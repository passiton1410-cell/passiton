'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, Briefcase, X, Eye, Calendar, MapPin, Phone, Mail, GraduationCap, Loader2, ShieldCheck, Shield, Trash2, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';

interface User {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  role: string;
  verified: boolean;
  createdAt: string;
  collegeName: string;
  city: string;
  state: string;
  collegeIdUrl?: string;
}

interface Stats {
  totalUsers: number;
  totalListings: number;
  totalOpportunities: number;
  activeListings: number;
  activeOpportunities: number;
  soldListings: number;
  inactiveOpportunities: number;
}

interface Product {
  _id: string;
  title: string;
  price: string;
  category: string;
  image: string;
  college: string;
  sold: boolean;
  createdAt: string;
  city: string;
  state: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

interface PendingProduct {
  _id: string;
  title: string;
  price: string;
  category: string;
  images: string[];
  image: string;
  college: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  createdAt: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  user: {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    collegeName: string;
    city: string;
    state: string;
  };
}

interface Opportunity {
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
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

interface PendingOpportunity {
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
  createdAt: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  user: {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    collegeName: string;
    city: string;
    state: string;
  };
}

interface UserDetails {
  user: User;
  products: Product[];
  opportunities: Opportunity[];
  stats: {
    totalProducts: number;
    activeProducts: number;
    soldProducts: number;
    totalOpportunities: number;
    activeOpportunities: number;
    inactiveOpportunities: number;
  };
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [roleChanging, setRoleChanging] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  // Tab management
  const [activeTab, setActiveTab] = useState<'users' | 'pending-posts'>('users');

  // Pending posts states
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
  const [pendingOpportunities, setPendingOpportunities] = useState<PendingOpportunity[]>([]);
  const [pendingPostsLoading, setPendingPostsLoading] = useState(false);
  const [approvingProduct, setApprovingProduct] = useState<string | null>(null);
  const [approvingOpportunity, setApprovingOpportunity] = useState<string | null>(null);

  // Delete states
  const [deletingUser, setDeletingUser] = useState<string | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null);
  const [deletingOpportunity, setDeletingOpportunity] = useState<string | null>(null);

  // Migration state
  const [migrating, setMigrating] = useState(false);

