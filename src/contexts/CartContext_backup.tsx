import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface CartProduct {
  id: number;
  name: string;
  price: string;
  image: string;
  stock: number;
  description?: string;
  rating?: number;
  reviews?: number;
  originalPrice?: string;
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  cartProduct: CartProduct;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (product: any, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      if (user) {
        // Load from Supabase for logged-in users
        const { data, error } = await supabase
          .from('cart')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const cartItems: CartItem[] = (data || []).map(item => ({
          id: item.id,
          cartId: item.id,
          productId: parseInt(item.product_id),
          quantity: item.quantity,
          cartProduct: {
            id: parseInt(item.product_id),
            name: item.product_name,
            price: item.product_price.toString(),
            image: item.product_image,
            stock: 1,
            description: '',
            rating: 4.5,
            reviews: 0,
            originalPrice: ''
          }
        }));

        setCart(cartItems);
      } else {
        // Load from localStorage for guest users
        const raw = localStorage.getItem('guest_cart');
        const parsed: CartItem[] = raw ? JSON.parse(raw) : [];
        setCart(parsed);
      }
    } catch (error) {
      console.error('CartContext: Error loading cart:', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (product: any, quantity: number = 1) => {
    setLoading(true);
    try {
      if (user) {
        // Add to Supabase for logged-in users
        const { data: existingItem } = await supabase
          .from('cart')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', product.id.toString())
          .single();

        if (existingItem) {
          // Update existing item
          const { error } = await supabase
            .from('cart')
            .update({ quantity: existingItem.quantity + quantity })
            .eq('id', existingItem.id);

          if (error) throw error;
        } else {
          // Add new item with product details stored directly
          const { error } = await supabase
            .from('cart')
            .insert({
              user_id: user.id,
              product_id: product.id.toString(),
              product_name: product.name,
              product_image: product.image,
              product_price: Number(product.price),
              quantity
            });

          if (error) throw error;
        }
        
        // Reload cart
        await loadCart();
      } else {
        // Use localStorage for guest users
        setCart((prevCart: CartItem[]) => {
          const existingItem = prevCart.find(item => item.productId === product.id);
          let newCart: CartItem[];
          
          if (existingItem) {
            newCart = prevCart.map(item =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newCart = [
              ...prevCart,
              {
                id: Date.now(),
                cartId: Date.now(),
                productId: product.id,
                quantity,
                cartProduct: {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  stock: product.stock || 1,
                  description: product.description || '',
                  rating: product.rating || 4.5,
                  reviews: product.reviews || 0,
                  originalPrice: product.originalPrice || ''
                }
              }
            ];
          }
          
          localStorage.setItem('guest_cart', JSON.stringify(newCart));
          return newCart;
        });
      }
    } catch (error) {
      console.error('CartContext: Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    setLoading(true);
    try {
      if (quantity < 1) {
        await removeFromCart(productId);
        return;
      }

      if (user) {
        // Update in Supabase for logged-in users
        const { data: cartItem } = await supabase
          .from('cart')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', parseInt(productId))
          .single();

        if (cartItem) {
          const { error } = await supabase
            .from('cart')
            .update({ quantity })
            .eq('id', cartItem.id);

          if (error) throw error;
        }
        
        // Reload cart
        await loadCart();
      } else {
        // Update localStorage for guest users
        setCart(prevCart => {
          const updatedCart = prevCart.map(item =>
            item.productId === parseInt(productId) ? { ...item, quantity } : item
          );
          localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
          return updatedCart;
        });
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setLoading(true);
    try {
      if (user) {
        // Remove from Supabase for logged-in users
        const { data: cartItem } = await supabase
          .from('cart')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', parseInt(productId))
          .single();

        if (cartItem) {
          const { error } = await supabase
            .from('cart')
            .delete()
            .eq('id', cartItem.id);

          if (error) throw error;
        }
        
        // Reload cart
        await loadCart();
      } else {
        // Remove from localStorage for guest users
        const updatedCart = cart.filter(item => item.productId !== parseInt(productId));
        setCart(updatedCart);
        localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      if (user) {
        // Clear from Supabase for logged-in users
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
        
        // Reload cart
        await loadCart();
      } else {
        // Clear localStorage for guest users
        localStorage.removeItem('guest_cart');
        setCart([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = (): number => {
    return cart.reduce((total: number, item: CartItem) => {
      const price = typeof item.cartProduct.price === 'string' 
        ? parseFloat(item.cartProduct.price) 
        : item.cartProduct.price as number;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = (): number => {
    return cart.reduce((count: number, item: CartItem) => {
      return count + item.quantity;
    }, 0);
  };

  const value: CartContextType = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
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
