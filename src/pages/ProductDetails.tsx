// @ts-nocheck
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
  Zap,
  Leaf,
  ShieldCheck
} from 'lucide-react';
import { getProductById } from '../utils/productData';
import { addToWishlist, removeFromWishlist, isInWishlist, addToRecentlyViewed } from '../utils/storage';
import { getProductImage, getProductImages } from '../utils/productImages';
import { useCart } from '../contexts/CartContext';
import { Product as SupabaseProduct } from '../lib/supabase';
import { ProductService } from '../services/productService';
import FloatingSocialButtons from '../components/FloatingSocialButtons';
import { BRAND_NAME } from '../config/brand';

// Helper: Check if string is a valid UUID
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showInfo, setShowInfo] = useState(false);
  const { addToCart } = useCart();

  const [product, setProduct] = useState<SupabaseProduct | null>(null);
  const [legacyProduct, setLegacyProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load product from Supabase or fallback to legacy
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        console.log('Loading product with ID:', id);
        setLoading(true);
        
        // Only try Supabase if ID is a valid UUID
        if (isValidUUID(id)) {
          const supabaseProduct = await ProductService.getProductById(id);
          if (supabaseProduct) {
            setProduct(supabaseProduct);
            console.log('Product loaded from Supabase:', supabaseProduct);
            return;
          }
        }
        
        // Fallback to legacy data for numeric IDs or if not found in Supabase
        const legacy = getProductById(Number(id));
        if (legacy) {
          setLegacyProduct(legacy);
          console.log('Product loaded from legacy data:', legacy);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        // Fallback to legacy data on error
        const legacy = getProductById(Number(id));
        if (legacy) {
          setLegacyProduct(legacy);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Use either Supabase product or legacy product
  const currentProduct = product || legacyProduct;

  // Helper function to get product properties safely
  const getProductProp = (prop: string, defaultValue: any = null) => {
    if (product) {
      return product[prop as keyof typeof product] || defaultValue;
    }
    if (legacyProduct) {
      const legacyMapping: Record<string, string> = {
        'original_price': 'originalPrice',
        'is_featured': 'isFeatured',
        'created_at': 'created_at',
        'images': 'images',
        'benefits': 'benefits',
        'ingredients': 'ingredients',
        'howToUse': 'howToUse',
        'storage': 'storage',
        'caution': 'caution',
        'manufacturer': 'manufacturer',
        'size': 'size'
      };
      const legacyKey = legacyMapping[prop] || prop;
      return legacyProduct[legacyKey] || defaultValue;
    }
    return defaultValue;
  };

  // Get images array (single image for Supabase, multiple for legacy)
  const getImages = () => {
    if (product) {
      return getProductImages([product.image]);
    }
    if (legacyProduct) {
      return legacyProduct.images
        ? getProductImages(legacyProduct.images)
        : getProductImages([legacyProduct.image]);
    }
    return [];
  };

  useEffect(() => {
    if (currentProduct) {
      // Convert to storage Product format if needed
      const storageProduct = product ? {
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        original_price: currentProduct.original_price || currentProduct.originalPrice,
        image: currentProduct.image,
        stock: currentProduct.stock,
        description: currentProduct.description,
        category: currentProduct.category,
        is_featured: currentProduct.is_featured || currentProduct.isFeatured,
        rating: currentProduct.rating,
        reviews: currentProduct.reviews,
        created_at: currentProduct.created_at || currentProduct.created_at
      } : currentProduct;
      
      addToRecentlyViewed(storageProduct);
      setIsWishlisted(isInWishlist(String(currentProduct.id)));
    }
  }, [currentProduct, product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-warm-600"></div>
      </div>
    );
  }

  if (!currentProduct) {
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
    if (!currentProduct) return;
    if (isWishlisted) {
      removeFromWishlist(currentProduct.id);
      setIsWishlisted(false);
    } else {
      addToWishlist(currentProduct);
      setIsWishlisted(true);
    }
  };

  const handleAddToCart = async () => {
    if (!currentProduct) return;
    try {
      await addToCart(currentProduct as any, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const nextImage = () => {
    const images = getImages();
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = getImages();
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const images = getImages();

  // @ts-ignore
  const discountPercentage = currentProduct?.originalPrice || currentProduct?.original_price 
    ? Math.round((((currentProduct?.originalPrice || currentProduct?.original_price) - (currentProduct?.price || 0)) / (currentProduct?.originalPrice || currentProduct?.original_price)) * 100)
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
                src={images[selectedImage]}
                alt={currentProduct?.name || 'Product'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                whileHover={{ scale: 1.05 }}
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
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
            {images.length > 1 && (
              <div className="flex space-x-3 justify-center">
                {images.map((image, index) => (
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
                      alt={`${currentProduct?.name || 'Product'} ${index + 1}`}
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
                {currentProduct?.name || 'Product'}
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 text-lg mb-4"
              >
                {currentProduct?.category === 'sunscreen' && "SPF 50 PA+++ | Broad Spectrum UVA/UVB Protection"}
                {currentProduct?.category === 'serum' && "Glow Boost Complex | Rice Extract Formula"}
                {currentProduct?.category === 'combo' && "Complete K-Beauty Routine | Sunscreen + Serum"}
              </motion.p>

              {/* Feature Badges */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                {currentProduct?.category === 'sunscreen' && (
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
                {currentProduct?.category === 'serum' && (
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
                        i < Math.floor(currentProduct?.rating || 4.5) 
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600 text-sm">({currentProduct?.reviews} reviews)</span>
                  <span className="text-sm text-gray-400 mx-2">•</span>
                  <span className="text-sm text-gray-600">{currentProduct?.size}</span>
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
                    ₹{(currentProduct?.price || 0).toLocaleString()}
                  </span>
                  {(currentProduct?.originalPrice || currentProduct?.original_price) && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ₹{(currentProduct?.originalPrice || currentProduct?.original_price || 0).toLocaleString()}
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
                {currentProduct?.stock && currentProduct.stock > 0 ? (
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
                  disabled={!currentProduct?.stock}
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
                { id: 'storage', label: 'Storage', icon: Shield }
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
                      {currentProduct?.description || 'Product description not available'}
                    </p>
                  </div>
                  
                  {/* Quick Benefits */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 tracking-wide">Key Benefits</h4>
                    <div className="space-y-3">
                      {currentProduct?.benefits?.slice(0, 5).map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-shadow duration-300"
                        >
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check size={16} className="text-white" />
                          </div>
                          <span className="font-semibold text-gray-900 tracking-wide">{benefit}</span>
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
                    <div className="space-y-3">
                      {currentProduct?.benefits?.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                        >
                          <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check size={16} className="text-white" />
                          </div>
                          <span className="font-semibold text-gray-900 tracking-wide">{benefit}</span>
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
                      {currentProduct?.ingredients && currentProduct.ingredients.length > 0 && currentProduct.ingredients.map((ingredient, index) => (
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
                      {currentProduct?.howToUse && currentProduct.howToUse.length > 0 && currentProduct.howToUse.map((step, index) => (
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
                  {currentProduct?.storage && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8">
                      <h3 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-3">
                        <Shield className="text-orange-500" />
                        Storage Instructions
                      </h3>
                      <div className="bg-white rounded-xl p-6 border-l-4 border-orange-400">
                        <p className="text-gray-700 leading-relaxed">{currentProduct?.storage}</p>
                      </div>
                    </div>
                  )}
                  
                  {currentProduct?.caution && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8">
                      <h3 className="text-2xl font-light text-gray-900 mb-6 flex items-center gap-3">
                        <ShieldCheck className="text-red-500" />
                        Safety & Caution
                      </h3>
                      <div className="bg-white rounded-xl p-6 border-l-4 border-red-400">
                        <p className="text-gray-700 leading-relaxed">{currentProduct?.caution}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              </AnimatePresence>
          </div>

          {/* Product Information Accordion */}
          {currentProduct?.manufacturer && (

            <div className="mt-10 border-t pt-6">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="flex justify-between w-full text-left font-semibold text-lg hover:text-gray-700 transition-colors duration-200"
              >
                Product Information
                <span className="text-2xl font-light">{showInfo ? "−" : "+"}</span>
              </button>
              
              {showInfo && (
                <div className="mt-4 text-gray-600 text-sm leading-relaxed">
                  <p>
                    <strong>Marketed By:</strong><br/>
                    {BRAND_NAME || 'MΛY SΞCRΞT'} Skin & Beauty<br/>
                    Shop No.2, Park Plaza<br/>
                    Opp. Kamla Nehru Park<br/>
                    Prabhat Road, Pune 411004
                  </p>
                  
                  <br/>
                  
                  <p>
                    <strong>Manufactured By:</strong><br/>
                    {currentProduct?.manufacturer?.manufacturedBy?.name || 'MAXNOVA HEALTHCARE'}<br/>
                    {currentProduct?.manufacturer?.manufacturedBy?.address?.split(',').map((addressPart, index) => (
                      <span key={index}>
                        {addressPart}
                        {index < (currentProduct?.manufacturer?.manufacturedBy?.address?.split(',').length || 0) - 1 && <br/>}
                      </span>
                    )) || 'Plot No 5, 6 & 7<br/>Davni Industrial Area<br/>PO Gurumajra, Baddi<br/>Distt Solan, Himachal Pradesh 174101'}
                  </p>
                  
                  <br/>
                  
                  <p>
                    <strong>Manufacturing License:</strong> {currentProduct?.manufacturer?.manufacturedBy?.licenseNo || 'HIM/COS/L/24/370'}
                  </p>
                  
                  <p>
                    <strong>Net Quantity:</strong> {currentProduct?.size || '100 ml'}
                  </p>
                  
                  <p>
                    <strong>Batch No / Mfg Date / Expiry Date:</strong><br/>
                    Refer Product Packaging
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails; 