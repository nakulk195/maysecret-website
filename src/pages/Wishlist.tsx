import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import WishlistCard from '../components/WishlistCard';

const Wishlist: React.FC = () => {
  const { wishlist, loading, removeFromWishlist, getWishlistCount } = useWishlist();
  const { getCartCount } = useCart();

  const handleRemoveFromWishlist = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <Heart className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Loading wishlist...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">My Wishlist</h1>
          <p className="text-gray-600 mb-8">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </motion.div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product: any, index: number) => (
            <WishlistCard
              key={product.id}
              product={product}
              onRemove={() => handleRemoveFromWishlist(product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist; 