import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { wishlistService } from '../services/database';
import { supabase, Product } from '../lib/supabase';
import { resolveSupabaseProductId } from '../utils/productIdResolver';
import { getErrorMessage, withTimeout } from '../utils/safeAsync';
import { safeGetItem, safeRemoveItem, safeSetItem } from '../utils/safeStorage';

interface WishlistContextType {
  wishlist: Product[];
  loading: boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => Promise<boolean>;
  clearWishlist: () => Promise<void>;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const readGuestWishlist = (): Product[] => {
    try {
      const stored = safeGetItem('guest_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveGuestWishlist = (items: Product[]) => {
    safeSetItem('guest_wishlist', JSON.stringify(items));
  };

  const normalizeWishlistProducts = (rows: any[]): Product[] => {
    const byProduct = new Map<string, Product>();

    for (const item of rows || []) {
      if (!item?.products?.id) continue;
      const productId = String(item.products.id);
      if (!byProduct.has(productId)) {
        byProduct.set(productId, item.products);
      }
    }

    return Array.from(byProduct.values());
  };

  // Load wishlist when user changes
  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        setWishlist(readGuestWishlist());
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const guestWishlist = readGuestWishlist();
        if (guestWishlist.length > 0) {
          for (const product of guestWishlist) {
            try {
              const resolvedProductId = await resolveSupabaseProductId(product);
              await withTimeout(
                wishlistService.addToWishlist(user.id, resolvedProductId),
                10000,
                'Wishlist sync timed out'
              );
            } catch (syncError) {
              console.error('Error syncing guest wishlist item:', getErrorMessage(syncError));
            }
          }
          safeRemoveItem('guest_wishlist');
        }

        // Load wishlist with product relationships
        const { data, error } = await withTimeout(supabase
          .from('wishlist')
          .select(`
            *,
            products:product_id (
              id,
              name,
              description,
              price,
              original_price,
              image,
              stock,
              category,
              is_featured,
              rating,
              reviews,
              created_at,
              updated_at
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
          10000,
          'Wishlist load timed out'
        );

        if (error) throw error;

        setWishlist(normalizeWishlistProducts(data || []));
      } catch (error) {
        console.error('Error loading wishlist:', getErrorMessage(error));
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user]);

  const addToWishlist = useCallback(async (product: Product) => {
    try {
      setLoading(true);
      const productId = String(product.id);

      if (!user) {
        setWishlist(prev => {
          const nextWishlist = prev.some(item => String(item.id) === productId)
            ? prev
            : [...prev, product];
          saveGuestWishlist(nextWishlist);
          return nextWishlist;
        });
        return;
      }

      let resolvedProductId: string;

      try {
        resolvedProductId = await resolveSupabaseProductId(product);
      } catch (resolveError) {
        console.error(
          `[WishlistContext] Failed to resolve product UUID for wishlist add ${productId}:`,
          resolveError instanceof Error ? resolveError.message : resolveError
        );
        throw resolveError;
      }

      await withTimeout(
        wishlistService.addToWishlist(user.id, resolvedProductId),
        10000,
        'Wishlist add timed out'
      );
      
      // Add to local state
      setWishlist(prev => (
        prev.some(item => String(item.id) === productId || String(item.id) === resolvedProductId)
          ? prev
          : [...prev, product]
      ));
    } catch (error) {
      console.error('Error adding to wishlist:', getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    try {
      setLoading(true);

      if (!user) {
        setWishlist(prev => {
          const nextWishlist = prev.filter(item => String(item.id) !== productId);
          saveGuestWishlist(nextWishlist);
          return nextWishlist;
        });
        return;
      }

      let resolvedProductId = productId;

      try {
        resolvedProductId = await resolveSupabaseProductId({ id: productId });
      } catch (resolveError) {
        console.error(
          `[WishlistContext] Failed to resolve product UUID for wishlist remove ${productId}:`,
          resolveError instanceof Error ? resolveError.message : resolveError
        );
      }

      await withTimeout(
        wishlistService.removeFromWishlist(user.id, resolvedProductId),
        10000,
        'Wishlist remove timed out'
      );
      
      // Remove from local state
      setWishlist(prev => prev.filter(item =>
        String(item.id) !== productId && String(item.id) !== resolvedProductId
      ));
    } catch (error) {
      console.error('Error removing from wishlist:', getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const isInWishlist = useCallback(async (productId: string) => {
    if (!user) {
      return readGuestWishlist().some(item => String(item.id) === productId);
    }
    
    try {
      let resolvedProductId = productId;
      try {
        resolvedProductId = await resolveSupabaseProductId({ id: productId });
      } catch {
        resolvedProductId = productId;
      }

      return await withTimeout(
        wishlistService.isInWishlist(user.id, resolvedProductId),
        10000,
        'Wishlist check timed out'
      );
    } catch (error) {
      console.error('Error checking wishlist:', getErrorMessage(error));
      return false;
    }
  }, [user]);

  const clearWishlist = useCallback(async () => {
    try {
      setLoading(true);
      if (!user) {
        safeRemoveItem('guest_wishlist');
        setWishlist([]);
        return;
      }

      // Clear all items for user
      for (const item of wishlist) {
        await withTimeout(
          wishlistService.removeFromWishlist(user.id, String(item.id)),
          10000,
          'Wishlist clear timed out'
        );
      }
      setWishlist([]);
    } catch (error) {
      console.error('Error clearing wishlist:', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [user, wishlist]);

  const getWishlistCount = () => wishlist.length;

  const value: WishlistContextType = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};


