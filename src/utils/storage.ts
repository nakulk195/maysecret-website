import { Product as ImportedProduct } from './productData';
import { safeGetItem, safeRemoveItem, safeSetItem } from './safeStorage';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
  stock: number;
  description: string;
  category: string;
  is_featured?: boolean;
  rating: number;
  reviews: number;
  created_at: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  date: string;
  shippingAddress: string;
}

// Cart Management
export const getCart = (): CartItem[] => {
  const cart = safeGetItem('maysecret_cart');
  try {
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const addToCart = (product: Product, quantity: number = 1): void => {
  const cart = getCart();
  const existingItem = cart.find(item => item.product.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }
  
  safeSetItem('maysecret_cart', JSON.stringify(cart));
};

export const removeFromCart = (productId: string): void => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.product.id !== productId);
  safeSetItem('maysecret_cart', JSON.stringify(updatedCart));
};

export const updateCartQuantity = (productId: string, quantity: number): void => {
  const cart = getCart();
  const item = cart.find(item => item.product.id === productId);
  if (item) {
    item.quantity = quantity;
    safeSetItem('maysecret_cart', JSON.stringify(cart));
  }
};

export const clearCart = (): void => {
  safeRemoveItem('maysecret_cart');
};

export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

// Wishlist Management
export const getWishlist = (): Product[] => {
  const wishlist = safeGetItem('maysecret_wishlist');
  try {
    return wishlist ? JSON.parse(wishlist) : [];
  } catch {
    return [];
  }
};

export const addToWishlist = (product: Product): void => {
  const wishlist = getWishlist();
  if (!wishlist.find(item => item.id === product.id)) {
    wishlist.push(product);
    safeSetItem('maysecret_wishlist', JSON.stringify(wishlist));
  }
};

export const removeFromWishlist = (productId: string): void => {
  const wishlist = getWishlist();
  const updatedWishlist = wishlist.filter(product => product.id !== productId);
  safeSetItem('maysecret_wishlist', JSON.stringify(updatedWishlist));
};

export const isInWishlist = (productId: string): boolean => {
  const wishlist = getWishlist();
  return wishlist.some(product => product.id === productId);
};

// Recently Viewed Management
export const getRecentlyViewed = (): Product[] => {
  const recentlyViewed = safeGetItem('maysecret_recently_viewed');
  try {
    return recentlyViewed ? JSON.parse(recentlyViewed) : [];
  } catch {
    return [];
  }
};

export const addToRecentlyViewed = (product: Product): void => {
  const recentlyViewed = getRecentlyViewed();
  const filtered = recentlyViewed.filter(item => item.id !== product.id);
  const updated = [product, ...filtered].slice(0, 10); // Keep only last 10 items
  safeSetItem('maysecret_recently_viewed', JSON.stringify(updated));
};

// Orders Management
export const getOrders = (): Order[] => {
  const orders = safeGetItem('maysecret_orders');
  try {
    return orders ? JSON.parse(orders) : [];
  } catch {
    return [];
  }
};

export const addOrder = (order: Order): void => {
  const orders = getOrders();
  orders.unshift(order); // Add to beginning
  safeSetItem('maysecret_orders', JSON.stringify(orders));
};

export const updateOrderStatus = (orderId: string, status: Order['status']): void => {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    safeSetItem('maysecret_orders', JSON.stringify(orders));
  }
};

// User Profile
export const getUserProfile = () => {
  const profile = safeGetItem('maysecret_profile');
  try {
    return profile ? JSON.parse(profile) : null;
  } catch {
    return null;
  }
};

export const saveUserProfile = (profile: any): void => {
  safeSetItem('maysecret_profile', JSON.stringify(profile));
};
