import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchProducts } from '../utils/productData';
import ProductCard from '../components/ProductCard';
import { BRAND_NAME } from '../config/brand';

const Search: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get query parameter from URL
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q') || '';
    
    setSearchQuery(query);
    
    if (query.trim()) {
      // Search for products
      const results = searchProducts(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
    
    setIsLoading(false);
  }, [location.search]);

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(newQuery)}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          {searchQuery && (
            <p className="text-gray-600">
              Showing results for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                id="search-input"
                name="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearch((e.target as HTMLInputElement).value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch((e.target as HTMLInputElement).value);
                  }
                }}
                className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div>
            {searchResults.length > 0 ? (
              <>
                <div className="mb-4">
                  <p className="text-gray-600">
                    Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any products matching "{searchQuery}"
                </p>
                <button
                  onClick={() => navigate('/shop')}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Browse All Products
                </button>
              </div>
            )}
          </div>
        )}

        {/* No Search Query */}
        {!searchQuery && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Enter a search term
            </h3>
            <p className="text-gray-600">
              Use the search bar above to find products
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
