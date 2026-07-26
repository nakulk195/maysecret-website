import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '../utils/productData';
import { getProductImage } from '../utils/productImages';
import { addToRecentlyViewed } from '../utils/storage';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';


interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Use WishlistContext
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Add null safety check for CartContext
  let addToCart: (product: any, quantity?: number) => Promise<void>;
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
      const inWishlist = await isInWishlist(String(product.id));
      setIsWishlisted(inWishlist);
    };
    checkWishlist();
  }, [product.id, isInWishlist]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isWishlisted) {
        await removeFromWishlist(String(product.id));
        setIsWishlisted(false);
        showToast('Product removed from wishlist', 'info');
      } else {
        await addToWishlist(product as any);
        setIsWishlisted(true);
        showToast('Product added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      showToast('Wishlist update failed. Please try again.', 'error');
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.stock) return;
    
    try {
      await addToCart(product, 1);
      showToast('Product added to cart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      showToast('Could not add product to cart. Please try again.', 'error');
    }
  };

  const handleProductClick = () => {
    // Add to recently viewed directly
    addToRecentlyViewed(product as any);
  };

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isComboHighlight = product.category === 'combo' && [3, 4, 5].includes(product.id);
  const comboSavings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;
  const comboSubtitle = product.id === 3 ? 'Complete Skincare Combo' : '2 Premium Products Included';
  const comboIcons = product.id === 3 ? ['🧴', '☀️'] : product.id === 4 ? ['🧴', '🧴'] : ['☀️', '☀️'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className={`product-card relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border group flex flex-col h-full ${isComboHighlight ? 'border-amber-300/70 bg-[linear-gradient(135deg,rgba(255,250,240,0.95),rgba(255,255,255,0.98))] shadow-[0_12px_40px_rgba(251,191,36,0.12)]' : 'border-gray-100'} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} onClick={handleProductClick} className="block">
        <div className="relative overflow-hidden h-32 min-[390px]:h-36 sm:h-40 md:h-52 w-full bg-gray-50 flex items-center justify-center">
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-white animate-pulse" />
          )}
          
          {/* Product Image */}
          <motion.img
            src={getProductImage(product.image)}
            alt={product.name}
            className={`max-w-full max-h-full transition-transform duration-500 ${
              isHovered ? 'scale-105' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            loading="lazy"
            style={{ objectFit: 'contain', objectPosition: 'center' }}
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full z-10">
              {discountPercentage}% OFF
            </div>
          )}

          {isComboHighlight && (
            <>
              <motion.div
                whileHover={{ y: -1, scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="absolute left-2 top-2 z-10 rounded-full border border-amber-200/70 bg-white/90 px-2 py-1 text-[9px] font-semibold tracking-[0.14em] text-amber-700 shadow-sm backdrop-blur sm:px-2.5 sm:text-[11px]"
              >
                ✨ BEST VALUE
              </motion.div>

              <motion.div
                whileHover={{ y: -1, scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="absolute right-2 top-2 z-10 rounded-full border border-amber-200/70 bg-amber-50/95 px-2 py-1 text-[9px] font-semibold text-amber-800 shadow-sm backdrop-blur sm:px-2.5 sm:text-[11px]"
              >
                SAVE ₹{comboSavings.toLocaleString()}
              </motion.div>

              <motion.div
                animate={{ x: ['-20%', '120%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </>
          )}
          
          {/* Action Buttons - Always visible on mobile, on hover on desktop */}
          <div className={`absolute bottom-2 right-2 flex flex-col space-y-2 transition-opacity duration-300 ${
            isHovered ? 'md:opacity-100' : 'opacity-100 md:opacity-0'
          }`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              className={`p-2.5 md:p-2 rounded-full shadow-lg transition-colors min-h-[44px] min-w-[44px] ${
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
              className="p-2.5 md:p-2 bg-white text-warm-700 rounded-full shadow-lg hover:bg-warm-50 transition-colors min-h-[44px] min-w-[44px]"
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
      <div className="p-3 sm:p-5 flex flex-1 flex-col">
        <div className="flex-1">
          {/* Product Name with ellipsis */}
          <h3 className="min-h-[2.5rem] text-[13px] sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 overflow-hidden" 
              style={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>
            {product.name}
          </h3>

          {isComboHighlight && (
            <div className="mb-2 flex min-h-[34px] items-center justify-between rounded-lg border border-amber-200/70 bg-amber-50/70 px-2 py-1.5 text-[9px] font-medium text-amber-800 sm:mb-3 sm:rounded-full sm:px-2.5 sm:text-[11px]">
              <span className="hidden items-center gap-1.5 min-[390px]:flex">
                <span>{comboIcons[0]}</span>
                <span>{comboIcons[1]}</span>
              </span>
              <span className="tracking-[0.08em] text-[9px] uppercase sm:tracking-[0.16em] sm:text-[10px]">{comboSubtitle}</span>
            </div>
          )}
          
          {/* Rating and Reviews */}
          <div className="flex items-center gap-1.5 mb-2 sm:gap-2 sm:mb-3">
            <div className="flex items-center bg-amber-50 rounded-full px-2 py-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-700 ml-1 font-medium">
                {product.rating}
              </span>
            </div>
            <span className="hidden text-xs text-gray-500 whitespace-nowrap min-[390px]:inline">
              ({product.reviews} reviews)
            </span>
          </div>
          
          {/* Price */}
          <div className="mb-3">
            <div className="flex items-baseline gap-1.5 flex-wrap sm:gap-3">
              <span className="text-base font-bold text-gray-900 sm:text-lg">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-500 line-through sm:text-sm">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <p className="mt-1 hidden text-xs font-medium text-gray-500 min-[390px]:block">
              Inclusive all taxes
            </p>
          </div>
        </div>
        
        {/* Stock Status and Add to Cart */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <span className={`mb-2 inline-flex text-[10px] px-2 py-1 rounded-full sm:text-xs ${
            product.stock > 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
          
          <Link
            to={`/product/${product.id}`}
            onClick={handleProductClick}
            className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-gray-900 px-2 py-2 text-center text-xs font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg sm:text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;



