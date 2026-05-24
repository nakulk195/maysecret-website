import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import CartItemCard from '../components/CartItemCard';
import { safeSetItem } from '../utils/safeStorage';

const Cart: React.FC = () => {
  const { cart, loading, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItem(productId);
    try {
      await updateQuantity(productId, newQuantity);
      showToast('Cart quantity updated', 'info');
    } catch (error) {
      console.error('Error updating quantity:', error);
      showToast('Could not update quantity. Please try again.', 'error');
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
      showToast('Product removed from cart', 'info');
    } catch (error) {
      console.error('Error removing cart item:', error);
      showToast('Could not remove product. Please try again.', 'error');
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsCheckingOut(true);
    try {
      // Check if user is authenticated
      if (!user) {
        // Store redirect path for after login
        safeSetItem('redirect_after_login', '/address');
        navigate('/login');
        return;
      }
      
      // User is authenticated, proceed to address page
      navigate('/address');
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-50 via-white to-warm-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-warm-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-50 via-white to-warm-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={48} className="text-warm-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Cart is Empty
          </h2>
          
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet. Start shopping to discover our amazing products!
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
          >
            Start Shopping
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-white to-warm-100 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Shopping Cart
          </h1>
          
          <p className="text-gray-600">
            {getCartCount()} item{getCartCount() !== 1 ? 's' : ''} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Your Cart Items
              </h2>
              <div className="space-y-6">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-warm-600"></div>
                  </div>
                ) : cart.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {cart.map((item) => {
                      if (!item.cartProduct) {
                        console.warn('Cart item missing cartProduct:', item);
                        return (
                          <div key={`cart-${item.id}`} className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                            <p className="text-red-600">⚠️ Product details unavailable (ID: {item.id})</p>
                            <button 
                              onClick={() => handleRemoveItem(item.product_id)}
                              className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                            >
                              Remove from cart
                            </button>
                          </div>
                        );
                      }
                      return (
                        <CartItemCard
                          key={`cart-item-${item.id}`}
                          item={item}
                          onQuantityChange={handleQuantityChange}
                          onRemove={handleRemoveItem}
                          updatingItem={updatingItem}
                        />
                      );
                    })}
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-sm text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
                    <Link
                      to="/shop"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                )}
              </div>
              </motion.div>
            </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Order Summary
              </h2>
              
              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span>₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹0</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span>₹{getCartTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || isCheckingOut}
                className={`w-full flex items-center justify-center py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  cart.length === 0 || isCheckingOut
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 hover:bg-black'
                }`}
              >
                {isCheckingOut ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              {/* Continue Shopping */}
              <div className="mt-6 text-center">
                <Link
                  to="/"
                  className="text-gray-900 hover:text-black font-medium transition-colors"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 
