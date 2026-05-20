import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, Product } from '../lib/supabase';
import { useAuth } from './AuthContext';

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
            await supabase
              .from('cart')
              .upsert({
                user_id: user.id,
                product_id: item.product_id,
                quantity: item.quantity
              });
          }
        }
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };

    saveCart();
  }, [cart, user]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    const productId = String(product.id);

    try {
      if (user) {
        // Check if item already exists in cart
        const { data: existingItem } = await supabase
          .from('cart')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .maybeSingle();

        if (existingItem) {
          // Update existing item
          const newQuantity = existingItem.quantity + quantity;
          await supabase
            .from('cart')
            .update({ quantity: newQuantity })
            .eq('user_id', user.id)
            .eq('product_id', productId);
        } else {
          // Add new item
          await supabase
            .from('cart')
            .insert({
              user_id: user.id,
              product_id: productId,
              quantity: quantity
            });
        }
        setCart(prev => {
          const existingIndex = prev.findIndex(item => item.product_id === productId);
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
              id: `cart_${Date.now()}_${productId}`,
              user_id: user.id,
              product_id: productId,
              quantity,
              cartProduct: product
            }
          ];
        });
      } else {
        throw new Error('Please log in to add products to cart.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      if (user) {
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    try {
      if (user) {
        const { error } = await supabase
          .from('cart')
          .update({ quantity: newQuantity })
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
      } else {
        throw new Error('Please log in to update your cart.');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
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




