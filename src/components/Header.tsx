import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Menu, 
  Search,
  Home as HomeIcon,
  Gift,
  Percent,
  HelpCircle,
  Phone,
  ChevronRight,
  Package,
  User,
  LogOut
} from 'lucide-react';
import { getLoggedInUser, removeUserSession } from '../utils/auth';
import { useCart } from '../contexts/CartContext';
import SearchBar from './SearchBar';
import { BRAND_NAME } from '../config/brand';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  user: { firstName: string } | null;
  setUser: (user: { firstName: string } | null) => void;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen, user, setUser }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for logged in user on mount and when storage changes
    const handleStorageChange = () => {
      setUser(getLoggedInUser());
    };

    // Initial check
    handleStorageChange();

    // Listen for storage events (for cross-tab updates)
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  return (
    <>
      {/* Mobile Header - Only shows on small screens */}
      <div className="md:hidden relative z-50">
        <header className="flex justify-between items-center px-4 py-3 bg-white shadow-sm sticky top-0">
          {/* Hamburger Menu */}
          <button
            onClick={() => {
              console.log("MENU CLICKED");
              setIsMenuOpen(true);
            }}
            className="p-2 bg-gray-100 rounded-lg z-50 relative"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/Maysecret_logo.svg"
              alt="MΛY SΞCRΞT"
              className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain flex-shrink-0"
            />
          </Link>

          {/* Cart Icon with Badge */}
          <Link to="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={closeMenu}>
            <ShoppingBag className="w-6 h-6 text-gray-700" />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </Link>
        </header>

        {/* Search Bar - Mobile only */}
        <div className="flex md:hidden px-4 pb-3 bg-white border-b border-gray-100">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 pl-10 pr-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              onFocus={toggleSearch}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Desktop Header - Keep unchanged */}
      <header className="hidden md:block bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            {/* Left Section - Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-3">
                <img
                  src="/images/Maysecret_logo.svg"
                  alt="MΛY SΞCRΞT"
                  className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto object-contain flex-shrink-0 max-h-[80px] md:max-h-none hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>

            {/* Center Section - Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { name: 'Home', path: '/', icon: HomeIcon },
                { name: 'Shop', path: '/shop', icon: ShoppingBag },
                { name: 'Offers', path: '/offers', icon: Percent },
                { name: 'Gift Kit', path: '/giftkit', icon: Gift },
                { name: 'Help', path: '/contact', icon: HelpCircle },
                { name: 'Orders', path: '/orders', icon: Package },
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.name + index}
                    to={item.path}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
                      isActive ? 'text-warm-700' : 'text-gray-600 hover:text-warm-700'
                    }`}
                    onClick={closeMenu}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Toggle */}
              <button
                onClick={toggleSearch}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Toggle search"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="User menu"
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user ? 'Account' : 'Login'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {user ? (
                      <>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={closeMenu}
                        >
                          Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={closeMenu}
                        >
                          Wishlist
                        </Link>
                        <button
                          onClick={() => {
                            removeUserSession();
                            setUser(null);
                            closeMenu();
                            navigate('/');
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={closeMenu}
                        >
                          Login
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Search Bar - Only visible when toggled */}
      <div className={`hidden md:block bg-white shadow-lg border-b border-gray-200 py-4 px-6 absolute left-0 right-0 z-40 transition-all duration-300 ${
        isSearchOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}>
        <div className="max-w-2xl mx-auto">
          <SearchBar onClose={closeSearch} />
        </div>
      </div>
    </>
  );
};

export default Header;
