"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

interface Product {
  _id: string;
  title: string;
  image: string;
  price: string;
  college: string;
  category: string;
}

export default function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    // Set initial width
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        setResults(data.products || []);
        setShowDropdown(true);
      } catch (e) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Helper function to determine if we should use desktop styling
  // Consider anything >= 640px as non-mobile (tablet and desktop)
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  // Get container max width based on focus state and screen size
  const getContainerMaxWidth = () => {
    if (isMobile) return '100%'; // Mobile: always full width

    // For tablet and desktop: expand when focused
    if (isTablet) {
      return isFocused ? '28rem' : '18rem'; // 448px : 288px
    } else if (isDesktop) {
      return isFocused ? '36rem' : '24rem'; // 576px : 384px
    }
    return '100%';
  };

  // Get input styling based on screen size
  const getInputStyling = () => {
    if (isMobile) {
      // Mobile styling - compact
      return {
        paddingLeft: '1rem',
        paddingRight: '3rem',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
        fontSize: '1rem',
        lineHeight: '1.5rem'
      };
    }

    // Tablet and desktop styling - enhanced
    return {
      paddingLeft: '1.5rem',
      paddingRight: '3.5rem',
      paddingTop: '1.25rem',
      paddingBottom: '1.25rem',
      fontSize: '1.25rem',
      lineHeight: '1.75rem'
    };
  };

  return (
    <div
      ref={containerRef}
      className="w-full text-[#23185B] transition-all duration-300 ease-in-out"
      style={{
        maxWidth: getContainerMaxWidth()
      }}
    >
      <div className="flex items-center relative">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            setShowDropdown(true);
          }}
          onBlur={() => {
            setTimeout(() => {
              setIsFocused(false);
            }, 150);
          }}
          type="text"
          placeholder="Search for products..."
          className="w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23185B] font-medium transition-all duration-300 ease-in-out focus:shadow-lg"
          style={getInputStyling()}
        />
        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5B3DF6] hover:text-[#23185B] pointer-events-auto"
          aria-label="Submit search"
        >
          <Search size={isMobile ? 24 : 28} />
        </button>
      </div>

      <AnimatePresence>
        {showDropdown && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md z-50 max-h-80 overflow-y-auto mt-1"
          >
            {loading && (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            )}
            {!loading && results.length === 0 && (
              <div className="p-4 text-center text-gray-500">No results found.</div>
            )}
            {!loading &&
              results.map((prod) => (
                <div
                  key={prod._id}
                  className="flex gap-3 p-3 hover:bg-[#e0d5fa] cursor-pointer rounded-md"
                  onMouseDown={() => {
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                    setShowDropdown(false);
                  }}
                >
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold truncate">{prod.title}</span>
                    <span className="text-xs text-gray-600 truncate">{prod.category}</span>
                  </div>
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
