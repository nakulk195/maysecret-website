import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/database';
import { Order, OrderItem } from '../lib/supabase';

export interface OrderWithItems extends Order {
  order_items: (OrderItem & {
    products: {
      id: string;
      name: string;
      image: string;
      price: number;
    };
  })[];
}

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders when user changes
  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await orderService.getUserOrders(user.id);
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: any, orderItems: any[]) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await orderService.createOrder(user.id, orderData, orderItems);
      await fetchOrders(); // Refresh orders
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (orderId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await orderService.getOrderById(orderId, user.id);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await orderService.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(order => order.id === orderId ? data : order));
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    getOrderById,
    updateOrderStatus
  };
};
