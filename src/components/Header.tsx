import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Heart, 
  Menu, 
  Search,
  Home as HomeIcon,
  Gift,
  HelpCircle,
  Phone,
  ChevronRight,
  Package,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import SearchBar from './SearchBar';
import { STORAGE_MEDIA } from '../config/storage';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { user, profile, signOut } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const mobileProfileDropdownRef = useRef<HTMLDivElement>(null);
  const desktopProfileDropdownRef = useRef<HTMLDivElement>(null);
  const cartCount = getCartCount();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileProfileDropdownRef.current && 
        !mobileProfileDropdownRef.current.contains(event.target as Node) &&
        desktopProfileDropdownRef.current && 
        !desktopProfileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      {/* Mobile Header - Only shows on small screens */}
      <div className="md:hidden relative z-50 w-full max-w-full overflow-hidden">
        <header className="grid w-full max-w-full grid-cols-[48px_1fr_96px] items-center px-3 py-2 bg-white shadow-sm sticky top-0 gap-2">
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
          <Link to="/" className="flex items-center justify-center min-w-0">
            <img
              src={STORAGE_MEDIA.logo.src}
              alt="MAY SECRET"
              className="maysecret-logo"
              loading="eager"
            />
          </Link>

          <div className="flex items-center justify-end gap-1">
            <Link
              to="/wishlist"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-6 h-6 text-gray-700" />
            </Link>
            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex min-w-[1.25rem] h-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white px-1.5">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

        </header>

        {/* Search Bar - Mobile only */}
        <div className="flex md:hidden px-3 pb-2 bg-white border-b border-gray-100">
          <div className="relative w-full">
            <input
              type="text"
              id="mobile-search"
              name="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(searchQuery);
                }
              }}
              className="w-full px-4 py-2 pl-10 pr-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Desktop Header - Compact spacing */}
      <header className="hidden md:block bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
          <div className="flex items-center justify-between">
            {/* Left Section - Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-3">
                <img
                  src={STORAGE_MEDIA.logo.src}
                  alt="MAY SECRET"
                  className="maysecret-logo"
                  loading="eager"
                />
              </Link>
            </div>

            {/* Center Section - Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { name: 'Home', path: '/', icon: HomeIcon },
                { name: 'Shop', path: '/shop', icon: ShoppingBag },
                { name: 'Gift Kit', path: '/giftkit', icon: Gift },
                { name: 'Help', path: '/contact', icon: HelpCircle },
                { name: 'Cart', path: '/cart', icon: ShoppingBag },
                { name: 'Wishlist', path: '/wishlist', icon: Heart },
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
              <div className="relative" ref={desktopProfileDropdownRef}>
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    setIsMenuOpen(false); // Close sidebar if open
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="User menu"
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user ? 'Account' : 'Login'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    >
                      {user ? (
                        <>
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">
                              Hello, {profile?.full_name?.split(' ')[0] || user?.user_metadata?.first_name || 'User'} 👋
                            </p>
                          </div>
                          <Link
                            to="/user-info"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => {
                              closeProfileDropdown();
                              closeMenu();
                            }}
                          >
                            User Info
                          </Link>
                          <Link
                            to="/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => {
                              closeProfileDropdown();
                              closeMenu();
                            }}
                          >
                            Orders
                          </Link>
                          <Link
                            to="/wishlist"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => {
                              closeProfileDropdown();
                              closeMenu();
                            }}
                          >
                            Wishlist
                          </Link>
                          <button
                            onClick={async () => {
                              await signOut();
                              closeProfileDropdown();
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
                            onClick={() => {
                              closeProfileDropdown();
                              closeMenu();
                            }}
                          >
                            Login
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
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
