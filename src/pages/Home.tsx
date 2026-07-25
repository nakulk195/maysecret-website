import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, ChevronLeft, ChevronRight } from 'lucide-react';
// Load products from local productData
import { products as localProducts } from '../utils/productData';
import type { Product } from '../utils/productData';
import ProductCard from '../components/ProductCard';
import FloatingSocialButtons from '../components/FloatingSocialButtons';
import RotatingTagline from '../components/RotatingTagline';
import SkincareTips from '../components/SkincareTips';
import WhyChooseMaySecret from '../components/WhyChooseMaySecret';
import Newsletter from '../components/Newsletter';
import GlassSkinRoutine from '../components/GlassSkinRoutine';
import { BRAND_NAME } from '../config/brand';
import { STORAGE_MEDIA } from '../config/storage';

type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  remoteMedia: string;
  fallbackMedia: string;
  mediaType: 'image' | 'video';
  gradient: string;
  ctaHref: string;
};

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = STORAGE_MEDIA.hero.hero1.src;
    document.head.appendChild(preloadLink);

    return () => {
      document.head.removeChild(preloadLink);
    };
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

  const heroSlides: HeroSlide[] = [
    {
      id: 'hero-1',
      title: 'From Courtroom Clarity to Skincare Confidence',
      subtitle: 'Meet the Founder of May Secret Skin & Beauty',
      description: 'Adv. PRASANNA',
      remoteMedia: STORAGE_MEDIA.hero.hero1.src,
      fallbackMedia: STORAGE_MEDIA.hero.hero1.fallback,
      mediaType: 'image',
      gradient: 'from-sky-50 via-white to-rose-100',
      ctaHref: '/shop',
    },
    {
      id: 'hero-2',
      title: 'Unlock the Secret of Korean Glass Skin',
      subtitle: 'with May Secret',
      description: 'RICE BRIGHTENING SERUM',
      remoteMedia: STORAGE_MEDIA.hero.hero2.src,
      fallbackMedia: STORAGE_MEDIA.hero.hero2.fallback,
      mediaType: 'video',
      gradient: 'from-rose-50 via-white to-pink-100',
      ctaHref: '/shop',
    },
    {
      id: 'hero-3',
      title: 'Just Spray',
      subtitle: 'Shield Your Skin and Shine Brighter',
      description: 'With Every Single Spray',
      remoteMedia: STORAGE_MEDIA.hero.hero3.src,
      fallbackMedia: STORAGE_MEDIA.hero.hero3.fallback,
      mediaType: 'video',
      gradient: 'from-emerald-50 via-white to-rose-100',
      ctaHref: '/shop',
    },
    {
      id: 'hero-4',
      title: 'Elevate Your Daily Glow',
      subtitle: 'with our ultimate radiance duo',
      description: 'SUNSCREEN SPRAY & RICE BRIGHTENING SERUM',
      remoteMedia: STORAGE_MEDIA.hero.hero4.src,
      fallbackMedia: STORAGE_MEDIA.hero.hero4.fallback,
      mediaType: 'image',
      gradient: 'from-purple-50 via-white to-pink-100',
      ctaHref: '/shop',
    }
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedHeroMedia, setFailedHeroMedia] = useState<Record<string, boolean>>({});
  const heroTouchStartX = useRef<number | null>(null);
  const heroTouchEndX = useRef<number | null>(null);
  const currentSlide = heroSlides[currentIndex] || heroSlides[0];
  const currentSlideMedia = failedHeroMedia[currentSlide.id]
    ? currentSlide.fallbackMedia
    : currentSlide.remoteMedia;
  const isCurrentSlideUsingFallback = Boolean(failedHeroMedia[currentSlide.id]);

  const handleHeroMediaError = (slide: HeroSlide) => {
    setFailedHeroMedia((failed) => {
      if (failed[slide.id]) {
        console.warn(`Local fallback hero media could not be loaded: ${slide.fallbackMedia}`);
        return failed;
      }

      console.warn(`Supabase hero media could not be loaded, using local fallback: ${slide.remoteMedia}`);
      return {
        ...failed,
        [slide.id]: true,
      };
    });
  };

  const showPreviousSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const showNextSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const handleHeroTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    heroTouchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleHeroTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    heroTouchEndX.current = event.touches[0]?.clientX ?? null;
  };

  const handleHeroTouchEnd = () => {
    if (heroTouchStartX.current === null || heroTouchEndX.current === null) {
      heroTouchStartX.current = null;
      heroTouchEndX.current = null;
      return;
    }

    const distance = heroTouchStartX.current - heroTouchEndX.current;

    if (Math.abs(distance) > 45) {
      if (distance > 0) {
        showNextSlide();
      } else {
        showPreviousSlide();
      }
    }

    heroTouchStartX.current = null;
    heroTouchEndX.current = null;
  };

  useEffect(() => {
    if (heroSlides.length === 0) return;

    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, 10000); // 10 seconds per slide
    return () => clearInterval(id);
  }, [heroSlides.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cream-100 font-['Inter',sans-serif]">
      {/* Floating Social Buttons */}
      <FloatingSocialButtons />

      {/* Product Hero Slider */}
      {currentSlide && (
        <section
          className={`relative w-full overflow-hidden bg-gradient-to-br ${currentSlide.gradient}`}
          onTouchStart={handleHeroTouchStart}
          onTouchMove={handleHeroTouchMove}
          onTouchEnd={handleHeroTouchEnd}
        >
          <div className="relative mx-auto grid h-[260px] max-w-7xl grid-cols-[1.08fr_0.92fr] items-center gap-3 px-5 sm:h-[340px] sm:px-8 md:h-[430px] lg:h-[500px] lg:grid-cols-2 lg:px-12">
            <div className="z-10 max-w-xl">
              <motion.p
                key={`eyebrow-${currentSlide.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-500 sm:text-sm"
              >
                MAY SECRET
              </motion.p>
              <motion.h1
                key={`title-${currentSlide.id}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-2 text-2xl font-bold leading-tight text-gray-950 sm:text-4xl lg:text-5xl"
              >
                {currentSlide.title}
              </motion.h1>
              <motion.p
                key={`subtitle-${currentSlide.id}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="mb-2 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base lg:text-lg"
              >
                {currentSlide.subtitle}
              </motion.p>
              <motion.p
                key={`description-${currentSlide.id}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-gray-800 sm:text-sm"
              >
                {currentSlide.description}
              </motion.p>
              <button
                type="button"
                onClick={() => window.location.href = currentSlide.ctaHref}
                className="rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-rose-600 sm:px-7 sm:py-3"
              >
                Shop Now
              </button>
            </div>

            <div className="relative flex h-full min-w-0 items-center justify-center">
              {currentSlide.mediaType === 'video' ? (
                <motion.video
                  key={`video-${currentSlide.id}`}
                  src={currentSlideMedia}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onError={() => handleHeroMediaError(currentSlide)}
                  initial={{ opacity: 0, scale: 0.96, x: 18 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="max-h-[220px] w-full object-contain drop-shadow-2xl transition-all duration-500 ease-in-out sm:max-h-[300px] md:max-h-[390px] lg:max-h-[455px]"
                />
              ) : (
                <motion.img
                  key={`image-${currentSlide.id}`}
                  src={currentSlideMedia}
                  alt={currentSlide.title}
                  loading={currentIndex === 0 && !isCurrentSlideUsingFallback ? 'eager' : 'lazy'}
                  onError={() => handleHeroMediaError(currentSlide)}
                  initial={{ opacity: 0, scale: 0.96, x: 18 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="max-h-[220px] w-full object-contain drop-shadow-2xl transition-all duration-500 ease-in-out sm:max-h-[300px] md:max-h-[390px] lg:max-h-[455px]"
                />
              )}
            </div>

            <button
              type="button"
              onClick={showPreviousSlide}
              className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/85 p-3 text-gray-900 shadow-md transition-all duration-300 hover:bg-white md:flex"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={showNextSlide}
              className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/85 p-3 text-gray-900 shadow-md transition-all duration-300 hover:bg-white md:flex"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'w-7 bg-gray-950' : 'w-2 bg-gray-950/30'
                  }`}
                  aria-label={`Go to ${slide.title}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

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
              className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-6"
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-0 py-4 sm:p-5"
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

      <WhyChooseMaySecret />

      <SkincareTips />

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
                  window.open('https://wa.me/919075849555', '_blank');
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
