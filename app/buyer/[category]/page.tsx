'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { motion } from 'framer-motion';

export default function CategoryPage() {
  // @ts-ignore
  const { category } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      const res = await fetch(`/api/products/category/${category}`);
      const data = await res.json();
      setProducts(data.products);
      setFiltered(data.products);
    };

    fetchProducts();
  }, [category]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = products.filter(p =>
      p.title.toLowerCase().includes(term) ||
      p.college.toLowerCase().includes(term) ||
      p.price.toLowerCase().includes(term)
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
        {category} Listings
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

      {filtered.length === 0 ? (
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
