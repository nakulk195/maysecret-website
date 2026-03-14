import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Home, Plus, Loader2, CreditCard, Smartphone } from 'lucide-react';
import { ordersAPI, usersAPI, addressesAPI } from '../services/api';
import { getLoggedInUser } from '../utils/auth';

// Types
interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

interface Order {
  id: string;
  items: any[];
  address: Address;
  total: number;
  date: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
}

const Checkout: React.FC = () => {
  // Navigation
  const navigate = useNavigate();
  const { cart, clearCart, getCartTotal } = useCart();

  // Step management
  const [step, setStep] = useState<number>(1);
  
  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState<Address>({
    id: '',
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('9890314682@apl');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');

  // Load addresses on mount
  useEffect(() => {
    const savedAddresses = localStorage.getItem('guest_addresses');
    if (savedAddresses) {
      const parsed = JSON.parse(savedAddresses);
      setAddresses(parsed);
      const defaultAddr = parsed.find((a: Address) => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr);
    }
  }, []);

  // Handle address form input
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  // Save new address
  const saveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const addressToAdd = {
      ...newAddress,
      id: `addr-${Date.now()}`,
      isDefault: addresses.length === 0
    };

    const updatedAddresses = [...addresses, addressToAdd];
    localStorage.setItem('guest_addresses', JSON.stringify(updatedAddresses));
    setAddresses(updatedAddresses);
    setSelectedAddress(addressToAdd);
    setShowAddressForm(false);
    setNewAddress({
      id: '',
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
  };

  // Process payment and create order
  const processPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Get current user
      const currentUser = getLoggedInUser();
      console.log('👤 Current user:', currentUser);
      
      if (!currentUser) {
        throw new Error('User not logged in');
      }

      // Create user in database if not exists
      let userId;
      try {
        console.log('🔍 Creating/retrieving user in database...');
        const userResponse = await usersAPI.create({
          first_name: currentUser.firstName || 'Guest',
          last_name: currentUser.lastName || 'User',
          phone: currentUser.phone || '0000000000'
        });
        userId = userResponse.data.id;
        console.log('✅ User created/retrieved with ID:', userId);
      } catch (userError) {
        console.error('❌ Failed to create user:', userError);
        throw new Error('Failed to create user account');
      }

      // Create address in database
      let addressId;
      try {
        if (!selectedAddress) {
          throw new Error('No delivery address selected');
        }
        
        console.log('🏠 Creating address in database...');
        const addressResponse = await addressesAPI.create({
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          address: `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode
        });
        addressId = addressResponse.data.id;
        console.log('✅ Address created with ID:', addressId);
      } catch (addressError) {
        console.error('❌ Failed to create address:', addressError);
        throw new Error('Failed to save delivery address');
      }

      // Prepare order items for backend
      const orderItems = cart.map(item => ({
        product_id: item.cartProduct?.id || item.id,
        quantity: item.quantity,
        price: Number(item.cartProduct?.price || 0)
      }));
      
      console.log('📦 Order items:', orderItems);

      // Create order in database
      let orderData;
      try {
        console.log('🛒 Creating order in database...');
        const orderResponse = await ordersAPI.create({
          user_id: userId,
          total_amount: Number(getCartTotal() || 0),
          status: 'pending',
          items: orderItems
        });
        
        orderData = orderResponse.data;
        console.log('✅ Order created successfully:', orderData);
      } catch (orderError) {
        console.error('❌ Failed to create order:', orderError);
        throw new Error('Failed to place order');
      }

      // Create order object for frontend display
      const order = {
        id: orderData.id.toString(),
        items: cart.map(item => ({
          ...item,
          cartProduct: item.cartProduct || item,
          price: Number(item.cartProduct?.price || 0)
        })),
        total: Number(getCartTotal() || 0),
        address: selectedAddress,
        paymentMethod: paymentMethod || 'UPI / Card',
        status: 'Successful',
        createdAt: new Date().toISOString()
      };

      // Save order ID for success page
      localStorage.setItem('recentOrderId', order.id);
      
      // Also save a copy in localStorage for backup (but not as primary storage)
      try {
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        localStorage.setItem('orders', JSON.stringify([order, ...existingOrders]));
        console.log('💾 Order backup saved to localStorage');
      } catch (backupError) {
        console.warn('⚠️ Could not save backup to localStorage:', backupError);
      }

      console.log('🎉 Order processed successfully!');
      console.log('📤 Order details:', order);

      // Clear cart and show success
      clearCart();
      setOrderId(order.id);
      setStep(3);
      setIsProcessing(false);
      
    } catch (error) {
      console.error('❌ Payment processing failed:', error);
      setIsProcessing(false);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to process order. Please try again.';
      alert(errorMessage);
    }
  };

  // Handle continue button
  const handleContinue = () => {
    if (step === 1 && !selectedAddress) return;
    if (step === 2) return processPayment();
    setStep(prev => prev + 1);
  };

  // Handle back button
  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  // Calculate cart total
  const cartTotal = getCartTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= i ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step > i ? <CheckCircle size={20} /> : i}
              </div>
              <span className="mt-2 text-sm font-medium text-gray-600">
                {i === 1 ? 'Address' : i === 2 ? 'Payment' : 'Complete'}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Step 1: Address Selection */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>
              
              {!showAddressForm ? (
                <div>
                  <div className="space-y-4 mb-6">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`p-4 border rounded-lg cursor-pointer ${
                          selectedAddress?.id === addr.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium">{addr.name}</h3>
                          {addr.isDefault && (
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-gray-600 text-sm">{addr.phone}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Add New Address
                  </button>
                </div>
              ) : (
                <form onSubmit={saveAddress} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={newAddress.name}
                        onChange={handleAddressChange}
                        className="w-full py-3 px-4 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={newAddress.phone}
                        onChange={handleAddressChange}
                        className="w-full py-3 px-4 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={newAddress.street}
                      onChange={handleAddressChange}
                      className="w-full py-3 px-4 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        className="w-full py-3 px-4 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        className="w-full py-3 px-4 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={newAddress.pincode}
                        onChange={handleAddressChange}
                        className="w-full py-3 px-4 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                {/* Card Payment */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
                    <span className="font-medium">Credit/Debit Card</span>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="mt-4 space-y-3">
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full py-3 px-4 border border-gray-300 rounded-md"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full py-3 px-4 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="w-full py-3 px-4 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* UPI Payment */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === 'upi' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <Smartphone className="w-5 h-5 mr-3 text-gray-600" />
                    <span className="font-medium">UPI</span>
                  </div>
                  {paymentMethod === 'upi' && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Enter UPI ID or select an app</p>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full py-3 px-4 border border-gray-300 rounded-md"
                      />
                      <div className="flex space-x-3 mt-3">
                        <button className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm">
                          Google Pay
                        </button>
                        <button className="px-3 py-2 bg-purple-50 text-purple-600 rounded-md text-sm">
                          PhonePe
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Order Confirmation */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your order has been placed and will be delivered soon.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg inline-block">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono font-medium">{orderId}</p>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => navigate('/orders')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  View Orders
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 3 && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className={`px-4 py-2 rounded-md ${
                  step === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                Back
              </button>
              
              <button
                onClick={handleContinue}
                disabled={(step === 1 && !selectedAddress) || (step === 2 && !paymentMethod) || isProcessing}
                className={`px-6 py-2 rounded-md flex items-center ${
                  (step === 1 && !selectedAddress) || (step === 2 && !paymentMethod)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : step === 2 ? (
                  'Pay Now'
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        {step < 3 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-md mr-4 overflow-hidden">
                      <img
                        src={item.cartProduct.image}
                        alt={item.cartProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.cartProduct.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">₹{Number(item.cartProduct.price) * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-6 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;