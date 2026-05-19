import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Trash2 } from 'lucide-react';
import { Product } from '../lib/supabase';
import { getProductImage } from '../utils/productImages';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

interface WishlistCardProps {
  product: Product;
  onRemove: (productId: string) => void;
}

const WishlistCard: React.FC<WishlistCardProps> = ({ product, onRemove }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleRemoveFromWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(product.id);
  };

  const handleProductClick = () => {
    // Navigate to product details
  };

  const discountPercentage = 0; // No discount calculation since original_price doesn't exist

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-warm-100"
    >
      <Link to={`/product/${product.id}`} onClick={handleProductClick}>
        <div className="relative overflow-hidden aspect-square">
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-warm-50 to-warm-100 animate-pulse" />
          )}
          
          {/* Product Image */}
          <motion.img
            src={getProductImage(product.image)}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-warm-700 text-white text-xs font-semibold px-2 py-1 rounded-full">
              -{discountPercentage}%
            </div>
          )}
          
          {/* Wishlist Badge */}
          <div className="absolute top-3 right-3">
            <div className="bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
              <Heart size={12} className="inline mr-1" />
              Saved
            </div>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`} onClick={handleProductClick}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-warm-700 transition-colors mb-2">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          
          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(product.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">
              ({product.reviews} reviews)
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-warm-700">
                ₹{product.price.toLocaleString()}
              </span>
            </div>
            
            {/* Stock Status */}
            <span className={`text-xs px-2 py-1 rounded-full ${
              product.stock > 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={!product.stock}
            className="flex-1 bg-warm-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-warm-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemoveFromWishlist}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove from wishlist"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default WishlistCard;
