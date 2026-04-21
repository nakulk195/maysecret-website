import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Instagram } from 'lucide-react';

const FloatingSocialButtons: React.FC = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919056555555', '_blank');
  };

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/maysecretskinandbeauty?igsh=MThqeHI2bTJ5ZmFkNw==', '_blank');
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 flex flex-col gap-3 z-50">
      {/* WhatsApp Floating Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleWhatsAppClick}
        className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-transform duration-300"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle size={20} className="text-white" />
      </motion.button>

      {/* Instagram Floating Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleInstagramClick}
        className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400 flex items-center justify-center shadow-lg hover:shadow-xl transition-transform duration-300"
        title="Follow us on Instagram"
      >
        <Instagram size={20} className="text-white" />
      </motion.button>
    </div>
  );
};

export default FloatingSocialButtons;
