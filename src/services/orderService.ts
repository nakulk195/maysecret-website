import { supabase, Order, OrderItem } from '../lib/supabase';
import { CartItem } from '../contexts/CartContext';

export interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CreateOrderData {
  user_id: string;
  total_amount: number;
  shipping_address: ShippingAddress;
  payment_id?: string;
}

export class OrderService {
  // Create order with order items
  static async createOrder(orderData: CreateOrderData, cartItems: CartItem[]): Promise<Order> {
    try {
      // Start a transaction by creating the order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.user_id,
          total_amount: orderData.total_amount,
          shipping_address: orderData.shipping_address,
          payment_id: orderData.payment_id,
          status: 'pending'
        })
        .select()
        .maybeSingle();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: Number(item.cartProduct?.price || 0)
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Get user orders
  static async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products:product_id (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  // Get single order by ID
  static async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products:product_id (*)
          )
        `)
        .eq('id', orderId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  // Update order status
  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Update payment ID for order
  static async updatePaymentId(orderId: string, paymentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_id: paymentId })
        .eq('id', orderId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating payment ID:', error);
      throw error;
    }
  }
}
