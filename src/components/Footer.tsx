import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, CreditCard, Wallet } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import maysecretLogo from '../assets/images/maysecret_logo.png';
import { BRAND_NAME } from '../config/brand';

const InstagramIcon = FaInstagram as unknown as React.ComponentType<{ className?: string }>;
const WhatsappIcon = FaWhatsapp as unknown as React.ComponentType<{ className?: string }>;
const FacebookIcon = FaFacebookF as unknown as React.ComponentType<{ className?: string }>;
const YoutubeIcon = FaYoutube as unknown as React.ComponentType<{ className?: string }>;

const Footer: React.FC = () => {
  return (
    <footer className="footer bg-white text-black pt-8 md:pt-10 pb-6 md:pb-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1 text-center md:text-left">
            <img
              src={maysecretLogo}
              alt={BRAND_NAME}
              className="maysecret-logo mb-4 mx-auto md:mx-0"
            />
            <p className="text-black text-sm leading-relaxed">
              {BRAND_NAME} combines Korean beauty science with powerful ingredients like Niacinamide, Rice Extract and UV protection technology to create glowing healthy skin.
            </p>
          </div>

          {/* Shop Links */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-4 text-lg text-black">Shop</h3>
            <ul className="space-y-2 text-black text-sm">
              <li>
                <Link to="/shop" className="hover:text-pink-500 transition duration-200">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/product/1" className="hover:text-pink-500 transition duration-200">
                  Sunscreen Spray
                </Link>
              </li>
              <li>
                <Link to="/product/2" className="hover:text-pink-500 transition duration-200">
                  Brightening Serum
                </Link>
              </li>
              <li>
                <Link to="/product/3" className="hover:text-pink-500 transition duration-200">
                  Combo Packs
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4 text-lg text-black">Customer Service</h3>
            <ul className="space-y-2 text-black text-sm">
              <li>
                <Link to="/faq" className="hover:text-pink-500 transition duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-pink-500 transition duration-200">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-pink-500 transition duration-200">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-pink-500 transition duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-pink-500 transition duration-200">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-pink-500 transition duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Beauty Guide */}
          <div>
            <h3 className="font-semibold mb-4 text-lg text-black">Beauty Guide</h3>
            <ul className="space-y-2 text-black text-sm">
              <li>
                <Link to="/skincare-tips" className="hover:text-pink-500 transition duration-200">
                  Skincare Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold mb-4 text-lg text-black">Contact</h3>
            <div className="space-y-2 text-black text-sm mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>maysecretskinandbeauty@gmail.com</span>
              </div>
              <p className="mt-2">
                Pune, Maharashtra, India
              </p>
            </div>

            <div className="flex justify-center md:justify-start gap-3 sm:gap-4">
              <a 
                href="https://www.instagram.com/maysecretskinandbeauty?igsh=MThqeHI2bTJ5ZmFkNw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon social-icon-instagram"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/919075849555" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon social-icon-whatsapp"
                aria-label="WhatsApp"
              >
                <WhatsappIcon className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61590062924530" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon social-icon-facebook"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@MaySecretOfficial"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon social-icon-youtube"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Payment Icons Section */}
        <div className="border-t border-gray-300 mt-8 pt-4 text-center">
          <p className="text-black text-sm mb-3">
            Secure Payments
          </p>
          <div className="flex justify-center space-x-6 text-black items-center">
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
        <div className="text-center text-gray-700 text-sm mt-6">
          © 2026 {BRAND_NAME} Skin & Beauty. All Rights Reserved.
        </div>
      </footer>
  );
};

export default Footer;
