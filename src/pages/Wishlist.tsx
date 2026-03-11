import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { getWishlist, removeFromWishlist } from '../utils/storage';
import WishlistCard from '../components/WishlistCard';

const Wishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState(getWishlist());

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId);
    setWishlist(getWishlist());
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-gray-400 mb-6">
              <Heart size={80} className="mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">
              Start adding products to your wishlist to save them for later.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center bg-warm-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-warm-700 transition-colors"
            >
              Browse Products
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {wishlist.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
            >
              <WishlistCard 
                product={product} 
                onRemove={handleRemoveFromWishlist}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Wishlist; 