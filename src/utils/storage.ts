import { Product } from './productData';

export interface CartItem {
  product: Product;
  quantity: number;
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
  const cart = localStorage.getItem('maysecret_cart');
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product: Product, quantity: number = 1): void => {
  const cart = getCart();
  const existingItem = cart.find(item => item.product.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }
  
  localStorage.setItem('maysecret_cart', JSON.stringify(cart));
};

export const removeFromCart = (productId: number): void => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.product.id !== productId);
  localStorage.setItem('maysecret_cart', JSON.stringify(updatedCart));
};

export const updateCartQuantity = (productId: number, quantity: number): void => {
  const cart = getCart();
  const item = cart.find(item => item.product.id === productId);
  if (item) {
    item.quantity = quantity;
    localStorage.setItem('maysecret_cart', JSON.stringify(cart));
  }
};

export const clearCart = (): void => {
  localStorage.removeItem('maysecret_cart');
};

export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

// Wishlist Management
export const getWishlist = (): Product[] => {
  const wishlist = localStorage.getItem('maysecret_wishlist');
  return wishlist ? JSON.parse(wishlist) : [];
};

export const addToWishlist = (product: Product): void => {
  const wishlist = getWishlist();
  if (!wishlist.find(item => item.id === product.id)) {
    wishlist.push(product);
    localStorage.setItem('maysecret_wishlist', JSON.stringify(wishlist));
  }
};

export const removeFromWishlist = (productId: number): void => {
  const wishlist = getWishlist();
  const updatedWishlist = wishlist.filter(product => product.id !== productId);
  localStorage.setItem('maysecret_wishlist', JSON.stringify(updatedWishlist));
};

export const isInWishlist = (productId: number): boolean => {
  const wishlist = getWishlist();
  return wishlist.some(product => product.id === productId);
};

// Recently Viewed Management
export const getRecentlyViewed = (): Product[] => {
  const recentlyViewed = localStorage.getItem('maysecret_recently_viewed');
  return recentlyViewed ? JSON.parse(recentlyViewed) : [];
};

export const addToRecentlyViewed = (product: Product): void => {
  const recentlyViewed = getRecentlyViewed();
  const filtered = recentlyViewed.filter(item => item.id !== product.id);
  const updated = [product, ...filtered].slice(0, 10); // Keep only last 10 items
  localStorage.setItem('maysecret_recently_viewed', JSON.stringify(updated));
};

// Orders Management
export const getOrders = (): Order[] => {
  const orders = localStorage.getItem('maysecret_orders');
  return orders ? JSON.parse(orders) : [];
};

export const addOrder = (order: Order): void => {
  const orders = getOrders();
  orders.unshift(order); // Add to beginning
  localStorage.setItem('maysecret_orders', JSON.stringify(orders));
};

export const updateOrderStatus = (orderId: string, status: Order['status']): void => {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    localStorage.setItem('maysecret_orders', JSON.stringify(orders));
  }
};

// User Profile
export const getUserProfile = () => {
  const profile = localStorage.getItem('maysecret_profile');
  return profile ? JSON.parse(profile) : null;
};

export const saveUserProfile = (profile: any): void => {
  localStorage.setItem('maysecret_profile', JSON.stringify(profile));
}; 