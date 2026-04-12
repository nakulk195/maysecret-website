import { motion } from 'framer-motion';
import { PaymentMethod, PaymentDetails } from '../../types/checkout';

interface PaymentMethodsProps {
  onSelect: (method: PaymentMethod, details?: PaymentDetails) => void;
  selectedMethod: PaymentMethod | null;
  paymentDetails: PaymentDetails;
  onDetailsChange: (details: PaymentDetails) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  onSelect,
  selectedMethod,
  paymentDetails,
  onDetailsChange,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDetailsChange({
      ...paymentDetails,
      [name]: value,
    });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    // Format as XXXX XXXX XXXX XXXX
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim().slice(0, 19);
    onDetailsChange({
      ...paymentDetails,
      cardNumber: value,
    });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    // Format as MM/YY
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    onDetailsChange({
      ...paymentDetails,
      expiryDate: value.slice(0, 5),
    });
  };

  const isCardValid = () => {
    return (
      paymentDetails.cardNumber?.replace(/\s/g, '').length === 16 &&
      paymentDetails.cardName &&
      paymentDetails.expiryDate?.length === 5 &&
      paymentDetails.cvv?.length === 3
    );
  };

  const isUpiValid = () => {
    return paymentDetails.upiId && paymentDetails.upiId.includes('@');
  };

  return (
    <div className="space-y-6">
      {/* Card Payment Option */}
      <div className="relative">
        <input
          type="radio"
          id="card"
          name="paymentMethod"
          checked={selectedMethod === 'card'}
          onChange={() => onSelect('card')}
          className="sr-only"
        />
        <label
          htmlFor="card"
          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center h-5">
            <div className="w-5 h-5 border-2 rounded-full flex items-center justify-center mr-3">
              {selectedMethod === 'card' && (
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
          <div className="ml-3">
            <span className="block text-sm font-medium text-gray-900">
              Credit/Debit Card
            </span>
            <span className="block text-sm text-gray-500">
              Pay with Visa, Mastercard, or other cards
            </span>
          </div>
          <div className="ml-auto flex space-x-2">
            <div className="w-10 h-6 bg-gray-200 rounded-sm"></div>
            <div className="w-10 h-6 bg-gray-200 rounded-sm"></div>
            <div className="w-10 h-6 bg-gray-200 rounded-sm"></div>
          </div>
        </label>

        {selectedMethod === 'card' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number *
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentDetails.cardNumber || ''}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card *
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={paymentDetails.cardName || ''}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={paymentDetails.expiryDate || ''}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV *
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentDetails.cvv || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      onDetailsChange({
                        ...paymentDetails,
                        cvv: value,
                      });
                    }}
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Your payment is secured with 256-bit SSL encryption
            </div>
          </motion.div>
        )}
      </div>

      {/* UPI Payment Option */}
      <div className="relative">
        <input
          type="radio"
          id="upi"
          name="paymentMethod"
          checked={selectedMethod === 'upi'}
          onChange={() => onSelect('upi')}
          className="sr-only"
        />
        <label
          htmlFor="upi"
          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center h-5">
            <div className="w-5 h-5 border-2 rounded-full flex items-center justify-center mr-3">
              {selectedMethod === 'upi' && (
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
          <div className="ml-3">
            <span className="block text-sm font-medium text-gray-900">
              UPI
            </span>
            <span className="block text-sm text-gray-500">
              Pay using any UPI app
            </span>
          </div>
          <div className="ml-auto">
            <div className="w-10 h-6 bg-gray-200 rounded-sm"></div>
          </div>
        </label>

        {selectedMethod === 'upi' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPI ID *
                </label>
                <input
                  type="text"
                  name="upiId"
                  value={paymentDetails.upiId || ''}
                  onChange={(e) => {
                    onDetailsChange({
                      ...paymentDetails,
                      upiId: e.target.value,
                    });
                  }}
                  placeholder="yourname@upi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Example: 9890314682@apl or yourname@okbizaxis
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-semibold">GPay</span>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-semibold">PPay</span>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-semibold">PhnPe</span>
                </div>
                <div className="text-xs text-gray-500">+3 more</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* COD Option */}
      <div className="relative">
        <input
          type="radio"
          id="cod"
          name="paymentMethod"
          checked={selectedMethod === 'cod'}
          onChange={() => onSelect('cod')}
          className="sr-only"
        />
        <label
          htmlFor="cod"
          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center h-5">
            <div className="w-5 h-5 border-2 rounded-full flex items-center justify-center mr-3">
              {selectedMethod === 'cod' && (
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
          <div className="ml-3">
            <span className="block text-sm font-medium text-gray-900">
              Cash on Delivery (COD)
            </span>
            <span className="block text-sm text-gray-500">
              Pay when you receive your order
            </span>
          </div>
        </label>
      </div>

      {/* Payment Method Validation */}
      {selectedMethod === 'card' && !isCardValid() && (
        <div className="text-sm text-red-600 mt-2">
          Please fill in all card details to proceed
        </div>
      )}
      {selectedMethod === 'upi' && !isUpiValid() && (
        <div className="text-sm text-red-600 mt-2">
          Please enter a valid UPI ID to proceed
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
