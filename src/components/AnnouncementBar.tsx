import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementBar: React.FC = () => {
  const messages: string[] = [
    "Get 48% off on combo pack!",
    "Get 40% off on sunscreen spray!",
    "Get 33% off on rice Brighting serum!"
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5000); // 5 seconds per message

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="w-full bg-black flex items-center justify-center h-10 md:h-12 overflow-hidden relative">
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
              className="text-white text-center font-semibold text-sm md:text-base px-4 md:px-6 py-2 w-full flex items-center justify-center"
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
