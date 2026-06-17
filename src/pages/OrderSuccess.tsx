import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductImage } from '../utils/productImages';
import { supabase } from '../lib/supabase';
import { CheckCircle, Package, Truck, Heart } from 'lucide-react';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_number?: number;
  product_name?: string;
  product_image?: string;
  product_price?: number;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  address?: string | Record<string, any>;
  payment_id?: string;
  razorpay_order_id?: string;
  payment_method?: string;
  payment_status?: string;
  order_status?: string;
  shipping_address?: {
    fullName?: string;
    mobileNumber?: string;
    houseNo?: string;
    address_line_1?: string;
    area?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
    emailAddress?: string;
  };
  created_at?: string;
  order_items?: OrderItem[];
}

const getOrderAddress = (order: Order) => {
  if (order.shipping_address) return order.shipping_address;
  if (!order.address) return {};
  if (typeof order.address !== 'string') return order.address;

  try {
    return JSON.parse(order.address);
  } catch {
    return { address_line_1: order.address };
  }
};

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      const orderId = searchParams.get('orderId');
      if (!orderId) {
        setOrder(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              id,
              order_id,
              product_id,
              quantity,
              price,
              product_number,
              product_name,
              product_image,
              product_price
            )
          `)
          .eq('id', orderId)
          .maybeSingle();

        if (error) {
          console.error('[OrderSuccess] Supabase query error:', error);
          setOrder(null);
        } else {
          setOrder(data as Order | null);
        }
      } catch (error) {
        console.error('[OrderSuccess] Error fetching order:', error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-warm-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-warm-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-warm-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const deliveryAddress = getOrderAddress(order);
  const isCodOrder = searchParams.get('payment') === 'cod' || order.payment_method === 'COD';
  const paymentMethod = order.payment_method || (isCodOrder ? 'COD' : 'Razorpay');
  const paymentStatus = order.payment_status || (isCodOrder ? 'Pending' : 'Paid');
  const orderStatus = order.order_status || 'Confirmed';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-6 py-8 sm:p-10">
            {/* Order Confirmed Header */}
            <div className="text-center mb-10">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
                Order Confirmed!
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                {isCodOrder
                  ? 'Your Cash on Delivery order has been placed successfully.'
                  : 'Your order has been placed successfully.'}
              </p>
              <p className="mt-4 text-sm font-medium text-gray-700">
                Order ID: <span className="text-gray-900">{order.id}</span>
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-3 text-sm">
                <span className="px-3 py-2 rounded-full bg-green-50 text-green-700">
                  Payment: {paymentStatus}
                </span>
                <span className="px-3 py-2 rounded-full bg-blue-50 text-blue-700">
                  Method: {paymentMethod}
                </span>
                <span className="px-3 py-2 rounded-full bg-blue-50 text-blue-700">
                  Status: {orderStatus}
                </span>
              </div>
            </div>

            {/* Ordered Products */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Ordered Items</h2>
              <div className="space-y-4">
                {order.order_items?.map((item, index) => (
                  <div key={`order-success-item-${item.id}-${index}`} className="grid grid-cols-12 gap-4 items-center bg-gray-50 p-4 rounded-xl">
                    <div className="col-span-3">
                      <div className="w-full h-24 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={getProductImage(item.product_image || '')}
                          alt={item.product_name || 'Product'}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="col-span-5">
                      <h3 className="text-base font-semibold text-gray-900">
                        {item.product_name || 'Product'}
                      </h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="col-span-4 text-right">
                      <p className="text-base font-semibold text-gray-900">
                        ₹{(item.product_price ?? item.price)?.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{((item.product_price ?? item.price) * item.quantity).toLocaleString()} total
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-8 pt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <p className="text-sm text-gray-500">Total amount</p>
                    <p className="text-2xl font-bold text-gray-900">₹{order.total_amount?.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate('/shop')}
                      className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-warm-600 text-white text-sm font-semibold hover:bg-warm-700 transition-colors"
                    >
                      Continue Shopping
                    </button>
                    <button
                      onClick={() => navigate('/orders')}
                      className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-gray-100 text-gray-900 text-sm font-semibold hover:bg-gray-200 transition-colors"
                    >
                      View Orders
                    </button>
                    <button
                      onClick={() => navigate('/orders')}
                      className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Address</h2>
              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="font-semibold text-gray-900">
                  {deliveryAddress.fullName || deliveryAddress.address_line_1 || 'N/A'}
                </p>
                <p className="text-gray-600 mt-1">
                  {deliveryAddress.mobileNumber || deliveryAddress.phone || ''}
                </p>
                <p className="text-gray-600 mt-2">
                  {deliveryAddress.houseNo || ''}
                  {deliveryAddress.houseNo && deliveryAddress.address_line_1 ? ', ' : ''}
                  {deliveryAddress.address_line_1 || ''}
                </p>
                <p className="text-gray-600">
                  {deliveryAddress.area || deliveryAddress.landmark || ''}
                </p>
                <p className="text-gray-600">
                  {deliveryAddress.city || ''}, {deliveryAddress.state || ''} {deliveryAddress.pincode || ''}
                </p>
                {deliveryAddress.emailAddress && (
                  <p className="text-gray-600">Email: {deliveryAddress.emailAddress}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">What Happens Next?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Processing</h3>
              <p className="text-gray-600">
                We'll review your order and prepare it for shipping within 24-48 hours.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Shipping</h3>
              <p className="text-gray-600">
                Your order will be shipped via our trusted delivery partners with tracking updates.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="text-warm-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Enjoy!</h3>
              <p className="text-gray-600">
                Receive your products and enjoy the premium quality of MAY SECRET cosmetics.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="bg-gradient-to-r from-warm-600 to-warm-700 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4 tracking-wide">Thank You for Choosing MAY SECRET!</h3>
            <p className="text-warm-100 text-lg mb-6">
              We're excited to be part of your beauty journey. Your order is in good hands, and we can't wait for you to experience the magic of our premium Korean beauty products.
            </p>
            <p className="text-warm-200">
              Stay beautiful, stay confident! ✨
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
