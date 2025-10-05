'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';

export default function DebugListingsPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [electronicsProducts, setElectronicsProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const testAPIs = async () => {
      try {
        console.log('🔍 Testing APIs...');

        // Test all products API
        const allRes = await fetch('/api/products');
        const allData = await allRes.json();
        console.log('📦 All products response:', allData);
        setAllProducts(allData.products || []);

        // Test electronics category API
        const electronicsRes = await fetch('/api/products/category/electronics');
        const electronicsData = await electronicsRes.json();
        console.log('⚡ Electronics response:', electronicsData);
        setElectronicsProducts(electronicsData.products || []);

      } catch (err) {
        console.error('❌ API Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    testAPIs();
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
          🔍 Debug: Product Listings (No Sold Filter)
        </h1>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">❌ Error: {error}</p>
          </div>
        )}

        {/* API Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#E0D5FA]">
            <h2 className="text-xl font-bold text-[#23185B] mb-4">All Products API Test</h2>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{allProducts.length}</div>
              <p className="text-blue-800">products found</p>
              <p className="text-sm text-gray-600 mt-2">From /api/products</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#E0D5FA]">
            <h2 className="text-xl font-bold text-[#23185B] mb-4">Electronics Category Test</h2>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{electronicsProducts.length}</div>
              <p className="text-green-800">electronics found</p>
              <p className="text-sm text-gray-600 mt-2">From /api/products/category/electronics</p>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {allProducts.length === 0 && !loading && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-bold text-red-800 mb-2">❌ No Products Found</h3>
            <p className="text-red-700 mb-2">This means:</p>
            <ul className="list-disc list-inside text-red-600 space-y-1">
              <li>No products exist in your database at all</li>
              <li>Database connection issues</li>
              <li>Products are in a different collection</li>
            </ul>
          </div>
        )}

        {allProducts.length > 0 && electronicsProducts.length === 0 && (
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-bold text-yellow-800 mb-2">⚠️ Products Exist But Not In Electronics</h3>
            <p className="text-yellow-700">Your products might be in other categories like Books, Furniture, etc.</p>
          </div>
        )}

        {allProducts.length > 0 && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-bold text-green-800 mb-2">✅ Products Found!</h3>
            <p className="text-green-700">
              Great! Your database has {allProducts.length} products.
              If they're not showing in regular listings, the issue is with the "sold" filter.
            </p>
          </div>
        )}

        {/* Show actual products */}
        {allProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#E0D5FA]">
            <h2 className="text-xl font-bold text-[#23185B] mb-4">
              Your Products (All Categories)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {allProducts.slice(0, 9).map(product => (
                <div key={product._id} className="relative">
                  <ProductCard product={product} />
                  {product.sold && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      SOLD
                    </div>
                  )}
                </div>
              ))}
            </div>
            {allProducts.length > 9 && (
              <p className="text-center text-[#7c689c] mt-4">
                ...and {allProducts.length - 9} more products
              </p>
            )}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2">🔧 Debug Instructions:</h3>
          <ol className="list-decimal list-inside text-blue-700 space-y-1">
            <li>Check the browser console for detailed API logs</li>
            <li>If products show here but not in regular listings, check the "sold" status</li>
            <li>Go to your dashboard and mark products as "unsold" if needed</li>
            <li>After testing, we'll restore the sold filter for production</li>
          </ol>
        </div>
      </div>
    </div>
  );
}