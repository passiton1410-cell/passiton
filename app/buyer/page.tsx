'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Book, Laptop, Bed, Shirt, PenTool, Boxes } from 'lucide-react';

// Use a deep purple text/icon on yellow, green, and blue backgrounds.
const categories = [
  { name: 'Books', color: 'bg-[#5B3DF6]/90', icon: Book, iconColor: '#fff',      textColor: '#fff' },
  { name: 'Electronics', color: 'bg-[#FFE158]/90', icon: Laptop, iconColor: '#23185B', textColor: '#23185B' },
  { name: 'Furniture', color: 'bg-[#F87171]/90', icon: Bed, iconColor: '#fff',      textColor: '#fff' },
  { name: 'Clothing', color: 'bg-[#EC4899]/90', icon: Shirt, iconColor: '#fff',      textColor: '#fff' },
  { name: 'Stationery', color: 'bg-[#34D399]/90', icon: PenTool, iconColor: '#23185B', textColor: '#23185B' },
  { name: 'Other', color: 'bg-[#38BDF8]/90', icon: Boxes, iconColor: '#23185B', textColor: '#23185B' },
];

export default function BuyerPage() {
  const router = useRouter();
  //@ts-ignore
  const handleCategoryClick = (category) => {
    router.push(`/buyer/${category.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen w-full bg-[#faf7ed] flex flex-col items-center pt-12 px-4 pb-12">
      <motion.div
        className="w-full max-w-3xl flex flex-col items-center"
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-3xl sm:text-4xl font-black text-[#5B3DF6] mb-2 text-center"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          What are you looking for?
        </motion.h2>
        <p className="text-base text-[#6C4AB6] font-medium mb-8 text-center max-w-md">
          Choose a category to browse items from your campus community!
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl w-full"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.09 } },
        }}
      >
        {categories.map((cat) => (
          <motion.button
            key={cat.name}
            onClick={() => handleCategoryClick(cat.name)}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.96 }}
            className={`flex flex-col items-center justify-center gap-3 rounded-3xl shadow-lg ${cat.color} px-8 py-8 transition-transform border-4 border-white hover:shadow-2xl`}
            style={{
              minHeight: 160,
              boxShadow: '0 6px 32px 0 rgba(120, 80, 210, 0.06)'
            }}
          >
            <cat.icon size={32} style={{ color: cat.iconColor }} />
            <span className="text-xl font-bold tracking-wide" style={{ color: cat.textColor }}>
              {cat.name}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
