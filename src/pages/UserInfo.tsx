import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Calendar, Shield, Edit, Package, Heart, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const UserInfo: React.FC = () => {
  const { user, signOut } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
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

  // Initialize form data from user metadata
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // This would update user profile in Supabase
    console.log('Saving user profile:', formData);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return null; // Will redirect via useEffect
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
                      {user?.user_metadata?.first_name || 'User'} {user?.user_metadata?.last_name || ''}
                    </h2>
                    <p className="text-gray-600">Member since {new Date(user?.created_at || '').toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Edit className="w-5 h-5 text-gray-600" />
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
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all ${
                        isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                      }`}
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
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all ${
                        isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                      }`}
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

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex space-x-4 pt-6">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-warm-600 text-white py-3 rounded-lg font-semibold hover:bg-warm-700 transition-colors"
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
                    className="w-full flex items-center justify-center space-x-2 p-3 bg-warm-50 text-warm-700 rounded-lg hover:bg-warm-100 transition-colors"
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
