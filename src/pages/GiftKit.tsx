import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import giftKitPack from '../assets/images/Giftpack/giftkit_pack.png';

const GiftKit: React.FC = () => {
  useEffect(() => {
    document.title = 'Gift Kit | MAY SECRET';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Gift Kit Collection
          </h1>
          <p className="mt-2 text-gray-600">
            Thoughtfully curated skincare gifts coming soon
          </p>
        </motion.div>

        {/* Product Card (Coming Soon) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -8 }}
          whileTap={{ scale: 0.995 }}
          className="max-w-md mx-auto"
        >
          <div className="group bg-white rounded-[2rem] shadow-xl shadow-rose-100/50 hover:shadow-2xl transition-all duration-500 overflow-hidden border border-rose-100">
            <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-pink-50">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100/60 via-white to-rose-100/80" />
              <div className="relative aspect-[4/3] flex items-center justify-center p-6">
                <motion.img
                  src={giftKitPack}
                  alt="Luxury Gift Kit"
                  className="max-h-full w-full object-contain rounded-3xl shadow-lg shadow-rose-200/50 transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              {/* Coming soon tag */}
              <div className="absolute top-4 left-4 bg-rose-100/95 text-rose-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-rose-200 shadow-sm animate-pulse">
                Coming Soon
              </div>
            </div>

            {/* Info */}
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Luxury Gift Kit
              </h3>
              <p className="text-sm text-gray-500 mb-6">Available Soon</p>

              <button
                disabled
                className="w-full cursor-not-allowed opacity-80 bg-gray-200 text-gray-500 py-3 px-4 rounded-2xl font-medium"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GiftKit;
