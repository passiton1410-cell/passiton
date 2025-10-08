'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { Package, MapPin } from 'lucide-react';
import { getStates, getCitiesForState } from '@/lib/indian-states-cities';

export default function CategoryPage() {
  // @ts-ignore
  const { category } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/category/${category}`);
        const data = await res.json();
        console.log('🔍 FRONTEND: Raw API response:', data);
        console.log('🔍 FRONTEND: Products array:', data.products);
        console.log('🔍 FRONTEND: Products length:', data.products?.length);
        console.log('🔍 FRONTEND: First product details:', data.products?.[0]);
        setProducts(data.products || []);
        setFiltered(data.products || []);

        // Extract unique states and cities from products
        const uniqueStates = [...new Set(data.products?.map((p: any) => p.state).filter(Boolean) as string[])].sort();
        const uniqueCities = [...new Set(data.products?.map((p: any) => p.city).filter(Boolean) as string[])].sort();
        setAvailableStates(uniqueStates);
        setAvailableCities(uniqueCities);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  useEffect(() => {
    const results = products.filter(p => {
      const matchesState = !selectedState || p.state === selectedState;
      const matchesCity = !selectedCity || p.city === selectedCity;

      return matchesState && matchesCity;
    });
    setFiltered(results);
  }, [products, selectedState, selectedCity]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity(''); // Reset city when state changes
  };

  const clearFilters = () => {
    setSelectedState('');
    setSelectedCity('');
  };

  console.log('🔍 FRONTEND: Current products state:', products);
  console.log('🔍 FRONTEND: Loading state:', loading);

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


      {/* Filters Section */}
      <motion.div
        className="w-full max-w-4xl mx-auto mb-8 bg-white rounded-2xl p-6 shadow-lg border-2 border-[#E0D5FA]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 text-[#23185B] font-semibold">
            <MapPin size={20} className="text-[#5B3DF6]" />
            <span>Filter by Location:</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* State Filter */}
            <div className="flex-1">
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white border-2 border-[#E0D5FA]
                          text-[#23185B] font-medium focus:outline-none focus:ring-2
                          focus:ring-[#5B3DF6] transition-all"
              >
                <option value="">All States</option>
                {availableStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div className="flex-1">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white border-2 border-[#E0D5FA]
                          text-[#23185B] font-medium focus:outline-none focus:ring-2
                          focus:ring-[#5B3DF6] transition-all"
                disabled={!selectedState}
              >
                <option value="">All Cities</option>
                {selectedState && getCitiesForState(selectedState).filter(city =>
                  availableCities.includes(city)
                ).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(selectedState || selectedCity) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-[#5B3DF6] text-white font-medium rounded-lg
                        hover:bg-[#4c31d9] transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-[#5B3DF6] focus:ring-opacity-50"
            >
              Clear Filters
            </button>
          )}
        </div>
      </motion.div>

      {/* Results Count */}
      <div className="mb-6 text-center">
        <p className="text-lg font-medium text-[#23185B]">
          Showing <span className="text-[#5B3DF6] font-bold">{filtered.length}</span> {category} products
          {selectedState && (
            <span className="text-[#7c689c]"> in <span className="font-semibold">{selectedState}</span></span>
          )}
          {selectedCity && (
            <span className="text-[#7c689c]">, <span className="font-semibold">{selectedCity}</span></span>
          )}
        </p>
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
        <motion.div
          className="text-center text-[#a78bfa] font-semibold mt-10 bg-white rounded-2xl p-8 shadow-lg border-2 border-[#E0D5FA] max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Package size={64} className="mx-auto mb-4 text-[#a78bfa]" />
          <p className="text-lg mb-2">No products found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </motion.div>
      ) : (
        <>
          {console.log('🔍 FRONTEND: About to render products grid with', filtered.length, 'products')}
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
            {filtered.map((product, index) => {
              console.log(`🔍 FRONTEND: Rendering product ${index}:`, product);
              return (
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
              );
            })}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
