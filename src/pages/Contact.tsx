import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { contactService } from '../services/database';

const Contact: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize form with user data if logged in
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.first_name ? 
          `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim() : '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Clear success and error messages after 5 seconds
  React.useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save message to database for both logged-in users and guests
      await contactService.saveMessage(user?.id || '', {
        full_name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      // Show success message instead of alert
      setSuccessMessage('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
              icon: <Mail size={24} className="text-warm-700" />,
      title: "Email",
      details: "maysecretskinandbeauty@gmail.com",
      description: "Send us an email anytime"
    },
    {
              icon: <MapPin size={24} className="text-warm-700" />,
      title: "Address",
      details: "Pune, Maharashtra, India",
      description: ""
    },
    {
              icon: <Clock size={24} className="text-warm-700" />,
      title: "Business Hours",
      details: "Business hr - 10 am - 8pm (Mon - Sat)",
      description: ""
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
            
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {errorMessage}
              </div>
            )}

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
                disabled={isSubmitting}
                className="w-full bg-warm-700 text-white py-4 px-6 rounded-lg font-semibold hover:bg-warm-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Send Message</span>
                  </>
                )}
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

        {/* Map / Visit our store removed per update */}
      </div>
    </div>
  );
};

export default Contact;