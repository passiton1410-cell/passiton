'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle, XCircle, Loader2, Eye, Heart } from 'lucide-react';
import UserInfoCard from '@/components/UserInfoCard';

type Product = {
  _id: string;
  title: string;
  price: string;
  category: string;
  image: string;
  college: string;
  sold: boolean;
  createdAt: string;
};

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/dashboard/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      });
  }, []);

  const handleToggleSold = async (productId: string, sold: boolean) => {
    setToggling(productId);
    await fetch('/api/dashboard/toggle-sold', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, sold }),
    });
    setProducts(products =>
      products.map(p =>
        p._id === productId ? { ...p, sold } : p
      )
    );
    setToggling(null);
  };

  return (
    <div className="min-h-screen bg-[#faf7ed] flex flex-col items-center py-10 px-4">
      
      <motion.h1
        className="text-3xl sm:text-4xl font-black text-[#5B3DF6] mb-7 text-center"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Dashboard
      </motion.h1>
      <UserInfoCard />
      <div className='h-10'></div>
      <div className="w-full max-w-5xl bg-white/90 rounded-3xl shadow-2xl border-2 border-[#E0D5FA] p-8 flex flex-col">
        <h2 className="text-xl font-bold text-[#23185B] mb-5">My Listings</h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#5B3DF6]" size={32} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-[#a78bfa] font-semibold py-10">
            You haven&apos;t listed any items yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
            {products.map(product => (
              <motion.div
                key={product._id}
                className={`flex flex-col items-center bg-[#f7f4e8] shadow-sm rounded-xl p-6 border-2 transition-transform hover:scale-105 relative ${
                  product.sold ? 'opacity-60' : ''
                }`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-full flex justify-end absolute top-3 right-3">
                  {product.sold ? (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-200 text-green-700 font-bold text-xs">
                      <CheckCircle size={16} /> Sold
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-bold text-xs">
                      <Eye size={16} /> Active
                    </span>
                  )}
                </div>
                <Image
                  src={product.image}
                  alt={product.title}
                  width={80}
                  height={80}
                  className="rounded-xl object-contain mb-2"
                />
                <span className="mt-1 font-semibold text-lg text-[#23185B] text-center">{product.title}</span>
                <span className="text-[#23185B] font-bold">₹{product.price}</span>
                <span className="text-xs text-[#7c689c] mb-2">{product.category}</span>
                <div className="flex gap-2 mt-2">
                  <button
                    className={`px-4 py-2 rounded-full font-bold shadow transition text-white ${
                      product.sold
                        ? 'bg-[#5B3DF6] hover:bg-[#3b278e]'
                        : 'bg-[#22C55E] hover:bg-[#16a34a]'
                    } flex items-center gap-2`}
                    disabled={toggling === product._id}
                    onClick={() => handleToggleSold(product._id, !product.sold)}
                  >
                    {toggling === product._id && <Loader2 size={16} className="animate-spin" />}
                    {product.sold ? (
                      <>
                        <XCircle size={16} /> Mark as Unsold
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} /> Mark as Sold
                      </>
                    )}
                  </button>
                  <button
                    className="px-3 py-2 rounded-full bg-[#FFE158] hover:bg-yellow-400 text-[#23185B] font-bold shadow transition flex items-center gap-1"
                    onClick={() => router.push(`/product/${product._id}`)}
                  >
                    <Eye size={16} /> View
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}