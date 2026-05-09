import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CreditCard, Smartphone, Shield, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { orderService } from '../services/database';

// Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    document.body.appendChild(script);
  });
};

const Payment: React.FC = () => {
  const { user } = useAuth();
  const { cart, getCartTotal } = useCart();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auth protection
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Get address from localStorage
  const [address, setAddress] = useState<any>(null);
  useEffect(() => {
    const savedAddress = localStorage.getItem('shipping_address');
    if (savedAddress) {
      setAddress(JSON.parse(savedAddress));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'number') {
      // Only allow digits, max 16
      const digitsOnly = value.replace(/\D/g, '').slice(0, 16);
      setCardDetails(prev => ({ ...prev, [name]: digitsOnly }));
    } else if (name === 'expiry') {
      // Format as MM/YY
      const formatted = value.replace(/\D/g, '').slice(0, 4);
      if (formatted.length === 2) {
        setCardDetails(prev => ({ ...prev, [name]: formatted + '/' }));
      } else {
        setCardDetails(prev => ({ ...prev, [name]: formatted }));
      }
    } else if (name === 'cvv') {
      // Only allow digits, max 3
      const digitsOnly = value.replace(/\D/g, '').slice(0, 3);
      setCardDetails(prev => ({ ...prev, [name]: digitsOnly }));
    } else {
      setCardDetails(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === 'card') {
      if (!cardDetails.number.replace(/\s/g, '').length) {
        newErrors.number = 'Card number is required';
      } else if (cardDetails.number.replace(/\s/g, '').length < 16) {
        newErrors.number = 'Card number must be 16 digits';
      }
      
      if (!cardDetails.name.trim()) {
        newErrors.name = 'Cardholder name is required';
      }
      
      if (!cardDetails.expiry.replace('/', '').length) {
        newErrors.expiry = 'Expiry date is required';
      } else if (cardDetails.expiry.replace('/', '').length !== 4) {
        newErrors.expiry = 'Invalid expiry date';
      }
      
      if (!cardDetails.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (cardDetails.cvv.length !== 3) {
        newErrors.cvv = 'CVV must be 3 digits';
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId.trim()) {
        newErrors.upiId = 'UPI ID is required';
      } else if (!/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
        newErrors.upiId = 'Invalid UPI ID format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      // Load Razorpay script
      await loadRazorpayScript();

      const options = {
        key: 'rzp_test_1DP5mmOlF5GQV', // Replace with your Razorpay key
        amount: getCartTotal() * 100, // Convert to paise
        currency: 'INR',
        name: 'Maysecret',
        description: 'Order Payment',
        image: '/images/Maysecret_logo.svg',
        handler: function (response: any) {
          // Payment successful
          console.log('Payment successful:', response);
          
          // Save order to Supabase
          saveOrderToSupabase(response.razorpay_payment_id);
          
          // Redirect to success page
          navigate('/order-success');
        },
        prefill: {
          name: user?.user_metadata?.first_name || 'Customer',
          email: user?.email || '',
          contact: address?.mobileNumber || ''
        },
        theme: {
          color: '#334155'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
    }
  };

  const saveOrderToSupabase = async (paymentId: string) => {
    try {
      if (!user || !address) {
        throw new Error('User or address data missing');
      }

      // Prepare order data
      const orderData = {
        total_amount: getCartTotal(),
        shipping_address: address,
        payment_id: paymentId
      };

      // Prepare order items
      const orderItems = cart.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: typeof item.cartProduct?.price === 'string' 
          ? parseFloat(item.cartProduct.price) 
          : (item.cartProduct?.price || 0)
      }));

      // Save order to Supabase
      const { order, items } = await orderService.createOrder(user.id, orderData, orderItems);
      
      console.log('Order saved successfully:', order);
      
      // Store order in localStorage as backup
      localStorage.setItem('last_order', JSON.stringify({
        user_id: user?.id,
        address: address,
        cart: cart,
        total: getCartTotal(),
        payment_id: paymentId,
        payment_status: 'success',
        created_at: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-white to-warm-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/address"
            className="inline-flex items-center text-warm-600 hover:text-warm-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Address
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment
          </h1>
          <p className="text-gray-600">
            Choose your payment method and complete your order
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Payment Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              {/* Payment Method Selection */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Payment Method
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-warm-600 bg-warm-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mx-auto mb-2" />
                    <span className="block text-sm font-medium">Credit/Debit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-warm-600 bg-warm-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Smartphone className="w-6 h-6 mx-auto mb-2" />
                    <span className="block text-sm font-medium">UPI</span>
                  </button>
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-6">
                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Card Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="number"
                          value={cardDetails.number}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all ${
                            errors.number ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.number && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.number}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={cardDetails.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          value={cardDetails.expiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all ${
                            errors.expiry ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.expiry && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.expiry}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={3}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all ${
                            errors.cvv ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.cvv && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.cvv}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'upi' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      UPI Details
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        UPI ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => {
                          setUpiId(e.target.value);
                          if (errors.upiId) {
                            setErrors(prev => ({ ...prev, upiId: '' }));
                          }
                        }}
                        placeholder="yourname@upi"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all ${
                          errors.upiId ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.upiId && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.upiId}
                        </motion.p>
                        )}
                      <p className="text-sm text-gray-500 mt-2">
                        Enter your UPI ID (e.g., yourname@upi)
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Pay Button */}
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-warm-600 text-white py-4 rounded-lg font-semibold hover:bg-warm-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    ) : (
                      <>
                        <Shield className="mr-2" />
                        Pay ₹{getCartTotal().toLocaleString()}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-8"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Order Summary
              </h2>
              
              {/* Address Summary */}
              {address && (
                <div className="mb-6 p-4 bg-warm-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">
                    Delivery Address
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>{address.fullName}</strong></p>
                    <p>{address.houseNo}, {address.area}</p>
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                    <p>{address.mobileNumber}</p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div key={`payment-${item.id}-${index}`} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.cartProduct?.image || '/placeholder-product.jpg'}
                        alt={item.cartProduct?.name || 'Product'}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 truncate">
                        {item.cartProduct?.name || 'Product'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    
                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm font-semibold text-warm-700">
                        ₹{typeof item.cartProduct?.price === 'string' 
                          ? (parseFloat(item.cartProduct.price) * item.quantity).toLocaleString()
                          : ((item.cartProduct?.price || 0) * item.quantity).toLocaleString()
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-800 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-warm-700">₹{getCartTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Secure Payment
                    </p>
                    <p className="text-xs text-green-600">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
