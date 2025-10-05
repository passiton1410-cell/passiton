'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { motion } from 'framer-motion';

export default function CategoryPage() {
  // @ts-ignore
  const { category } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/category/${category}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);


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


      {loading ? (
        <motion.div
          className="flex justify-center items-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B3DF6]"></div>
          <span className="ml-4 text-[#5B3DF6] font-medium">Loading products...</span>
        </motion.div>
      ) : products.length === 0 ? (
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
          {products.map(product => (
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
