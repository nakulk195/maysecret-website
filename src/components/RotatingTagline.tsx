import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Heart, Sun } from 'lucide-react';

const RotatingTagline: React.FC = () => {
  const taglines = [
    {
      english: "Unlock K Beauty, Glass Glow Skin Effect",
      korean: "K뷰티의 비밀, 유리처럼 빛나는 피부",
      icon: Sparkles
    },
    {
      english: "K-Serum Light Up Your Life",
      korean: "K-세럼으로 빛나는 하루",
      icon: Star
    },
    {
      english: "Brighten the Korean Way",
      korean: "한국식 피부 광채",
      icon: Heart
    },
    {
      english: "Vitamin Glow, Korean Flow",
      korean: "비타민 광채, 한국의 흐름",
      icon: Sun
    }
  ];

  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3500); // 3.5 seconds per tagline

    return () => clearInterval(interval);
  }, [taglines.length]);

  const CurrentIcon = taglines[currentTaglineIndex].icon;

  return (
    <div className="w-full flex items-center justify-center py-3 md:py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 overflow-hidden relative border-t border-white/40 border-b border-white/40 shadow-sm">
      <div className="w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTaglineIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full flex items-center justify-center"
          >
            <div className="flex flex-col items-center text-center px-4 md:px-0">
              <div className="flex items-center gap-2 justify-center">
                <CurrentIcon className="text-white w-5 h-5" />
                <p 
                  className="text-white text-base md:text-xl font-bold tracking-wide"
                  style={{ textShadow: "0px 1px 4px rgba(0,0,0,0.18)" }}
                >
                  {taglines[currentTaglineIndex].english}
                </p>
              </div>
              <p 
                className="text-white text-xs md:text-base font-medium opacity-95 mt-1"
                style={{ textShadow: "0px 1px 3px rgba(0,0,0,0.15)" }}
              >
                {taglines[currentTaglineIndex].korean}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RotatingTagline;
