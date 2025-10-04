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
} from 'lucide-react';
import { getStates, getCitiesForState } from '@/lib/indian-states-cities';
import { searchColleges } from '@/lib/indian-colleges';

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
  const [collegeName, setCollegeName] = useState('');
  const [collegeSuggestions, setCollegeSuggestions] = useState<string[]>([]);
  const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);
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
  const handleCollegeNameChange = (value: string) => {
    setCollegeName(value);
    if (value.length >= 2) {
      const suggestions = searchColleges(value);
      setCollegeSuggestions(suggestions);
      setShowCollegeSuggestions(suggestions.length > 0);
    } else {
      setCollegeSuggestions([]);
      setShowCollegeSuggestions(false);
    }
  };

  // Handle college suggestion selection
  const handleCollegeSuggestionClick = (college: string) => {
    setCollegeName(college);
    setCollegeSuggestions([]);
    setShowCollegeSuggestions(false);
  };

  // Handlers
  const handleSendOtp = async () => {
    setLoading(true);
    setStatus('');
    setUserExists(false);

    if (!email || !password || !fullName || !username || !collegeIdUrl || !selectedState || !selectedCity || !collegeName) {
      setStatus('❌ All fields including college, state, city and ID are required.');
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
        collegeIdUrl,
        state: selectedState,
        city: selectedCity,
        collegeName: collegeName,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (res.ok) {
      setStatus('✅ Verified! Redirecting...');
      setTimeout(() => (window.location.href = '/'), 1000);
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

            {/* State and City Dropdowns */}
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
                <GraduationCap size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none" />
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
            </div>

            {/* Email and Password */}
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
              {/* Password */}
              <div className="relative">
                <input
                  type="password"
                  placeholder="Set a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-pink-300 focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition pr-10"
                />
                <LockKeyhole size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400" />
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

        {/* T&C Checkbox and Modal Trigger */}
        {step === 'signup' && (
          <div className="w-full flex items-start gap-3 mb-5">
            {/* Bubbly Tick Checkbox */}
            <span
              className={`inline-block w-6 h-6 rounded-full cursor-pointer border-2 border-[#E0D5FA] shadow transition-colors flex items-center justify-center ${tncChecked ? 'bg-[#5B3DF6] border-[#5B3DF6]' : 'bg-[#faf7ed]'}`}
              onClick={() => setTncChecked((v) => !v)}
            >
              {tncChecked && (
                <svg className="block w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            <span className="text-base text-[#5B3DF6] font-medium">
              I agree to the{" "}
              <span
                className="underline ml-1 cursor-pointer hover:text-[#6C4AB6] font-semibold"
                onClick={() => setShowTnc(true)}
              >
                Terms & Conditions
              </span>
            </span>
          </div>
        )}

        {/* ACTION BUTTON */}
        <motion.button
          onClick={step === 'signup' ? handleSendOtp : handleVerifyOtp}
          disabled={loading || uploadingId || (step === 'signup' && !tncChecked)}
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
            <div className="overflow-y-auto text-base text-[#23185B] max-h-[60vh] pr-2">
              {/* Put your full legal T&C here */}
              <ul className="list-decimal ml-6 space-y-2">
                <li>This platform is only for college students with valid identification.</li>
                <li>Upload only authentic student identification. Fake documents will result in permanent ban.</li>
                <li>Your college email will be used for identity verification.</li>
                <li>By signing up, you agree to receive communications from us.</li>
                <li>Abuse, spamming, or any policy violation will subject your account to suspension or removal.</li>
                <li>
                  Your data is handled as per our privacy policy.
                  See details at <span className="underline text-[#5B3DF6]"><a href="https://www.passiton.cash/terms">passiton.cash/terms</a></span>.
                </li>
                <li>
                  For detailed terms or concerns, contact support.
                </li>
              </ul>
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
