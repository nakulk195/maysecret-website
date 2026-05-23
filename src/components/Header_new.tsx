import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Heart, 
  Menu, 
  X,
  Search,
  Home as HomeIcon,
  Gift,
  HelpCircle,
  Phone,
  ChevronRight,
  Package,
  User,
  LogOut
} from 'lucide-react';
import { getLoggedInUser, removeUserSession } from '../utils/auth';
import { useCart } from '../contexts/CartContext';
import SearchBar from './SearchBar';
import maysecretLogo from '../assets/images/maysecret_logo.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<{ firstName: string } | null>(null);
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for logged in user on mount and when storage changes
    const handleStorageChange = () => {
      setUser(getLoggedInUser());
    };

    // Initial check
    handleStorageChange();

    // Listen for storage events (for cross-tab updates)
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    removeUserSession();
    setUser(null);
    if (window.location.pathname === '/checkout' || window.location.pathname.startsWith('/orders')) {
      navigate('/');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  // Navigation items
  const navItems = [
    { to: '/', label: 'Home', icon: <HomeIcon className="w-5 h-5 mr-3" /> },
    { to: '/shop', label: 'Shop', icon: <ShoppingBag className="w-5 h-5 mr-3" /> },
    { to: '/orders', label: 'Orders', icon: <Package className="w-5 h-5 mr-3" /> },
    { to: '/giftkit', label: 'Gift Kit', icon: <Gift className="w-5 h-5 mr-3" /> },
    { to: '/quiz', label: 'Quiz', icon: <HelpCircle className="w-5 h-5 mr-3" /> },
    { to: '/contact', label: 'Contact', icon: <Phone className="w-5 h-5 mr-3" /> },
  ];

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <motion.img 
                src={maysecretLogo} 
                alt="MAY SECRET"
                className="maysecret-logo hidden md:block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />
              <motion.img 
                src={maysecretLogo} 
                alt="MAY SECRET"
                className="maysecret-logo md:hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />
              <motion.h1 
                className="text-2xl md:text-2xl font-bold text-black tracking-wide"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                MAY SECRET
              </motion.h1>
            </Link>
          </div>

          {/* Center Section - Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 mx-8">
            {navItems.map((item) => (
              <Link 
                key={item.to} 
                to={item.to} 
                className="text-gray-700 hover:text-warm-600 text-sm font-medium transition-colors"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section - Icons and Actions */}
          <div className="flex items-center space-x-6">
            {/* Search Icon - Desktop */}
            <div className="hidden md:flex items-center mr-4">
              <button
                onClick={toggleSearch}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Toggle search"
              >
                <Search className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="hidden md:block p-2 rounded-full hover:bg-gray-100"
              onClick={closeMenu}
            >
              <Heart className="h-5 w-5 text-gray-700" />
            </Link>
            
            {/* Cart */}
            <Link 
              to="/cart" 
              className="p-2 rounded-full hover:bg-gray-100 relative"
              onClick={closeMenu}
            >
              <ShoppingBag className="h-5 w-5 text-gray-700" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
            
            {/* User Menu or Login Button */}
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-warm-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-warm-700" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Hi, {user.firstName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block text-sm font-semibold text-warm-700 hover:text-gray-900 transition-colors"
                onClick={closeMenu}
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-warm-600 p-2 rounded-md focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Only visible when toggled */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-3">
                <SearchBar />
              </div>
              <div className="border-t border-gray-200 pt-4 pb-3">
                {/* Mobile Logo Section */}
                <div className="flex items-center space-x-3 px-2 py-3 border-b border-gray-100 mb-2">
                  <img 
                    src={maysecretLogo} 
                    alt="MAY SECRET"
                    className="maysecret-logo"
                  />
                  <h2 className="text-xl font-bold text-black tracking-wide">MAY SECRET</h2>
                </div>
                
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="group flex items-center px-2 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={closeMenu}
                    >
                      {item.icon}
                      {item.label}
                      <ChevronRight className="ml-auto h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    </Link>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-1">
                  <Link
                    to="/wishlist"
                    className="group flex items-center px-2 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={closeMenu}
                  >
                    <Heart className="w-5 h-5 mr-3" />
                    Wishlist
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  </Link>
                  {user ? (
                    <>
                      <div className="flex items-center px-4 py-2 text-gray-700">
                        <User className="w-5 h-5 mr-2 text-warm-600" />
                        <span>Hi, {user.firstName}</span>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMenu();
                        }}
                        className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <LogOut className="w-5 h-5 mr-2 text-warm-600" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link 
                      to="/login" 
                      className="block px-4 py-2 text-lg font-semibold text-warm-700 hover:bg-gray-100 rounded-md transition-colors mt-2"
                      onClick={closeMenu}
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>

    {/* Desktop Search Bar - Only visible when toggled */}
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="hidden md:block bg-white shadow-lg border-b border-gray-200 py-4 px-6 absolute left-0 right-0 z-40"
        >
          <div className="max-w-2xl mx-auto">
            <SearchBar onClose={closeSearch} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Header;
