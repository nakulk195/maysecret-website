import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

interface OrderSuccessProps {
  orderId: string;
  total: number;
  onContinueShopping: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({
  orderId,
  total,
  onContinueShopping,
}) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>

            <div className="w-full bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              We've sent an order confirmation email with details and tracking information.
            </p>

            <div className="w-full space-y-3">
              <button
                onClick={() => navigate(`/orders/${orderId}`)}
                className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View Order Details
              </button>
              <button
                onClick={onContinueShopping}
                className="w-full px-4 py-2.5 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
