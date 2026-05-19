import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductImage } from '../utils/productImages';
import { CheckCircle, Package, Truck, Heart } from 'lucide-react';

interface OrderItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  cartProduct: {
    id: number;
    name: string;
    price: string;
    image: string;
    stock: number;
  };
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  address: {
    name: string;
    phone: string;
    street: string;
    city: string;
    pincode: string;
    state: string;
  };
  date: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
}

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (orderId) {
      // Get order from localStorage
      const orders = JSON.parse(localStorage.getItem('guest_orders') || '[]');
      const foundOrder = orders.find((o: Order) => o.id === orderId);
      setOrder(foundOrder || null);
    }
    setLoading(false);
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
                Your order has been placed successfully.
              </p>
              <p className="text-sm text-gray-500">
                Order ID: {order.id}
              </p>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div key={`order-success-${item.id}-${index}`} className="flex items-center">
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-md overflow-hidden">
                      <img
                        src={getProductImage(item.cartProduct.image)}
                        alt={item.cartProduct.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-base font-medium text-gray-900">
                        {item.cartProduct.name}
                      </h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-base font-medium text-gray-900">
                      ₹{item.cartProduct.price}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-8 pt-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>₹{order.total.toLocaleString()}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Including all taxes and shipping fees
                </p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Address</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">{order.address.name}</p>
                <p className="text-gray-600">{order.address.phone}</p>
                <p className="text-gray-600">{order.address.street}</p>
                <p className="text-gray-600">
                  {order.address.city}, {order.address.state} {order.address.pincode}
                </p>
                <div className="text-sm text-blue-600">
                  <p>Email: support@maysecret.com</p>
                </div>
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