  useEffect(() => {
    // Check if user is admin before loading data
    const checkAdminAccess = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();

        if (!data.loggedIn) {
          window.location.href = '/auth/login';
          return;
        }

        if (data.user.role !== 'admin') {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        // User is admin, proceed to load data
        fetchUsers();
        fetchStats();
        fetchPendingPosts();
      } catch (error) {
        console.error('Error checking admin access:', error);
        setAccessDenied(true);
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard-stats');
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchPendingPosts = async () => {
    setPendingPostsLoading(true);
    try {
      const [productsResponse, opportunitiesResponse] = await Promise.all([
        fetch('/api/admin/pending-products'),
        fetch('/api/admin/pending-opportunities')
      ]);

      const productsData = await productsResponse.json();
      const opportunitiesData = await opportunitiesResponse.json();

      setPendingProducts(productsData.products || []);
      setPendingOpportunities(opportunitiesData.opportunities || []);
    } catch (error) {
      console.error('Failed to fetch pending posts:', error);
    } finally {
      setPendingPostsLoading(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    setUserDetailsLoading(true);
    try {
      const response = await fetch(`/api/admin/user-details/${userId}`);
      const data = await response.json();
      setSelectedUser(data.userDetails);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    } finally {
      setUserDetailsLoading(false);
    }
  };

  const changeRole = async (userId: string, newRole: string) => {
    setRoleChanging(userId);
    try {
      const response = await fetch('/api/admin/change-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole }),
      });

      if (response.ok) {
        const data = await response.json();
        fetchUsers(); // Refresh the list
        if (selectedUser && selectedUser.user._id === userId) {
          setSelectedUser({
            ...selectedUser,
            user: { ...selectedUser.user, role: newRole }
          });
        }
        alert(`✅ ${data.message}\n\n⚠️ Important: The user must logout and login again for the role change to take effect.`);
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to update role: ${errorData.error}`);
      }
    } catch (error) {
      alert('Error updating role');
    } finally {
      setRoleChanging(null);
    }
  };

  const deleteUser = async (userId: string, userName: string) => {
    if (!confirm(`⚠️ Are you sure you want to permanently delete user "${userName}"?\n\nThis will also delete:\n• All their products/listings\n• All their opportunities\n• All their data\n\nThis action cannot be undone!`)) {
      return;
    }

    setDeletingUser(userId);
    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.message}`);
        fetchUsers(); // Refresh the list
        if (selectedUser && selectedUser.user._id === userId) {
          setSelectedUser(null); // Close modal if this user was selected
        }
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to delete user: ${errorData.error}`);
      }
    } catch (error) {
      alert('Error deleting user');
    } finally {
      setDeletingUser(null);
    }
  };

  const deleteProduct = async (productId: string, productTitle: string) => {
    if (!confirm(`⚠️ Are you sure you want to permanently delete the product "${productTitle}"?\n\nThis action cannot be undone!`)) {
      return;
    }

    setDeletingProduct(productId);
    try {
      const response = await fetch('/api/admin/delete-post', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.message}`);
        // Refresh user details if modal is open
        if (selectedUser) {
          fetchUserDetails(selectedUser.user._id);
        }
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to delete product: ${errorData.error}`);
      }
    } catch (error) {
      alert('Error deleting product');
    } finally {
      setDeletingProduct(null);
    }
  };

  const deleteOpportunity = async (opportunityId: string, opportunityTitle: string) => {
    if (!confirm(`⚠️ Are you sure you want to permanently delete the opportunity "${opportunityTitle}"?\n\nThis action cannot be undone!`)) {
      return;
    }

    setDeletingOpportunity(opportunityId);
    try {
      const response = await fetch('/api/admin/delete-opportunity', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.message}`);
        // Refresh user details if modal is open
        if (selectedUser) {
          fetchUserDetails(selectedUser.user._id);
        }
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to delete opportunity: ${errorData.error}`);
      }
    } catch (error) {
      alert('Error deleting opportunity');
    } finally {
      setDeletingOpportunity(null);
    }
  };

  const handleProductApproval = async (productId: string, action: 'approve' | 'reject', title: string) => {
    const actionText = action === 'approve' ? 'approve' : 'reject';
    if (!confirm(`Are you sure you want to ${actionText} the product "${title}"?`)) {
      return;
    }

    setApprovingProduct(productId);
    try {
      const response = await fetch('/api/admin/approve-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, action }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.message}`);
        // Remove from pending list and refresh
        setPendingProducts(prev => prev.filter(p => p._id !== productId));
        fetchStats(); // Refresh stats
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to ${actionText} product: ${errorData.error}`);
      }
    } catch (error) {
      alert(`Error ${actionText}ing product`);
    } finally {
      setApprovingProduct(null);
    }
  };

  const handleOpportunityApproval = async (opportunityId: string, action: 'approve' | 'reject', title: string) => {
    const actionText = action === 'approve' ? 'approve' : 'reject';
    if (!confirm(`Are you sure you want to ${actionText} the opportunity "${title}"?`)) {
      return;
    }

    setApprovingOpportunity(opportunityId);
    try {
      const response = await fetch('/api/admin/approve-opportunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId, action }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.message}`);
        // Remove from pending list and refresh
        setPendingOpportunities(prev => prev.filter(o => o._id !== opportunityId));
        fetchStats(); // Refresh stats
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to ${actionText} opportunity: ${errorData.error}`);
      }
    } catch (error) {
      alert(`Error ${actionText}ing opportunity`);
    } finally {
      setApprovingOpportunity(null);
    }
  };

  const handleMigrationApprovalStatus = async () => {
    if (!confirm('⚠️ This will approve all existing products and opportunities that don\'t have an approval status.\n\nThis should only be done once during the initial migration.\n\nAre you sure you want to continue?')) {
      return;
    }

    setMigrating(true);
    try {
      const response = await fetch('/api/admin/migrate-approval-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ Migration completed!\n\nProducts updated: ${data.results.productsUpdated}\nOpportunities updated: ${data.results.opportunitiesUpdated}`);
        fetchStats(); // Refresh stats
      } else {
        const errorData = await response.json();
        alert(`❌ Migration failed: ${errorData.error}`);
      }
    } catch (error) {
      alert('Error during migration');
    } finally {
      setMigrating(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, loading }: {
    icon: any;
    title: string;
    value: number;
    color: string;
    loading: boolean;
  }) => (
    <motion.div
      className="bg-white/90 rounded-2xl shadow-lg border-2 border-[#E0D5FA] p-6 flex items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-[#23185B]">
          {loading ? <Loader2 className="animate-spin" size={24} /> : value.toLocaleString()}
        </h3>
        <p className="text-[#7c689c] font-medium">{title}</p>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7ed] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#5B3DF6]" size={48} />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-[#faf7ed] flex items-center justify-center">
        <motion.div
          className="bg-white/90 rounded-3xl shadow-2xl border-2 border-red-200 p-8 text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-red-500 mb-4">
            <Shield size={64} className="mx-auto mb-4" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin dashboard. Only administrators can view this page.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-[#5B3DF6] text-white rounded-full font-semibold hover:bg-[#4c32d9] transition-colors"
          >
            Go to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7ed] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl font-black text-[#5B3DF6] mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Admin Dashboard
        </motion.h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats?.totalUsers || 0}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            loading={statsLoading}
          />
          <StatCard
            icon={Package}
            title="Total Listings"
            value={stats?.totalListings || 0}
            color="bg-gradient-to-r from-green-500 to-green-600"
            loading={statsLoading}
          />
          <StatCard
            icon={Briefcase}
            title="Total Opportunities"
            value={stats?.totalOpportunities || 0}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            loading={statsLoading}
          />
          <StatCard
            icon={Package}
            title="Active Listings"
            value={stats?.activeListings || 0}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
            loading={statsLoading}
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-[#5B3DF6] text-white shadow-lg'
                : 'bg-white/90 text-[#5B3DF6] border-2 border-[#E0D5FA] hover:bg-[#f7f4e8]'
            }`}
          >
            <Users className="inline mr-2" size={20} />
            User Management
          </button>
          <button
            onClick={() => {
              setActiveTab('pending-posts');
              fetchPendingPosts();
            }}
            className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center ${
              activeTab === 'pending-posts'
                ? 'bg-[#5B3DF6] text-white shadow-lg'
                : 'bg-white/90 text-[#5B3DF6] border-2 border-[#E0D5FA] hover:bg-[#f7f4e8]'
            }`}
          >
            <Clock className="inline mr-2" size={20} />
            Pending Posts
            {(pendingProducts.length + pendingOpportunities.length > 0) && (
              <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {pendingProducts.length + pendingOpportunities.length}
              </span>
            )}
          </button>
        </div>

        {/* Users Table */}
        {activeTab === 'users' && (
        <motion.div
          className="bg-white/90 rounded-3xl shadow-2xl border-2 border-[#E0D5FA] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-6 border-b border-[#E0D5FA]">
            <h2 className="text-2xl font-bold text-[#23185B] flex items-center gap-3">
              <Users className="text-[#5B3DF6]" size={28} />
              User Management ({users.length} total users)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f7f4e8]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#23185B]">User</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#23185B]">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#23185B]">College</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#23185B]">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#23185B]">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#23185B]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0D5FA]">
                {users.map((user) => (
                  <motion.tr
                    key={user._id}
                    className="hover:bg-[#f7f4e8] transition-colors cursor-pointer"
                    onClick={() => fetchUserDetails(user._id)}
                    whileHover={{ backgroundColor: '#f7f4e8' }}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-[#23185B]">{user.fullName}</div>
                        <div className="text-[#7c689c] text-sm">@{user.username}</div>
                        <div className="text-[#7c689c] text-xs">
                          {user.city}, {user.state}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#23185B]">{user.email}</td>
                    <td className="px-6 py-4 text-[#7c689c] text-sm">{user.collegeName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? <ShieldCheck size={12} /> : <Shield size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.verified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <select
                          value={user.role}
                          onChange={(e) => {
                            e.stopPropagation();
                            changeRole(user._id, e.target.value);
                          }}
                          disabled={roleChanging === user._id}
                          className="text-xs border-2 border-[#E0D5FA] rounded-lg px-2 py-1 bg-white text-[#23185B] font-medium focus:border-[#5B3DF6] focus:outline-none"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        {roleChanging === user._id && (
                          <Loader2 className="animate-spin text-[#5B3DF6]" size={16} />
                        )}
                        {user.collegeIdUrl && (
                          <a
                            href={`/api/admin/view-college-id/${user._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                            title="View College ID"
                          >
                            <GraduationCap size={16} />
                          </a>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteUser(user._id, user.fullName);
                          }}
                          disabled={deletingUser === user._id}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-all disabled:opacity-50"
                          title="Delete User"
                        >
                          {deletingUser === user._id ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        )}

        {/* Pending Posts Section */}
        {activeTab === 'pending-posts' && (
          <motion.div
            className="bg-white/90 rounded-3xl shadow-2xl border-2 border-[#E0D5FA] p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="text-[#5B3DF6]" size={28} />
                <h2 className="text-2xl font-bold text-[#23185B]">
                  Pending Posts ({pendingProducts.length} products, {pendingOpportunities.length} opportunities)
                </h2>
              </div>

              <button
                onClick={handleMigrationApprovalStatus}
                disabled={migrating}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm flex items-center gap-2 disabled:opacity-50"
                title="Migrate existing posts to approved status"
              >
                {migrating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Package size={16} />
                )}
                Migrate Legacy Posts
              </button>
            </div>

            {pendingPostsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-[#5B3DF6]" size={48} />
              </div>
            ) : (
              <div className="space-y-8">
                {/* Pending Products */}
                <div>
                  <h3 className="text-xl font-bold text-[#23185B] mb-4 flex items-center gap-2">
                    <Package size={24} />
                    Pending Products ({pendingProducts.length})
                  </h3>
                  {pendingProducts.length === 0 ? (
                    <p className="text-[#7c689c] text-center py-8">No products waiting for approval</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pendingProducts.map((product) => (
                        <motion.div
                          key={product._id}
                          className="bg-[#f7f4e8] rounded-xl p-6 border-2 border-yellow-200"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <img
                              src={product.image || product.images[0]}
                              alt={product.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-bold text-[#23185B] mb-1">{product.title}</h4>
                              <p className="text-[#5B3DF6] font-semibold">₹{product.price}</p>
                              <p className="text-[#7c689c] text-sm">{product.category}</p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail size={14} />
                              <span className="text-[#7c689c]">{product.user.fullName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <GraduationCap size={14} />
                              <span className="text-[#7c689c]">{product.college}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={14} />
                              <span className="text-[#7c689c]">{product.city}, {product.state}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              <span className="text-[#7c689c]">
                                {new Date(product.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleProductApproval(product._id, 'approve', product.title)}
                              disabled={approvingProduct === product._id}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {approvingProduct === product._id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleProductApproval(product._id, 'reject', product.title)}
                              disabled={approvingProduct === product._id}
                              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {approvingProduct === product._id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <XCircle size={16} />
                              )}
                              Reject
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pending Opportunities */}
                <div>
                  <h3 className="text-xl font-bold text-[#23185B] mb-4 flex items-center gap-2">
                    <Briefcase size={24} />
                    Pending Opportunities ({pendingOpportunities.length})
                  </h3>
                  {pendingOpportunities.length === 0 ? (
                    <p className="text-[#7c689c] text-center py-8">No opportunities waiting for approval</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pendingOpportunities.map((opportunity) => (
                        <motion.div
                          key={opportunity._id}
                          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-yellow-200"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="mb-4">
                            <h4 className="font-bold text-[#23185B] mb-2">{opportunity.title}</h4>
                            <p className="text-[#5B3DF6] font-semibold mb-1">{opportunity.company}</p>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {opportunity.type}
                            </span>
                          </div>

                          <p className="text-[#7c689c] text-sm mb-4 line-clamp-3">{opportunity.description}</p>

                          <div className="space-y-2 mb-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail size={14} />
                              <span className="text-[#7c689c]">{opportunity.user.fullName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <GraduationCap size={14} />
                              <span className="text-[#7c689c]">{opportunity.college}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={14} />
                              <span className="text-[#7c689c]">{opportunity.city}, {opportunity.state}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              <span className="text-[#7c689c]">
                                {new Date(opportunity.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {opportunity.salary && (
                              <div className="flex items-center gap-2">
                                <span className="text-[#7c689c] text-sm">Salary: {opportunity.salary}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpportunityApproval(opportunity._id, 'approve', opportunity.title)}
                              disabled={approvingOpportunity === opportunity._id}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {approvingOpportunity === opportunity._id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleOpportunityApproval(opportunity._id, 'reject', opportunity.title)}
                              disabled={approvingOpportunity === opportunity._id}
                              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {approvingOpportunity === opportunity._id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <XCircle size={16} />
                              )}
                              Reject
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {userDetailsLoading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="animate-spin text-[#5B3DF6]" size={48} />
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="p-6 border-b border-[#E0D5FA] flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-[#23185B]">User Details</h2>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-[#f7f4e8] rounded-full transition-colors"
                  >
                    <X className="text-[#7c689c]" size={24} />
                  </button>
                </div>

                <div className="p-6">
                  {/* User Info */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#23185B] mb-2">{selectedUser.user.fullName}</h3>
                        <p className="text-[#7c689c] mb-1">@{selectedUser.user.username}</p>
                        <div className="flex items-center gap-2 text-[#7c689c] mb-2">
                          <Mail size={16} />
                          <span>{selectedUser.user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#7c689c] mb-2">
                          <MapPin size={16} />
                          <span>{selectedUser.user.city}, {selectedUser.user.state}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#7c689c] mb-2">
                          <GraduationCap size={16} />
                          <span>{selectedUser.user.collegeName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#7c689c] mb-2">
                          <Calendar size={16} />
                          <span>Joined {new Date(selectedUser.user.createdAt).toLocaleDateString()}</span>
                        </div>
                        {selectedUser.user.collegeIdUrl && (
                          <div className="flex items-center gap-2 text-[#7c689c]">
                            <GraduationCap size={16} />
                            <span>College ID:</span>
                            <a
                              href={selectedUser.user.collegeIdUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#5B3DF6] hover:text-[#4c32d9] flex items-center gap-1 font-medium"
                            >
                              View College ID <ExternalLink size={14} />
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block ${
                          selectedUser.user.role === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedUser.user.role}
                        </span>
                        <br />
                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                          selectedUser.user.verified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedUser.user.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* User Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#5B3DF6]">{selectedUser.stats.totalProducts}</div>
                        <div className="text-sm text-[#7c689c]">Total Products</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedUser.stats.activeProducts}</div>
                        <div className="text-sm text-[#7c689c]">Active Products</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{selectedUser.stats.soldProducts}</div>
                        <div className="text-sm text-[#7c689c]">Sold Products</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{selectedUser.stats.totalOpportunities}</div>
                        <div className="text-sm text-[#7c689c]">Total Opportunities</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedUser.stats.activeOpportunities}</div>
                        <div className="text-sm text-[#7c689c]">Active Opportunities</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">{selectedUser.stats.inactiveOpportunities}</div>
                        <div className="text-sm text-[#7c689c]">Inactive Opportunities</div>
                      </div>
                    </div>
                  </div>

                  {/* Products and Opportunities */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Products */}
                    <div>
                      <h4 className="text-lg font-bold text-[#23185B] mb-4 flex items-center gap-2">
                        <Package size={20} />
                        Products ({selectedUser.products.length})
                      </h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {selectedUser.products.length === 0 ? (
                          <p className="text-[#7c689c] text-center py-4">No products listed</p>
                        ) : (
                          selectedUser.products.map((product) => (
                            <div key={product._id} className="bg-[#f7f4e8] rounded-lg p-3">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-semibold text-[#23185B]">{product.title}</h5>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    product.sold ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {product.sold ? 'Sold' : 'Active'}
                                  </span>
                                  <button
                                    onClick={() => deleteProduct(product._id, product.title)}
                                    disabled={deletingProduct === product._id}
                                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-all disabled:opacity-50"
                                    title="Delete Product"
                                  >
                                    {deletingProduct === product._id ? (
                                      <Loader2 className="animate-spin" size={14} />
                                    ) : (
                                      <Trash2 size={14} />
                                    )}
                                  </button>
                                </div>
                              </div>
                              <p className="text-[#5B3DF6] font-bold">₹{product.price}</p>
                              <p className="text-[#7c689c] text-sm">{product.category}</p>
                              <p className="text-[#7c689c] text-xs">
                                {new Date(product.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Opportunities */}
                    <div>
                      <h4 className="text-lg font-bold text-[#23185B] mb-4 flex items-center gap-2">
                        <Briefcase size={20} />
                        Opportunities ({selectedUser.opportunities.length})
                      </h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {selectedUser.opportunities.length === 0 ? (
                          <p className="text-[#7c689c] text-center py-4">No opportunities posted</p>
                        ) : (
                          selectedUser.opportunities.map((opportunity) => (
                            <div key={opportunity._id} className="bg-[#f7f4e8] rounded-lg p-3">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-semibold text-[#23185B]">{opportunity.title}</h5>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    opportunity.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {opportunity.active ? 'Active' : 'Inactive'}
                                  </span>
                                  <button
                                    onClick={() => deleteOpportunity(opportunity._id, opportunity.title)}
                                    disabled={deletingOpportunity === opportunity._id}
                                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-all disabled:opacity-50"
                                    title="Delete Opportunity"
                                  >
                                    {deletingOpportunity === opportunity._id ? (
                                      <Loader2 className="animate-spin" size={14} />
                                    ) : (
                                      <Trash2 size={14} />
                                    )}
                                  </button>
                                </div>
                              </div>
                              <p className="text-[#5B3DF6] font-medium">{opportunity.company}</p>
                              <p className="text-[#7c689c] text-sm">{opportunity.type}</p>
                              <p className="text-[#7c689c] text-xs">
                                {new Date(opportunity.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}