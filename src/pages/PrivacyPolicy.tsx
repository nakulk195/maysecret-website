import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | MaySecret';

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute(
      'content',
      "Read MaySecret's Privacy Policy to understand how we collect, use and protect your personal information while using our website."
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_20px_80px_-24px_rgba(244,114,182,0.45)] sm:p-8 lg:p-10"
        >
          <div className="mb-8 text-center sm:mb-10">
            <span className="inline-flex items-center rounded-full bg-pink-100 px-3 py-1 text-sm font-semibold text-pink-700">
              Last Updated: June 2026
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              We value your privacy and are committed to protecting your personal information.
            </p>
          </div>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Introduction</h2>
              <p className="leading-7">
                At MaySecret, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website{' '}
                <a href="https://maysecret.in" target="_blank" rel="noopener noreferrer" className="font-medium text-pink-600 hover:underline">
                  https://maysecret.in
                </a>
                , create an account, or purchase our products.
              </p>
              <p className="mt-3 leading-7">
                By accessing or using our website, you agree to the terms outlined in this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Information We Collect</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Personal Information</h3>
                  <ul className="ml-5 list-disc space-y-2 leading-7">
                    <li>Full Name</li>
                    <li>Email Address</li>
                    <li>Mobile Number</li>
                    <li>Shipping Address</li>
                    <li>Billing Address</li>
                    <li>Account Login Information</li>
                    <li>Order History</li>
                    <li>Payment Information (processed securely through trusted payment gateways; MaySecret does not store your complete debit/credit card details.)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Non-Personal Information</h3>
                  <ul className="ml-5 list-disc space-y-2 leading-7">
                    <li>Browser Type</li>
                    <li>Device Information</li>
                    <li>IP Address</li>
                    <li>Operating System</li>
                    <li>Pages Visited</li>
                    <li>Time Spent on the Website</li>
                    <li>Cookies and Usage Data</li>
                  </ul>
                  <p className="mt-3 leading-7">
                    This information helps us improve our services, website performance, and overall shopping experience.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
              <ul className="ml-5 list-disc space-y-2 leading-7">
                <li>To process, confirm, and deliver your orders.</li>
                <li>To communicate order confirmations, shipping updates, and customer support.</li>
                <li>To manage your account and provide personalized services.</li>
                <li>To improve our website, products, and customer experience.</li>
                <li>To process secure online payments.</li>
                <li>To prevent fraudulent transactions and enhance website security.</li>
                <li>To send promotional offers, discounts, newsletters, and product updates (only if you choose to receive them).</li>
                <li>To comply with applicable legal and regulatory requirements.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Cookies and Tracking Technologies</h2>
              <p className="leading-7">
                Our website uses cookies and similar tracking technologies to improve your browsing experience and website functionality.
              </p>
              <p className="mt-3 leading-7">Cookies help us:</p>
              <ul className="ml-5 mt-3 list-disc space-y-2 leading-7">
                <li>Remember your preferences.</li>
                <li>Keep you signed in.</li>
                <li>Analyze website traffic.</li>
                <li>Improve website performance.</li>
                <li>Personalize your shopping experience.</li>
              </ul>
              <p className="mt-3 leading-7">Users can disable cookies through browser settings.</p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Payment Information</h2>
              <p className="leading-7">MaySecret uses Razorpay for secure payment processing.</p>
              <ul className="ml-5 mt-3 list-disc space-y-2 leading-7">
                <li>Payment information is encrypted.</li>
                <li>MaySecret never stores complete debit card, credit card, CVV, or UPI PIN details.</li>
                <li>Payments are securely processed through Razorpay.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Shipping Information</h2>
              <p className="leading-7">
                MaySecret shares shipping information only with authorized logistics partners including iThink Logistics for order fulfilment.
              </p>
              <p className="mt-3 leading-7">Shared information may include:</p>
              <ul className="ml-5 mt-3 list-disc space-y-2 leading-7">
                <li>Customer Name</li>
                <li>Address</li>
                <li>Mobile Number</li>
                <li>Order Details</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Sharing of Information</h2>
              <p className="leading-7">MaySecret never sells or rents customer information.</p>
              <p className="mt-3 leading-7">Information may be shared only with:</p>
              <ul className="ml-5 mt-3 list-disc space-y-2 leading-7">
                <li>Razorpay</li>
                <li>iThink Logistics</li>
                <li>Hosting Providers</li>
                <li>Technical Service Providers</li>
                <li>Government Authorities where legally required</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Google Login</h2>
              <p className="leading-7">Users signing in with Google may share:</p>
              <ul className="ml-5 mt-3 list-disc space-y-2 leading-7">
                <li>Name</li>
                <li>Email Address</li>
                <li>Profile Picture</li>
              </ul>
              <p className="mt-3 leading-7">Only for authentication.</p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Analytics</h2>
              <p className="leading-7">The website uses</p>
              <ul className="ml-5 mt-3 list-disc space-y-2 leading-7">
                <li>Google Analytics</li>
                <li>Google Tag Manager</li>
              </ul>
              <p className="mt-3 leading-7">to improve website performance and understand visitor behaviour.</p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Data Security</h2>
              <p className="leading-7">
                Industry-standard security measures are used, but no online system can guarantee complete security.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Third-Party Links</h2>
              <p className="leading-7">
                MaySecret is not responsible for third-party privacy practices.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Your Rights</h2>
              <p className="leading-7">Users can</p>
              <ul className="ml-5 mt-3 list-disc space-y-2 leading-7">
                <li>Access their information</li>
                <li>Update information</li>
                <li>Delete their account</li>
                <li>Opt out of marketing</li>
                <li>Contact support</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Children&apos;s Privacy</h2>
              <p className="leading-7">The website is intended for users 18+ or under parent/guardian supervision.</p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Changes to Privacy Policy</h2>
              <p className="leading-7">
                MaySecret may update this policy anytime. Changes will appear on this page with an updated Last Updated date.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Contact</h2>
              <p className="leading-7">MaySecret</p>
              <p className="mt-2 leading-7">
                Website:{' '}
                <a href="https://maysecret.in" target="_blank" rel="noopener noreferrer" className="font-medium text-pink-600 hover:underline">
                  https://maysecret.in
                </a>
              </p>
              <p className="mt-2 leading-7">
                Email:{' '}
                <a href="mailto:maysecretskinandbeauty@gmail.com" className="font-medium text-pink-600 hover:underline">
                  maysecretskinandbeauty@gmail.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-pink-600 px-8 py-3 font-semibold text-white transition hover:bg-pink-700"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
