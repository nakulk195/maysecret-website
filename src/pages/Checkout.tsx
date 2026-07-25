import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CheckCircle, Plus, Loader2, CreditCard, Smartphone } from 'lucide-react';
import { getLoggedInUser } from '../utils/auth';
import { OrderService } from '../services/orderService';
import CouponBox from '../components/CouponBox';
import { AppliedCoupon } from '../services/couponService';
import { safeGetItem, safeSetItem } from '../utils/safeStorage';
import { getProductImage } from '../utils/productImages';
import { handleMediaFallback } from '../config/storage';

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
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  // Load addresses on mount
  useEffect(() => {
    const savedAddresses = safeGetItem('guest_addresses');
    if (!savedAddresses) return;

    try {
      const parsed = JSON.parse(savedAddresses);
      setAddresses(parsed);
      const defaultAddr = parsed.find((a: Address) => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr);
    } catch {
      setAddresses([]);
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
    safeSetItem('guest_addresses', JSON.stringify(updatedAddresses));
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

      // Validate address
      if (!selectedAddress) {
        throw new Error('No delivery address selected');
      }

      // Prepare order data for Supabase
      const orderData = {
        user_id: (currentUser as any)?.id || 'guest-' + Date.now(),
        total_amount: payableTotal,
        shipping_address: {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode
        },
        payment_id: paymentMethod === 'upi' ? upiId : 'card-' + Date.now()
      };

      // Prepare order items for Supabase
      const orderItems = cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: Number(item.cartProduct?.price || 0)
      }));
      
      console.log('📦 Order items:', orderItems);
      console.log('🛒 Creating order in Supabase...');

      // Create order in Supabase using OrderService
      const createdOrder = await OrderService.createOrder(orderData, cart);
      
      console.log('✅ Order created successfully:', createdOrder);
      
      // Create order object for frontend display
      const frontendOrder = {
        id: createdOrder.id,
        items: cart.map(item => ({
          ...item,
          cartProduct: item.cartProduct || {
            id: '',
            name: 'Product',
            price: 0,
            image: '',
            description: '',
            category: '',
            stock: 0,
            is_featured: false,
            rating: 0,
            reviews: 0,
            created_at: '',
            updated_at: ''
          },
          price: Number(item.cartProduct?.price || 0)
        })),
        total: payableTotal,
        address: selectedAddress,
        paymentMethod: paymentMethod || 'UPI / Card',
        status: 'Successful',
        createdAt: new Date().toISOString()
      };

      console.log('🎉 Order processed successfully!');
      console.log('📤 Order details:', frontendOrder);

      // Clear cart and show success
      clearCart();
      setOrderId(frontendOrder.id);
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
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const payableTotal = Math.max(0, cartTotal - couponDiscount);

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
              {cart.map((item, index) => {
                if (!item.cartProduct) {
                  return (
                    <div key={`checkout-${item.id}-${index}`} className="flex justify-between p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-md mr-4 overflow-hidden">
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No image</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-red-600">Product Unavailable</p>
                          <p className="text-sm text-gray-500">ID: {item.product_id}</p>
                        </div>
                      </div>
                      <p className="font-medium text-red-600">₹0</p>
                    </div>
                  );
                }
                return (
                  <div key={`checkout-${item.id}-${index}`} className="flex justify-between">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-md mr-4 overflow-hidden">
                        <img
                          src={getProductImage(item.cartProduct?.image)}
                          alt={item.cartProduct?.name || 'Product'}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={handleMediaFallback}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.cartProduct?.name || 'Product'}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">₹{Number(item.cartProduct?.price || 0) * item.quantity}</p>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-gray-200 mt-6 pt-4">
              <CouponBox
                subtotal={cartTotal}
                appliedCoupon={appliedCoupon}
                onCouponChange={setAppliedCoupon}
              />
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between mb-2 text-green-700">
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>₹{payableTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
