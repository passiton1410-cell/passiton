'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

export default function AllListingsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
      setFiltered(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = products.filter(p =>
      p.title.toLowerCase().includes(term) ||
      p.college.toLowerCase().includes(term) ||
      p.price.toString().includes(term)
    );
    setFiltered(results);
  }, [searchTerm, products]);

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
        All Product Listings
      </motion.h2>

      <motion.input
        type="text"
        placeholder="🔍 Search by title, price or college"
        className="w-full max-w-xl mx-auto block mb-10 px-6 py-4
                  rounded-full bg-white text-[#23185B] font-medium
                  border-2 border-[#E0D5FA] shadow focus:outline-none
                  focus:ring-2 focus:ring-[#5B3DF6] transition-all placeholder:text-[#a78bfa]"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        whileFocus={{ scale: 1.025 }}
      />

      {/* Results Count */}
      <div className="mb-6 text-center">
        <p className="text-lg font-medium text-[#23185B]">
          Showing <span className="text-[#5B3DF6] font-bold">{filtered.length}</span> products
          {searchTerm && (
            <span className="text-[#7c689c]"> for "<span className="font-semibold">{searchTerm}</span>"</span>
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