import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Heart } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function MobileSidebarClean({ isOpen, setIsOpen }: MobileSidebarProps) {
  const { user, signOut } = useAuth();
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 h-full w-[80%] max-w-[320px]
                       bg-white/80 backdrop-blur-md shadow-2xl
                       z-[9999] md:hidden rounded-r-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User */}
            <div className="p-4">
              <p className="text-sm text-gray-500">Welcome</p>
              <h3 className="text-lg font-semibold text-pink-600">
                Hello {user?.user_metadata?.first_name || "Guest"} 👋
              </h3>
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-4 px-4">
              {[
                { name: "Home", path: "/" },
                { name: "Shop", path: "/shop" },
                { name: "Cart", path: "/cart" },
                { name: "Wishlist", path: "/wishlist" },
                { name: "Orders", path: "/orders" },
                { name: "Offers", path: "/offers" },
                { name: "Gift Kit", path: "/giftkit" },
                { name: "Quiz", path: "/quiz" },
                { name: "Contact", path: "/contact" },
                ...(user ? [
                  { name: "User Info", path: "/user-info" },
                  { name: "Logout", path: "#", isLogout: true }
                ] : [
                  { name: "Login", path: "/login" }
                ]),
              ].map((item, index) => {
                if (item.isLogout) {
                  return (
                    <button
                      key={item.name + index}
                      onClick={async () => {
                        await signOut();
                        setIsOpen(false);
                        // Redirect to login page after logout
                        window.location.href = '/login';
                      }}
                      className="block w-full text-lg font-medium text-gray-700 hover:text-pink-600 transition-all text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.name}</span>
                      </div>
                    </button>
                  );
                } else {
                  return (
                    <Link
                      key={item.name + index}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="block text-lg font-medium text-gray-700 hover:text-pink-600 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        {item.name === "Cart" && <ShoppingBag className="w-5 h-5" />}
                        {item.name === "Wishlist" && <Heart className="w-5 h-5" />}
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );
                }
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
