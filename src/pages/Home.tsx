import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Clock, Sparkles, Star } from 'lucide-react';
// Load products from local productData
import { products as localProducts } from '../utils/productData';
import type { Product } from '../utils/productData';
import ProductCard from '../components/ProductCard';
import FloatingSocialButtons from '../components/FloatingSocialButtons';
import RotatingTagline from '../components/RotatingTagline';
import SkincareTips from '../components/SkincareTips';
import Newsletter from '../components/Newsletter';
import GlassSkinRoutine from '../components/GlassSkinRoutine';
import FoundersNote from '../components/FoundersNote';
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
  const [heroOffset, setHeroOffset] = useState({ x: 0, y: 0 });
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
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = campaign.heroMedia;
    document.head.appendChild(preloadLink);

    return () => {
      document.head.removeChild(preloadLink);
    };
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

  const handleHeroPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;
    setHeroOffset({ x, y });
  };

  const handleHeroPointerLeave = () => {
    setHeroOffset({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cream-100 font-['Inter',sans-serif]">
      {/* Floating Social Buttons */}
      <FloatingSocialButtons />

      {/* Campaign Hero */}
      {campaign.isCampaignActive && (
        <section
          className="campaign-hero relative w-full overflow-hidden text-white"
          onPointerMove={handleHeroPointerMove}
          onPointerLeave={handleHeroPointerLeave}
          style={{
            backgroundImage: campaign.gradientColors.hero,
            ['--campaign-primary' as string]: campaign.accentColors.primary,
            ['--campaign-secondary' as string]: campaign.accentColors.secondary,
            ['--campaign-accent' as string]: campaign.accentColors.accent,
          }}
        >
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <img
              src={campaign.backgroundMedia}
              alt=""
              className="campaign-hero-background h-full w-full object-cover"
              loading="eager"
            />
            {campaign.backgroundEffects.rain && <div className="campaign-rain-layer" />}
            {campaign.backgroundEffects.glow && (
              <>
                <motion.div
                  animate={{ x: [0, 22, 0], y: [0, -18, 0], opacity: [0.3, 0.52, 0.3] }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-[-10%] top-12 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl"
                />
                <motion.div
                  animate={{ x: [0, -18, 0], y: [0, 18, 0], opacity: [0.24, 0.44, 0.24] }}
                  transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-[-12%] right-[-6%] h-80 w-80 rounded-full bg-sky-400/25 blur-3xl"
                />
              </>
            )}
          </div>

          <div className="relative mx-auto grid min-h-[650px] max-w-7xl grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 md:min-h-[700px] lg:min-h-[680px] lg:grid-cols-[0.96fr_1.04fr] lg:px-12">
            <div className="z-10 max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mb-4 inline-flex items-center rounded-full border border-emerald-200/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-100 shadow-sm backdrop-blur-md sm:text-sm"
              >
                {campaign.campaignLabel}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="mb-3 text-4xl font-extrabold leading-[1.02] text-white sm:text-5xl lg:text-6xl"
              >
                {campaign.heading}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="mb-4 text-xl font-semibold text-emerald-100 sm:text-2xl"
              >
                {campaign.subHeading}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6 max-w-xl text-sm leading-relaxed text-white/78 sm:text-base lg:text-lg"
              >
                {campaign.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="mb-6 flex flex-col gap-3 sm:flex-row"
              >
                <button
                  type="button"
                  onClick={() => window.location.href = campaign.primaryCTA.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-gray-950 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-100 sm:px-7"
                >
                  {campaign.primaryCTA.label}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => window.location.href = campaign.secondaryCTA.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200/60 hover:bg-white/16 sm:px-7"
                >
                  {campaign.secondaryCTA.label}
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-5 flex flex-wrap gap-2"
              >
                {campaign.offerChips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/86 shadow-sm backdrop-blur-md"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-200" />
                    {chip}
                  </span>
                ))}
              </motion.div>

              {campaign.showCountdown && campaign.countdownEnabled && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.24 }}
                  className="grid max-w-xl grid-cols-4 overflow-hidden rounded-2xl border border-white/16 bg-white/10 shadow-2xl backdrop-blur-md"
                >
                  {countdown.isExpired ? (
                    <div className="col-span-4 px-4 py-4 text-center text-sm font-bold text-white">
                      Offer Ended
                    </div>
                  ) : (
                    [
                      ['Days', countdown.days],
                      ['Hours', countdown.hours],
                      ['Minutes', countdown.minutes],
                      ['Seconds', countdown.seconds],
                    ].map(([label, value]) => (
                      <div key={label} className="border-r border-white/12 px-2 py-3 text-center last:border-r-0">
                        <p className="text-lg font-extrabold text-white sm:text-2xl">
                          {String(value).padStart(2, '0')}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100/76">{label}</p>
                      </div>
                    ))
                  )}
                  <div className="col-span-4 flex items-center justify-center gap-2 border-t border-white/12 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">
                    <Clock className="h-3.5 w-3.5" />
                    {campaign.countdownTitle}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="relative z-10 flex min-h-[340px] min-w-0 items-center justify-center md:min-h-[440px] lg:min-h-[560px]">
              {campaign.showOfferBadge && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 5 }}
                  transition={{ duration: 0.55, delay: 0.24 }}
                  className="campaign-discount-badge absolute left-1 top-3 z-20 sm:left-4 lg:left-0"
                >
                  <span>{campaign.heroBadge.eyebrow}</span>
                  <strong>{campaign.offerPercentage}%</strong>
                  <span>{campaign.heroBadge.suffix}</span>
                </motion.div>
              )}

              {campaign.showFloatingComboCard && (
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.55, delay: 0.32 }}
                  className="campaign-combo-card absolute bottom-2 right-0 z-20 w-60 overflow-hidden rounded-3xl border border-emerald-100/25 bg-slate-950/58 shadow-2xl backdrop-blur-xl sm:right-6"
                >
                  <img
                    src={campaign.featuredPromoMedia}
                    alt={campaign.featuredComboName}
                    className="h-24 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-100">{campaign.featuredComboName}</p>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-2xl font-black text-white">{campaign.featuredComboPrice}</span>
                      <span className="pb-1 text-sm font-semibold text-white/45 line-through">{campaign.featuredComboOriginalPrice}</span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-emerald-200">{campaign.featuredComboSavings}</p>
                    <button
                      type="button"
                      onClick={() => window.location.href = campaign.secondaryCTA.href}
                      className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-white transition-colors hover:text-emerald-100"
                    >
                      {campaign.featuredComboCtaText}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              <motion.div
                className="campaign-hero-media-wrap relative w-full"
                animate={{
                  x: heroOffset.x,
                  y: heroOffset.y,
                  scale: heroOffset.x || heroOffset.y ? 1.012 : 1,
                }}
                transition={{ type: 'spring', stiffness: 80, damping: 22 }}
              >
                <div className="campaign-product-glow" aria-hidden="true" />
                {campaign.heroMediaType === 'video' ? (
                  <motion.video
                    src={campaign.heroMedia}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    initial={{ opacity: 0, scale: 0.97, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                    transition={{ opacity: { duration: 0.55 }, scale: { duration: 0.55 }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
                    className="campaign-hero-media relative w-full object-contain"
                  />
                ) : (
                  <motion.img
                    src={campaign.heroMedia}
                    alt={campaign.heroMediaAlt}
                    loading="eager"
                    initial={{ opacity: 0, scale: 0.97, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                    transition={{ opacity: { duration: 0.55 }, scale: { duration: 0.55 }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
                    className="campaign-hero-media relative w-full object-contain"
                  />
                )}
              </motion.div>
            </div>

            {campaign.showTrustStrip && (
              <div className="absolute bottom-0 left-0 right-0 z-10 hidden border-t border-white/12 bg-slate-950/34 px-4 py-3 backdrop-blur-md md:block">
                <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-2">
                  {campaign.trustPoints.map((point) => (
                    <span key={point} className="inline-flex items-center gap-2 text-sm font-bold text-white/82">
                      <Check className="h-4 w-4 text-emerald-200" />
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
