import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
              icon: <Mail size={24} className="text-warm-700" />,
      title: "Email",
      details: "support@maysecret.com",
      description: "Send us an email anytime"
    },
    {
              icon: <MapPin size={24} className="text-warm-700" />,
      title: "Address",
      details: "123 Beauty Street, Mumbai, Maharashtra 400001",
      description: "Visit our office"
    },
    {
              icon: <Clock size={24} className="text-warm-700" />,
      title: "Business Hours",
      details: "Monday - Saturday",
      description: "9:00 AM - 6:00 PM"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            <span className="font-bold"></span>
            <span className="text-sm text-gray-500 ml-2">(Contact Us)</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-rose-100 p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <MessageCircle size={24} className="text-warm-700" />
              <h2 className="text-2xl font-bold text-gray-800">
                <span className="font-bold"></span>
                <span className="text-sm text-gray-500 ml-2">(Send us a Message)</span>
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-600 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-600 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-600 focus:border-transparent"
                  placeholder="Enter subject"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-600 focus:border-transparent resize-none"
                  placeholder="Enter your message"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-warm-700 text-white py-4 px-6 rounded-lg font-semibold hover:bg-warm-800 transition-colors flex items-center justify-center space-x-2"
              >
                <Send size={20} />
                <span>Send Message</span>
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                <span className="font-bold"></span>
                <span className="text-sm text-gray-500 ml-2">(Get in Touch)</span>
              </h2>
              <p className="text-gray-600 mb-8">
                We're here to help and answer any question you might have. We look forward to hearing from you.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 p-3 bg-warm-50 rounded-lg">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{info.title}</h3>
                    <p className="text-gray-600 font-medium">{info.details}</p>
                    <p className="text-sm text-gray-500">{info.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-rose-100 p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                <span className="font-bold">FAQ</span>
                <span className="text-sm text-gray-500 ml-2">(Frequently Asked Questions)</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">How long does shipping take?</h4>
                  <p className="text-gray-600 text-sm">
                    Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">What is your return policy?</h4>
                  <p className="text-gray-600 text-sm">
                    We offer a 30-day return policy for unused products in their original packaging.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Do you ship internationally?</h4>
                  <p className="text-gray-600 text-sm">
                    Currently, we ship within India only. International shipping will be available soon.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              <span className="font-bold"></span>
              <span className="text-sm text-gray-500 ml-2">(Visit Our Store)</span>
            </h2>
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-600">Map placeholder - Would show actual location</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;