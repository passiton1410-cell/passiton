// app/search/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Product {
  _id: string;
  title: string;
  image: string;
  price: number;
  college: string;
  category: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('🔴 Error fetching products:', err);
        setError('Something went wrong while fetching products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  if (!query) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-[#23185B] text-xl">
        Please enter a search term.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#fff6eb] min-h-[70vh] flex items-center justify-center text-[#23185B] text-xl">
        Searching for “{query}”...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="bg-[#fff6eb] min-h-screen flex items-center justify-center text-[#23185B] text-xl">
        No results found for “{query}”.
      </div>
    );
  }

  return (
    <div className="bg-[#fff6eb] min-h-screen py-10 px-4 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#23185B] mb-6">
          Search Results for “{query}”
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              className="group rounded-2xl overflow-hidden shadow hover:shadow-xl transition duration-200 bg-white"
            >
              <div className="relative w-full h-48 sm:h-52 md:h-56 bg-gray-100">
                <Image
                  src={product.image || '/default.png'}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-200"
                />
              </div>
              <div className="p-4 text-[#23185B]">
                <h2 className="text-lg font-semibold truncate">{product.title}</h2>
                <p className="text-sm text-gray-500">{product.college}</p>
                <div className="mt-2 font-bold text-lg">₹{product.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
