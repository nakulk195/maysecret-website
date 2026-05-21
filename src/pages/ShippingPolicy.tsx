import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ShippingPolicy: React.FC = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Shipping Policy</h1>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              At May Secret, we aim to deliver your orders quickly and safely.
            </p>
          </div>

          <div className="space-y-8 text-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Processing Time</h2>
              <p>Orders are processed within 1–2 business days after payment confirmation.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Delivery Time</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Metro Cities: 3–5 business days</li>
                <li>Other Locations: 5–7 business days</li>
              </ul>
              <p className="mt-2">Delivery timelines may vary during festivals or high-demand periods.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Shipping Charges</h2>
              <p>Shipping charges (if any) are displayed during checkout before payment.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Order Tracking</h2>
              <p>Once your order is shipped, tracking details will be shared via email or WhatsApp.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Delayed Deliveries</h2>
              <p>In rare cases, delivery may be delayed due to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>weather conditions</li>
                <li>courier issues</li>
                <li>public holidays</li>
                <li>unexpected situations</li>
              </ul>
              <p className="mt-2">We appreciate your patience and support.</p>
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

export default ShippingPolicy;
