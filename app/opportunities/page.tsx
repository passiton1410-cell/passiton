'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Clock, Users, Briefcase, Filter, Plus } from 'lucide-react';

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

export default function OpportunitiesPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('/api/opportunities');
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data.opportunities || []);
      }
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || opportunity.type === selectedType;
    const matchesLocation = selectedLocation === 'all' || opportunity.location === selectedLocation;

    return matchesSearch && matchesType && matchesLocation && opportunity.active;
  });

  const opportunityTypes = ['all', 'jobs', 'internship', 'teaching', 'coaching', 'mentorship', 'other'];
  const locationTypes = ['all', 'remote', 'hybrid', 'on-site'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Career Opportunities</h1>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100">
            Discover jobs, internships, and mentorship opportunities from your college community
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-xl border-2 border-[#E0D5FA] p-6 sm:p-8 mb-6 sm:mb-8 backdrop-blur-sm">
          {/* Filter Header */}
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E0D5FA]">
            <Filter className="h-5 w-5 text-[#5B3DF6]" />
            <h2 className="text-lg font-bold text-[#23185B]">Search & Filter Opportunities</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-sm font-bold text-[#23185B] mb-2">Search Opportunities</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-[#5B3DF6] pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by title, company, or description..."
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-[#E0D5FA] rounded-xl focus:ring-2 focus:ring-[#5B3DF6] focus:border-[#5B3DF6] text-sm sm:text-base bg-white text-[#23185B] hover:bg-gray-50 transition-colors shadow-sm font-medium placeholder:text-[#a78bfa]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#23185B] mb-2">Opportunity Type</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5B3DF6] pointer-events-none" />
                <select
                  className="w-full pl-10 pr-4 py-3 sm:py-4 border-2 border-[#E0D5FA] rounded-xl focus:ring-2 focus:ring-[#5B3DF6] focus:border-[#5B3DF6] text-sm sm:text-base bg-white text-[#23185B] hover:bg-gray-50 transition-colors shadow-sm appearance-none cursor-pointer font-medium"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {opportunityTypes.map(type => (
                    <option key={type} value={type} className="text-[#23185B]">
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#23185B] mb-2">Work Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5B3DF6] pointer-events-none" />
                <select
                  className="w-full pl-10 pr-4 py-3 sm:py-4 border-2 border-[#E0D5FA] rounded-xl focus:ring-2 focus:ring-[#5B3DF6] focus:border-[#5B3DF6] text-sm sm:text-base bg-white text-[#23185B] hover:bg-gray-50 transition-colors shadow-sm appearance-none cursor-pointer font-medium"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {locationTypes.map(location => (
                    <option key={location} value={location} className="text-[#23185B]">
                      {location === 'all' ? 'All Locations' : location.charAt(0).toUpperCase() + location.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <p className="text-sm sm:text-base font-medium text-gray-800">
              Showing <span className="text-blue-600 font-bold">{filteredOpportunities.length}</span> opportunities
              {searchTerm && (
                <span className="text-gray-600"> for "<span className="font-semibold">{searchTerm}</span>"</span>
              )}
            </p>
          </div>
        </div>

        {/* Opportunities Grid */}
        {filteredOpportunities.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-md mx-2 sm:mx-0">
            <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-sm sm:text-base text-gray-600 px-4">Try adjusting your search filters or check back later for new opportunities.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {filteredOpportunities.map((opportunity) => (
              <div key={opportunity._id} className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow mx-2 sm:mx-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3 sm:gap-0">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{opportunity.title}</h3>
                    <p className="text-blue-600 font-medium text-sm sm:text-base">{opportunity.company}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium self-start">
                    {opportunity.type}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed">{opportunity.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{opportunity.location} • {opportunity.city}, {opportunity.state}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{opportunity.college}</span>
                  </div>
                  {opportunity.deadline && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                      <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  {opportunity.salary && (
                    <div className="flex items-center">
                      <span className="font-medium">Salary: {opportunity.salary}</span>
                    </div>
                  )}
                </div>

                {opportunity.requirements && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Requirements:</h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{opportunity.requirements}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-200 gap-3 sm:gap-0">
                  <div className="text-xs sm:text-sm text-gray-500">
                    Posted {new Date(opportunity.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <a
                      href={`mailto:${opportunity.email}`}
                      className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium text-center"
                    >
                      Contact via Email
                    </a>
                    <a
                      href={`tel:${opportunity.phone}`}
                      className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm font-medium text-center"
                    >
                      Call
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <button
          onClick={() => {
            // Navigate to add opportunity page
            router.push('/post-opportunity');
          }}
          className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95"
          aria-label="Add new opportunity"
        >
          <Plus
            size={24}
            className="transition-transform duration-300 group-hover:rotate-90"
          />

          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-active:opacity-30 transition-opacity duration-200"></div>

          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 animate-ping"></div>
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Add Opportunity
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>
    </div>
  );
}