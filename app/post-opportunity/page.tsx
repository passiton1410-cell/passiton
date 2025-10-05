'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Building,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Users,
  Target,
  Loader2,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { getStates, getCitiesForState } from '@/lib/indian-states-cities';
import CollegeAutocomplete from '@/components/CollegeAutocomplete';

export default function PostOpportunityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'jobs',
    company: '',
    location: 'on-site',
    city: '',
    state: '',
    college: '',
    email: '',
    phone: '',
    requirements: '',
    deadline: '',
    salary: '',
    duration: ''
  });

  // Get user info on load
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();

        if (data.loggedIn && data.user) {
          setFormData(prev => ({
            ...prev,
            email: data.user.email,
            city: data.user.city || '',
            state: data.user.state || '',
            college: data.user.collegeName || ''
          }));
        } else {
          // User not logged in, redirect to login
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        router.push('/auth/login');
      }
    };

    getUserInfo();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStateChange = (state: string) => {
    setFormData(prev => ({
      ...prev,
      state,
      city: '' // Reset city when state changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    // Validation
    if (!formData.title || !formData.description || !formData.company || !formData.email) {
      setStatus('❌ Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('✅ Opportunity posted successfully!');
        setTimeout(() => {
          router.push('/opportunities');
        }, 2000);
      } else {
        setStatus(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error('Error posting opportunity:', error);
      setStatus('❌ Failed to post opportunity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const opportunityTypes = [
    { value: 'jobs', label: 'Job', icon: <Briefcase size={16} /> },
    { value: 'internship', label: 'Internship', icon: <Users size={16} /> },
    { value: 'teaching', label: 'Teaching', icon: <Users size={16} /> },
    { value: 'coaching', label: 'Coaching', icon: <Target size={16} /> },
    { value: 'mentorship', label: 'Mentorship', icon: <Users size={16} /> },
    { value: 'other', label: 'Other', icon: <Briefcase size={16} /> }
  ];

  const locationTypes = [
    { value: 'remote', label: 'Remote' },
    { value: 'on-site', label: 'On-site' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const states = getStates();
  const cities = formData.state ? getCitiesForState(formData.state) : [];

  return (
    <div className="min-h-screen bg-[#faf7ed] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => router.push('/opportunities')}
            className="inline-flex items-center gap-2 text-[#5B3DF6] hover:text-[#4c32d9] mb-4 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Opportunities
          </button>
          <h1 className="text-4xl font-black text-[#5B3DF6] mb-4">
            Post New Opportunity
          </h1>
          <p className="text-[#7c689c] text-lg max-w-2xl mx-auto">
            Share job openings, internships, or mentorship opportunities with your college community
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="bg-white/90 rounded-3xl shadow-2xl border-2 border-[#E0D5FA] p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#23185B] mb-2">
                  Opportunity Title *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Frontend Developer Internship"
                    required
                    className="w-full px-4 py-3 pl-10 border-2 border-[#E0D5FA] rounded-xl focus:border-[#5B3DF6] focus:outline-none text-[#23185B] font-medium"
                  />
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7c689c]" size={18} />
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-bold text-[#23185B] mb-2">
                  Opportunity Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-[#E0D5FA] rounded-xl focus:border-[#5B3DF6] focus:outline-none text-[#23185B] font-medium"
                >
                  {opportunityTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-bold text-[#23185B] mb-2">
                  Company/Organization *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g., TechCorp Inc."
                    required
                    className="w-full px-4 py-3 pl-10 border-2 border-[#E0D5FA] rounded-xl focus:border-[#5B3DF6] focus:outline-none text-[#23185B] font-medium"
                  />
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7c689c]" size={18} />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-[#23185B] mb-2">
                Description *
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the opportunity, responsibilities, and what you're looking for..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 pl-10 border-2 border-[#E0D5FA] rounded-xl focus:border-[#5B3DF6] focus:outline-none text-[#23185B] font-medium resize-none"
                />
                <FileText className="absolute left-3 top-4 text-[#7c689c]" size={18} />
              </div>
            </div>

            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Work Type */}
              <div>
                <label className="block text-sm font-bold text-[#23185B] mb-2">
                  Work Type
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-[#E0D5FA] rounded-xl focus:border-[#5B3DF6] focus:outline-none text-[#23185B] font-medium"
                >
                  {locationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-bold text-[#23185B] mb-2">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#E0D5FA] rounded-xl focus:border-[#5B3DF6] focus:outline-none text-[#23185B] font-medium"
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-bold text-[#23185B] mb-2">
                  City
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!formData.state}
                  className="w-full px-4 py-3 border-2 border-[#E0D5FA] rounded-xl focus:border-[#5B3DF6] focus:outline-none text-[#23185B] font-medium disabled:opacity-50"
                >
                  <option value="">Select City</option>
                  {cities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-[#23185B] mb-2">
                  Contact Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                    className="w-full px-4 py-3 pl-10 border-2 border-[#E0D5FA] rounded-xl focus:border-[#5B3DF6] focus:outline-none text-[#23185B] font-medium"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7c689c]" size={18} />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-[#23185B] mb-2">
                  Contact Phone
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 pl-10 border-2 border-[#E0D5FA] rounded-xl focus:border-[#5B3DF6] focus:outline-none text-[#23185B] font-medium"
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7c689c]" size={18} />
                </div>
              </div>
            </div>

            {/* Optional Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Salary */}
              <div>
                <label className="block text-sm font-bold text-[#23185B] mb-2">
                  Salary/Stipend
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., ₹30,000/month"
                    className="w-full px-4 py-3 pl-10 border-2 border-[#E0D5FA] rounded-xl focus:border-[#5B3DF6] focus:outline-none text-[#23185B] font-medium"
                  />
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7c689c]" size={18} />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-bold text-[#23185B] mb-2">
                  Duration
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 3 months"
                    className="w-full px-4 py-3 pl-10 border-2 border-[#E0D5FA] rounded-xl focus:border-[#5B3DF6] focus:outline-none text-[#23185B] font-medium"
                  />
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7c689c]" size={18} />
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-bold text-[#23185B] mb-2">
                  Application Deadline
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-10 border-2 border-[#E0D5FA] rounded-xl focus:border-[#5B3DF6] focus:outline-none text-[#23185B] font-medium"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7c689c]" size={18} />
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-bold text-[#23185B] mb-2">
                Requirements & Qualifications
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="List the required skills, qualifications, or experience..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-[#E0D5FA] rounded-xl focus:border-[#5B3DF6] focus:outline-none text-[#23185B] font-medium resize-none"
              />
            </div>

            {/* College */}
            <div>
              <label className="block text-sm font-bold text-[#23185B] mb-2">
                College/University
              </label>
              <CollegeAutocomplete
                value={formData.college}
                onChange={(value) => setFormData(prev => ({ ...prev, college: value }))}
                placeholder="Select or add your college"
                className="w-full"
              />
            </div>

            {/* Status Message */}
            {status && (
              <motion.div
                className={`p-4 rounded-xl text-center font-medium ${
                  status.startsWith('✅')
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {status}
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <motion.button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-[#5B3DF6] to-[#6C4AB6] text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-60 flex items-center gap-3"
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Posting Opportunity...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Post Opportunity
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}