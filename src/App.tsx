import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import { MobileSidebarClean } from './components/MobileSidebarClean';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Address from './pages/Address';
import Payment from './pages/Payment';
import UserInfo from './pages/UserInfo';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';
import Offer from './pages/Offer';
import Search from './pages/Search';
import RecentlyViewed from './pages/RecentlyViewed';
import Quiz from './pages/Quiz';
import GiftKit from './pages/GiftKit';
import SkincareTipsPage from './pages/SkincareTipsPage';
import FAQ from './pages/FAQ';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <ScrollToTop />
            <AnnouncementBar />
            <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <div className="App pb-16 md:pb-0 w-full overflow-x-hidden">
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/giftkit" element={<GiftKit />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/address" element={
                    <ProtectedRoute>
                      <Address />
                    </ProtectedRoute>
                  } />
                  <Route path="/payment" element={
                    <ProtectedRoute>
                      <Payment />
                    </ProtectedRoute>
                  } />
                  <Route path="/user-info" element={
                    <ProtectedRoute>
                      <UserInfo />
                    </ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/offer" element={<Offer />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/recently-viewed" element={<RecentlyViewed />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/skincare-tips" element={<SkincareTipsPage />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/shipping-policy" element={<ShippingPolicy />} />
                  <Route path="/return-policy" element={<ReturnPolicy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                </Routes>
              </main>
              <Footer />
              <MobileBottomNav />
            </div>
            <MobileSidebarClean isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
