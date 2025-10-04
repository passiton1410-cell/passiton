'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, Briefcase, X, Eye, Calendar, MapPin, Phone, Mail, GraduationCap, Loader2, ShieldCheck, Shield, Trash2, Filter, Search, ExternalLink } from 'lucide-react';

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

  // Filter states
  const [filters, setFilters] = useState({
    colleges: [] as string[],
    states: [] as string[],
    cities: [] as string[]
  });
  const [selectedFilters, setSelectedFilters] = useState({
    college: 'all',
    state: 'all',
    city: 'all',
    search: ''
  });

  // Delete states
  const [deletingUser, setDeletingUser] = useState<string | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null);
  const [deletingOpportunity, setDeletingOpportunity] = useState<string | null>(null);

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
      } catch (error) {
        console.error('Error checking admin access:', error);
        setAccessDenied(true);
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, []);

  // Refetch users when filters change
  useEffect(() => {
    if (!loading && !accessDenied) {
      fetchUsers();
    }
  }, [selectedFilters]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedFilters.college !== 'all') params.append('college', selectedFilters.college);
      if (selectedFilters.state !== 'all') params.append('state', selectedFilters.state);
      if (selectedFilters.city !== 'all') params.append('city', selectedFilters.city);
      if (selectedFilters.search) params.append('search', selectedFilters.search);

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await response.json();
      setUsers(data.users || []);
      setFilters(data.filters || { colleges: [], states: [], cities: [] });
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

        {/* Filters */}
        <motion.div
          className="bg-white/90 rounded-3xl shadow-2xl border-2 border-[#E0D5FA] p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-[#5B3DF6]" size={24} />
            <h3 className="text-xl font-bold text-[#23185B]">Filter Users</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7c689c]" size={16} />
              <input
                type="text"
                placeholder="Search users..."
                value={selectedFilters.search}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border-2 border-[#E0D5FA] rounded-lg focus:border-[#5B3DF6] focus:outline-none text-[#23185B]"
              />
            </div>

            {/* College Filter */}
            <select
              value={selectedFilters.college}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, college: e.target.value }))}
              className="px-4 py-2 border-2 border-[#E0D5FA] rounded-lg focus:border-[#5B3DF6] focus:outline-none text-[#23185B] bg-white"
            >
              <option value="all">All Colleges</option>
              {filters.colleges.map(college => (
                <option key={college} value={college}>{college}</option>
              ))}
            </select>

            {/* State Filter */}
            <select
              value={selectedFilters.state}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, state: e.target.value }))}
              className="px-4 py-2 border-2 border-[#E0D5FA] rounded-lg focus:border-[#5B3DF6] focus:outline-none text-[#23185B] bg-white"
            >
              <option value="all">All States</option>
              {filters.states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            {/* City Filter */}
            <select
              value={selectedFilters.city}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, city: e.target.value }))}
              className="px-4 py-2 border-2 border-[#E0D5FA] rounded-lg focus:border-[#5B3DF6] focus:outline-none text-[#23185B] bg-white"
            >
              <option value="all">All Cities</option>
              {filters.cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setSelectedFilters({ college: 'all', state: 'all', city: 'all', search: '' })}
              className="px-4 py-2 text-[#7c689c] hover:text-[#5B3DF6] transition-colors font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          className="bg-white/90 rounded-3xl shadow-2xl border-2 border-[#E0D5FA] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-6 border-b border-[#E0D5FA]">
            <h2 className="text-2xl font-bold text-[#23185B] flex items-center gap-3">
              <Users className="text-[#5B3DF6]" size={28} />
              User Management ({users.length} users)
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