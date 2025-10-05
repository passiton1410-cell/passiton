'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';

export default function TestCategoryPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [booksProducts, setBooksProducts] = useState<any[]>([]);
  const [electronicsProducts, setElectronicsProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testApis = async () => {
      try {
        // Test 1: All products (no filters)
        const allRes = await fetch('/api/products');
        const allData = await allRes.json();
        setAllProducts(allData.products || []);

        // Test 2: Books category (no location filters)
        const booksRes = await fetch('/api/products/category/books');
        const booksData = await booksRes.json();
        setBooksProducts(booksData.products || []);

        // Test 3: Electronics category (no location filters)
        const electronicsRes = await fetch('/api/products/category/electronics');
        const electronicsData = await electronicsRes.json();
        setElectronicsProducts(electronicsData.products || []);

        console.log('All products:', allData.products?.length || 0);
        console.log('Books products:', booksData.products?.length || 0);
        console.log('Electronics products:', electronicsData.products?.length || 0);
      } catch (error) {
        console.error('Error fetching test data:', error);
      } finally {
        setLoading(false);
      }
    };

    testApis();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7ed] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B3DF6] mx-auto mb-4"></div>
          <p className="text-[#5B3DF6] font-medium">Testing APIs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7ed] px-6 pb-12 pt-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#5B3DF6] mb-8 text-center">
          Category API Test - No Filters Applied
        </h1>

        {/* Test Results Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-[#E0D5FA]">
          <h2 className="text-xl font-bold text-[#23185B] mb-4">API Test Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-blue-800">All Products</h3>
              <p className="text-3xl font-bold text-blue-600">{allProducts.length}</p>
              <p className="text-sm text-blue-600">From /api/products</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-green-800">Books Category</h3>
              <p className="text-3xl font-bold text-green-600">{booksProducts.length}</p>
              <p className="text-sm text-green-600">From /api/products/category/books</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-purple-800">Electronics Category</h3>
              <p className="text-3xl font-bold text-purple-600">{electronicsProducts.length}</p>
              <p className="text-sm text-purple-600">From /api/products/category/electronics</p>
            </div>
          </div>

          {allProducts.length === 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">⚠️ No products found at all!</p>
              <p className="text-red-600 text-sm mt-1">
                This means either:
                <br />• No products have been created yet
                <br />• All products are marked as "sold"
                <br />• There's a database connection issue
              </p>
            </div>
          )}

          {allProducts.length > 0 && booksProducts.length === 0 && electronicsProducts.length === 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 font-medium">⚠️ Products exist but not in Books/Electronics categories</p>
              <p className="text-yellow-600 text-sm mt-1">
                Your products might be in other categories like Furniture, Clothing, etc.
              </p>
            </div>
          )}
        </div>

        {/* Display all products */}
        {allProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#E0D5FA]">
            <h2 className="text-xl font-bold text-[#23185B] mb-4">
              All Products Preview (First 6)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {allProducts.slice(0, 6).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            {allProducts.length > 6 && (
              <p className="text-center text-[#7c689c] mt-4">
                ...and {allProducts.length - 6} more products
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}