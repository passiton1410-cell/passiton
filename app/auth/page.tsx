'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  MailCheck,
  LockKeyhole,
  KeyRound,
  UserRound,
  UserCircle,
  Loader2,
  MapPin,
  GraduationCap,
  Eye,
  EyeOff,
  Phone,
} from 'lucide-react';
import { getStates, getCitiesForState } from '@/lib/indian-states-cities';

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [collegeIdUrl, setCollegeIdUrl] = useState('');
  const [uploadingId, setUploadingId] = useState(false);
  const [tncChecked, setTncChecked] = useState(false);
  const [showTnc, setShowTnc] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [course, setCourse] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [collegeSuggestions, setCollegeSuggestions] = useState<string[]>([]);
  const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);
  const [collegeSearchLoading, setCollegeSearchLoading] = useState(false);
  const [showAddCollegeOption, setShowAddCollegeOption] = useState(false);
  const [addingCollege, setAddingCollege] = useState(false);
  const [personalEmail, setPersonalEmail] = useState('');
  const [personalId, setPersonalId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const collegeContainerRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside college suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        collegeContainerRef.current &&
        !collegeContainerRef.current.contains(event.target as Node)
      ) {
        setShowCollegeSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle state change and reset city
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity(''); // Reset city when state changes
  };

  // Handle college name input and search
  const handleCollegeNameChange = async (value: string) => {
    setCollegeName(value);
    setShowAddCollegeOption(false);

    if (value.length >= 2) {
      setCollegeSearchLoading(true);
      try {
        const response = await fetch(`/api/colleges/search?q=${encodeURIComponent(value)}`);
        const data = await response.json();

        if (data.colleges && data.colleges.length > 0) {
          setCollegeSuggestions(data.colleges);
          setShowCollegeSuggestions(true);
          setShowAddCollegeOption(false);
        } else {
          setCollegeSuggestions([]);
          setShowCollegeSuggestions(false);
          setShowAddCollegeOption(value.length >= 3); // Show "Add college" option if no results and name is long enough
        }
      } catch (error) {
        console.error('Error searching colleges:', error);
        setCollegeSuggestions([]);
        setShowCollegeSuggestions(false);
        setShowAddCollegeOption(value.length >= 3);
      } finally {
        setCollegeSearchLoading(false);
      }
    } else {
      setCollegeSuggestions([]);
      setShowCollegeSuggestions(false);
      setShowAddCollegeOption(false);
    }
  };

  // Handle college suggestion selection
  const handleCollegeSuggestionClick = (college: string) => {
    setCollegeName(college);
    setCollegeSuggestions([]);
    setShowCollegeSuggestions(false);
    setShowAddCollegeOption(false);
  };

  // Handle adding a new college
  const handleAddNewCollege = async () => {
    if (!collegeName.trim() || collegeName.trim().length < 3) {
      setStatus('❌ College name must be at least 3 characters long');
      return;
    }

    setAddingCollege(true);
    setStatus('Adding your college to our database...');

    try {
      const response = await fetch('/api/colleges/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeName: collegeName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.existed) {
          setStatus('✅ College found and selected!');
          setCollegeName(data.collegeName);
        } else {
          setStatus('✅ College added successfully! Other users can now find it too.');
        }
        setShowAddCollegeOption(false);
        setShowCollegeSuggestions(false);
      } else {
        setStatus(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding college:', error);
      setStatus('❌ Failed to add college. Please try again.');
    } finally {
      setAddingCollege(false);
    }
  };

  // Handlers
  const handleSendOtp = async () => {
    setLoading(true);
    setStatus('');
    setUserExists(false);

    if (!email || !password || !fullName || !username || !mobileNumber || !collegeIdUrl || !selectedState || !selectedCity || !collegeName || !course || !department || !semester || !year) {
      setStatus('❌ All fields including mobile number and academic information are required.');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email, username }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (res.ok) {
      setStatus('✅ OTP sent to your email');
      setStep('verify');
    } else {
      setStatus(`❌ ${data.error}`);
      if (data.userExists) {
        setUserExists(true);
        setTimeout(() => router.push('/auth/login'), 2000);
      }
    }

    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setStatus('');

    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        otp,
        fullName,
        username,
        mobileNumber,
        collegeIdUrl,
        state: selectedState,
        city: selectedCity,
        collegeName: collegeName,
        personalEmail: personalEmail.trim() || undefined,
        personalId: personalId.trim() || undefined,
        pincode: pincode.trim() || undefined,
        course: course.trim(),
        department: department.trim(),
        semester: semester,
        year: year,
        termsAccepted: tncChecked,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (res.ok) {
      setStatus('✅ Verified! Redirecting...');

      // Check user role after successful verification
      setTimeout(async () => {
        try {
          const userRes = await fetch('/api/auth/me');
          const userData = await userRes.json();

          if (userData.loggedIn && userData.user) {
            // Check if user has accepted terms
            if (!userData.user.termsAccepted) {
              window.location.href = "/accept-terms";
            } else if (userData.user.role === 'admin') {
              window.location.href = "/admin";
            } else {
              window.location.href = "/";
            }
          } else {
            window.location.href = "/accept-terms";
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          window.location.href = "/accept-terms";
        }
      }, 1000);
    } else {
      setStatus(`❌ ${data.error}`);
    }

    setLoading(false);
  };

  const handleCollegeIdUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingId(true);
    setStatus('Uploading College ID...');

    const form = new FormData();
    form.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: form,
    });

    const data = await res.json();
    if (res.ok) {
      setCollegeIdUrl(data.secure_url);
      setStatus('✅ College ID uploaded');
    } else {
      setStatus('❌ Failed to upload ID');
    }

    setUploadingId(false);
  };

  // Main Return
  return (
    <div className="min-h-screen flex items-center justify-center px-2 sm:px-6 py-10 bg-gradient-to-br from-[#faf7ed] via-[#E0D5FA] to-[#ffe9fa]">
      {/* SIGNUP CARD */}
      <motion.div
        className="relative w-full max-w-lg bg-white/95 border border-[#6C4AB6]/10 rounded-3xl shadow-xl p-6 sm:p-10 flex flex-col items-center overflow-y-auto max-h-[90vh] pb-8"
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55 }}
      >
        {/* Logo and Heading */}
        <div className="mb-8 flex flex-col items-center">
          <span className="inline-block rounded-full shadow-lg border-4 border-white">
            <Image
              src="/logo3.jpeg"
              alt="Site Logo"
              width={110}
              height={110}
              className="rounded-full"
            />
          </span>
          <h2 className="text-3xl font-extrabold text-[#5B3DF6] mt-5 tracking-wide text-center flex gap-3 items-center">
            {step === 'signup' ? (
              <>
                <MailCheck size={25} />
                Sign Up for Student Access
              </>
            ) : (
              <>
                <KeyRound size={25} className="text-[#22C55E]" />
                Enter OTP
              </>
            )}
          </h2>
        </div>

        {/* FORM FIELDS */}
        {step === 'signup' && (
          <>
            {/* Two-column (above sm) Full Name/Username */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Full Name */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-blue-300 focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition pr-10"
                />
                <UserRound size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400" />
              </div>
              {/* Username */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-blue-300 focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition pr-10"
                />
                <UserCircle size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-fuchsia-500" />
              </div>
            </div>

            {/* State, City, and Pincode Fields */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* State Dropdown */}
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-blue-300 focus:outline-none text-base shadow font-semibold transition pr-10 appearance-none cursor-pointer"
                  style={{ color: selectedState ? '#23185B' : '#a78bfa' }}
                >
                  <option value="" disabled>Select State</option>
                  {getStates().map((state) => (
                    <option key={state} value={state} className="text-[#23185B]">
                      {state}
                    </option>
                  ))}
                </select>
                <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none" />
              </div>

              {/* City Dropdown */}
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState}
                  className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-blue-300 focus:outline-none text-base shadow font-semibold transition pr-10 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: selectedCity ? '#23185B' : '#a78bfa' }}
                >
                  <option value="" disabled>
                    {selectedState ? 'Select City' : 'Select State First'}
                  </option>
                  {selectedState && getCitiesForState(selectedState).map((city) => (
                    <option key={city} value={city} className="text-[#23185B]">
                      {city}
                    </option>
                  ))}
                </select>
                <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none" />
              </div>
            </div>

            {/* Pincode Field */}
            <div className="w-full mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pincode (optional)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-purple-300 focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition pr-10"
                />
                <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none" />
              </div>
            </div>

            {/* College Autocomplete */}
            <div ref={collegeContainerRef} className="w-full mb-4 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="College/University Name"
                  value={collegeName}
                  onChange={(e) => handleCollegeNameChange(e.target.value)}
                  onFocus={() => {
                    if (collegeSuggestions.length > 0) {
                      setShowCollegeSuggestions(true);
                    }
                  }}
                  className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-blue-300 focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition pr-10"
                />
                {collegeSearchLoading ? (
                  <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 animate-spin" />
                ) : (
                  <GraduationCap size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none" />
                )}
              </div>

              {/* College Suggestions Dropdown */}
              {showCollegeSuggestions && collegeSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-2xl z-50 max-h-60 overflow-y-auto mt-2 border-2 border-[#E0D5FA]"
                >
                  {collegeSuggestions.map((college, index) => (
                    <div
                      key={index}
                      className="px-5 py-3 hover:bg-[#E0D5FA] cursor-pointer transition-colors text-[#23185B] font-medium border-b border-gray-100 last:border-b-0"
                      onClick={() => handleCollegeSuggestionClick(college)}
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap size={16} className="text-[#5B3DF6]" />
                        <span className="text-sm">{college}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Add College Option */}
              {showAddCollegeOption && collegeName.trim().length >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-2xl z-50 mt-2 border-2 border-[#E0D5FA]"
                >
                  <div className="p-4">
                    <p className="text-sm text-[#7c689c] mb-3 text-center">
                      Can't find your college? You can add it to our database!
                    </p>
                    <button
                      onClick={handleAddNewCollege}
                      disabled={addingCollege}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {addingCollege ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Adding College...
                        </>
                      ) : (
                        <>
                          <GraduationCap size={16} />
                          Add "{collegeName.trim()}" to Database
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Email, Password, and Mobile Number */}
            <div className="w-full flex flex-col gap-4 mb-4">
              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your student email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-[#5B3DF6] focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition pr-10"
                />
                <MailCheck size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8e79df]" />
              </div>
              {/* Mobile Number */}
              <div className="relative">
                <input
                  type="tel"
                  placeholder="Mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  autoComplete="tel"
                  className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-blue-300 focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition pr-10"
                />
                <Phone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400" />
              </div>
              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Set a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-pink-300 focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <LockKeyhole size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400" />
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="w-full mb-4">
              <p className="text-sm text-[#7c689c] mb-3 text-center font-medium">
                Academic Information (Required)
              </p>
              {/* Course and Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Course/Program (e.g., B.Tech)"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-indigo-300 focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition pr-10"
                  />
                  <GraduationCap size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Department (e.g., Computer Science)"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-teal-300 focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition pr-10"
                  />
                  <UserRound size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500" />
                </div>
              </div>
              {/* Year and Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-rose-300 focus:outline-none text-base shadow font-semibold transition pr-10 appearance-none cursor-pointer"
                    style={{ color: year ? '#23185B' : '#a78bfa' }}
                  >
                    <option value="" disabled>Select Year</option>
                    <option value="1" className="text-[#23185B]">1st Year</option>
                    <option value="2" className="text-[#23185B]">2nd Year</option>
                    <option value="3" className="text-[#23185B]">3rd Year</option>
                    <option value="4" className="text-[#23185B]">4th Year</option>
                    <option value="5" className="text-[#23185B]">5th Year</option>
                    <option value="graduate" className="text-[#23185B]">Graduate</option>
                    <option value="postgraduate" className="text-[#23185B]">Post Graduate</option>
                  </select>
                  <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-emerald-300 focus:outline-none text-base shadow font-semibold transition pr-10 appearance-none cursor-pointer"
                    style={{ color: semester ? '#23185B' : '#a78bfa' }}
                  >
                    <option value="" disabled>Select Semester</option>
                    <option value="1" className="text-[#23185B]">1st Semester</option>
                    <option value="2" className="text-[#23185B]">2nd Semester</option>
                    <option value="3" className="text-[#23185B]">3rd Semester</option>
                    <option value="4" className="text-[#23185B]">4th Semester</option>
                    <option value="5" className="text-[#23185B]">5th Semester</option>
                    <option value="6" className="text-[#23185B]">6th Semester</option>
                    <option value="7" className="text-[#23185B]">7th Semester</option>
                    <option value="8" className="text-[#23185B]">8th Semester</option>
                    <option value="other" className="text-[#23185B]">Other</option>
                  </select>
                  <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Optional Fields Section */}
            <div className="w-full mb-4">
              <p className="text-sm text-[#7c689c] mb-3 text-center font-medium">
                Optional Information (can be added later)
              </p>
              <div className="flex flex-col gap-4">
                {/* Personal Email */}
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Personal email (optional)"
                    value={personalEmail}
                    onChange={(e) => setPersonalEmail(e.target.value)}
                    className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-blue-300 focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition pr-10"
                  />
                  <MailCheck size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400" />
                </div>
                {/* Personal ID */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Personal ID (Aadhar/Passport/etc.) - optional"
                    value={personalId}
                    onChange={(e) => setPersonalId(e.target.value)}
                    className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-purple-300 focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition pr-10"
                  />
                  <UserRound size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400" />
                </div>
              </div>
            </div>
            {/* College ID Upload */}
            <div className="w-full mb-4 flex flex-col">
              <label className="font-semibold text-[#5B3DF6] mb-2">
                Upload College ID Card <span className="font-normal text-gray-400">(Required)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCollegeIdUpload}
                disabled={uploadingId}
                className="w-full px-5 py-2 bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] rounded-full shadow file:font-bold file:px-4 file:py-2 cursor-pointer"
              />
              {collegeIdUrl && (
                <img
                  src={collegeIdUrl}
                  alt="College ID"
                  className="mt-3 h-28 object-contain rounded-xl border border-[#ddd] shadow-sm"
                />
              )}
            </div>
          </>
        )}
        {/* OTP Input */}
        {step === 'verify' && (
          <div className="w-full mb-3 relative">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-[#22C55E] focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition pr-10"
            />
            <KeyRound size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#22C55E]" />
          </div>
        )}

        {/* Info about T&C */}
        {step === 'signup' && (
          <div className="w-full mb-5 text-center">
            <p className="text-sm text-[#7c689c]">
              By creating an account, you agree to accept our{" "}
              <span
                className="underline cursor-pointer hover:text-[#6C4AB6] font-semibold text-[#5B3DF6]"
                onClick={() => setShowTnc(true)}
              >
                Terms & Conditions
              </span>{" "}
              after registration
            </p>
          </div>
        )}

        {/* ACTION BUTTON */}
        <motion.button
          onClick={step === 'signup' ? handleSendOtp : handleVerifyOtp}
          disabled={loading || uploadingId}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-4 mt-1 rounded-full font-bold tracking-wide text-lg transition-all shadow-lg flex items-center justify-center gap-2
            ${
              step === 'signup'
                ? 'bg-gradient-to-r from-[#5B3DF6] to-[#6C4AB6] text-white hover:from-[#6C4AB6]'
                : 'bg-[#22C55E] hover:bg-[#16a34a] text-white'
            }
            disabled:opacity-60
          `}
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {step === 'signup' ? 'Send OTP' : 'Verify & Sign Up'}
        </motion.button>

        {/* STATUS */}
        {status && (
          <motion.p
            className={`mt-6 mb-1 text-center text-base font-semibold ${
              status.startsWith('✅')
                ? 'text-green-500'
                : status.startsWith('❌')
                ? 'text-pink-500'
                : 'text-[#a78bfa]'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {status}
          </motion.p>
        )}

        {/* Already Registered Link */}
        <p
          className="mt-6 text-sm text-[#5B3DF6] hover:underline font-medium cursor-pointer"
          onClick={() => router.push('/auth/login')}
        >
          Already have an account? <span className="underline">Login</span>
        </p>
        {userExists && (
          <p
            onClick={() => router.push('/auth/login')}
            className="mt-2 text-sm text-blue-500 underline text-center cursor-pointer font-bold"
          >
            Already registered? Login Here →
          </p>
        )}
      </motion.div>

      {/* MODAL for T&C */}
      {showTnc && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-3"
          onClick={() => setShowTnc(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] p-8 relative border border-[#E0D5FA] overflow-hidden"
            style={{ minWidth: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-2xl font-semibold text-[#5B3DF6] mb-3">
              Terms &amp; Conditions
            </h3>
            <div className="overflow-y-auto text-xs text-[#23185B] max-h-[65vh] pr-2 space-y-3">
              <div className="text-center mb-4">
                <h4 className="font-bold text-sm text-[#5B3DF6]">PassitOn: Comprehensive Terms and Conditions</h4>
                <p className="text-xs text-gray-600 mt-1">Please read carefully before accepting</p>
              </div>

              <div>
                <p><strong>1. Definitions and General Scope</strong></p>
                <ul className="list-disc ml-4 mt-1 space-y-1 text-xs">
                  <li><strong>Platform:</strong> PassitOn is an online marketplace connecting verified students for buying, selling, and exchanging goods and services within educational campuses.</li>
                  <li><strong>Users:</strong> Includes both buyers and sellers, who must be currently affiliated with a recognized institution.</li>
                  <li><strong>Agreement:</strong> By registering, accessing, or interacting with PassitOn, users consent to all terms, privacy, and policies outlined below. These terms may be updated at any time; continued use implies acceptance of updates.</li>
                </ul>
              </div>

              <div>
                <p><strong>2. User Eligibility, Registration & Account Security</strong></p>
                <ul className="list-disc ml-4 mt-1 space-y-1 text-xs">
                  <li>Users must be students of recognised and registered educational institutions. Proof may be required during signup/registration or at any time.</li>
                  <li>Users must be 18 years or older. Students below 18 require guardian consent.</li>
                  <li>Registration: Accurate personal information, including valid institutional email and, where required, student ID must be provided.</li>
                  <li>Account Responsibility: Users are responsible for safeguarding their credentials. Any misuse, unauthorized access, or suspicious activity must be reported immediately to PassitOn.</li>
                </ul>
              </div>

              <div>
                <p><strong>3. Prohibited Items and Conduct</strong></p>
                <p className="text-xs mt-1 font-medium">Users must NOT list, trade, or promote any of the following:</p>
                <div className="ml-2 mt-2 space-y-2">
                  <div>
                    <p className="font-medium text-xs">• Illegal/Narcotic Substances:</p>
                    <p className="text-xs ml-2">Drugs, illegal alcohol, tobacco products, e-cigarettes, vapes, electronic nicotine delivery systems</p>
                  </div>
                  <div>
                    <p className="font-medium text-xs">• Weapons and Explosives:</p>
                    <p className="text-xs ml-2">Firearms, ammunition, knives, explosives, fireworks</p>
                  </div>
                  <div>
                    <p className="font-medium text-xs">• Pornographic/Offensive Material:</p>
                    <p className="text-xs ml-2">Adult content, hate speech, defamatory materials</p>
                  </div>
                  <div>
                    <p className="font-medium text-xs">• Counterfeit/Pirated Goods:</p>
                    <p className="text-xs ml-2">Fake branded products, pirated software, unauthorized replicas</p>
                  </div>
                  <div>
                    <p className="font-medium text-xs">• Medical Items:</p>
                    <p className="text-xs ml-2">Prescription medicines, controlled substances, medical equipment without certification</p>
                  </div>
                  <div>
                    <p className="font-medium text-xs">• Political/Religious Activities:</p>
                    <p className="text-xs ml-2">Political campaigning, religious preaching, discriminatory content</p>
                  </div>
                </div>
              </div>

              <div>
                <p><strong>4. Platform Fees and Payments</strong></p>
                <ul className="list-disc ml-4 mt-1 space-y-1 text-xs">
                  <li>Basic Usage: PassitOn does not charge fees for standard listing or buying</li>
                  <li>Transaction Handling: The platform does not process payments. Transactions are strictly between buyer and seller</li>
                </ul>
              </div>

              <div>
                <p><strong>5. Shipping and Delivery</strong></p>
                <ul className="list-disc ml-4 mt-1 space-y-1 text-xs">
                  <li>PassitOn does not provide delivery or logistics services</li>
                  <li>All arrangements for exchange are solely between buyer and seller</li>
                  <li>Campus exchanges are strongly recommended for safety</li>
                </ul>
              </div>

              <div>
                <p><strong>6. Returns and Refunds</strong></p>
                <ul className="list-disc ml-4 mt-1 space-y-1 text-xs">
                  <li>Returns and refunds must be settled directly between users</li>
                  <li>All promotional purchases are final and non-refundable</li>
                </ul>
              </div>

              <div>
                <p><strong>7. Dispute Resolution</strong></p>
                <ul className="list-disc ml-4 mt-1 space-y-1 text-xs">
                  <li>Issues must be reported within 7 days via email to hi@passiton.cash</li>
                  <li>PassitOn may assist informally but is not an arbitrator</li>
                </ul>
              </div>

              <div>
                <p><strong>8. Privacy and Data Protection</strong></p>
                <ul className="list-disc ml-4 mt-1 space-y-1 text-xs">
                  <li>Minimal data collected for operations - never sold to third parties</li>
                  <li>Standard security measures including encryption employed</li>
                  <li>Information may be shared with authorities as required by law</li>
                </ul>
              </div>

              <div>
                <p><strong>9. Limitation of Liability</strong></p>
                <ul className="list-disc ml-4 mt-1 space-y-1 text-xs">
                  <li>PassitOn is a facilitator only, not a guarantor of transactions</li>
                  <li>Platform liability is limited to the extent permitted by law</li>
                  <li>Users agree to indemnify PassitOn for misuse of the platform</li>
                </ul>
              </div>

              <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                <p className="font-bold text-xs text-red-800">Final Disclaimer</p>
                <p className="text-xs text-red-700 mt-1">PassitOn is not responsible for fraud, disputes, or the outcome of any user transaction. Users transact AT THEIR OWN RISK and must observe all safety precautions, legal guidelines, and institutional policies. Violation can lead to account suspension or permanent ban.</p>
              </div>

              <div className="mt-4 text-center bg-[#faf7ed] p-3 rounded-lg">
                <p className="text-xs font-medium">
                  Questions? Contact us at <span className="text-[#D93D04] font-bold">hi@passiton.cash</span>
                </p>
                <p className="text-xs mt-2 text-gray-600">
                  Complete terms: <a href="/terms" className="underline text-[#5B3DF6] font-medium" target="_blank">passiton.cash/terms</a>
                </p>
                <p className="text-xs mt-2 text-[#5B3DF6] font-medium">
                  By using PassitOn, you affirm your thorough understanding and agreement with these terms and conditions.
                </p>
              </div>
            </div>
            <button
              className="absolute top-3 right-5 text-[#5B3DF6] text-2xl font-extrabold hover:text-[#6C4AB6] focus:outline-none"
              onClick={() => setShowTnc(false)}
              aria-label="Close terms and conditions modal"
              type="button"
            >
              &times;
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
