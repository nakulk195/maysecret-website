import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ShoppingBag, Search, X, ChevronRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { STORAGE_MEDIA, handleMediaFallback } from '../config/storage';

interface MobileHeaderProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ isMenuOpen, onMenuToggle }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Orders", path: "/orders" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Quiz", path: "/quiz" },
    { name: "Contact", path: "/contact" },
    { name: "Login", path: "/login" }
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
    onMenuToggle();
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 lg:hidden">
        <div className="flex justify-between items-center px-3 py-2">
          {/* Hamburger Menu */}
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Centered Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="flex items-center">
              <img
                src={STORAGE_MEDIA.logo.src}
                alt="MAY SECRET"
                className="maysecret-logo"
                loading="eager"
                onError={(event) => handleMediaFallback(event, STORAGE_MEDIA.logo)}
              />
            </Link>
          </div>

          {/* Cart Icon with Badge */}
          <Link to="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ShoppingBag className="w-6 h-6 text-gray-700" />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </Link>
        </div>

        {/* Search Bar Below Header */}
        <div className="px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 pl-10 pr-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </header>

      {/* Side Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
              onClick={onMenuToggle}
            />

            {/* Menu Container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white shadow-xl z-50 lg:hidden"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={onMenuToggle}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="px-5 py-4">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleMenuClick(item.path)}
                    className="w-full flex items-center justify-between py-3 border-b border-gray-100 text-gray-800 font-medium hover:bg-gray-50 transition-colors"
                  >
                    <span>{item.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileHeader;
