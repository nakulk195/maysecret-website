import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '../lib/supabase';
import { addToRecentlyViewed } from '../utils/storage';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, className = '' }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  // Use WishlistContext
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Add null safety check for CartContext
  let addToCart: (product: Product, quantity?: number) => Promise<void>;
  try {
    const cartContext = useCart();
    addToCart = cartContext.addToCart;
  } catch (error) {
    console.error('ProductCard: CartContext not available:', error);
    addToCart = async () => {
      console.warn('ProductCard: CartContext not available - addToCart disabled');
    };
  }

  // Check if product is in wishlist on component mount
  useEffect(() => {
    const checkWishlist = async () => {
      const inWishlist = await isInWishlist(product.id);
      setIsWishlisted(inWishlist);
    };
    checkWishlist();
  }, [product.id, isInWishlist]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        setIsWishlisted(false);
      } else {
        await addToWishlist(product);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
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
    // Convert Supabase Product to legacy Product format for addToRecentlyViewed
    const legacyProduct = {
      id: parseInt(product.id) || 0, // Convert string ID to number for legacy compatibility
      name: product.name,
      price: product.price,
      image: product.image,
      images: [product.image],
      description: product.description,
      benefits: [],
      category: product.category,
      inStock: product.in_stock,
      rating: product.rating,
      reviews: product.reviews,
      createdAt: product.created_at
    };
    addToRecentlyViewed(legacyProduct);
  };

  const discountPercentage = 0; // No discount calculation since original_price doesn't exist

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full min-h-[500px] ${className}`}
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
            style={{ objectFit: 'cover', objectPosition: 'center' }}
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
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product.id}`);
              }}
              className="p-2 bg-white text-warm-700 rounded-full shadow-lg hover:bg-warm-50 transition-colors flex items-center justify-center"
              aria-label="View details"
            >
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="flex-1">
          {/* Product Name with ellipsis */}
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 overflow-hidden" 
              style={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>
            {product.name}
          </h3>
          
          {/* Rating and Reviews */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center bg-amber-50 rounded-full px-2 py-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-700 ml-1 font-medium">
                {product.rating}
              </span>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              ({product.reviews} reviews)
            </span>
          </div>
          
          {/* Price */}
          <div className="mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Inclusive of all taxes</div>
          </div>
        </div>
        
        {/* Stock Status and Add to Cart - Always at bottom */}
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
          <span className={`text-xs px-2 py-1 rounded-full ${
            product.in_stock 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {product.in_stock ? 'In Stock' : 'Out of Stock'}
          </span>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              product.in_stock 
                ? 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;