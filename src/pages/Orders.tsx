import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, CreditCard, MapPin, Package, Phone, ShoppingBag, Truck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { getProductImage } from '../utils/productImages';
import { getErrorMessage, withTimeout } from '../utils/safeAsync';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === '1') {
      showToast('Order successful');
    }
  }, [searchParams, showToast]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await withTimeout(supabase
          .from('orders')
          .select(`
            *,
            order_items (
              id,
              product_id,
              product_name,
              product_image,
              product_price,
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
          .order('created_at', { ascending: false }),
          10000,
          'Orders load timed out'
        );

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', getErrorMessage(error));
        setOrders([]);
        showToast('Could not load orders. Please try again.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, showToast]);

  const getOrderStatus = (order: any) => order.order_status || order.status || 'processing';
  const getPaymentStatus = (order: any) => order.payment_status || (order.payment_id ? 'completed' : 'pending');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-gray-900 hover:text-black mb-6">
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
            <p className="text-gray-500 mb-6">Your order history will appear here after payment.</p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 rounded-md shadow-sm text-white bg-gray-900 hover:bg-black font-medium"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => {
              const orderStatus = getOrderStatus(order);
              const paymentStatus = getPaymentStatus(order);
              const address = order.shipping_address || {};

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                >
                  <div className="bg-gray-900 px-6 py-4 text-white">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          <h3 className="text-lg font-semibold">
                            Order #{order.order_number || order.id?.substring(0, 8).toUpperCase()}
                          </h3>
                        </div>
                        <p className="mt-1 text-xs text-gray-300">Order ID: {order.id}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          {orderStatus}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-100">
                          {paymentStatus === 'completed' ? 'Payment Successful' : 'Payment Pending'}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-300">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <ShoppingBag className="w-5 h-5 mr-2 text-gray-900" />
                      Order Items
                    </h4>
                    <div className="space-y-4">
                      {order.order_items?.map((item: any, index: number) => {
                        const name = item.product_name || item.products?.name || 'Product';
                        const image = item.product_image || item.products?.image || '';
                        const price = Number(item.product_price || item.price || 0);

                        return (
                          <div
                            key={`order-${order.id}-item-${item.id}-${index}`}
                            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={getProductImage(image)}
                              alt={name}
                              className="w-16 h-16 object-contain rounded-lg bg-white shadow-sm"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-base font-medium text-gray-800 mb-1">{name}</h5>
                              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                <span>Qty: {item.quantity}</span>
                                <span>Price: ₹{price.toLocaleString('en-IN')}</span>
                                <span className="font-semibold text-gray-900">
                                  Total: ₹{(price * item.quantity).toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 border-t border-gray-200">
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                        <Truck className="w-4 h-4 mr-2 text-gray-900" />
                        Delivery Address
                      </h4>
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-sm text-gray-600">
                        <div className="flex items-center text-gray-900 font-medium">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          {address.fullName || address.full_name || 'N/A'}
                        </div>
                        <div className="ml-6 mt-2 space-y-1">
                          <p>{address.houseNo || address.address_line_1}</p>
                          <p>{address.apartment || address.address_line_2}</p>
                          <p>{address.area || address.landmark}</p>
                          <p>{address.city}, {address.state} - {address.pincode}</p>
                          <div className="flex items-center pt-1">
                            <Phone className="w-4 h-4 text-gray-400 mr-2" />
                            {address.mobileNumber || address.phone}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                        <CreditCard className="w-4 h-4 mr-2 text-gray-900" />
                        Payment & Total
                      </h4>
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                          <p className="text-sm text-gray-600 mb-1">Payment ID</p>
                          <p className="text-xs font-medium text-gray-800 break-all">
                            {order.payment_id || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                          <p className="text-sm text-gray-600 mb-1">Order Total</p>
                          <p className="text-xl font-bold text-gray-900">
                            ₹{Number(order.total_amount || 0).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
