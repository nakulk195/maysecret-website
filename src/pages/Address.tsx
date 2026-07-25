import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CreditCard, MapPin, Phone, Mail, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { useAddresses } from '../hooks/useAddresses';
import { CheckoutAddress, createCashOnDeliveryOrder, startRazorpayCheckout } from '../services/checkoutService';
import CouponBox from '../components/CouponBox';
import { AppliedCoupon } from '../services/couponService';
import { getErrorMessage } from '../utils/safeAsync';
import { safeGetItem, safeRemoveItem, safeSetItem } from '../utils/safeStorage';
import { getProductImage } from '../utils/productImages';
import { handleMediaFallback } from '../config/storage';

// Indian states data
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry'
];

// Major Indian cities
const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar',
  'Varanasi', 'Srinagar', 'Dhanbad', 'Jodhpur', 'Amritsar', 'Raipur', 'Allahabad',
  'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Guwahati',
  'Chandigarh', 'Hubli-Dharwad', 'Mysore', 'Tiruchirappalli', 'Bareilly', 'Aligarh',
  'Tiruppur', 'Gurgaon', 'Kochi', 'Kozhikode', 'Thiruvananthapuram', 'Rourkela',
  'Bhilai', 'Saharanpur', 'Gulbarga', 'Dehradun', 'Bikaner', 'Warangal', 'Mangalore',
  'Noida', 'Bhubaneswar', 'Raigarh', 'Kota', 'Amravati', 'Allahabad', 'Shimla',
  'Ranchi', 'Cuttack', 'Firozabad', 'Kochi', 'Nanded', 'Kolhapur', 'Ajmer',
  'Guntur', 'Ujjain', 'Jammu', 'Salem', 'Solapur', 'Bhiwandi', 'Tirupati',
  'Malegaon', 'Gwalior', 'Jalgaon', 'Thrissur', 'Kurnool', 'Nellore', 'Bhilwara',
  'Bikaner', 'Erode', 'Belagavi', 'Ambarnath', 'Ahmednagar', 'Cuddalore', 'Kharagpur',
  'Bharatpur', 'Bhilai', 'Kochi', 'Nizamabad', 'Bhopal', 'Rajahmundry', 'Mathura',
  'Kannauj', 'Khammam', 'Udaipur', 'Secunderabad', 'Tirunelveli', 'Kota', 'Rourkela',
  'Bhilai', 'Saharanpur', 'Gulbarga', 'Dehradun', 'Bikaner', 'Warangal', 'Mangalore'
];

interface AddressFormData {
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  houseNo: string;
  apartment: string;
  area: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}

type PaymentMethod = 'online' | 'cod';

