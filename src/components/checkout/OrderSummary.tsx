import { motion } from 'framer-motion';
import { CartItem } from '../../contexts/CartContext';
import { getProductImage } from '../../utils/productImages';
import { handleMediaFallback } from '../../config/storage';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  onProceed: () => void;
  buttonText: string;
  isButtonDisabled?: boolean;
  showItems?: boolean;
  className?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  shipping,
  onProceed,
  buttonText,
  isButtonDisabled = false,
  showItems = true,
  className = '',
}) => {
  const total = subtotal + shipping;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
      </div>
      
      {showItems && (
        <div className="divide-y divide-gray-200">
          {items.map((item, index) => {
            if (!item.cartProduct) {
              return (
                <div key={`order-summary-${item.id}-${index}`} className="p-4 flex items-center bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                    <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                      <span className="text-xs">No image</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3 className="line-clamp-1 text-red-600">Product Unavailable</h3>
                      <p className="ml-4 whitespace-nowrap">
                        ₹0
                      </p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <p>ID: {item.product_id}</p>
                      <p>Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={`order-summary-${item.id}-${index}`} className="p-4 flex items-center">
                <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                  {item.cartProduct.image ? (
                    <img
                      src={getProductImage(item.cartProduct.image)}
                      alt={item.cartProduct.name}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                      onError={handleMediaFallback}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                      <svg
                        className="h-8 w-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3 className="line-clamp-1">{item.cartProduct.name}</h3>
                    <p className="ml-4 whitespace-nowrap">
                      ₹{Number(item.cartProduct.price || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <p>Qty: {item.quantity}</p>
                    <p>
                      ₹{Number(item.cartProduct.price || 0) * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <div className="flex justify-between text-base text-gray-600">
            <p>Subtotal</p>
            <p>₹{subtotal.toLocaleString('en-IN')}</p>
          </div>
          <div className="flex justify-between text-base text-gray-600">
            <p>Shipping</p>
            <p>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</p>
          </div>
          {shipping === 0 && subtotal > 0 && (
            <div className="text-sm text-green-600">
              <p>🎉 Yay! Your order qualifies for free shipping</p>
            </div>
          )}
          <div className="flex justify-between text-base font-medium text-gray-900 pt-2 border-t border-gray-200">
            <p>Total</p>
            <p>₹{total.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onProceed}
          disabled={isButtonDisabled}
          className={`mt-6 w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
            isButtonDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {buttonText}
        </motion.button>

        <div className="mt-4 flex justify-center text-sm text-center text-gray-500">
          <p>
            or{' '}
            <button
              type="button"
              className="text-indigo-600 font-medium hover:text-indigo-500"
              onClick={() => window.history.back()}
            >
              Continue Shopping<span aria-hidden="true"> &rarr;</span>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
