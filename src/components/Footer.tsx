import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Youtube, Facebook, Mail, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { BRAND_NAME } from '../config/brand';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12">
          
          {/* Brand Section */}
          <div className="md:col-span-1">
            <img
              src="/images/maysecret-logo.jpg"
              alt={BRAND_NAME}
              className="h-14 mb-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              {BRAND_NAME} combines Korean beauty science with powerful ingredients like Niacinamide, Rice Extract and UV protection technology to create glowing healthy skin.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Shop</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/shop" className="hover:text-pink-400 transition duration-200">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/product/sunscreen" className="hover:text-pink-400 transition duration-200">
                  Sunscreen Spray
                </Link>
              </li>
              <li>
                <Link to="/product/serum" className="hover:text-pink-400 transition duration-200">
                  Brightening Serum
                </Link>
              </li>
              <li>
                <Link to="/combo" className="hover:text-pink-400 transition duration-200">
                  Combo Packs
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Customer Care</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/contact" className="hover:text-pink-400 transition duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-pink-400 transition duration-200">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-pink-400 transition duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-pink-400 transition duration-200">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-pink-400 transition duration-200">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Beauty Guide */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Beauty Guide</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/skincare-tips" className="hover:text-pink-400 transition duration-200">
                  Skincare Tips
                </Link>
              </li>
              <li>
                <Link to="/korean-skincare" className="hover:text-pink-400 transition duration-200">
                  K-Beauty Routine
                </Link>
              </li>
              <li>
                <Link to="/ingredients" className="hover:text-pink-400 transition duration-200">
                  Ingredient Guide
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-pink-400 transition duration-200">
                  Beauty Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Contact</h3>
            <div className="space-y-2 text-gray-400 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>maysecretskinandbeauty@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <p className="mt-2">
                Pune, Maharashtra, India
              </p>
            </div>

            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/maysecret" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-green-400 transition duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com/maysecret" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-red-400 transition duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com/maysecret" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Payment Icons Section */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center">
          <p className="text-gray-400 text-sm mb-3">
            Secure Payments
          </p>
          <div className="flex justify-center space-x-6 text-gray-300 items-center">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span>Visa</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span>Mastercard</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span>UPI</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span>GPay</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span>PhonePe</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm mt-6">
          © 2026 {BRAND_NAME} Skin & Beauty. All Rights Reserved.
        </div>
      </footer>
  );
};

export default Footer;