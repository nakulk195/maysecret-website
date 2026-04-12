import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, User, Menu } from "lucide-react";

const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Cart", icon: ShoppingCart, path: "/cart" },
    { name: "Orders", icon: User, path: "/orders" },
    { name: "Menu", icon: Menu, path: "/menu" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md md:hidden z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center text-xs min-h-[44px] justify-center px-3 py-2 rounded-lg transition-colors ${
                isActive ? "text-pink-600" : "text-gray-500"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
