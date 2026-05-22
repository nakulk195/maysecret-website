import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, User, Brain } from "lucide-react";

const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Quiz", icon: Brain, path: "/quiz" },
    { name: "Login", icon: User, path: "/login" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full sm:max-w-md sm:mx-auto sm:left-1/2 sm:transform sm:-translate-x-1/2 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl rounded-t-3xl md:hidden z-30 pb-safe overflow-hidden">
      <div className="flex justify-between items-center py-2 px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-1 items-center justify-center text-center py-2 rounded-xl transition-all duration-300 transform ${
                isActive 
                  ? "text-pink-500 scale-110 bg-pink-50" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50 hover:scale-105"
              }`}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
