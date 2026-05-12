import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { wishlistService } from '../services/database';
import { supabase, Product } from '../lib/supabase';

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

  // Load wishlist when user changes
  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        setWishlist([]);
        return;
      }

      try {
        setLoading(true);
        // Load wishlist with product relationships
        const { data, error } = await supabase
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
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Extract products from the relationship
        const products = (data || [])
          .map(item => item.products)
          .filter(Boolean);

        setWishlist(products);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user]);

  const addToWishlist = async (product: Product) => {
    if (!user) {
      // Redirect to login for guest users
      window.location.href = '/login';
      return;
    }

    try {
      setLoading(true);
      await wishlistService.addToWishlist(user.id, product.id);
      
      // Add to local state
      setWishlist(prev => [...prev, product]);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      await wishlistService.removeFromWishlist(user.id, productId);
      
      // Remove from local state
      setWishlist(prev => prev.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = async (productId: string) => {
    if (!user) return false;
    
    try {
      return await wishlistService.isInWishlist(user.id, productId);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  };

  const clearWishlist = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Clear all items for user
      for (const item of wishlist) {
        await wishlistService.removeFromWishlist(user.id, item.id);
      }
      setWishlist([]);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

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
