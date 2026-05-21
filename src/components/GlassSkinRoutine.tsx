import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Droplets, Shield } from 'lucide-react';
import serumImg from '../assets/images/brightening-serum.PNG';
import sunscreenImg from '../assets/images/sunscreen-spray.PNG';
import glowImg from '../assets/images/combo.PNG';
import { BRAND_NAME } from '../config/brand';

const GlassSkinRoutine: React.FC = () => {
  const routineSteps = [
    {
      id: 1,
      title: 'Step 1 – Brighten',
      product: 'Rice Brightening Serum',
      description: `Use ${BRAND_NAME} Rice Brightening Serum to reduce dullness and improve skin glow.`,
      image: serumImg,
      icon: <Sparkles className="w-6 h-6 text-pink-600" />,
      buttonColor: 'bg-pink-600 hover:bg-pink-700',
      buttonText: 'View Product',
      link: '/product/2'
    },
    {
      id: 2,
      title: 'Step 2 – Hydrate & Glow',
      product: 'May Secret Glow Combo Pack',
      description: 'Niacinamide and rice extract help hydrate skin and improve brightness.',
      image: glowImg,
      icon: <Droplets className="w-6 h-6 text-blue-600" />,
      buttonColor: 'bg-gray-900 hover:bg-gray-800',
      buttonText: 'Learn More',
      link: '/skincare-tips'
    },
    {
      id: 3,
      title: 'Step 3 – Protect',
      product: 'Sunscreen Spray SPF50',
      description: `Finish with ${BRAND_NAME} Sunscreen Spray SPF50 PA+++ for UVA/UVB protection.`,
      image: sunscreenImg,
      icon: <Shield className="w-6 h-6 text-green-600" />,
      buttonColor: 'bg-green-600 hover:bg-green-700',
      buttonText: 'View Product',
      link: '/product/1'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Perfect Glass Skin Routine
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Follow this simple Korean-inspired routine for radiant glowing skin.
          </p>
        </motion.div>

        {/* Routine Steps Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {routineSteps.map((step) => (
            <motion.div
              key={step.id}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Step Number & Icon */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  {step.icon}
                </div>
              </div>

              {/* Product Image */}
              <div className="mb-6">
                <img
                  src={step.image}
                  alt={step.product}
                  className="h-48 mx-auto object-contain rounded-lg"
                />
              </div>

              {/* Step Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                {step.title}
              </h3>

              {/* Product Name */}
              <p className="text-pink-600 font-medium text-center mb-4">
                {step.product}
              </p>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 text-center">
                {step.description}
              </p>

              {/* Action Button */}
              <div className="text-center">
                {step.link.startsWith('/product') ? (
                  <Link to={step.link}>
                    <button className={`px-8 py-3 ${step.buttonColor} text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105`}>
                      {step.buttonText}
                    </button>
                  </Link>
                ) : (
                  <Link to={step.link}>
                    <button className={`px-8 py-3 ${step.buttonColor} text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105`}>
                      {step.buttonText}
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready for Your Glass Skin Journey?
            </h3>
            <p className="text-gray-600 mb-6">
              Complete the full routine for best results and achieve that coveted Korean glass glow.
            </p>
            <Link to="/product/3">
              <button className="px-8 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-lg font-semibold hover:from-pink-700 hover:to-pink-800 transition-all duration-300 transform hover:scale-105">
                Shop Complete Routine
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GlassSkinRoutine;