const Address: React.FC = () => {
  const { user } = useAuth();
  const { cart, getCartTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const { addresses, loading: addressesLoading, error: addressesError, addAddress, updateAddress, deleteAddress } = useAddresses();
  const navigate = useNavigate();
  const [buyNowItems, setBuyNowItems] = useState<any[]>([]);
  const [pendingCheckoutItems, setPendingCheckoutItems] = useState<any[]>([]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const [formData, setFormData] = useState<AddressFormData>({
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    houseNo: '',
    apartment: '',
    area: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    country: 'India'
  });

  const [errors, setErrors] = useState<Partial<AddressFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<CheckoutAddress | null>(null);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');
  const [citySearch, setCitySearch] = useState('');
  const [filteredCities, setFilteredCities] = useState(INDIAN_CITIES);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const checkoutItems = buyNowItems.length > 0
    ? buyNowItems
    : cart.length > 0
      ? cart
      : pendingCheckoutItems;
  const cartTotal = checkoutItems.length > 0
    ? checkoutItems.reduce((total, item) => {
        const price = Number(item.cartProduct?.price || 0);
        return total + price * Number(item.quantity || 1);
      }, 0)
    : getCartTotal();
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const payableTotal = Math.max(0, cartTotal - couponDiscount);
  const clearCheckoutItems = async () => {
    if (buyNowItems.length > 0) {
      safeRemoveItem('buy_now_checkout');
      setBuyNowItems([]);
      return;
    }

    safeRemoveItem('pending_checkout_cart');
    await clearCart();
  };

  // Auth protection
  useEffect(() => {
    if (!user) {
      safeSetItem('redirect_after_login', '/address');
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    try {
      const storedBuyNow = safeGetItem('buy_now_checkout');
      const parsedBuyNow = storedBuyNow ? JSON.parse(storedBuyNow) : [];
      setBuyNowItems(Array.isArray(parsedBuyNow) ? parsedBuyNow : []);
    } catch {
      setBuyNowItems([]);
    }

    try {
      const storedPendingCart = safeGetItem('pending_checkout_cart');
      const parsedPendingCart = storedPendingCart ? JSON.parse(storedPendingCart) : [];
      setPendingCheckoutItems(Array.isArray(parsedPendingCart) ? parsedPendingCart : []);
    } catch {
      setPendingCheckoutItems([]);
    }
  }, []);

  // City search functionality
  useEffect(() => {
    const filtered = INDIAN_CITIES.filter(city =>
      city.toLowerCase().includes(citySearch.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [citySearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof AddressFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<AddressFormData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.emailAddress.trim()) newErrors.emailAddress = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }
    if (!formData.houseNo.trim()) newErrors.houseNo = 'House number is required';
    if (!formData.area.trim()) newErrors.area = 'Area/Street is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let savedAddress: any = null;
      if (user) {
        if (isEditing && editingAddressId) {
          // Update existing address
          savedAddress = await updateAddress(editingAddressId, {
            full_name: formData.fullName,
            phone: formData.mobileNumber,
            email: formData.emailAddress || user?.email || '',
            address_line_1: formData.houseNo,
            address_line_2: [formData.apartment, formData.area].filter(Boolean).join(', '),
            landmark: formData.landmark || formData.area,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country
          });
        } else {
          // Create new address
          savedAddress = await addAddress({
            full_name: formData.fullName,
            phone: formData.mobileNumber,
            email: formData.emailAddress || user?.email || '',
            address_line_1: formData.houseNo,
            address_line_2: [formData.apartment, formData.area].filter(Boolean).join(', '),
            landmark: formData.landmark || formData.area,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country
          });
        }
      }

      // Save address to localStorage for use in payment page
      const checkoutAddress: CheckoutAddress = {
        id: savedAddress?.id || editingAddressId || undefined,
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        emailAddress: formData.emailAddress || user?.email || '',
        houseNo: formData.houseNo,
        apartment: formData.apartment,
        area: formData.area,
        landmark: formData.landmark,
        pincode: formData.pincode,
        city: formData.city,
        state: formData.state,
        country: formData.country,
      };
      safeSetItem('shipping_address', JSON.stringify(checkoutAddress));
      setSelectedAddress(checkoutAddress);
      showToast('Address saved. You can proceed to payment.', 'info');
      
      // Reset form and go back to address list
      resetForm();
      setShowAddressForm(false);
      setIsEditing(false);
      setEditingAddressId(null);
    } catch (error) {
      console.error('Error saving address:', getErrorMessage(error));
      showToast('Could not save address. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      mobileNumber: '',
      emailAddress: '',
      houseNo: '',
      apartment: '',
      area: '',
      landmark: '',
      pincode: '',
      city: '',
      state: '',
      country: 'India'
    });
    setErrors({});
  };

  const handleEditAddress = (address: any) => {
    setFormData({
      fullName: address.full_name,
      mobileNumber: address.phone,
      emailAddress: address.email || '',
      houseNo: address.address_line_1,
      apartment: address.address_line_2 || '',
      area: address.landmark || '',
      landmark: address.landmark || '',
      pincode: address.pincode,
      city: address.city,
      state: address.state,
      country: address.country
    });
    setIsEditing(true);
    setEditingAddressId(address.id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(addressId);
      } catch (error) {
        console.error('Error deleting address:', getErrorMessage(error));
        showToast('Could not delete address. Please try again.', 'error');
      }
    }
  };

  const buildCheckoutAddress = (address: any): CheckoutAddress => ({
    id: address.id,
    fullName: address.full_name,
    mobileNumber: address.phone,
    emailAddress: address.email || user?.email || '',
    houseNo: address.address_line_1,
    apartment: address.address_line_2 || '',
    area: address.landmark || address.address_line_2 || '',
    landmark: address.landmark || '',
    pincode: address.pincode,
    city: address.city,
    state: address.state,
    country: address.country || 'India'
  });

  const handleSelectAddress = (address: any) => {
    const addressFormData = buildCheckoutAddress(address);
    safeSetItem('shipping_address', JSON.stringify(addressFormData));
    setSelectedAddress(addressFormData);
    showToast('Delivery address selected', 'info');
  };

  const renderPaymentMethodSection = () => (
    <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">Payment Method</h3>
      <div className="space-y-3">
        <label
          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
            paymentMethod === 'online'
              ? 'border-gray-900 bg-gray-50'
              : 'border-gray-200 hover:border-gray-400'
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="online"
            checked={paymentMethod === 'online'}
            onChange={() => setPaymentMethod('online')}
            className="mt-1 h-4 w-4 text-gray-900 focus:ring-gray-900"
          />
          <span>
            <span className="block text-sm font-semibold text-gray-900">
              Online Payment
            </span>
            <span className="block text-xs text-gray-600">
              UPI, card, netbanking, and wallet through Razorpay.
            </span>
          </span>
        </label>

        <label
          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
            paymentMethod === 'cod'
              ? 'border-gray-900 bg-gray-50'
              : 'border-gray-200 hover:border-gray-400'
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={() => setPaymentMethod('cod')}
            className="mt-1 h-4 w-4 text-gray-900 focus:ring-gray-900"
          />
          <span>
            <span className="block text-sm font-semibold text-gray-900">
              Cash on Delivery (COD)
            </span>
            <span className="block text-xs text-gray-600">
              Pay in cash when your order is delivered.
            </span>
          </span>
        </label>
      </div>
    </div>
  );

  const handlePayNow = async () => {
    if (!user) {
      safeSetItem('redirect_after_login', '/address');
      navigate('/login');
      return;
    }

    if (!selectedAddress) {
      showToast('Please select an address first', 'info');
      return;
    }

    if (!checkoutItems.length) {
      showToast('Your cart is empty', 'error');
      navigate('/cart');
      return;
    }

    setIsPaymentProcessing(true);
    try {
      const checkoutPayload = {
        user,
        cart: checkoutItems,
        totalAmount: payableTotal,
        address: selectedAddress,
        clearCart: clearCheckoutItems,
      };

      if (paymentMethod === 'cod') {
        const order = await createCashOnDeliveryOrder(checkoutPayload);
        showToast('Your Cash on Delivery order has been placed successfully.');
        navigate(`/order-success?orderId=${order.id}&payment=cod`);
        return;
      }

      const order = await startRazorpayCheckout(checkoutPayload);
      showToast('Order successful');
      navigate(`/orders?success=1&orderId=${order.id}`);
    } catch (error: any) {
      if (error?.message !== 'Payment cancelled') {
        console.error('Checkout error:', error);
        showToast(
          error?.message || (paymentMethod === 'cod' ? 'Could not place COD order. Please try again.' : 'Payment failed. Please try again.'),
          'error'
        );
      }
    } finally {
      setIsPaymentProcessing(false);
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
            to="/cart"
            className="inline-flex items-center text-gray-900 hover:text-black mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {showAddressForm ? (isEditing ? 'Edit Address' : 'Add New Address') : 'Delivery Address'}
              </h1>
              <p className="text-gray-600">
                {showAddressForm 
                  ? 'Fill in the details below' 
                  : 'Select an existing address or add a new one'
                }
              </p>
            </div>
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
              >
                Add New Address
              </button>
            )}
          </div>
        </motion.div>

        {showAddressForm ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Address Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.fullName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.fullName}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        maxLength={10}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all ${
                          errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="9876543210"
                      />
                    </div>
                    {errors.mobileNumber && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.mobileNumber}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all ${
                        errors.emailAddress ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.emailAddress && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.emailAddress}
                    </motion.p>
                    )}
                </div>

                {/* Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      House No / Flat No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="houseNo"
                      value={formData.houseNo}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all ${
                        errors.houseNo ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123, A-101"
                    />
                    {errors.houseNo && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.houseNo}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apartment / Building
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all"
                      placeholder="Apartment name, floor, etc."
                    />
                  </div>
                </div>

                {/* Area and Landmark */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area / Street / Locality <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all ${
                          errors.area ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Main Street, Colony name"
                      />
                    </div>
                    {errors.area && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.area}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landmark / Nearby Place
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all"
                      placeholder="Near school, temple, etc."
                    />
                  </div>
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    maxLength={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all ${
                      errors.pincode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="110001"
                  />
                  {errors.pincode && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.pincode}
                    </motion.p>
                    )}
                </div>

                {/* City and State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={(e) => {
                          handleInputChange(e);
                          setCitySearch(e.target.value);
                        }}
                        onFocus={() => setCitySearch(formData.city)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Start typing city name..."
                      />
                      {citySearch && filteredCities.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {filteredCities.slice(0, 5).map((city, index) => (
                            <div
                              key={`city-${city}-${index}`}
                              onClick={() => {
                                setFormData(prev => ({ ...prev, city }));
                                setCitySearch('');
                                setFilteredCities(INDIAN_CITIES);
                              }}
                              className="px-4 py-2 hover:bg-warm-50 cursor-pointer transition-colors"
                            >
                              {city}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.city && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.city}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((state, index) => (
                        <option key={`state-${state}-${index}`} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.state}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all"
                    disabled
                  >
                    <option value="India">India</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    ) : (
                      <>
                        Save Address
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
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
              
              <div className="space-y-4">
                {checkoutItems.map((item, index) => (
                  <div key={`summary-${item.id}-${index}`} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={getProductImage(item.cartProduct?.image)}
                        alt={item.cartProduct?.name || 'Product'}
                        className="w-16 h-16 object-cover rounded-lg"
                        loading="lazy"
                        onError={handleMediaFallback}
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

              <div className="mt-5">
                <CouponBox
                  subtotal={cartTotal}
                  appliedCoupon={appliedCoupon}
                  onCouponChange={setAppliedCoupon}
                />
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-700">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-800 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-gray-900">₹{payableTotal.toLocaleString()}</span>
                </div>
              </div>

              {renderPaymentMethodSection()}
            </motion.div>
          </div>
        </div>
        ) : (
          // Address List View
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {addressesLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-warm-600 border-t-transparent"></div>
                  </div>
                ) : addressesError ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 bg-white rounded-xl shadow-sm"
                  >
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Could not load addresses</h3>
                    <p className="text-gray-600 mb-6">Please try again or add a new delivery address.</p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
                    >
                      Add New Address
                    </button>
                  </motion.div>
                ) : addresses.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 bg-white rounded-xl shadow-sm"
                  >
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Saved Addresses</h3>
                    <p className="text-gray-600 mb-6">Add your first delivery address to get started</p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
                    >
                      Add Your First Address
                    </button>
                  </motion.div>
                ) : (
                  addresses.map((address, index) => (
                    <motion.div
                      key={address.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white rounded-xl shadow-sm p-6 border transition-colors ${
                        selectedAddress?.id === address.id
                          ? 'border-gray-900 ring-2 ring-gray-900/10'
                          : 'border-gray-100 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <User className="w-5 h-5 text-warm-600 mr-2" />
                            <h3 className="font-semibold text-gray-800">{address.full_name}</h3>
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              {address.phone}
                            </div>
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                              <div>
                                {address.address_line_1}
                                {address.address_line_2 && <>, {address.address_line_2}</>}
                                <br />
                                {address.city}, {address.state} - {address.pincode}
                                <br />
                                {address.country}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-gray-700 hover:text-black p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleSelectAddress(address)}
                            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors"
                          >
                            {selectedAddress?.id === address.id ? 'Selected' : 'Use This'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
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
                
                <div className="space-y-4">
                  {checkoutItems.map((item, index) => (
                    <div key={`summary-${item.id}-${index}`} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={getProductImage(item.cartProduct?.image)}
                          alt={item.cartProduct?.name || 'Product'}
                          className="w-16 h-16 object-cover rounded-lg"
                          loading="lazy"
                          onError={handleMediaFallback}
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

                <div className="mt-5">
                  <CouponBox
                    subtotal={cartTotal}
                    appliedCoupon={appliedCoupon}
                    onCouponChange={setAppliedCoupon}
                  />
                </div>

                {/* Totals */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-700">
                      <span>Coupon Discount</span>
                      <span>-₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-800 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-gray-900">₹{payableTotal.toLocaleString()}</span>
                  </div>
                </div>

                {renderPaymentMethodSection()}

                {selectedAddress && (
                  <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 text-gray-900" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Selected delivery address</p>
                        <p className="mt-1 text-sm text-gray-600">
                          {selectedAddress.fullName}, {selectedAddress.city} - {selectedAddress.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={!selectedAddress || isPaymentProcessing || checkoutItems.length === 0}
                  className="mt-5 flex w-full items-center justify-center rounded-lg bg-gray-900 px-5 py-4 font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPaymentProcessing ? (
                    <span className="flex items-center">
                      <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {paymentMethod === 'cod' ? 'Placing order...' : 'Opening payment...'}
                    </span>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      {paymentMethod === 'cod' ? 'Place COD Order' : `Pay ₹${payableTotal.toLocaleString()}`}
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Address;
