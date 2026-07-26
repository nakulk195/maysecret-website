import { Link, useLocation } from "react-router-dom";
import { Gift, MessageCircle, ShoppingBag, ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext";

const MobileBottomNav = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const navItems = [
    { name: "Shop", icon: ShoppingBag, path: "/shop" },
    { name: "Combos", icon: Gift, path: "/product/3" },
    { name: "WhatsApp", icon: MessageCircle, href: "https://wa.me/919075849555" },
    { name: "Cart", icon: ShoppingCart, path: "/cart", count: cartCount },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 w-full border-t border-gray-200 bg-white/95 pb-safe shadow-2xl backdrop-blur-md md:hidden">
      <div className="grid grid-cols-4 items-center gap-1 px-2 py-1.5">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.path ? location.pathname === item.path : false;
          const className = `relative flex min-h-[56px] flex-col items-center justify-center rounded-xl text-center transition-all duration-300 ${
            isActive
              ? "bg-gray-100 text-gray-950"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
          }`;

          if (item.href) {
            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className="mb-1 h-5 w-5" />
                <span className="text-[11px] font-semibold">{item.name}</span>
              </a>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.path || "/"}
              className={className}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className="mb-1 h-5 w-5" />
              <span className="text-[11px] font-semibold">{item.name}</span>
              {Boolean(item.count) && (
                <span className="absolute right-5 top-1 inline-flex min-w-[1.15rem] items-center justify-center rounded-full bg-pink-600 px-1 text-[10px] font-bold text-white">
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
