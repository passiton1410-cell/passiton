'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { getStates, getCitiesForState } from '@/lib/indian-states-cities';
import { MapPin, Filter } from 'lucide-react';

export default function CategoryPage() {
  // @ts-ignore
  const { category } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedState) params.append('state', selectedState);
        if (selectedCity) params.append('city', selectedCity);

        const url = `/api/products/category/${category}${params.toString() ? `?${params.toString()}` : ''}`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data.products);
        setFiltered(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, selectedState, selectedCity]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = products.filter(p =>
      p.title.toLowerCase().includes(term) ||
      p.college.toLowerCase().includes(term) ||
      p.price.toLowerCase().includes(term) ||
      (p.city && p.city.toLowerCase().includes(term)) ||
      (p.state && p.state.toLowerCase().includes(term))
    );
    setFiltered(results);
  }, [searchTerm, products]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity(''); // Reset city when state changes
  };

  const clearFilters = () => {
    setSelectedState('');
    setSelectedCity('');
  };

  const states = getStates();
  const cities = selectedState ? getCitiesForState(selectedState) : [];

  return (
    <motion.div
      className="min-h-screen bg-[#faf7ed] px-6 pb-12 pt-8 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        className="text-3xl sm:text-4xl font-extrabold text-[#5B3DF6] mb-6 capitalize text-center tracking-wide"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {category} Listings
      </motion.h2>

      {/* Search and Filter Controls */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <motion.input
          type="text"
          placeholder="🔍 Search by title, price, college, city or state"
          className="w-full max-w-xl mx-auto block mb-4 px-6 py-4
                    rounded-full bg-white text-[#23185B] font-medium
                    border-2 border-[#E0D5FA] shadow focus:outline-none
                    focus:ring-2 focus:ring-[#5B3DF6] transition-all placeholder:text-[#a78bfa]"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          whileFocus={{ scale: 1.025 }}
        />

        {/* Filter Toggle Button */}
        <div className="flex justify-center">
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-[#5B3DF6] text-white rounded-full font-medium hover:bg-[#4c32d9] transition-colors shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter size={18} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </motion.button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 bg-white rounded-2xl shadow-lg border-2 border-[#E0D5FA] p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* State Filter */}
              <div className="relative">
                <label className="block text-sm font-bold text-[#23185B] mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Filter by State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-[#5B3DF6] focus:outline-none font-medium"
                >
                  <option value="">All States</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div className="relative">
                <label className="block text-sm font-bold text-[#23185B] mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Filter by City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState}
                  className="w-full px-4 py-3 rounded-xl bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-[#5B3DF6] focus:outline-none font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {selectedState ? 'All Cities' : 'Select State First'}
                  </option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <motion.button
                  onClick={clearFilters}
                  className="w-full px-4 py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear Filters
                </motion.button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedState || selectedCity) && (
              <div className="mt-4 pt-4 border-t border-[#E0D5FA]">
                <p className="text-sm font-medium text-[#7c689c] mb-2">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedState && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#5B3DF6] text-white rounded-full text-sm">
                      State: {selectedState}
                      <button
                        onClick={() => handleStateChange('')}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedCity && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#5B3DF6] text-white rounded-full text-sm">
                      City: {selectedCity}
                      <button
                        onClick={() => setSelectedCity('')}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {loading ? (
        <motion.div
          className="flex justify-center items-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B3DF6]"></div>
          <span className="ml-4 text-[#5B3DF6] font-medium">Loading products...</span>
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.p
          className="text-center text-[#a78bfa] text-lg font-semibold mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No matching products found.
        </motion.p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.07,
              },
            },
          }}
        >
          {filtered.map(product => (
            <motion.div
              key={product._id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
