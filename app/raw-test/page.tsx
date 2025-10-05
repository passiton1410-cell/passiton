'use client';

import { useEffect, useState } from 'react';

export default function RawTestPage() {
  const [rawData, setRawData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const testRawAPI = async () => {
      try {
        console.log('🔍 Testing raw API response...');

        const response = await fetch('/api/products/category/electronics');
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers);

        const data = await response.json();
        console.log('📦 Raw API response:', data);

        setRawData(data);
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    testRawAPI();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf7ed] px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#5B3DF6] mb-8 text-center">
          🔍 Raw API Test - Electronics Category
        </h1>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-bold">❌ Error: {error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#E0D5FA]">
          <h2 className="text-xl font-bold text-[#23185B] mb-4">Raw API Response</h2>

          {!rawData ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B3DF6] mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-2">Products Array Length:</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {rawData.products ? rawData.products.length : 'undefined'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-2">Full Response:</h3>
                <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-64">
                  {JSON.stringify(rawData, null, 2)}
                </pre>
              </div>

              {rawData.products && rawData.products.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-bold mb-2 text-green-800">✅ Products Found!</h3>
                  <p className="text-green-700 mb-3">
                    API is returning {rawData.products.length} products.
                    If they're not showing in the UI, it's a frontend display issue.
                  </p>

                  <h4 className="font-semibold mb-2">Sample Product Data:</h4>
                  <div className="space-y-2">
                    {rawData.products.slice(0, 3).map((product: any, index: number) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><strong>Title:</strong> {product.title || 'undefined'}</div>
                          <div><strong>Category:</strong> {product.category || 'undefined'}</div>
                          <div><strong>Price:</strong> {product.price || 'undefined'}</div>
                          <div><strong>Sold:</strong> {String(product.sold)}</div>
                          <div><strong>College:</strong> {product.college || 'undefined'}</div>
                          <div><strong>Image:</strong> {product.image ? '✅ Present' : '❌ Missing'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rawData.products && rawData.products.length === 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-bold mb-2 text-yellow-800">⚠️ Empty Array</h3>
                  <p className="text-yellow-700">
                    API returned an empty products array. This means either:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-yellow-600">
                    <li>No products in "electronics" category</li>
                    <li>Category name mismatch (check exact spelling/case)</li>
                    <li>Database query issue</li>
                  </ul>
                </div>
              )}

              {!rawData.products && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="font-bold mb-2 text-red-800">❌ No Products Property</h3>
                  <p className="text-red-700">
                    API response doesn't have a 'products' property. This indicates an API error.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2">🔧 Next Steps:</h3>
          <ol className="list-decimal list-inside text-blue-700 space-y-1">
            <li>Check the console logs for detailed API debugging</li>
            <li>If products are returned here, the issue is in the frontend display</li>
            <li>If no products, check your database for exact category names</li>
            <li>Verify products exist with category exactly "Electronics" (case-sensitive)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}