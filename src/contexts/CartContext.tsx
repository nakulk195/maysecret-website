import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, Product } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { resolveSupabaseProductId } from '../utils/productIdResolver';

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

  // Load cart from Supabase or localStorage
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        if (user) {
          // Load from Supabase for logged-in users with product data
          console.log('Fetching cart from Supabase for user:', user.id);
          const { data, error } = await supabase
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
            .eq('user_id', user.id);

          if (error) throw error;
          console.log('Fetched cart data:', data);

          const cartItems: CartItem[] = (data || []).map(item => ({
            id: item.id,
            user_id: item.user_id,
            product_id: item.product_id,
            quantity: item.quantity,
            cartProduct: item.products
          }));
          setCart(cartItems);
        } else {
          localStorage.removeItem('guest_cart');
          setCart([]);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        // Set empty cart on error to prevent crashes
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // Save cart to Supabase or localStorage
  useEffect(() => {
    const saveCart = async () => {
      try {
        if (user && cart.length > 0) {
          // Save to Supabase for logged-in users
          for (const item of cart) {
            try {
              // Resolve product_id to UUID if it's numeric
              const resolvedProductId = await resolveSupabaseProductId({
                id: item.product_id
              });

              await supabase
                .from('cart')
                .upsert({
                  user_id: user.id,
                  product_id: resolvedProductId,
                  quantity: item.quantity
                });
            } catch (resolveError) {
              console.error(
                `[CartContext] Failed to save cart item with product_id ${item.product_id}:`,
                resolveError instanceof Error ? resolveError.message : resolveError
              );
              // Continue with next item but ensure error is visible
              throw resolveError;
            }
          }
        }
      } catch (error) {
        console.error(
          '[CartContext] Error saving cart to Supabase:',
          error instanceof Error ? error.message : error
        );
      }
    };

    saveCart();
  }, [cart, user]);

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

        // Check if item already exists in cart
        const { data: existingItem, error: queryError } = await supabase
          .from('cart')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', resolvedProductId)
          .maybeSingle();

        if (queryError) {
          console.error(
            `[CartContext] Supabase query error for product ${resolvedProductId}:`,
            queryError
          );
          throw queryError;
        }

        if (existingItem) {
          // Update existing item
          const newQuantity = existingItem.quantity + quantity;
          const { error: updateError } = await supabase
            .from('cart')
            .update({ quantity: newQuantity })
            .eq('user_id', user.id)
            .eq('product_id', resolvedProductId);

          if (updateError) {
            console.error(
              `[CartContext] Supabase update error for product ${resolvedProductId}:`,
              updateError
            );
            throw updateError;
          }
        } else {
          // Add new item
          const { error: insertError } = await supabase
            .from('cart')
            .insert({
              user_id: user.id,
              product_id: resolvedProductId,
              quantity: quantity
            });

          if (insertError) {
            console.error(
              `[CartContext] Supabase insert error for product ${resolvedProductId}:`,
              insertError
            );
            throw insertError;
          }
        }

        // Update local state with resolved UUID
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

        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', resolvedProductId);

        if (error) {
          console.error(
            `[CartContext] Supabase delete error for product ${resolvedProductId}:`,
            error
          );
          throw error;
        }

        // Update local state to remove item
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

        const { error } = await supabase
          .from('cart')
          .update({ quantity: newQuantity })
          .eq('user_id', user.id)
          .eq('product_id', resolvedProductId);

        if (error) {
          console.error(
            `[CartContext] Supabase update error for product ${resolvedProductId}:`,
            error
          );
          throw error;
        }

        // Update local state
        setCart(prev =>
          prev.map(item =>
            item.product_id === resolvedProductId
              ? { ...item, quantity: newQuantity }
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
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        localStorage.removeItem('guest_cart');
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




