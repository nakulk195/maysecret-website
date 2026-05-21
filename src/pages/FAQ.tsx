import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FAQ: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10"
        >
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">FAQ</h1>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Answers to common questions about our products, shipping, and support.
            </p>
          </div>

          <div className="space-y-8 text-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">How long does delivery take?</h2>
              <p>Orders are usually delivered within 3–7 business days depending on your location.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">How can I track my order?</h2>
              <p>Once your order is shipped, tracking details will be shared through email or WhatsApp.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Do you offer Cash on Delivery (COD)?</h2>
              <p>Currently, we support prepaid payments only for a faster and secure checkout experience.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Can I return my order?</h2>
              <p>Yes, we offer a 7-day return policy for eligible products.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">What if I receive a damaged or wrong product?</h2>
              <p>
                Please contact us within 24 hours of delivery with:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                <li>order details</li>
                <li>product photos</li>
                <li>mandatory unboxing video</li>
              </ul>
              <p className="mt-2">This helps us process replacement/refund quickly.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">How can I contact customer support?</h2>
              <p>You can contact us through:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                <li>Email</li>
                <li>WhatsApp</li>
                <li>Contact form on website</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link to="/" className="inline-flex items-center justify-center rounded-full bg-pink-600 px-8 py-3 text-white font-semibold transition hover:bg-pink-700">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
