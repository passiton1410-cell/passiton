'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';

export default function TestListingsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch debug info
        const debugRes = await fetch('/api/debug/products');
        const debugData = await debugRes.json();
        setDebugInfo(debugData);

        // Fetch products without any filters
        const productsRes = await fetch('/api/products');
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);

        console.log('Debug info:', debugData);
        console.log('Products:', productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7ed] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B3DF6] mx-auto mb-4"></div>
          <p className="text-[#5B3DF6] font-medium">Loading debug info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7ed] px-6 pb-12 pt-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#5B3DF6] mb-8 text-center">
          Debug: Product Listings Test Page
        </h1>

        {/* Debug Information */}
        {debugInfo && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-[#E0D5FA]">
            <h2 className="text-xl font-bold text-[#23185B] mb-4">Database Debug Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Total Products</h3>
                <p className="text-2xl font-bold text-blue-600">{debugInfo.totalProducts}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">With State</h3>
                <p className="text-2xl font-bold text-green-600">{debugInfo.summary?.productsWithState || 0}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800">With City</h3>
                <p className="text-2xl font-bold text-yellow-600">{debugInfo.summary?.productsWithCity || 0}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800">Missing Location</h3>
                <p className="text-2xl font-bold text-red-600">{debugInfo.summary?.productsWithoutLocation || 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-[#23185B] mb-2">Unique States ({debugInfo.uniqueStates?.length || 0})</h3>
                <div className="bg-gray-50 rounded p-3 max-h-32 overflow-y-auto">
                  <div className="text-sm space-y-1">
                    {debugInfo.uniqueStates?.map((state: string) => (
                      <div key={state} className="bg-white px-2 py-1 rounded">"{state}"</div>
                    )) || <p>No states found</p>}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[#23185B] mb-2">Unique Cities ({debugInfo.uniqueCities?.length || 0})</h3>
                <div className="bg-gray-50 rounded p-3 max-h-32 overflow-y-auto">
                  <div className="text-sm space-y-1">
                    {debugInfo.uniqueCities?.slice(0, 10).map((city: string) => (
                      <div key={city} className="bg-white px-2 py-1 rounded">"{city}"</div>
                    )) || <p>No cities found</p>}
                    {debugInfo.uniqueCities?.length > 10 && (
                      <p className="text-gray-500 italic">...and {debugInfo.uniqueCities.length - 10} more</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-[#23185B] mb-2">Sample Products</h3>
              <div className="bg-gray-50 rounded p-3 max-h-48 overflow-y-auto">
                <div className="text-sm space-y-2">
                  {debugInfo.products?.map((product: any) => (
                    <div key={product._id || Math.random()} className="bg-white p-2 rounded border">
                      <div className="font-medium">{product.title}</div>
                      <div className="text-gray-600">
                        Category: {product.category} | State: "{product.state}" | City: "{product.city}"
                      </div>
                      <div className="text-xs text-gray-500">College: {product.college}</div>
                    </div>
                  )) || <p>No products found</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Display */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#E0D5FA]">
          <h2 className="text-xl font-bold text-[#23185B] mb-4">
            All Products (No Filters) - {products.length} found
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#a78bfa] text-lg">No products found in database</p>
              <p className="text-sm text-gray-500 mt-2">
                This means either no products have been created, or they're all marked as sold.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}