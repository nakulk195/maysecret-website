import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Package, CheckCircle2 } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
}

interface Address {
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  address: Address;
  paymentMethod: string;
  status: string;
  createdAt: string;
  date?: string; // For backward compatibility
  paymentStatus?: string; // For backward compatibility
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = () => {
      try {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          // Ensure all orders have required fields
          const validatedOrders = parsedOrders.map((order: any) => ({
            id: order.id || `order-${Date.now()}`,
            items: Array.isArray(order.items) ? order.items.map((item: any) => ({
              id: item.id || 'item-' + Math.random().toString(36).substr(2, 9),
              name: item.name || 'Unnamed Product',
              image: item.image || '',
              quantity: Number(item.quantity) || 1,
              price: Number(item.price) || 0
            })) : [],
            total: Number(order.total) || 0,
            address: order.address || {},
            paymentMethod: order.paymentMethod || 'Unknown',
            status: order.status || 'Completed',
            createdAt: order.createdAt || order.date || new Date().toISOString()
          }));
          setOrders(validatedOrders);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(loadOrders, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-warm-600 hover:text-warm-700 mb-6">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow overflow-hidden p-8 text-center"
          >
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Your order history will appear here</p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-warm-600 hover:bg-warm-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warm-500"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow overflow-hidden sm:rounded-lg"
              >
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Order #{order.id.substring(0, 8).toUpperCase()}
                      </h3>
                      <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        {order.status === 'successful' ? 'Successful' : order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="border-b border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <li key={`${order.id}-${item.id}`} className="p-4 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden bg-gray-200">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover object-center"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                                <Package className="h-8 w-8 text-gray-500" />
                              </div>
                            )}
                          </div>

                          <div className="ml-6 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                              <h4 className="text-sm font-medium text-gray-900">
                                {item.name}
                              </h4>
                              <p className="mt-1 sm:mt-0 text-sm font-medium text-gray-900">
                                <p className="font-medium">₹{Number(item.price || 0).toFixed(2)}</p>
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                            <p className="mt-2 text-sm font-medium text-gray-900">
                              <p className="font-medium">₹{(Number(item.price) * (item.quantity || 1)).toFixed(2)}</p>
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-4 py-5 sm:px-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Delivery Address</h4>
                      <div className="mt-1 text-sm text-gray-900">
                        <p>{order.address.name}</p>
                        <p>{order.address.street}</p>
                        <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
                        <p>Phone: {order.address.phone}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {order.paymentMethod}
                      </p>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-1">
                      <h4 className="text-sm font-medium text-gray-500">Order Total</h4>
                      <p className="mt-1 text-xl font-bold text-gray-900">
                        ₹{order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
