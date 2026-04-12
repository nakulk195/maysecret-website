import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, Star } from 'lucide-react';

interface CartProduct {
  id: number;
  name: string;
  price: number | string;
  image: string;
  inStock: boolean;
  description?: string;
  rating?: number;
  reviews?: number;
  originalPrice?: number | string;
}

interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  cartProduct?: CartProduct; // Make cartProduct optional
}

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

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    onQuantityChange(String(item.id), newQuantity);
  };

  const handleRemove = () => {
    onRemove(String(item.id));
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
            disabled={updatingItem === String(item.id)}
          >
            {updatingItem === String(item.id) ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500"></div>
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>
      </div>
    );
  }

  const price = typeof item.cartProduct.price === 'string' 
    ? parseFloat(item.cartProduct.price)
    : item.cartProduct.price;
    
  const originalPrice = item.cartProduct.originalPrice
    ? (typeof item.cartProduct.originalPrice === 'string'
        ? parseFloat(item.cartProduct.originalPrice)
        : item.cartProduct.originalPrice)
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <Link to={`/product/${item.productId}`}>
              <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                {item.cartProduct?.image ? (
                  <>
                    <img
                      src={item.cartProduct?.image || '/placeholder-product.jpg'}
                      alt={item.cartProduct?.name || 'Product'}
                      className="w-24 h-24 object-cover rounded-lg"
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.jpg';
                        setImageLoaded(true);
                      }}
                    />
                    {!imageLoaded && (
                      <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                    )}
                  </>
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs text-center px-2">No image</span>
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <Link to={`/product/${item.productId}`}>
              <h3 className="text-lg font-semibold text-gray-800 hover:text-warm-700 transition-colors mb-2">
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
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold text-warm-700">
                ₹{price.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Quantity Controls and Actions */}
          <div className="flex flex-col items-end space-y-4">
            {/* Quantity Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={updatingItem === String(item.id)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Minus size={16} />
              </button>
              
              <span className="text-gray-800 font-medium min-w-[2rem] text-center">
                {updatingItem === String(item.id) ? '...' : item.quantity}
              </span>
              
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={updatingItem === String(item.id)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
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
              className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors p-2 rounded-lg"
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
