import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { products } from '../utils/productData';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import comingSoonImg from '../assets/images/coming-soon.png';
import FloatingSocialButtons from '../components/FloatingSocialButtons';
import heroimg1 from '../assets/images/heroimg1.png';
import heroimg2 from '../assets/images/heroimg2.png';
import heroimg3 from '../assets/images/heroimg3.png';
import heroimg4 from '../assets/images/heroimg4.png';
import heroimg5 from '../assets/images/heroimg5.png';
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
  const heroImages = [heroimg1, heroimg2, heroimg3, heroimg4, heroimg5];
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000); // 3 seconds per slide
    return () => clearInterval(id);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cream-100 font-['Inter',sans-serif]">
      {/* Floating Social Buttons */}
      <FloatingSocialButtons />

      {/* Rotating Banner (below header) */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full flex items-center justify-center bg-black overflow-hidden h-[300px] sm:h-[350px] md:h-[450px] lg:h-[550px]">
          {heroImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Hero"
              className={`absolute top-0 left-0 w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[550px] object-contain bg-black transition-opacity duration-700 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          
          {/* Dots Indicator */}
          <div className="absolute bottom-4 w-full flex justify-center gap-2">
            {heroImages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* New Rotating Tagline Below Hero Images */}
      <RotatingTagline />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-cream-100 py-6 md:py-10 px-4 scroll-smooth">
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
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch"
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
              className="relative h-full"
            >
              <div className="bg-gray-100 rounded-xl shadow-md p-3 md:p-4 flex flex-col justify-center items-center h-full">
                <div className="w-full h-40 md:h-52 flex items-center justify-center bg-gray-200 rounded-lg">
                  <span className="text-gray-500 text-sm font-semibold">
                    Coming Soon
                  </span>
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