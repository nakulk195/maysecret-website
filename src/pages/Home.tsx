import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
// Load products from local productData
import { products as localProducts } from '../utils/productData';
import type { Product } from '../utils/productData';
import ProductCard from '../components/ProductCard';
import FloatingSocialButtons from '../components/FloatingSocialButtons';
import RotatingTagline from '../components/RotatingTagline';
import SkincareTips from '../components/SkincareTips';
import GlassSkinRoutine from '../components/GlassSkinRoutine';
import FoundersNote from '../components/FoundersNote';
import CampaignHero from '../components/hero/CampaignHero';
import { BRAND_NAME } from '../config/brand';
import { campaign } from '../config/campaign';

type CountdownState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
};

const getCountdownState = (endDate: string): CountdownState => {
  const endTime = new Date(endDate).getTime();
  const distance = endTime - Date.now();

  if (!Number.isFinite(endTime) || distance <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
    isExpired: false,
  };
};

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<CountdownState>(() =>
    getCountdownState(campaign.countdownEndDate)
  );

  // Load products from local productData
  useEffect(() => {
    try {
      console.log('Loading products for homepage from local productData');
      setProducts(localProducts);
      console.log('Homepage products loaded:', localProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(getCountdownState(campaign.countdownEndDate));
    };

    updateCountdown();
    const id = setInterval(updateCountdown, 1000);

    return () => clearInterval(id);
  }, []);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 1, y: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cream-100 font-['Inter',sans-serif]">
      {/* Floating Social Buttons */}
      <FloatingSocialButtons />

      <CampaignHero countdown={countdown} />

      {/* New Rotating Tagline Below Hero Images */}
      <RotatingTagline />

      {/* Hero Section moved below Featured Products to tighten layout */}

      {/* Featured Products */}
      <section className="py-6 md:py-8 px-4 bg-gradient-to-br from-pink-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-7 md:mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden sm:inline-block mb-4"
            >
              <Sparkles className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 md:mb-6"
            >
              <span className="inline-block">Featured Products</span>
              <span className="inline-block text-xl md:text-2xl lg:text-3xl font-medium text-pink-600" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>미래 제품</span>
            </motion.h2>
            <p className="text-sm md:text-base lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover our most popular and effective skincare products
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial={false}
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 px-0 py-3 sm:p-5"
          >
            {products && products.length > 0 && products.filter((product) => product.isFeatured).slice(0, 5).map((product: Product, index: number) => (
              <motion.div
              key={product.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  y: -3,
                  transition: { duration: 0.2 }
                }}
              >
                <ProductCard 
                  product={product}                />
              </motion.div>
            ))}
            
            {/* Only show Coming Soon if no products are loaded */}
            {(!products || products.length === 0) && !loading && (
              <motion.div
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  y: -3,
                  transition: { duration: 0.2 }
                }}
                className="relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
              >
              {/* Image Area */}
              <div className="relative overflow-hidden h-40 md:h-52 w-full">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🚀</div>
                    <span className="text-gray-600 text-sm font-semibold">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Info Area - Matching other cards */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col">
                <div className="flex-1">
                  {/* Product Name */}
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
                    New Products
                  </h3>
                  
                  {/* Rating Placeholder */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center bg-amber-50 rounded-full px-2 py-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-700 ml-1 font-medium">
                        Soon
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      (Be the first!)
                    </span>
                  </div>
                  
                  {/* Price Placeholder */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-bold text-gray-400">
                        ₹???
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Coming soon</div>
                  </div>
                </div>
                
                {/* Stock Status and Button - Always at bottom */}
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                  <span className="text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap bg-orange-100 text-orange-700">
                    Coming Soon
                  </span>
                  
                  {/* Notify Button */}
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-gray-200 text-gray-600 hover:bg-gray-300"
                  >
                    Notify Me
                  </button>
                </div>
              </div>
            </motion.div>
            )}
          </motion.div>

          {products && products.length > 6 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mt-16"
            >
              <button 
                onClick={() => window.location.href = '/shop'}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                View All Products
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <FoundersNote />

      {/* May Secret Brand section (moved below Featured Products) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-cream-100 py-6 md:py-8 px-4 scroll-smooth">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-rose-300/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              rotate: [360, 180, 0]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-cream-300/20 to-pink-200/30 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              x: [0, 60, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-pink-300/20 to-cream-400/20 rounded-full blur-lg"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center"
          >
            {/* Brand Name with Korean Text and Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <motion.h1 
                initial={{ opacity: 0, letterSpacing: "0.5em" }}
                animate={{ opacity: 1, letterSpacing: "0.1em" }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="text-2xl md:text-4xl lg:text-6xl font-bold mb-3 text-black leading-tight tracking-wide text-center px-4"
              >
                <span className="tracking-widest font-bold">{BRAND_NAME}</span>
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl lg:text-3xl font-medium text-pink-600 mb-4"
              >
                메이시크릿
              </motion.div>
              
              {/* Shimmer Effect */}
              <motion.div
                animate={{
                  backgroundPosition: ["200% center", "-200% center"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-pink-400 to-transparent bg-[length:200%_100%] rounded-full"
              />
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-sm md:text-base lg:text-lg mb-6 max-w-3xl mx-auto text-gray-600 leading-relaxed text-center px-4"
            >
              Premium skincare products crafted with nature's finest ingredients, 
              designed to reveal your skin's natural radiance and vitality.
            </motion.p>

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex justify-center space-x-4 mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 bg-pink-400 rounded-full"
              />
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 bg-cream-500 rounded-full"
              />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 bg-pink-400 rounded-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <GlassSkinRoutine />


      <SkincareTips />

    </div>
  );
};

export default Home; 
