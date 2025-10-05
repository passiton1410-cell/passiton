'use client';

import { useEffect, useState } from 'react';

export default function CategoriesTestPage() {
  const [categoryData, setCategoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetch('/api/debug/categories');
        const data = await response.json();
        console.log('📊 Category debug data:', data);
        setCategoryData(data);
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7ed] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B3DF6] mx-auto mb-4"></div>
          <p className="text-[#5B3DF6] font-medium">Loading category data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7ed] px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#5B3DF6] mb-8 text-center">
          📊 Database Category Analysis
        </h1>

        {categoryData && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#E0D5FA]">
              <h2 className="text-xl font-bold text-[#23185B] mb-4">Database Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{categoryData.totalProducts}</div>
                  <div className="text-blue-800">Total Products</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{categoryData.uniqueCategories?.length || 0}</div>
                  <div className="text-green-800">Unique Categories</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {categoryData.categoryStats?.reduce((sum: number, cat: any) => sum + cat.unsold, 0) || 0}
                  </div>
                  <div className="text-purple-800">Unsold Products</div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#E0D5FA]">
              <h2 className="text-xl font-bold text-[#23185B] mb-4">Categories in Your Database</h2>
              {categoryData.categoryStats?.length > 0 ? (
                <div className="space-y-3">
                  {categoryData.categoryStats.map((cat: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg">"{cat.category}"</h3>
                        <div className="text-sm text-gray-600">Total: {cat.total}</div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-600">✅ Unsold: {cat.unsold}</span>
                        <span className="text-red-600">❌ Sold: {cat.sold}</span>
                      </div>

                      {/* Test links */}
                      <div className="mt-3 flex gap-2">
                        <a
                          href={`/buyer/${cat.category.toLowerCase()}`}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                          target="_blank"
                        >
                          Test Category Page
                        </a>
                        <button
                          onClick={() => {
                            fetch(`/api/products/category/${cat.category.toLowerCase()}`)
                              .then(res => res.json())
                              .then(data => console.log(`API test for "${cat.category}":`, data));
                          }}
                          className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                        >
                          Test API Call
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-red-600">No categories found in database!</p>
              )}
            </div>

            {/* Sample Products */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#E0D5FA]">
              <h2 className="text-xl font-bold text-[#23185B] mb-4">Sample Products</h2>
              {categoryData.sampleProducts?.length > 0 ? (
                <div className="space-y-3">
                  {categoryData.sampleProducts.map((product: any, index: number) => (
                    <div key={index} className="p-3 border rounded bg-gray-50">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div><strong>Title:</strong> {product.title}</div>
                        <div><strong>Category:</strong> "{product.category}"</div>
                        <div><strong>Sold:</strong> {String(product.sold)}</div>
                        <div><strong>Created:</strong> {new Date(product.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-red-600">No sample products found!</p>
              )}
            </div>

            {/* Troubleshooting */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-yellow-800 mb-3">🔧 Troubleshooting Guide</h2>
              <div className="space-y-2 text-yellow-700">
                <p><strong>If you see categories but no products in listings:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Check if category names match exactly (case-sensitive)</li>
                  <li>Look for extra spaces or special characters in category names</li>
                  <li>Verify products are marked as unsold (sold: false)</li>
                </ul>

                <p className="mt-4"><strong>Common Issues:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>"Electronics" vs "electronics" - case mismatch</li>
                  <li>"Books " vs "Books" - trailing spaces</li>
                  <li>All products marked as sold</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}