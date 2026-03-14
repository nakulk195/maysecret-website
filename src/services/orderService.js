import { supabaseClient } from '../lib/supabaseClient';

export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const { data, error } = await supabaseClient.insert('orders', {
        ...orderData,
        status: 'pending',
        payment_status: 'pending',
        created_at: new Date().toISOString()
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user orders
  getUserOrders: async (userId, options = {}) => {
    try {
      const { data, error } = await supabaseClient.fetch('orders', {
        select: `
          *,
          order_items (
            id,
            quantity,
            unit_price,
            total_price,
            product_snapshot
          )
        `,
        eq: { column: 'user_id', value: userId },
        order: { column: 'created_at', ascending: false },
        limit: options.limit || null
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get order by ID
  getOrderById: async (orderId, userId) => {
    try {
      const { data, error } = await supabaseClient.fetch('orders', {
        select: `
          *,
          order_items (
            id,
            quantity,
            unit_price,
            total_price,
            product_snapshot
          )
        `,
        eq: { column: 'id', value: orderId },
        single: true
      });

      // Additional check to ensure user can only access their own orders
      if (data && data.user_id !== userId) {
        throw new Error('Unauthorized: You can only access your own orders');
      }

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status, userId = null) => {
    try {
      const updateData = { 
        status,
        updated_at: new Date().toISOString()
      };

      // Add timestamps based on status
      if (status === 'shipped') {
        updateData.shipped_at = new Date().toISOString();
      } else if (status === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }

      const { data, error } = await supabaseClient.update('orders', updateData, { 
        column: 'id', 
        value: orderId 
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add order items
  addOrderItems: async (orderItems) => {
    try {
      const { data, error } = await supabaseClient.insert('order_items', orderItems);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update payment status
  updatePaymentStatus: async (orderId, paymentStatus) => {
    try {
      const { data, error } = await supabaseClient.update('orders', {
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      }, { column: 'id', value: orderId });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Cancel order
  cancelOrder: async (orderId, userId) => {
    try {
      // First check if order belongs to user
      const { data: order, error: fetchError } = await supabaseClient.fetch('orders', {
        select: 'user_id, status',
        eq: { column: 'id', value: orderId },
        single: true
      });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!order) {
        throw new Error('Order not found');
      }

      if (order.user_id !== userId) {
        throw new Error('Unauthorized: You can only cancel your own orders');
      }

      if (order.status !== 'pending' && order.status !== 'confirmed') {
        throw new Error('Order cannot be cancelled at this stage');
      }

      const { data, error } = await supabaseClient.update('orders', {
        status: 'cancelled',
        updated_at: new Date().toISOString()
      }, { column: 'id', value: orderId });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get order statistics (admin)
  getOrderStats: async (filters = {}) => {
    try {
      let query = supabaseClient.fetch('orders', {
        select: 'status, total_amount, created_at'
      });

      if (filters.startDate) {
        query = supabaseClient.fetch('orders', {
          select: 'status, total_amount, created_at',
          gte: { column: 'created_at', value: filters.startDate }
        });
      }

      if (filters.endDate) {
        query = supabaseClient.fetch('orders', {
          select: 'status, total_amount, created_at',
          lte: { column: 'created_at', value: filters.endDate }
        });
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      // Calculate statistics
      const stats = {
        totalOrders: data?.length || 0,
        totalRevenue: data?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0,
        ordersByStatus: data?.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {}),
        averageOrderValue: data?.length > 0 
          ? data.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) / data.length 
          : 0
      };

      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default orderService;
