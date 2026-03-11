import React from 'react';
import { motion } from 'framer-motion';
import { Star, Percent, Gift, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../utils/productData';

const Offer: React.FC = () => {
  const offers = [
    {
      id: 1,
      title: "New Customer Special",
      description: "Get 20% off on your first order",
      discount: "20%",
      code: "NEW20",
      validUntil: "2024-12-31",
      icon: <Star size={24} className="text-yellow-500" />
    },
    {
      id: 2,
      title: "Buy 2 Get 1 Free",
      description: "Purchase any 2 products and get 1 free",
      discount: "33%",
      code: "B2G1",
      validUntil: "2024-12-31",
      icon: <Gift size={24} className="text-rose-500" />
    },
    {
      id: 3,
      title: "Flash Sale",
      description: "Limited time offer on selected items",
      discount: "50%",
      code: "FLASH50",
      validUntil: "2024-12-15",
      icon: <Clock size={24} className="text-red-500" />
    }
  ];

  const featuredProducts = products.filter(product => product.originalPrice);

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
            <span className="font-bold">특별 할인</span>
            <span className="text-sm text-gray-500 ml-2">(Special Offers)</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing deals and exclusive offers on our premium skincare products
          </p>
        </motion.div>

        {/* Current Offers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            <span className="font-bold">진행 중인 혜택</span>
            <span className="text-sm text-gray-500 ml-2">(Current Offers)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-rose-100 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  {offer.icon}
                  <div className="text-right">
                    <span className="text-3xl font-bold text-rose-600">{offer.discount}</span>
                    <span className="text-sm text-gray-500">OFF</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{offer.title}</h3>
                <p className="text-gray-600 mb-4">{offer.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Code:</span>
                    <span className="font-mono font-semibold text-rose-600">{offer.code}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Valid until:</span>
                    <span className="text-sm text-gray-800">
                      {new Date(offer.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button className="w-full bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors">
                  Shop Now
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Products on Sale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            <span className="font-bold">세일 중인 제품</span>
            <span className="text-sm text-gray-500 ml-2">(Products on Sale)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => {
              const discountPercentage = product.originalPrice 
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-rose-600 text-white text-sm font-semibold px-2 py-1 rounded-full">
                      -{discountPercentage}%
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-rose-600">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/product/${product.id}`}
                        className="flex items-center text-rose-600 hover:text-rose-700 transition-colors"
                      >
                        <span className="text-sm font-medium">View</span>
                        <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-rose-100 mb-6">
            Subscribe to our newsletter to get exclusive offers and updates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-rose-600 px-6 py-3 rounded-lg font-semibold hover:bg-rose-50 transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Offer; 