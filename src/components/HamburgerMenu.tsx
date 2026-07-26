import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STORAGE_MEDIA } from '../config/storage';

const navLinks = [
  { to: '/shop', label: 'Shop' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/cart', label: 'Cart' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/recently-viewed', label: 'Recently Viewed' },
  { to: '/login', label: 'Login', className: 'mt-4 pt-4 border-t border-gray-200' },
];

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        className="p-2 rounded-full hover:bg-cream-200 transition"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 flex flex-col p-8 gap-6"
          >
            {/* Logo Section */}
            <div className="flex items-center justify-center pb-6 border-b border-gray-200 mb-4">
              <img
                src={STORAGE_MEDIA.logo.src}
                alt="MAY SECRET"
                className="maysecret-logo"
                loading="lazy"
              />
            </div>
            
            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-lg font-poppins hover:text-pink-500 transition ${link.className || ''}`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HamburgerMenu;
