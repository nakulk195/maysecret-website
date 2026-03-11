import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Leaf, Award } from 'lucide-react';

const WhyChooseMaySecret: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Korean Skincare Innovation",
      description: "Inspired by Korean beauty technology for glowing skin."
    },
    {
      icon: Leaf,
      title: "Premium Ingredients",
      description: "Rice extract, Niacinamide and advanced skincare actives."
    },
    {
      icon: Shield,
      title: "Dermatologically Tested",
      description: "Safe and effective skincare formulations."
    },
    {
      icon: Award,
      title: "Visible Skin Results",
      description: "Products designed to brighten, protect and hydrate skin."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            Why Choose MaySecret
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition duration-300 cursor-pointer"
            >
              <div className="flex justify-center mb-4">
                <feature.icon className="w-12 h-12 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseMaySecret;
