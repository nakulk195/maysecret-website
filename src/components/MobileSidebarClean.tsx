import { useEffect } from 'react';
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Gift, Heart, Home, LogIn, LogOut, Mail, Package, ShoppingBag, ShoppingCart, User, X } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const MobileSidebarClean: React.FC<MobileSidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, profile, signOut } = useAuth();
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
              <button onClick={() => setIsOpen(false)} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full hover:bg-gray-100" aria-label="Close menu">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User */}
            <div className="p-4">
              <p className="text-sm text-gray-500">Welcome</p>
              <h3 className="text-lg font-semibold text-pink-600">
                Hello {profile?.full_name?.split(' ')[0] || user?.user_metadata?.first_name || "Guest"} 👋
              </h3>
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-2 px-4">
              {[
                { name: "Shop", path: "/shop", icon: ShoppingBag },
                { name: "Combo Packs", path: "/product/3", icon: Gift, highlight: true },
                { name: "Offers", path: "/shop", icon: Gift, highlight: true },
                { name: "Cart", path: "/cart", icon: ShoppingCart },
                { name: "Home", path: "/", icon: Home },
                { name: "Wishlist", path: "/wishlist", icon: Heart },
                ...(user ? [{ name: "Orders", path: "/orders", icon: Package }] : []),
                { name: "Gift Kit", path: "/giftkit", icon: Gift },
                { name: "Quiz", path: "/quiz", icon: Brain },
                { name: "Contact", path: "/contact", icon: Mail },
                ...(user ? [
                  { name: "User Info", path: "/user-info", icon: User },
                  { name: "Logout", path: "#", icon: LogOut, isLogout: true }
                ] : [
                  { name: "Login", path: "/login", icon: LogIn }
                ]),
              ].map((item, index) => {
                const Icon = item.icon;
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
                      className="block min-h-[44px] w-full rounded-xl px-3 text-left text-base font-medium text-gray-700 transition-all hover:bg-pink-50 hover:text-pink-600"
                    >
                      <div className="flex min-h-[44px] items-center gap-3">
                        <Icon className="w-5 h-5" />
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
                      className={`block min-h-[44px] rounded-xl px-3 text-base font-medium transition-all ${
                        item.highlight
                          ? "bg-pink-50 text-pink-700 shadow-sm"
                          : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                      }`}
                    >
                      <div className="flex min-h-[44px] items-center gap-3">
                        <Icon className="w-5 h-5" />
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
