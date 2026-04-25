import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: { firstName: string } | null;
}

export default function MobileSidebarClean({ isOpen, setIsOpen, user }: MobileSidebarProps) {
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
                Hello {user?.firstName || "Guest"} 👋
              </h3>
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-4 px-4">
              {[
                { name: "Home", path: "/" },
                { name: "Shop", path: "/shop" },
                { name: "Orders", path: "/orders" },
                { name: "Offers", path: "/offers" },
                { name: "Gift Kit", path: "/giftkit" },
                { name: "Quiz", path: "/quiz" },
                { name: "Contact", path: "/contact" },
                { name: "Login", path: "/login" },
              ].map((item, index) => (
                <Link
                  key={item.name + index}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium text-gray-700 hover:text-pink-600 transition-all"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
