import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Facebook, Mail, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { BRAND_NAME } from '../config/brand';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 md:pt-16 pb-8 md:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1 text-center md:text-left">
            <img
              src="/images/Maysecret_logo.svg"
              alt={BRAND_NAME}
              className="h-10 md:h-12 lg:h-14 mb-4 mx-auto md:mx-0"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              {BRAND_NAME} combines Korean beauty science with powerful ingredients like Niacinamide, Rice Extract and UV protection technology to create glowing healthy skin.
            </p>
          </div>

          {/* Shop Links */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-4 text-lg">Shop</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/shop" className="hover:text-pink-400 transition duration-200">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/product/1" className="hover:text-pink-400 transition duration-200">
                  Sunscreen Spray
                </Link>
              </li>
              <li>
                <Link to="/product/2" className="hover:text-pink-400 transition duration-200">
                  Brightening Serum
                </Link>
              </li>
              <li>
                <Link to="/product/3" className="hover:text-pink-400 transition duration-200">
                  Combo Packs
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Customer Service</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/faq" className="hover:text-pink-400 transition duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-pink-400 transition duration-200">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-pink-400 transition duration-200">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-pink-400 transition duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-pink-400 transition duration-200">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-pink-400 transition duration-200">
                  Contact Us
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
                            <p className="mt-2">
                Pune, Maharashtra, India
              </p>
            </div>

            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/maysecretskinandbeauty?igsh=MThqeHI2bTJ5ZmFkNw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/919075849555" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-green-400 transition duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              {/* YouTube removed because the site does not have a YouTube channel at this time */}
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