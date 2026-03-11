import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface CartProduct {
  id: number;
  name: string;
  price: string;
  image: string;
  inStock: boolean;
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

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      // Always load from localStorage for guest users
      const raw = localStorage.getItem('guest_cart');
      const parsed: CartItem[] = raw ? JSON.parse(raw) : [];
      setCart(parsed);
    } catch (error) {
      console.error('CartContext: Error loading cart:', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (product: any, quantity: number = 1) => {
    setLoading(true);
    try {
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
                inStock: product.inStock || true,
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

      setCart(prevCart => {
        const updatedCart = prevCart.map(item =>
          item.id.toString() === productId ? { ...item, quantity } : item
        );
        localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
        return updatedCart;
      });
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setLoading(true);
    try {
      const updatedCart = cart.filter(item => item.id !== parseInt(productId));
      setCart(updatedCart);
      localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
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
      localStorage.removeItem('guest_cart');
      setCart([]);
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
