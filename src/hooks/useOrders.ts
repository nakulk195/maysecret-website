import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/database';
import { Order, OrderItem } from '../lib/supabase';
import { getErrorMessage, withTimeout } from '../utils/safeAsync';

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
    let isActive = true;

    const load = async () => {
      if (!user) {
        if (isActive) {
          setOrders([]);
          setLoading(false);
          setError(null);
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await withTimeout(
          orderService.getUserOrders(user.id),
          10000,
          'Orders load timed out'
        );
        if (isActive) setOrders(data);
      } catch (err: any) {
        if (isActive) {
          setError(getErrorMessage(err));
          setOrders([]);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [user]);

  const fetchOrders = async () => {
    if (user) {
      setLoading(true);
      setError(null);

      try {
        const data = await withTimeout(
          orderService.getUserOrders(user.id),
          10000,
          'Orders load timed out'
        );
        setOrders(data);
      } catch (err: any) {
        setError(getErrorMessage(err));
        setOrders([]);
      } finally {
        setLoading(false);
      }
    } else {
      setOrders([]);
      setLoading(false);
    }
  };

  const createOrder = async (orderData: any, orderItems: any[]) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await withTimeout(
        orderService.createOrder(user.id, orderData, orderItems),
        10000,
        'Order save timed out'
      );
      await fetchOrders(); // Refresh orders
      return result;
    } catch (err: any) {
      setError(getErrorMessage(err));
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
      const data = await withTimeout(
        orderService.getOrderById(orderId, user.id),
        10000,
        'Order load timed out'
      );
      return data;
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await withTimeout(
        orderService.updateOrderStatus(orderId, status),
        10000,
        'Order update timed out'
      );
      setOrders(prev => prev.map(order => order.id === orderId ? data : order));
      return data;
    } catch (err: any) {
      setError(getErrorMessage(err));
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
