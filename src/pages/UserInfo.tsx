import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Calendar, Shield, Edit, Package, Heart, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { profileService, addressService, orderService } from '../services/database';
import { getErrorMessage, withTimeout } from '../utils/safeAsync';

const UserInfo: React.FC = () => {
  const { user, signOut } = useAuth();
  const { getCartCount } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Auth protection
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Load user data from database
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const [profileResult, addressesResult, ordersResult] = await Promise.allSettled([
          withTimeout(profileService.getProfile(user.id), 10000, 'Profile load timed out'),
          withTimeout(addressService.getUserAddresses(user.id), 10000, 'Address load timed out'),
          withTimeout(orderService.getUserOrders(user.id), 10000, 'Orders load timed out'),
        ]);

        const userProfile = profileResult.status === 'fulfilled' ? profileResult.value : null;
        if (userProfile) {
          setProfile(userProfile);
          setFormData({
            firstName: userProfile.full_name?.split(' ')[0] || '',
            lastName: userProfile.full_name?.split(' ')[1] || '',
            email: userProfile.email || user.email || '',
            phone: userProfile.phone || ''
          });
        } else {
          // Fallback to user metadata if no profile exists
          setFormData({
            firstName: user.user_metadata?.first_name || '',
            lastName: user.user_metadata?.last_name || '',
            email: user.email || '',
            phone: user.user_metadata?.phone || ''
          });
        }

        if (profileResult.status === 'rejected') {
          console.error('Error loading profile:', getErrorMessage(profileResult.reason));
        }

        if (addressesResult.status === 'fulfilled') {
          setAddresses(addressesResult.value);
        } else {
          console.error('Error loading addresses:', getErrorMessage(addressesResult.reason));
          setAddresses([]);
        }

        if (ordersResult.status === 'fulfilled') {
          setOrders(ordersResult.value);
        } else {
          console.error('Error loading orders:', getErrorMessage(ordersResult.reason));
          setOrders([]);
        }
        
      } catch (error) {
        console.error('Error loading user data:', getErrorMessage(error));
        setAddresses([]);
        setOrders([]);
        showToast('Could not load all profile data. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, showToast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await withTimeout(
        profileService.updateProfile(user.id, {
          full_name: fullName
        }),
        10000,
        'Profile update timed out'
      );
      
      // Reload profile data
      const updatedProfile = await withTimeout(
        profileService.getProfile(user.id),
        10000,
        'Profile refresh timed out'
      );
      setProfile(updatedProfile);
      
      setIsEditing(false);
      showToast('Profile updated');
    } catch (error) {
      console.error('Error saving profile:', getErrorMessage(error));
      showToast('Could not update profile. Please try again.', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      setProfile(null);
      setAddresses([]);
      setOrders([]);
      setLoading(false);
      navigate('/');
    }
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-50 via-white to-warm-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <User className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-white to-warm-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center text-warm-600 hover:text-warm-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            User Profile
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Profile Card */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              {/* Profile Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-warm-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {profile?.full_name || `${formData.firstName} ${formData.lastName}`.trim() || 'User'}
                    </h2>
                    <p className="text-gray-600">Member since {new Date(user?.created_at || '').toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="rounded-lg bg-gray-900 p-2 text-white transition-colors hover:bg-black"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all ${
                        isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all ${
                        isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-10 pr-4 py-3 border rounded-lg border-gray-200 bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      disabled
                      className="w-full pl-10 pr-4 py-3 border rounded-lg border-gray-200 bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                {/* Account Info */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">User ID</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {user?.id?.substring(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Account Created</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {new Date(user?.created_at || '').toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Account Status</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">Active</span>
                    </div>
                  </div>
                </div>

                {/* Saved Addresses */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Saved Addresses ({addresses.length})</h3>
                  {addresses.length > 0 ? (
                    <div className="space-y-3">
                      {addresses.map((address, index) => (
                        <div key={`address-${address.id}-${index}`} className="p-4 bg-gray-50 rounded-lg">
                          <div className="space-y-1">
                            <p className="font-medium text-gray-800">{address.full_name}</p>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                            <p className="text-sm text-gray-600">
                              {address.address_line_1}, {address.address_line_2 && `${address.address_line_2}, `}
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No saved addresses yet</p>
                  )}
                </div>

                {/* Order History */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Order History ({orders.length})</h3>
                  {orders.length > 0 ? (
                    <div className="space-y-3">
                      {orders.map((order, index) => (
                        <div key={`order-${order.id}-${index}`} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800">Order #{order.id.substring(0, 8).toUpperCase()}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(order.created_at).toLocaleDateString()} • {order.order_items?.length || 0} items
                              </p>
                              <p className="text-sm font-medium text-warm-700">
                                ₹{order.total_amount?.toLocaleString()}
                              </p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              (order.order_status || order.status) === 'delivered' ? 'bg-green-100 text-green-800' :
                              (order.order_status || order.status) === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              (order.order_status || order.status) === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.order_status || order.status || 'pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No orders yet</p>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex space-x-4 pt-6">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-black transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Side - Quick Actions */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <Link
                    to="/orders"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Package className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">My Orders</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Wishlist</span>
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative">
                      <ShoppingBag className="w-5 h-5 text-gray-600" />
                      {getCartCount() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                          {getCartCount()}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-700">Shopping Cart</span>
                  </Link>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-green-50 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">Security</h3>
                </div>
                <p className="text-sm text-green-700">
                  Your account is protected with secure authentication. 
                  Your personal information is encrypted and never shared with third parties.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
