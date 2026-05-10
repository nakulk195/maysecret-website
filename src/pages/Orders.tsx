import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Package, CheckCircle2, Truck, CreditCard, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  date?: string; // For backward compatibility
  paymentStatus?: string; // For backward compatibility
}

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            price,
            products (
              id,
              name,
              image
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
            {orders.map((order: any) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-warm-50 to-white px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Package className="w-5 h-5 text-warm-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id?.substring(0, 8).toUpperCase()}
                        </h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                        order.order_status === 'delivered' 
                          ? 'bg-green-100 text-green-800'
                          : order.order_status === 'processing'
                          ? 'bg-blue-100 text-blue-800'
                          : order.order_status === 'shipped'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        {order.order_status || 'Processing'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2 text-warm-600" />
                    Order Items
                  </h4>
                  <div className="space-y-4">
                    {order.order_items?.map((item: any, index: number) => (
                      <motion.div
                        key={`order-${order.id}-item-${item.id}-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.products?.image || '/placeholder-product.jpg'}
                            alt={item.products?.name || 'Product'}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h5 className="text-base font-medium text-gray-800 mb-1">
                            {item.products?.name || 'Product'}
                          </h5>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Qty: {item.quantity}</span>
                            <span>Price: ₹{item.price}</span>
                            <span className="font-semibold text-warm-700">
                              Total: ₹{item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-warm-25 border-t border-gray-200">
                  {/* Delivery Address */}
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                      <Truck className="w-4 h-4 mr-2 text-warm-600" />
                      Delivery Address
                    </h4>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-800">
                            {order.shipping_address?.full_name || 'N/A'}
                          </span>
                        </div>
                        <div className="text-gray-600 ml-6">
                          <p>{order.shipping_address?.houseNo || order.shipping_address?.address_line_1}</p>
                          <p>{order.shipping_address?.area || order.shipping_address?.landmark}</p>
                          <p>{order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}</p>
                          <div className="flex items-center mt-2">
                            <Phone className="w-4 h-4 text-gray-400 mr-2" />
                            <span>{order.shipping_address?.mobileNumber || order.shipping_address?.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  {/* Payment & Total */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-warm-600" />
                      Payment & Total
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                        <p className={`text-sm font-semibold ${
                          order.payment_status === 'completed' 
                            ? 'text-green-600' 
                            : 'text-yellow-600'
                        }`}>
                          {order.payment_status === 'completed' ? 'Payment Successful' : 'Payment Pending'}
                        </p>
                        {order.payment_id && (
                          <p className="text-xs text-gray-500 mt-1">
                            ID: {order.payment_id?.substring(0, 12)}...
                          </p>
                        )}
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-600 mb-1">Order Total</p>
                        <p className="text-xl font-bold text-warm-700">
                          ₹{order.total_amount?.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
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

