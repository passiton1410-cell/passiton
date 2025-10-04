'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle, XCircle, Loader2, Eye, Heart, Briefcase, Trash2, Calendar } from 'lucide-react';
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

type Opportunity = {
  _id: string;
  title: string;
  description: string;
  type: string;
  company: string;
  location: string;
  city: string;
  state: string;
  college: string;
  email: string;
  phone: string;
  requirements?: string;
  deadline?: string;
  salary?: string;
  duration?: string;
  active: boolean;
  createdAt: string;
};

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [opportunitiesLoading, setOpportunitiesLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch products
    fetch('/api/dashboard/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      });

    // Fetch opportunities
    fetch('/api/dashboard/opportunities')
      .then(res => res.json())
      .then(data => {
        setOpportunities(data.opportunities || []);
        setOpportunitiesLoading(false);
      })
      .catch(() => setOpportunitiesLoading(false));
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

  const handleDeleteOpportunity = async (opportunityId: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    setDeleting(opportunityId);
    try {
      const response = await fetch('/api/dashboard/opportunities/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId }),
      });

      if (response.ok) {
        setOpportunities(opportunities =>
          opportunities.filter(o => o._id !== opportunityId)
        );
      } else {
        alert('Failed to delete opportunity');
      }
    } catch (error) {
      alert('Error deleting opportunity');
    }
    setDeleting(null);
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

      {/* My Opportunities Section */}
      <div className="w-full max-w-5xl bg-white/90 rounded-3xl shadow-2xl border-2 border-[#E0D5FA] p-8 flex flex-col mt-8">
        <div className="flex items-center gap-3 mb-5">
          <Briefcase className="text-[#5B3DF6]" size={24} />
          <h2 className="text-xl font-bold text-[#23185B]">My Opportunities</h2>
        </div>

        {opportunitiesLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#5B3DF6]" size={32} />
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center text-[#a78bfa] font-semibold py-10">
            <Briefcase className="mx-auto mb-4 text-[#a78bfa]" size={48} />
            <p>You haven&apos;t posted any opportunities yet.</p>
            <button
              onClick={() => router.push('/post-opportunity')}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all font-semibold"
            >
              Post Your First Opportunity
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map(opportunity => (
              <motion.div
                key={opportunity._id}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-100 hover:border-blue-200 transition-all hover:shadow-lg"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{opportunity.title}</h3>
                    <p className="text-blue-600 font-medium text-sm">{opportunity.company}</p>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mt-2">
                      {opportunity.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {opportunity.active ? (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 font-bold text-xs">
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-bold text-xs">
                        <XCircle size={14} /> Inactive
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{opportunity.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} />
                    <span>Posted {new Date(opportunity.createdAt).toLocaleDateString()}</span>
                  </div>
                  {opportunity.deadline && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} />
                      <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  {opportunity.salary && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Salary: {opportunity.salary}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    onClick={() => router.push(`/opportunities`)}
                  >
                    <Eye size={16} /> View
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    disabled={deleting === opportunity._id}
                    onClick={() => handleDeleteOpportunity(opportunity._id)}
                  >
                    {deleting === opportunity._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete
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