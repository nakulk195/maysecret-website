import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, Star } from 'lucide-react';
import { CartItem } from '../contexts/CartContext';
import { getProductImage } from '../utils/productImages';

interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (productId: string, newQuantity: number) => void;
  onRemove: (productId: string) => void;
  updatingItem: string | null;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ 
  item, 
  onQuantityChange, 
  onRemove, 
  updatingItem 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const isUpdating = updatingItem === item.id || updatingItem === item.product_id;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    onQuantityChange(item.product_id, newQuantity);
  };

  const handleRemove = () => {
    onRemove(item.product_id);
  };

  if (!item.cartProduct) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-red-600 font-medium">Product Unavailable</p>
            <p className="text-sm text-gray-500">This item is no longer available</p>
          </div>
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 p-1"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500"></div>
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>
      </div>
    );
  }

  const price = Number(item.cartProduct?.price || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:space-x-4 sm:gap-0">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <Link to={`/product/${item.product_id}`}>
              <div className="relative h-28 w-full rounded-lg overflow-hidden bg-gray-50 sm:h-24 sm:w-24">
                {item.cartProduct?.image ? (
                  <>
                    <img
                      src={getProductImage(item.cartProduct?.image)}
                      alt={item.cartProduct?.name || 'Product'}
                      className="h-full w-full object-contain rounded-lg"
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageLoaded(true)}
                      loading="lazy"
                    />
                    {!imageLoaded && (
                      <div className="h-full w-full bg-gray-200 rounded-lg animate-pulse"></div>
                    )}
                  </>
                ) : (
                  <div className="h-28 w-full bg-gray-100 rounded-lg flex items-center justify-center sm:h-24 sm:w-24">
                    <span className="text-gray-400 text-xs text-center px-2">No image</span>
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Product Details */}
          <div className="min-w-0 flex-1">
            <Link to={`/product/${item.product_id}`}>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 hover:text-warm-700 transition-colors mb-2">
                {item.cartProduct?.name || 'Product'}
              </h3>
            </Link>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {item.cartProduct?.description || 'Product description not available'}
            </p>
            
            {/* Rating */}
            {item.cartProduct && (
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={`${
                        i < Math.floor(item.cartProduct?.rating ?? 4.5) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  ({item.cartProduct?.reviews || 0} reviews)
                </span>
              </div>
            )}
            
            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">
                ₹{price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quantity Controls and Actions */}
          <div className="flex flex-row items-center justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-col sm:items-end sm:justify-start sm:space-y-4 sm:border-t-0 sm:pt-0">
            {/* Quantity Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Minus size={16} />
              </button>
              
              <span className="text-gray-800 font-medium min-w-[2rem] text-center">
                {isUpdating ? '...' : item.quantity}
              </span>
              
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Total Price */}
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-800">
                ₹{(price * item.quantity).toLocaleString()}
              </p>
              {item.quantity > 1 && (
                <p className="text-sm text-gray-500">
                  ₹{price.toLocaleString()} each
                </p>
              )}
            </div>

            {/* Remove Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRemove}
              disabled={isUpdating}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors p-2 rounded-lg disabled:opacity-50"
              title="Remove item"
            >
              <Trash2 size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItemCard;
