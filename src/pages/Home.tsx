import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Leaf, Droplets, Shield, Zap, Eye, Heart, Star, MessageCircle, Sparkles, Award, ShieldCheck, Flower, Gem } from 'lucide-react';
import { products } from '../utils/productData';
import Maysecret_cover from '../assets/images/Maysecret_cover.png';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import comingSoonImg from '../assets/images/coming-soon.png';
import FloatingSocialButtons from '../components/FloatingSocialButtons';
import BenefitsSection from '../components/BenefitsSection';
import Heroimg1 from '../assets/images/Heroimg1.png';
import Heroimg2 from '../assets/images/Heroimg2.png';
import Display1 from '../assets/images/Display1.jpg';
import Display2 from '../assets/images/Display2.jpg';
import RotatingTagline from '../components/RotatingTagline';
import SkincareTips from '../components/SkincareTips';
import WhyChooseMaySecret from '../components/WhyChooseMaySecret';
import CustomerReviews from '../components/CustomerReviews';
import Newsletter from '../components/Newsletter';
import GlassSkinRoutine from '../components/GlassSkinRoutine';
import { BRAND_NAME } from '../config/brand';

const Home: React.FC = () => {
  const { addToCart } = useCart();

  const handleAddToCart = async (product: any) => {
    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error('Home: Error adding to cart:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  // Rotating banner setup
  const bannerImages = [Maysecret_cover, Heroimg2, Heroimg1, Display2, Display1];
  const [bannerIndex, setBannerIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(id);
  }, []);

  const features = [
    {
      title: "Globally Sourced Ingredients",
      icon: Globe,
      description: "Premium ingredients from around the world",
      color: "from-blue-400 to-indigo-500",
      bgColor: "from-blue-50 to-indigo-100"
    },
    {
      title: "100% Vegan",
      icon: Leaf,
      description: "Completely plant-based formulations",
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-50 to-emerald-100"
    },
    {
      title: "Alcohol Free",
      icon: Droplets,
      description: "Gentle on sensitive skin",
      color: "from-cyan-400 to-blue-500",
      bgColor: "from-cyan-50 to-blue-100"
    },
    {
      title: "Clinically Proven Ingredients",
      icon: ShieldCheck,
      description: "Scientifically validated effectiveness",
      color: "from-purple-400 to-violet-500",
      bgColor: "from-purple-50 to-violet-100"
    },
    {
      title: "Parabens & SLS Free",
      icon: Zap,
      description: "No harsh chemicals or preservatives",
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-50 to-orange-100"
    },
    {
      title: "Non Comedogenic",
      icon: Eye,
      description: "Won't clog your pores",
      color: "from-pink-400 to-rose-500",
      bgColor: "from-pink-50 to-rose-100"
    },
    {
      title: "High Quality & Cruelty-Free",
      icon: Heart,
      description: "Ethical beauty standards",
      color: "from-red-400 to-pink-500",
      bgColor: "from-red-50 to-pink-100"
    },
    {
      title: "No Animal Testing",
      icon: Flower,
      description: "Committed to animal welfare",
      color: "from-emerald-400 to-teal-500",
      bgColor: "from-emerald-50 to-teal-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cream-100 font-['Inter',sans-serif]">
      {/* Floating Social Buttons */}
      <FloatingSocialButtons />

      {/* Rotating Banner (below header) */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full h-[280px] md:h-[450px]">
          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={bannerIndex}
                src={bannerImages[bannerIndex]}
                alt="Promotional banner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* New Rotating Tagline Below Hero Images */}
      <RotatingTagline />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-cream-100">
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-32">
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
              className="mb-8"
            >
              <motion.h1 
                initial={{ opacity: 0, letterSpacing: "0.5em" }}
                animate={{ opacity: 1, letterSpacing: "0.1em" }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4 text-black leading-tight tracking-wide text-center px-4"
              >
                <span className="tracking-widest font-bold">{BRAND_NAME}</span>
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl lg:text-3xl font-medium text-pink-600 mb-6"
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
                className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-pink-400 to-transparent bg-[length:200%_100%] rounded-full"
              />
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-sm md:text-base lg:text-xl mb-10 max-w-3xl mx-auto text-gray-600 leading-relaxed text-center px-4"
            >
              Premium skincare products crafted with nature's finest ingredients, 
              designed to reveal your skin's natural radiance and vitality.
            </motion.p>

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex justify-center space-x-4 mb-8"
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

      {/* Featured Products */}
      <section className="py-8 md:py-12 px-4 bg-gradient-to-br from-pink-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-4"
            >
              <Sparkles className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-6"
            >
              <span className="inline-block">Featured Products</span>
              <span className="inline-block ml-3 text-xl md:text-2xl lg:text-3xl font-medium text-pink-600" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>미래 제품</span>
            </motion.h2>
            <p className="text-sm md:text-base lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover our most popular and effective skincare products
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {products.slice(0, 6).map((product: any, index: number) => (
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
                  product={product} 
                  onAddToCart={() => handleAddToCart(product)}
                />
              </motion.div>
            ))}
            
            {/* Coming Soon Product Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                y: -3,
                transition: { duration: 0.2 }
              }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group opacity-75">
                {/* Coming Soon Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Coming Soon
                  </span>
                </div>
                
                {/* Product Image with Grayscale Effect */}
                <div className="relative overflow-hidden">
                  <img
                    src={comingSoonImg}
                    alt="New Product Coming Soon"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 filter grayscale group-hover:grayscale-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  {/* Overlay for Coming Soon Effect */}
                  <div className="absolute inset-0 bg-gray-200/20 group-hover:bg-transparent transition-all duration-300"></div>
                </div>
                
                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-600 mb-3 leading-tight">
                    New Product Coming Soon...
                  </h3>
                  <p className="text-gray-500 mb-4 leading-relaxed">
                    We're working on something amazing. Stay tuned for our latest innovation!
                  </p>
                  
                  {/* Coming Soon Message */}
                  <div className="text-center py-4">
                    <span className="inline-flex items-center gap-2 text-gray-500 font-medium">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"
                      />
                      Coming Soon
                    </span>
                  </div>
                  
                  {/* Disabled Button */}
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-xl font-semibold cursor-not-allowed opacity-50"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {products.length > 6 && (
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

      <GlassSkinRoutine />

      <WhyChooseMaySecret />

      <SkincareTips />

      <CustomerReviews />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-pink-100 to-cream-200">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-800"
            >
              <span className="inline-block">Ready to Transform Your Skin?</span>
              <span className="inline-block ml-3 text-3xl md:text-4xl font-medium text-pink-600" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>피부 변화를 준비하세요</span>
            </motion.h2>
            <p className="text-xl mb-10 text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Join thousands of satisfied customers who have discovered their natural beauty with {BRAND_NAME}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => window.location.href = '/shop'}
                className="bg-white text-pink-600 hover:bg-pink-50 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-pink-200"
              >
                Start Your Journey
              </button>
              <button 
                onClick={() => {
                  const whatsappNumber = '9579365540';
                  window.open(`https://wa.me/${whatsappNumber}`, '_blank');
                }}
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Chat with Expert
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
};

export default Home; 