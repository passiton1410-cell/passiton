'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function AcceptTermsPage() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in and get their info
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();

      if (!data.loggedIn) {
        // If not logged in, redirect to login
        router.push('/auth/login');
        return;
      }

      setUserInfo(data.user);

      // If user has already accepted terms, redirect to main page
      if (data.user.termsAccepted) {
        router.push('/');
        return;
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      router.push('/auth/login');
    }
  };

  const handleAcceptTerms = async () => {
    if (!accepted) {
      setStatus('❌ Please accept the Terms & Conditions to continue');
      return;
    }

    setLoading(true);
    setStatus('Processing...');

    try {
      const response = await fetch('/api/user/accept-terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ termsAccepted: true })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('✅ Terms accepted! Redirecting...');
        setTimeout(() => {
          // Check user role and redirect accordingly
          if (userInfo?.role === 'admin') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/';
          }
        }, 1000);
      } else {
        setStatus(`❌ ${data.error || 'Failed to accept terms'}`);
      }
    } catch (error) {
      console.error('Error accepting terms:', error);
      setStatus('❌ Failed to accept terms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = () => {
    // Log user out and redirect to login page
    fetch('/api/auth/logout', { method: 'POST' })
      .then(() => {
        window.location.href = '/auth/login';
      });
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf7ed] via-[#E0D5FA] to-[#ffe9fa]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B3DF6] mx-auto"></div>
          <p className="mt-4 text-[#5B3DF6] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 bg-gradient-to-br from-[#faf7ed] via-[#E0D5FA] to-[#ffe9fa]">
      <motion.div
        className="relative w-full max-w-4xl bg-white/95 border border-[#6C4AB6]/10 rounded-3xl shadow-xl p-6 sm:p-10 flex flex-col items-center overflow-y-auto max-h-[90vh]"
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55 }}
      >
        {/* Logo and Welcome */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="inline-block rounded-full shadow-lg border-4 border-white">
            <Image
              src="/logo3-adjusted.jpeg"
              alt="PassitOn Logo"
              width={110}
              height={110}
              className="rounded-full"
            />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#5B3DF6] mt-5 tracking-wide">
            Welcome to PassitOn!
          </h1>
          <p className="text-lg text-[#23185B] mt-2 font-medium">
            Hi {userInfo?.fullName}! 👋
          </p>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl">
            To complete your registration and start using PassitOn, please read and accept our Terms & Conditions.
          </p>
        </div>

        {/* Terms Content */}
        <div className="w-full mb-6">
          <div className="bg-[#faf7ed] border-2 border-[#E0D5FA] rounded-2xl p-6 max-h-[50vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#5B3DF6] mb-4 text-center">
              PassitOn Terms & Conditions
            </h2>

            <div className="space-y-4 text-sm text-[#23185B]">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <p className="font-bold text-blue-800 mb-2">📋 Quick Summary</p>
                <ul className="list-disc ml-4 space-y-1 text-blue-700 text-xs">
                  <li>PassitOn is a student marketplace for verified college students only</li>
                  <li>You must be 18+ or have guardian consent to use the platform</li>
                  <li>Prohibited items include drugs, weapons, adult content, and illegal goods</li>
                  <li>All transactions are between users - PassitOn facilitates connections only</li>
                  <li>Users transact at their own risk with safety precautions recommended</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <p className="font-bold text-red-800 mb-2">🚫 Strictly Prohibited</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-red-700">
                  <div>
                    <p className="font-medium">• Illegal Substances</p>
                    <p>Drugs, alcohol, tobacco, vapes</p>
                  </div>
                  <div>
                    <p className="font-medium">• Weapons & Explosives</p>
                    <p>Firearms, knives, fireworks</p>
                  </div>
                  <div>
                    <p className="font-medium">• Medical Items</p>
                    <p>Prescription drugs, medical equipment</p>
                  </div>
                  <div>
                    <p className="font-medium">• Adult Content</p>
                    <p>Pornography, offensive materials</p>
                  </div>
                  <div>
                    <p className="font-medium">• Political/Religious</p>
                    <p>Campaigning, preaching activities</p>
                  </div>
                  <div>
                    <p className="font-medium">• Fraudulent Items</p>
                    <p>Fake IDs, stolen goods, counterfeits</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <p className="font-bold text-green-800 mb-2">✅ Your Responsibilities</p>
                <ul className="list-disc ml-4 space-y-1 text-green-700 text-xs">
                  <li>Provide accurate information in listings</li>
                  <li>Meet in safe, public campus locations</li>
                  <li>Report suspicious activities immediately</li>
                  <li>Respect other users and follow campus guidelines</li>
                  <li>Resolve disputes directly with other users</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <p className="font-bold text-yellow-800 mb-2">⚠️ Important Disclaimers</p>
                <ul className="list-disc ml-4 space-y-1 text-yellow-700 text-xs">
                  <li>PassitOn is not responsible for transactions between users</li>
                  <li>All exchanges are at your own risk</li>
                  <li>Platform may suspend accounts for policy violations</li>
                  <li>Terms may be updated - continued use implies acceptance</li>
                </ul>
              </div>

              <div className="text-center bg-[#fff9e8] p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">
                  📖 <Link href="/terms" target="_blank" className="underline text-[#5B3DF6] font-medium">Read Complete Terms & Conditions</Link>
                </p>
                <p className="text-xs font-medium text-[#5B3DF6]">
                  Contact us: <span className="text-[#D93D04]">hi@passiton.cash</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Acceptance Section */}
        <div className="w-full mb-6">
          <div className="bg-white border-2 border-[#5B3DF6] rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <span
                className={`inline-block w-6 h-6 rounded-full cursor-pointer border-2 shadow transition-colors flex items-center justify-center flex-shrink-0 mt-1 ${
                  accepted
                    ? 'bg-[#5B3DF6] border-[#5B3DF6]'
                    : 'bg-white border-[#E0D5FA] hover:border-[#5B3DF6]'
                }`}
                onClick={() => setAccepted(!accepted)}
              >
                {accepted && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <div className="flex-1">
                <p className="text-base font-semibold text-[#23185B] leading-relaxed">
                  I have read, understood, and agree to abide by the
                  <Link href="/terms" target="_blank" className="text-[#5B3DF6] underline mx-1 hover:text-[#6C4AB6]">
                    Terms & Conditions
                  </Link>
                  of PassitOn. I understand that violation of these terms may result in account suspension or permanent ban.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={handleAcceptTerms}
                disabled={loading}
                whileHover={{ scale: accepted ? 1.02 : 1 }}
                whileTap={{ scale: accepted ? 0.98 : 1 }}
                className={`flex-1 py-4 px-6 rounded-full font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                  accepted
                    ? 'bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white hover:from-[#16a34a] hover:to-[#15803d]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    ✅ Accept & Continue to PassitOn
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={handleDecline}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 px-6 rounded-full font-bold text-lg transition-all shadow-lg bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 flex items-center justify-center gap-2"
              >
                ❌ Decline & Logout
              </motion.button>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <motion.p
            className={`text-center text-base font-semibold ${
              status.startsWith('✅')
                ? 'text-green-500'
                : status.startsWith('❌')
                ? 'text-red-500'
                : 'text-[#5B3DF6]'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {status}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}