import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../utils/productData';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClose }) => {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();

  const handleExpand = () => setExpanded((prev) => !prev);
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
  const runSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setNoResults(false);
      return;
    }

    // Allow parent hook if provided, but still handle navigation
    onSearch?.(trimmed);

    const results = searchProducts(trimmed);
    if (results.length > 0) {
      // Navigate to the first match's product detail page
      navigate(`/product/${results[0].id}`);
      setNoResults(false);
      setExpanded(false);
    } else {
      setNoResults(true);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    runSearch(query);
  };

  return (
    <div className="relative flex items-center flex-1 md:flex-initial">
      <button
        className="p-3 md:p-2 rounded-full hover:bg-cream-200 transition min-h-[44px]"
        onClick={() => {
          if (expanded && query.trim()) {
            runSearch(query);
          } else {
            handleExpand();
          }
        }}
        aria-label="Search"
      >
        <Search size={20} className="md:size-5" />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.form
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-0 md:left-10 bg-white rounded-full shadow-lg px-4 py-2 md:px-4 md:py-1 flex items-center border border-cream-300 md:border md:rounded-full w-full md:w-auto"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              id="searchbar-input"
              name="search"
              value={query}
              onChange={handleInput}
              placeholder="Search products..."
              className="outline-none bg-transparent w-full md:w-48 font-poppins text-sm md:text-base"
              autoFocus
            />
          </motion.form>
        )}
      </AnimatePresence>
      {/* No results message */}
      <AnimatePresence>
        {noResults && expanded && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute left-10 top-10 text-xs text-gray-500 bg-white border border-cream-300 rounded-md px-3 py-2 shadow"
          >
            No products found
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;