import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '../utils/productData';
import { addToWishlist, removeFromWishlist, isInWishlist, addToRecentlyViewed } from '../utils/storage';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, className = '' }) => {
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(product.id));
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
    } else {
      addToWishlist(product);
      setIsWishlisted(true);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addToCart(product, 1);
      if (onAddToCart) onAddToCart();
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleProductClick = () => {
    addToRecentlyViewed(product);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group p-3 md:p-4 flex flex-col justify-between h-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} onClick={handleProductClick} className="block">
        <div className="relative overflow-hidden h-40 md:h-52 w-full">
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-warm-50 to-warm-100 animate-pulse" />
          )}
          
          {/* Product Image */}
          <motion.img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-warm-700 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
              -{discountPercentage}% OFF
            </div>
          )}
          
          {/* Action Buttons - Always visible on mobile, on hover on desktop */}
          <div className={`absolute bottom-2 right-2 flex flex-col space-y-2 transition-opacity duration-300 ${
            isHovered ? 'md:opacity-100' : 'opacity-100 md:opacity-0'
          }`}>
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              className={`p-3 md:p-2 rounded-full shadow-lg transition-colors min-h-[44px] ${
                isWishlisted 
                  ? 'bg-warm-700 text-white' 
                  : 'bg-white text-warm-700 hover:bg-warm-50'
              }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className="h-5 w-5 md:h-4 md:w-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="p-3 md:p-2 bg-white text-warm-700 rounded-full shadow-lg hover:bg-warm-50 transition-colors min-h-[44px]"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-5 w-5 md:h-4 md:w-4" />
            </motion.button>
            
            <Link 
              to={`/product/${product.id}`}
              className="p-2 bg-white text-warm-700 rounded-full shadow-lg hover:bg-warm-50 transition-colors flex items-center justify-center"
              aria-label="View details"
            >
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 h-10 sm:h-12 leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center bg-warm-100 rounded-full px-2 py-1 ml-2 flex-shrink-0">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-700 ml-1 font-medium">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-gray-500 ml-2">
            ({product.reviews} reviews)
          </span>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-warm-700">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">(Inclusive of all taxes)</div>
            </div>
            
            </div>
          
        </div>
        
        {/* Stock Status and Add to Cart */}
        <div className="mt-3 flex justify-between items-center">
          <span className={`text-xs px-2 py-1 rounded-full ${
            product.inStock 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              product.inStock 
                ? 'bg-warm-700 text-white hover:bg-warm-800' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;