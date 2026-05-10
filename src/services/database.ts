import { supabase } from '../lib/supabase';
import { Profile, Address, Wishlist, ContactMessage } from '../lib/supabase';

// Profile Service
export const profileService = {
  // Create profile when user signs up
  async createProfile(userId: string, fullName: string, email: string, phone: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            full_name: fullName,
            email: email,
            phone: phone
          }
        ])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  // Get user profile
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<Profile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};

// Address Service
export const addressService = {
  // Create new address
  async createAddress(userId: string, addressData: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .insert([
          {
            user_id: userId,
            ...addressData
          }
        ])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  },

  // Get all user addresses
  async getUserAddresses(userId: string) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  },

  // Update address
  async updateAddress(addressId: string, updates: Partial<Address>) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .update(updates)
        .eq('id', addressId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },

  // Delete address
  async deleteAddress(addressId: string) {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }
};

// Wishlist Service
export const wishlistService = {
  // Add item to wishlist
  async addToWishlist(userId: string, productId: string) {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .insert([
          {
            user_id: userId,
            product_id: productId
          }
        ])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  // Get user wishlist
  async getUserWishlist(userId: string) {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },

  // Remove item from wishlist
  async removeFromWishlist(userId: string, productId: string) {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  // Check if item is in wishlist
  async isInWishlist(userId: string, productId: string) {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  }
};

// Contact Messages Service
export const contactService = {
  // Save contact message
  async saveMessage(userId: string, messageData: Omit<ContactMessage, 'id' | 'user_id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            user_id: userId,
            ...messageData
          }
        ])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving contact message:', error);
      throw error;
    }
  },

  // Get user contact messages
  async getUserMessages(userId: string) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      throw error;
    }
  }
};

// Order Service
export const orderService = {
  // Create order with items
  async createOrder(userId: string, orderData: any, orderItems: any[]) {
    try {
      // Start a transaction by creating order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId,
            total_amount: orderData.total_amount,
            status: 'pending',
            shipping_address: orderData.shipping_address,
            payment_id: orderData.payment_id
          }
        ])
        .select()
        .maybeSingle();

      if (orderError) throw orderError;

      // Create order items
      const orderItemsData = orderItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));

      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData)
        .select();

      if (itemsError) throw itemsError;

      return { order, items };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get user orders
  async getUserOrders(userId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (id, name, image, price)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get order by ID
  async getOrderById(orderId: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (id, name, image, price)
          )
        `)
        .eq('id', orderId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};

// Database initialization function
export const initializeDatabase = async () => {
  try {
    // This would be called to create tables if they don't exist
    // In a real app, this would be handled by migrations
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};
