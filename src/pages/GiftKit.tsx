import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

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
          className="max-w-md mx-auto"
        >
          <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-warm-100">
            <div className="relative overflow-hidden aspect-square">
              {/* Placeholder image area */}
              <div className="absolute inset-0 bg-gradient-to-br from-warm-50 to-warm-100 flex items-center justify-center">
                <div className="w-24 h-16 sm:w-28 sm:h-20 bg-rose-200/60 rounded-lg" />
              </div>

              {/* Coming soon tag */}
              <div className="absolute top-3 left-3 bg-rose-100 text-rose-700 text-xs font-medium px-3 py-1 rounded-full">
                Coming Soon
              </div>
            </div>

            {/* Info */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                Luxury Gift Kit
              </h3>

              <div className="flex flex-col items-center space-y-3">
                <span className="text-sm text-gray-500">Available Soon</span>
                <button
                  disabled
                  className="w-full cursor-not-allowed opacity-70 bg-gray-200 text-gray-500 py-3 px-4 rounded-lg font-medium"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GiftKit;
