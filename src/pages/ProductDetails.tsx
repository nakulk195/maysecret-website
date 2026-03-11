import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Sparkles,
  Sun,
  Droplets,
  Award,
  ChevronDown,
  ChevronUp,
  Zap,
  Leaf,
  ShieldCheck
} from 'lucide-react';
import { getProductById } from '../utils/productData';
import { addToWishlist, removeFromWishlist, isInWishlist, addToRecentlyViewed } from '../utils/storage';
import { useCart } from '../contexts/CartContext';
import FloatingSocialButtons from '../components/FloatingSocialButtons';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const { addToCart } = useCart();

  const product = getProductById(Number(id));

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
      setIsWishlisted(isInWishlist(product.id));
    }
  }, [product]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-warm-700 text-white px-6 py-3 rounded-lg hover:bg-warm-800 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
    } else {
      addToWishlist(product);
      setIsWishlisted(true);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      // You can add a success notification here
    } catch (error) {
      console.error('Error adding to cart:', error);
      // You can add an error notification here
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 py-8">
      <FloatingSocialButtons />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft size={20} className="mr-2" />
          Back
        </motion.button>

        {/* Hero Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Side - Product Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden group">
              <motion.img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                whileHover={{ scale: 1.05 }}
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/50"
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/50"
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-3 justify-center">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-rose-400 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Side - Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Product Name */}
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-light text-gray-900 mb-3"
              >
                {product.name}
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 text-lg mb-4"
              >
                {product.category === 'sunscreen' && "SPF 50 PA+++ | Broad Spectrum UVA/UVB Protection"}
                {product.category === 'serum' && "Glow Boost Complex | Rice Extract Formula"}
                {product.category === 'combo' && "Complete K-Beauty Routine | Sunscreen + Serum"}
              </motion.p>

              {/* Feature Badges */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                {product.category === 'sunscreen' && (
                  <>
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium border border-orange-200">
                      <Sun size={14} />
                      SPF 50 PA+++
                    </div>
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                      <ShieldCheck size={14} />
                      Broad Spectrum
                    </div>
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium border border-purple-200">
                      <Droplets size={14} />
                      Lightweight
                    </div>
                  </>
                )}
                {product.category === 'serum' && (
                  <>
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 px-4 py-2 rounded-full text-sm font-medium border border-pink-200">
                      <Sparkles size={14} />
                      Brightens Skin
                    </div>
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium border border-purple-200">
                      <Zap size={14} />
                      Reduces Pigmentation
                    </div>
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                      <Leaf size={14} />
                      Rice Extract
                    </div>
                  </>
                )}
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 px-4 py-2 rounded-full text-sm font-medium border border-rose-200">
                  <Sparkles size={14} />
                  K-Beauty Inspired
                </div>
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                  <Leaf size={14} />
                  Skin Friendly
                </div>
              </motion.div>

              {/* Rating */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center space-x-4 mb-6"
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600 text-sm">({product.reviews} reviews)</span>
                  <span className="text-sm text-gray-400 mx-2">•</span>
                  <span className="text-sm text-gray-600">{product.size}</span>
                </div>
              </motion.div>

              {/* Price */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-light text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-2">(Inclusive of all taxes)</div>
              </motion.div>

              {/* Stock Status */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-6"
              >
                {product.inStock ? (
                  <div className="flex items-center text-green-600">
                    <Check size={20} className="mr-2" />
                    <span className="font-medium">In Stock</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <span className="font-medium">Out of Stock</span>
                  </div>
                )}
              </motion.div>

              {/* Quantity Selector */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-3 mb-6"
              >
                <label className="text-sm font-medium text-gray-700">Quantity</label>
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-2xl border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    -
                  </motion.button>
                  <span className="w-16 text-center font-medium text-lg">{quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-2xl border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    +
                  </motion.button>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex space-x-4 mb-8"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-orange-400 text-white py-4 px-6 rounded-2xl font-medium hover:from-pink-600 hover:to-orange-500 transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
                >
                  <ShoppingCart size={20} />
                  <span>Add to Cart</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleWishlistToggle}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center ${
                    isWishlisted
                      ? 'border-rose-400 bg-rose-50 text-rose-600'
                      : 'border-gray-300 text-gray-600 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600'
                  }`}
                >
                  <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                </motion.button>
              </motion.div>

              {/* Features */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <Truck size={18} className="text-green-600" />
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield size={18} className="text-blue-600" />
                  <span className="text-sm text-gray-600">Secure Payment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw size={18} className="text-orange-600" />
                  <span className="text-sm text-gray-600">Easy Returns</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="border-b border-gray-100 mb-8">
            <nav className="flex space-x-1 sm:space-x-8 overflow-x-auto">
              {[
                { id: 'description', label: 'Description', icon: Sparkles },
                { id: 'benefits', label: 'Benefits', icon: Award },
                { id: 'ingredients', label: 'Ingredients', icon: Droplets },
                { id: 'how-to-use', label: 'How To Use', icon: Check },
                { id: 'storage', label: 'Storage', icon: Shield },
                { id: 'manufacturer', label: 'Manufacturer Info', icon: ChevronDown }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 border-b-2 font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-rose-400 text-rose-600 bg-rose-50 rounded-t-xl'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-6">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-light text-gray-900 mb-4">Product Overview</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {product.description}
                    </p>
                  </div>
                  
                  {/* Quick Benefits */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Key Benefits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.benefits.slice(0, 4).map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100"
                        >
                          <Check size={18} className="text-green-600 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'benefits' && (
                <motion.div
                  key="benefits"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-3">
                      <Award className="text-rose-500" />
                      Complete Benefits
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                        >
                          <Check size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'ingredients' && (
                <motion.div
                  key="ingredients"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-3">
                      <Droplets className="text-blue-500" />
                      Active Ingredients
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.ingredients && product.ingredients.map((ingredient, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.02 }}
                          className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm leading-relaxed">{ingredient}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'how-to-use' && (
                <motion.div
                  key="how-to-use"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-3">
                      <Check className="text-green-500" />
                      How to Use
                    </h3>
                    <div className="space-y-4">
                      {product.howToUse && product.howToUse.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-700 leading-relaxed font-medium">Step {index + 1}</p>
                            <p className="text-gray-600 leading-relaxed">{step}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'storage' && (
                <motion.div
                  key="storage"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {product.storage && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8">
                      <h3 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-3">
                        <Shield className="text-orange-500" />
                        Storage Instructions
                      </h3>
                      <div className="bg-white rounded-xl p-6 border-l-4 border-orange-400">
                        <p className="text-gray-700 leading-relaxed">{product.storage}</p>
                      </div>
                    </div>
                  )}
                  
                  {product.caution && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8">
                      <h3 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-3">
                        <ShieldCheck className="text-red-500" />
                        Safety & Caution
                      </h3>
                      <div className="bg-white rounded-xl p-6 border-l-4 border-red-400">
                        <p className="text-gray-700 leading-relaxed">{product.caution}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'manufacturer' && (
                <motion.div
                  key="manufacturer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {product.manufacturer && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
                      <h3 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-3">
                        <ChevronDown className="text-indigo-500" />
                        Manufacturer Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                          <h4 className="font-semibold text-gray-900 mb-3 text-lg">Marketed By</h4>
                          <div className="space-y-2">
                            <p className="text-gray-700 font-medium">{product.manufacturer.marketedBy.name}</p>
                            <p className="text-gray-600 text-sm">{product.manufacturer.marketedBy.address}</p>
                            <a 
                              href={`mailto:${product.manufacturer.marketedBy.email}`}
                              className="text-rose-600 hover:text-rose-700 text-sm font-medium inline-flex items-center gap-1"
                            >
                              {product.manufacturer.marketedBy.email}
                            </a>
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                          <h4 className="font-semibold text-gray-900 mb-3 text-lg">Manufactured By</h4>
                          <div className="space-y-2">
                            <p className="text-gray-700 font-medium">{product.manufacturer.manufacturedBy.name}</p>
                            <p className="text-gray-600 text-sm">{product.manufacturer.manufacturedBy.address}</p>
                            <p className="text-gray-600 text-sm">Mfg Lic No: {product.manufacturer.manufacturedBy.licenseNo}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails; 