import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ReturnPolicy: React.FC = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Return Policy</h1>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              We make returns easy with a clear and simple policy.
            </p>
          </div>

          <div className="space-y-8 text-gray-700">
            <div>
              <p>We offer a 7-day return policy from the date of delivery.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">To be eligible for return:</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Product must be unused and in original condition</li>
                <li>Original packaging should be available</li>
                <li>Return request must be raised within 7 days</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">IMPORTANT CONDITIONS</h2>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mandatory Unboxing Video</h3>
              <p>An unboxing video is mandatory in case:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>product is damaged</li>
                <li>wrong product is received</li>
                <li>item is missing</li>
              </ul>
              <p className="mt-2">Without unboxing video, return/replacement requests may not be approved.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Non-Returnable Items</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Used products</li>
                <li>Damaged products caused after delivery</li>
                <li>Products without original packaging</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Refund Process</h2>
              <p>Once the returned item is received and inspected:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>refund will be processed within 5–7 business days</li>
                <li>amount will be credited to original payment method</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Support</h2>
              <p>For return requests, contact us with:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>order ID</li>
                <li>issue details</li>
                <li>photos/videos</li>
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

export default ReturnPolicy;
