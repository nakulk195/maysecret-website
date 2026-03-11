import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Leaf, Ban, FlaskConical, ShieldCheck, Droplets, Award, PawPrint } from 'lucide-react';

const items = [
  { icon: Globe, label: 'Globally Sourced Ingredients' },
  { icon: Leaf, label: '100% Vegan' },
  { icon: Ban, label: 'Alcohol Free' },
  { icon: FlaskConical, label: 'Clinically Proven Ingredients' },
  { icon: ShieldCheck, label: 'Parabens & SLS Free' },
  { icon: Droplets, label: 'Non Comedogenic' },
  { icon: Award, label: 'High Quality & Cruelty-Free' },
  { icon: PawPrint, label: 'No Animal testing' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};

const BenefitsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            <span style={{ fontFamily: 'Playfair Display, serif' }}>Glow Beyond Expectations</span>
            <span className="ml-3 text-pink-600 font-medium md:text-[1.6rem] text-[1.25rem]" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>(이점이 있는 블렌드)</span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {items.map(({ icon: Icon, label }, idx) => (
            <motion.div
              key={label}
              variants={item}
              whileHover={{ scale: 1.04 }}
              className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600 rounded-2xl flex items-center justify-center mb-4">
                <Icon className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <p className="text-sm md:text-base text-gray-800 font-medium leading-snug">
                {label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
