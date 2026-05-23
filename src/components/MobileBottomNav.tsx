import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Brain, Home, LogIn, LogOut, Package, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Quiz", icon: Brain, path: "/quiz" },
  ];

  const handleLogout = async () => {
    await signOut();
    setIsAccountOpen(false);
    navigate("/");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full sm:max-w-md sm:mx-auto sm:left-1/2 sm:transform sm:-translate-x-1/2 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl rounded-t-3xl md:hidden z-30 pb-safe overflow-visible">
      {user && isAccountOpen && (
        <div className="absolute bottom-full right-3 mb-3 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
          <Link
            to="/user-info"
            onClick={() => setIsAccountOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            <User className="h-4 w-4" />
            User Info
          </Link>
          <Link
            to="/orders"
            onClick={() => setIsAccountOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            <Package className="h-4 w-4" />
            Orders
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}

      <div className="flex justify-between items-center py-1.5 px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-1 flex-col items-center justify-center text-center py-2 rounded-xl transition-all duration-300 transform ${
                isActive
                  ? "text-gray-900 scale-105 bg-gray-100"
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}

        {user ? (
          <button
            type="button"
            onClick={() => setIsAccountOpen(prev => !prev)}
            className={`flex flex-1 flex-col items-center justify-center text-center py-2 rounded-xl transition-all duration-300 ${
              location.pathname === "/user-info" || location.pathname === "/orders" || isAccountOpen
                ? "text-gray-900 scale-105 bg-gray-100"
                : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Account</span>
          </button>
        ) : (
          <Link
            to="/login"
            className={`flex flex-1 flex-col items-center justify-center text-center py-2 rounded-xl transition-all duration-300 ${
              location.pathname === "/login"
                ? "text-gray-900 scale-105 bg-gray-100"
                : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <LogIn className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Login</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileBottomNav;
