import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BRAND_NAME } from '../config/brand';

const CustomerReviews: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    {
      name: "Isha Sharma",
      rating: 5,
      text: "The sunscreen spray is amazing. It protects my skin perfectly and feels very lightweight. My skin looks brighter and healthier.",
      image: "/images/reviews/user1.png"
    },
    {
      name: "Neethi Rao",
      rating: 5,
      text: "The rice brightening serum gave my skin a beautiful glow. I love the hydration and texture.",
      image: "/images/reviews/user2.png"
    },
    {
      name: "Riya Kapoor",
      rating: 5,
      text: `My skin texture improved so much after using ${BRAND_NAME} products. The glow is amazing.`,
      image: "/images/reviews/user3.png"
    },
    {
      name: "Ananya Patel",
      rating: 5,
      text: "These products are very gentle and effective. Perfect skincare routine for daily use.",
      image: "/images/reviews/user4.png"
    }
  ];

  const nextReview = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextReview();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextReview]);

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, index) => (
      <span key={index} className="text-yellow-400">⭐</span>
    ));
  };

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 text-gray-900">
            Love From Our Community
          </h2>
        </motion.div>

        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white shadow rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:shadow-xl transition duration-300"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
          </button>
          
          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white shadow rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:shadow-xl transition duration-300"
            aria-label="Next review"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
          </button>

          {/* Review Cards Container */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex justify-center"
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 lg:p-10 w-[85%] sm:w-[70%] md:w-[45%] lg:w-[30%] mx-auto relative hover:shadow-xl transition duration-300">
                  {/* Quote Icon */}
                  <div className="text-green-500 text-4xl md:text-6xl absolute top-4 right-6 md:top-6 md:right-8">
                    "
                  </div>

                  {/* Profile Image */}
                  <img
                    src={reviews[currentIndex].image}
                    alt={reviews[currentIndex].name}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full mx-auto mb-3 md:mb-4 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />

                  {/* Customer Name */}
                  <h3 className="font-semibold text-base md:text-lg mb-2 text-gray-900">
                    {reviews[currentIndex].name}
                  </h3>

                  {/* Rating Stars */}
                  <div className="flex justify-center text-yellow-400 mb-3">
                    {renderStars(reviews[currentIndex].rating)}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base lg:text-lg">
                    {reviews[currentIndex].text}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Review Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? 'bg-pink-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
