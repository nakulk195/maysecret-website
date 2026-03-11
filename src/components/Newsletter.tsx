import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send the email to your backend
      console.log('Newsletter subscription:', email);
      setIsSubscribed(true);
      setEmail('');
      
      // Reset the success message after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <section className="py-16 bg-black text-white text-center">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Mail Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-pink-600 p-4 rounded-full">
              <Mail className="w-8 h-8" />
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4">
            Join Our Skincare Community
          </h2>
          
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Get exclusive skincare tips, special offers, and be the first to know about new product launches.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex justify-center max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-3 w-full rounded-l-lg text-black focus:outline-none focus:ring-2 focus:ring-pink-600"
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-pink-600 px-6 py-3 rounded-r-lg hover:bg-pink-700 transition duration-300 font-semibold flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Subscribe
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg inline-block"
            >
              ✓ Thank you for subscribing!
            </motion.div>
          )}

          <p className="text-gray-400 text-sm mt-6">
            Join 10,000+ skincare enthusiasts. No spam, unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
