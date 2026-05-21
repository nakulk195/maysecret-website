import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TermsAndConditions: React.FC = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Terms & Conditions</h1>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Please review the terms and conditions for using May Secret services.
            </p>
          </div>

          <div className="space-y-8 text-gray-700">
            <div>
              <p>By using May Secret, you agree to:</p>
              <ul className="list-disc list-inside mt-3 space-y-2 text-gray-700">
                <li>provide accurate information</li>
                <li>use website lawfully</li>
                <li>not misuse services</li>
              </ul>
            </div>
            <div>
              <p>All products and pricing are subject to change without prior notice.</p>
            </div>
            <div>
              <p>We reserve the right to:</p>
              <ul className="list-disc list-inside mt-3 space-y-2 text-gray-700">
                <li>cancel suspicious orders</li>
                <li>refuse service in certain situations</li>
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

export default TermsAndConditions;
