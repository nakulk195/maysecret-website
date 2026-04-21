import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Heart, 
  Menu, 
  Search,
  Home as HomeIcon,
  Gift,
  Percent,
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
import MobileMenuDrawer from './MobileMenuDrawer';
import { BRAND_NAME } from '../config/brand';

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
    { to: '/', label: 'Home', icon: <HomeIcon className="w-5 h-5 md:w-6 md:h-6 mr-3" /> },
    { to: '/shop', label: 'Shop', icon: <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 mr-3" /> },
    { to: '/orders', label: 'Orders', icon: <Package className="w-5 h-5 md:w-6 md:h-6 mr-3" /> },
    { to: '/offer', label: 'Offers', icon: <Percent className="w-5 h-5 md:w-6 md:h-6 mr-3" /> },
    { to: '/giftkit', label: 'Gift Kit', icon: <Gift className="w-5 h-5 md:w-6 md:h-6 mr-3" /> },
    { to: '/quiz', label: 'Quiz', icon: <HelpCircle className="w-5 h-5 md:w-6 md:h-6 mr-3" /> },
    { to: '/contact', label: 'Contact', icon: <Phone className="w-5 h-5 md:w-6 md:h-6 mr-3" /> },
  ];

  return (
    <>
      {/* Mobile Header - Only shows on small screens */}
      <header className="flex md:hidden justify-between items-center px-4 py-3 bg-white shadow-sm sticky top-0 z-50">
        {/* Hamburger Menu */}
        <button
          onClick={toggleMenu}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Centered Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link to="/" className="flex items-center">
            <img
              src="/images/Maysecret_logo.svg"
              alt="MAY SECRET"
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Cart Icon with Badge */}
        <Link to="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={closeMenu}>
          <ShoppingBag className="w-6 h-6 text-gray-700" />
          {getCartCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </Link>
      </header>

      {/* Search Bar - Mobile only */}
      <div className="flex md:hidden px-4 pb-3 bg-white border-b border-gray-100">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 pl-10 pr-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            onFocus={toggleSearch}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Desktop Header - Keep unchanged */}
      <header className="hidden md:block bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/images/Maysecret_logo.svg"
                alt="MΛY SΞCRΞT"
                className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto object-contain flex-shrink-0 max-h-[80px] md:max-h-none hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Center Section - Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 mx-8">
            {navItems.map((item) => (
              <Link 
                key={item.to} 
                to={item.to} 
                className="text-gray-700 hover:text-warm-600 text-sm font-medium transition-colors min-h-[44px] px-3 py-2 flex items-center"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section - Icons and Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Icon - Desktop */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={toggleSearch}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Toggle search"
              >
                <Search className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            {/* Wishlist - Desktop */}
            <Link 
              to="/wishlist" 
              className="hidden lg:block p-2 rounded-full hover:bg-gray-100"
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

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-warm-600 p-2 rounded-md focus:outline-none"
                aria-expanded="false"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            
            {/* User Menu or Login Button - Desktop */}
            {user ? (
              <div className="hidden lg:flex items-center space-x-4">
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
                className="hidden lg:block text-sm font-semibold text-warm-700 hover:text-gray-900 transition-colors"
                onClick={closeMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <MobileMenuDrawer isOpen={isMenuOpen} onClose={closeMenu} />
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
