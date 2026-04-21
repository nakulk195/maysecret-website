import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, ShoppingBag, Package, Heart, Brain, Mail, Phone, MapPin, Clock, User, LogIn } from 'lucide-react';
import { getLoggedInUser } from '../utils/auth';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ firstName: string } | null>(null);

  // Get logged in user
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getLoggedInUser());
    };
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const menuItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Shop", icon: ShoppingBag, path: "/shop" },
    { name: "Orders", icon: Package, path: "/orders" },
    { name: "Wishlist", icon: Heart, path: "/wishlist" },
    { name: "Quiz", icon: Brain, path: "/quiz" },
    { name: "Contact", icon: Mail, path: "/contact" },
    { name: "Login", icon: LogIn, path: "/login" }
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />

          {/* Menu Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-[75%] max-w-sm bg-white shadow-2xl z-50 md:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* User Info */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4 px-5 pt-2"
              >
                <div className="text-lg font-semibold text-gray-800">
                  Hello, {user.firstName}! <span className="text-xl">{"\ud83d\udc4b"}</span>
                </div>
              </motion.div>
            )}

            {/* Menu Items */}
            <nav className="py-4 px-5">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * 0.05, 
                      type: 'spring', 
                      damping: 20, 
                      stiffness: 300 
                    }}
                    onClick={() => handleItemClick(item.path)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-pink-50 text-pink-600 shadow-sm' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.name}</span>
                  </motion.button>
                );
              })}
            </nav>

            {/* Contact Info */}
            <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-100 bg-gray-50">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-pink-600" />
                  <span>maysecretskinandbeauty@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-pink-600" />
                  <span>Pune, Maharashtra, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-pink-600" />
                  <span>Mon-Sat 9AM-6PM</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenuDrawer;
