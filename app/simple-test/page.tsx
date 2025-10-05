'use client';

import { useEffect, useState } from 'react';

export default function SimpleTestPage() {
  const [step, setStep] = useState(1);
  const [results, setResults] = useState<any>({});

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    console.log('🔍 Starting comprehensive diagnostics...');

    // Step 1: Test dashboard API (this should work)
    setStep(1);
    try {
      const dashboardRes = await fetch('/api/dashboard/products');
      const dashboardData = await dashboardRes.json();
      console.log('📊 Dashboard API response:', dashboardData);
      setResults(prev => ({ ...prev, dashboard: dashboardData }));
    } catch (err) {
      console.error('❌ Dashboard API failed:', err);
      setResults(prev => ({ ...prev, dashboard: { error: String(err) } }));
    }

    // Step 2: Test all products API
    setStep(2);
    try {
      const allRes = await fetch('/api/products');
      const allData = await allRes.json();
      console.log('📦 All products API response:', allData);
      setResults(prev => ({ ...prev, allProducts: allData }));
    } catch (err) {
      console.error('❌ All products API failed:', err);
      setResults(prev => ({ ...prev, allProducts: { error: String(err) } }));
    }

    // Step 3: Test electronics category API
    setStep(3);
    try {
      const electronicsRes = await fetch('/api/products/category/electronics');
      const electronicsData = await electronicsRes.json();
      console.log('⚡ Electronics API response:', electronicsData);
      setResults(prev => ({ ...prev, electronics: electronicsData }));
    } catch (err) {
      console.error('❌ Electronics API failed:', err);
      setResults(prev => ({ ...prev, electronics: { error: String(err) } }));
    }

    // Step 4: Test books category API
    setStep(4);
    try {
      const booksRes = await fetch('/api/products/category/books');
      const booksData = await booksRes.json();
      console.log('📚 Books API response:', booksData);
      setResults(prev => ({ ...prev, books: booksData }));
    } catch (err) {
      console.error('❌ Books API failed:', err);
      setResults(prev => ({ ...prev, books: { error: String(err) } }));
    }

    setStep(5); // Complete
  };

  return (
    <div className="min-h-screen bg-[#faf7ed] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#5B3DF6] mb-8 text-center">
          🔍 Complete API Diagnostics
        </h1>

        {/* Progress */}
        <div className="mb-8 bg-white rounded-lg p-4 border-2 border-[#E0D5FA]">
          <div className="flex items-center gap-4">
            <div className="text-lg font-bold">Testing Progress:</div>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(i => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i <= step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              {step === 1 && 'Testing Dashboard API...'}
              {step === 2 && 'Testing All Products API...'}
              {step === 3 && 'Testing Electronics API...'}
              {step === 4 && 'Testing Books API...'}
              {step === 5 && 'Complete!'}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Dashboard Results */}
          {results.dashboard && (
            <div className="bg-white rounded-lg p-6 border-2 border-[#E0D5FA]">
              <h2 className="text-xl font-bold mb-4">
                📊 Dashboard API (/api/dashboard/products)
              </h2>
              {results.dashboard.error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-700">❌ Error: {results.dashboard.error}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">
                    ✅ {results.dashboard.products?.length || 0} products found
                  </div>
                  <p className="text-green-700">Dashboard API works - you have products!</p>
                </div>
              )}
            </div>
          )}

          {/* All Products Results */}
          {results.allProducts && (
            <div className="bg-white rounded-lg p-6 border-2 border-[#E0D5FA]">
              <h2 className="text-xl font-bold mb-4">
                📦 All Products API (/api/products)
              </h2>
              {results.allProducts.error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-700">❌ Error: {results.allProducts.error}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {results.allProducts.products?.length || 0} products found
                  </div>
                  {results.allProducts.products?.length > 0 ? (
                    <p className="text-green-700">✅ Public API returns products!</p>
                  ) : (
                    <p className="text-red-700">❌ Public API returns empty - this is the problem!</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Electronics Results */}
          {results.electronics && (
            <div className="bg-white rounded-lg p-6 border-2 border-[#E0D5FA]">
              <h2 className="text-xl font-bold mb-4">
                ⚡ Electronics API (/api/products/category/electronics)
              </h2>
              {results.electronics.error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-700">❌ Error: {results.electronics.error}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">
                    {results.electronics.products?.length || 0} electronics found
                  </div>
                  {results.electronics.products?.length > 0 ? (
                    <p className="text-green-700">✅ Electronics category has products!</p>
                  ) : (
                    <p className="text-red-700">❌ No electronics found - category issue?</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Books Results */}
          {results.books && (
            <div className="bg-white rounded-lg p-6 border-2 border-[#E0D5FA]">
              <h2 className="text-xl font-bold mb-4">
                📚 Books API (/api/products/category/books)
              </h2>
              {results.books.error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-700">❌ Error: {results.books.error}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-600">
                    {results.books.products?.length || 0} books found
                  </div>
                  {results.books.products?.length > 0 ? (
                    <p className="text-green-700">✅ Books category has products!</p>
                  ) : (
                    <p className="text-red-700">❌ No books found - category issue?</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Analysis */}
          {step === 5 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-yellow-800 mb-4">🔍 Analysis</h2>
              <div className="space-y-3 text-yellow-700">
                {results.dashboard?.products?.length > 0 && results.allProducts?.products?.length === 0 && (
                  <p><strong>Issue Found:</strong> Dashboard has products but public API returns empty. This means the sold filter or query is too restrictive.</p>
                )}
                {results.allProducts?.products?.length > 0 && results.electronics?.products?.length === 0 && (
                  <p><strong>Issue Found:</strong> Products exist but not in "electronics" category. Check category names in database.</p>
                )}
                {results.dashboard?.products?.length === 0 && (
                  <p><strong>Issue Found:</strong> No products exist in database at all.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2">📋 Instructions:</h3>
          <ol className="list-decimal list-inside text-blue-700 space-y-1">
            <li>Check the results above to see which APIs work</li>
            <li>Open browser console (F12) to see detailed API responses</li>
            <li>Look for the "Analysis" section which will identify the exact problem</li>
          </ol>
        </div>
      </div>
    </div>
  );
}