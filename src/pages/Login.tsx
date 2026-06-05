import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { safeGetItem, safeRemoveItem } from '../utils/safeStorage';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [checked, setChecked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, signUp, signIn, signInWithGoogle } = useAuth();

  const navigateAfterAuth = () => {
    const redirectPath = safeGetItem('redirect_after_login');
    if (redirectPath) {
      safeRemoveItem('redirect_after_login');
      navigate(redirectPath);
    } else {
      const fromPath = (location.state as any)?.from;
      navigate(fromPath ? `${fromPath.pathname || '/'}${fromPath.search || ''}${fromPath.hash || ''}` : '/');
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      navigateAfterAuth();
    }
  }, [authLoading, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For phone number, only allow digits and limit to 10 characters
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length > 10) return;
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isLoginMode) {
      // Login validation
      if (!formData.email || !formData.password) {
        setError('Please enter email and password');
        return;
      }
    } else {
      // Signup validation
      if (!formData.email || !formData.password) {
        setError('Please enter email and password');
        return;
      }
      
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError('Please enter your full name');
        return;
      }
      
      if (!formData.phone || formData.phone.length !== 10) {
        setError('Please enter a valid 10-digit phone number');
        return;
      }
      
      if (!checked) {
        setError('Please accept the Privacy Policy & T&Cs');
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      if (isLoginMode) {
        // Login with Supabase
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setError(error.message);
        } else {
          setShowSuccess(true);
        }
      } else {
        // Signup with Supabase
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.firstName.trim(),
          formData.lastName.trim(),
          formData.phone
        );
        if (error) {
          setError(error.message);
        } else {
          setShowSuccess(true);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

    const handleGoogleSignIn = async () => {
      setError('')
      setGoogleLoading(true)
      try {
        const { data, error } = await signInWithGoogle()
        if (error) {
          setError(error.message || JSON.stringify(error))
          setGoogleLoading(false)
          return
        }

        if (data?.url) {
          window.location.href = data.url
        }
      } catch (err) {
        setError('An unexpected error occurred')
      } finally {
        setGoogleLoading(false)
      }
    }

    const isFormValid = isLoginMode 
    ? formData.email !== '' && formData.password !== ''
    : formData.firstName.trim() !== '' && 
      formData.lastName.trim() !== '' && 
      formData.email !== '' &&
      formData.password !== '' &&
      formData.phone.length === 10 && 
      checked;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[420px]"
      >
        <motion.div 
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/50"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="p-8">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold text-black mb-1 tracking-wide">Welcome to MAY SECRET</h1>
              <p className="text-gray-500 text-sm">Sign in with your mobile number</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setIsLoginMode(true)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    isLoginMode 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsLoginMode(false)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    !isLoginMode 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <AnimatePresence>
                {/* Email Field (always visible) */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-1"
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border-0 bg-gray-50/50 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </motion.div>

                {/* Password Field (always visible) */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="space-y-1"
                >
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 pr-12 border-0 bg-gray-50/50 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-sm"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Signup-only fields */}
                {!isLoginMode && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-1"
                    >
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <div className="relative">
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-3 border-0 bg-gray-50/50 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-sm"
                          placeholder="Enter your first name"
                        />
                      </div>
                    </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-1"
                >
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border-0 bg-gray-50/50 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-sm"
                      placeholder="Enter your last name"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-1"
                >
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">+91</span>
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      maxLength={10}
                      className="block w-full pl-16 pr-4 py-3 border-0 bg-gray-50/50 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-sm"
                      placeholder="Enter mobile number"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
                  </>
                )}
              </AnimatePresence>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-start pt-1"
              >
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-all"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                </div>
                <label htmlFor="terms" className="ml-2 block text-xs text-gray-600">
                  I accept the{' '}
                  <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Privacy Policy
                  </Link>{' '}
                  &{' '}
                  <Link to="/terms" className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Terms
                  </Link>
                </label>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="pt-2"
              >
                <motion.button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  whileHover={!googleLoading ? { scale: 1.01 } : {}}
                  whileTap={!googleLoading ? { scale: 0.99 } : {}}
                  className={`w-full flex justify-center items-center mb-3 py-3.5 px-4 rounded-xl text-sm font-semibold text-black border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${googleLoading ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {googleLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Redirecting...
                    </>
                  ) : (
                    <>Continue with Google</>
                  )}
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  whileHover={isFormValid ? { scale: 1.01 } : {}}
                  whileTap={isFormValid ? { scale: 0.99 } : {}}
                  className={`w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-semibold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                    isFormValid 
                      ? 'bg-gradient-to-r from-indigo-600 to-pink-500 hover:shadow-md hover:shadow-indigo-100' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center text-xs text-gray-500"
            >
              <p>We'll send you an OTP to verify your number</p>
              <p className="mt-1">
                Need help?{' '}
                <Link to="/contact" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Contact Support
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-black mb-1 tracking-wide">Login Successful</h3>
              <p className="text-gray-600">Welcome to MAY SECRET</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
