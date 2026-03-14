import React from 'react';
import { motion } from 'framer-motion';
import { featuredTips } from '../data/skincareTipsData';

const SkincareTips: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-white to-pink-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 text-gray-900">
            Skincare Tips
          </h2>
          <p className="text-sm md:text-base text-center text-gray-600 max-w-2xl mx-auto">
            Expert skincare advice to help you achieve glowing healthy skin
          </p>
        </motion.div>

        {/* Tips Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {featuredTips.map((tip) => (
            <motion.div
              key={tip.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => window.location.href = `/skincare-tips#${tip.slug}`}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={tip.image}
                  alt={tip.title}
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
              
              {/* Content */}
              <div className="p-4 md:p-6">
                {/* Category */}
                <span className="text-xs font-semibold text-pink-600 uppercase tracking-wide">
                  {tip.category}
                </span>

                {/* Title */}
                <h3 className="mt-2 text-lg font-semibold text-gray-900 leading-tight">
                  {tip.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  {tip.shortDescription}
                </p>
                
                {/* Read More Button */}
                <button 
                  className="mt-4 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors duration-200 flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/skincare-tips#${tip.slug}`;
                  }}
                >
                  Read More 
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Tips Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/skincare-tips'}
            className="px-8 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition duration-300 font-semibold"
          >
            View All Skincare Tips
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default SkincareTips;
