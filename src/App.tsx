import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';
import Offer from './pages/Offer';
import RecentlyViewed from './pages/RecentlyViewed';
import Quiz from './pages/Quiz';
import GiftKit from './pages/GiftKit';
import SkincareTipsPage from './pages/SkincareTipsPage';
import './App.css';

function App() {
  return (
    <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="App pb-16 md:pb-0 w-full overflow-x-hidden">
            <AnnouncementBar />
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/giftkit" element={<GiftKit />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/offer" element={<Offer />} />
                <Route path="/recently-viewed" element={<RecentlyViewed />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/skincare-tips" element={<SkincareTipsPage />} />
                {/* Add protected routes here if needed */}
              </Routes>
            </main>
            <Footer />
            <MobileBottomNav />
          </div>
        </Router>
      </CartProvider>
  );
}

export default App;
