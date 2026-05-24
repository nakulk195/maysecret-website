import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, Product } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { resolveSupabaseProductId } from '../utils/productIdResolver';
import { getErrorMessage, withTimeout } from '../utils/safeAsync';
import { safeRemoveItem } from '../utils/safeStorage';

// Types
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  cartProduct?: Product;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const normalizeCartRows = (rows: any[]): CartItem[] => {
    const byProduct = new Map<string, CartItem>();

    for (const item of rows || []) {
      if (!item?.product_id) continue;

      const productId = String(item.product_id);
      const quantity = Math.max(1, Number(item.quantity || 1));
      const existing = byProduct.get(productId);

      if (existing) {
        existing.quantity = Math.max(existing.quantity, quantity);
        if (!existing.cartProduct && item.products) {
          existing.cartProduct = item.products;
        }
        continue;
      }

      byProduct.set(productId, {
        id: item.id,
        user_id: item.user_id,
        product_id: productId,
        quantity,
        cartProduct: item.products
      });
    }

    return Array.from(byProduct.values());
  };

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      if (!user) {
        safeRemoveItem('guest_cart');
        setCart([]);
        return;
      }

      const { data, error } = await withTimeout(supabase
        .from('cart')
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
        .order('created_at', { ascending: true }),
        10000,
        'Cart load timed out'
      );

      if (error) throw error;
      setCart(normalizeCartRows(data || []));
    } catch (error) {
      console.error('Error loading cart:', getErrorMessage(error));
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    const localProductId = String(product.id);

    try {
      if (user) {
        // Resolve product UUID for Supabase operations
        let resolvedProductId: string;
        try {
          resolvedProductId = await resolveSupabaseProductId(product);
        } catch (resolveError) {
          console.error(
            `[CartContext] Failed to resolve product UUID for local product_id ${localProductId}:`,
            resolveError instanceof Error ? resolveError.message : resolveError
          );
          throw resolveError;
        }

        const { data: existingRows, error: queryError } = await withTimeout(supabase
          .from('cart')
          .select('id, quantity')
          .eq('user_id', user.id)
          .eq('product_id', resolvedProductId)
          .order('created_at', { ascending: true })
          .limit(1),
          10000,
          'Cart update timed out'
        );

        if (queryError) {
          console.error(
            `[CartContext] Supabase query error for product ${resolvedProductId}:`,
            queryError
          );
          throw queryError;
        }

        const existingItem = existingRows?.[0];

        if (existingItem) {
          const newQuantity = Math.max(1, Number(existingItem.quantity || 1) + quantity);
          const { error: updateError } = await withTimeout(supabase
            .from('cart')
            .update({ quantity: newQuantity })
            .eq('id', existingItem.id)
            .eq('user_id', user.id),
            10000,
            'Cart update timed out'
          );

          if (updateError) {
            console.error(
              `[CartContext] Supabase update error for product ${resolvedProductId}:`,
              updateError
            );
            throw updateError;
          }
        } else {
          const { error: insertError } = await withTimeout(supabase
            .from('cart')
            .insert({
              user_id: user.id,
              product_id: resolvedProductId,
              product_name: product.name,
              product_image: product.image,
              product_price: product.price,
              quantity: quantity
            }),
            10000,
            'Cart add timed out'
          );

          if (insertError) {
            console.error(
              `[CartContext] Supabase insert error for product ${resolvedProductId}:`,
              insertError
            );
            throw insertError;
          }
        }

        setCart(prev => {
          const existingIndex = prev.findIndex(item => item.product_id === resolvedProductId);
          if (existingIndex >= 0) {
            return prev.map((item, index) =>
              index === existingIndex
                ? { ...item, quantity: item.quantity + quantity, cartProduct: item.cartProduct || product }
                : item
            );
          }

          return [
            ...prev,
            {
              id: `cart_${Date.now()}_${resolvedProductId}`,
              user_id: user.id,
              product_id: resolvedProductId,
              quantity,
              cartProduct: product
            }
          ];
        });
      } else {
        throw new Error('Please log in to add products to cart.');
      }
    } catch (error) {
      console.error(
        `[CartContext] Error adding product ${localProductId} to cart:`,
        error instanceof Error ? error.message : error
      );
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      if (user) {
        // Resolve product_id to UUID if needed
        let resolvedProductId: string;
        try {
          resolvedProductId = await resolveSupabaseProductId({ id: productId });
        } catch (resolveError) {
          console.error(
            `[CartContext] Failed to resolve product UUID for removal ${productId}:`,
            resolveError instanceof Error ? resolveError.message : resolveError
          );
          throw resolveError;
        }

        const { error } = await withTimeout(supabase
          .from('cart')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', resolvedProductId),
          10000,
          'Cart remove timed out'
        );

        if (error) {
          console.error(
            `[CartContext] Supabase delete error for product ${resolvedProductId}:`,
            error
          );
          throw error;
        }

        setCart(prev => prev.filter(item => item.product_id !== resolvedProductId));
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error(
        `[CartContext] Error removing product ${productId} from cart:`,
        error instanceof Error ? error.message : error
      );
      throw error;
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    try {
      if (user) {
        // Resolve product_id to UUID if needed
        let resolvedProductId: string;
        try {
          resolvedProductId = await resolveSupabaseProductId({ id: productId });
        } catch (resolveError) {
          console.error(
            `[CartContext] Failed to resolve product UUID for quantity update ${productId}:`,
            resolveError instanceof Error ? resolveError.message : resolveError
          );
          throw resolveError;
        }

        const safeQuantity = Math.max(1, Number(newQuantity || 1));
        const { data: existingRows, error: queryError } = await withTimeout(supabase
          .from('cart')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', resolvedProductId)
          .order('created_at', { ascending: true })
          .limit(1),
          10000,
          'Cart quantity update timed out'
        );

        if (queryError) {
          console.error(
            `[CartContext] Supabase query error for quantity update ${resolvedProductId}:`,
            queryError
          );
          throw queryError;
        }

        const existingItem = existingRows?.[0];
        if (!existingItem) {
          setCart(prev => prev.filter(item => item.product_id !== resolvedProductId));
          return;
        }

        const { error } = await withTimeout(supabase
          .from('cart')
          .update({ quantity: safeQuantity })
          .eq('id', existingItem.id)
          .eq('user_id', user.id),
          10000,
          'Cart quantity update timed out'
        );

        if (error) {
          console.error(
            `[CartContext] Supabase update error for product ${resolvedProductId}:`,
            error
          );
          throw error;
        }

        setCart(prev =>
          prev.map(item =>
            item.product_id === resolvedProductId
              ? { ...item, quantity: safeQuantity }
              : item
          )
        );
      } else {
        throw new Error('Please log in to update your cart.');
      }
    } catch (error) {
      console.error(
        `[CartContext] Error updating quantity for product ${productId}:`,
        error instanceof Error ? error.message : error
      );
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        const { error } = await withTimeout(supabase
          .from('cart')
          .delete()
          .eq('user_id', user.id),
          10000,
          'Cart clear timed out'
        );

        if (error) throw error;
      } else {
        safeRemoveItem('guest_cart');
      }
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = Number(item.cartProduct?.price || 0);
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value: CartContextType = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};




