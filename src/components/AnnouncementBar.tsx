import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementBar: React.FC = () => {
  const messages: string[] = [
    "🌸 Get 40% OFF on our MAY SECRET Combo Pack!",
    "💝 Free shipping on orders above ₹999!"
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 4000); // 4 seconds per message

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="w-full bg-black flex items-center justify-center h-12 overflow-hidden relative">
      <div className="w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full h-full flex items-center justify-center"
          >
            <p
              className="text-white text-center font-semibold text-base md:text-lg px-6 py-2 w-full flex items-center justify-center"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {messages[currentMessageIndex]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnnouncementBar;
