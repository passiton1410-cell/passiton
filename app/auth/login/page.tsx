'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { LockKeyhole, MailCheck, Loader2, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  // Password reset states
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetStep, setResetStep] = useState<'enter' | 'verify' | 'set'>('enter');
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetNewPwd, setResetNewPwd] = useState('');
  const [resetStatus, setResetStatus] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setStatus('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (res.ok) {
      setStatus('✅ Logged in! Redirecting...');

      // Check user role after successful login
      setTimeout(async () => {
        try {
          const userRes = await fetch('/api/auth/me');
          const userData = await userRes.json();

          if (userData.loggedIn && userData.user) {
            // Redirect admin users to admin dashboard
            if (userData.user.role === 'admin') {
              window.location.href = "/admin";
            } else {
              window.location.href = "/";
            }
          } else {
            window.location.href = "/";
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          window.location.href = "/";
        }
      }, 1000);
    } else {
      setStatus(`❌ ${data.error}`);
    }
    setLoading(false);
  };

  // Forgot password handlers:
  const handleRequestOtp = async () => {
    setResetStatus('');
    setResetLoading(true);
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email: resetEmail, mode: "reset" }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (res.ok) {
      setResetStatus("✅ OTP sent!");
      setResetStep("verify");
    } else {
      setResetStatus("❌ " + data.error);
    }
    setResetLoading(false);
  };

  const handleVerifyOtp = async () => {
    setResetStatus('');
    setResetLoading(true);
    const res = await fetch('/api/auth/reset-password/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email: resetEmail, otp: resetOtp }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (res.ok) {
      setResetStatus("✅ OTP verified, set new password.");
      setResetStep("set");
    } else {
      setResetStatus("❌ " + data.error);
    }
    setResetLoading(false);
  };

  const handleSetNewPwd = async () => {
    setResetStatus('');
    setResetLoading(true);
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email: resetEmail, newPassword: resetNewPwd }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (res.ok) {
      setResetStatus("✅ Password updated. You can login now.");
      setTimeout(() => {
        setForgotOpen(false);
        setResetStep("enter");
        setResetEmail('');
        setResetOtp('');
        setResetNewPwd('');
        setResetStatus('');
      }, 1500);
    } else {
      setResetStatus("❌ " + data.error);
    }
    setResetLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-2 sm:px-6 py-10 bg-gradient-to-br from-[#faf7ed] via-[#E0D5FA] to-[#ffe9fa]">
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
            <LockKeyhole size={25} />
            Login to Your Account
          </h2>
        </div>
        {/* Email Field */}
        <div className="w-full mb-5">
          <div className="relative">
            <input
              type="email"
              placeholder="Your student email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
              className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-[#5B3DF6] focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition pr-10"
            />
            <MailCheck size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8e79df]" />
          </div>
        </div>
        {/* Password Field */}
        <div className="w-full mb-3">
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full px-5 py-4 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-pink-400 focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition pr-10"
            />
            <LockKeyhole size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400" />
          </div>
        </div>
        {/* Login Button */}
        <motion.button
          onClick={handleLogin}
          disabled={loading}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 mt-2 rounded-full font-bold tracking-wide text-lg transition-all shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-[#5B3DF6] to-[#6C4AB6] text-white disabled:opacity-60"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? 'Logging in...' : 'Login'}
        </motion.button>
        <span className="w-full text-right mt-3">
          <button
            className="text-blue-500 underline text-xs font-semibold hover:opacity-80"
            onClick={() => setForgotOpen(true)}
          >
            Forgot password?
          </button>
        </span>
        {/* Modal for forgot password */}
        {forgotOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm px-3"
            onClick={() => setForgotOpen(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 flex flex-col gap-5 relative border border-blue-200"
              style={{ minWidth: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute right-4 top-4 text-gray-400 text-2xl font-bold hover:text-blue-500"
                onClick={() => setForgotOpen(false)}
              >×</button>
              <h3 className="text-2xl font-bold text-[#5B3DF6] mb-3 flex items-center gap-2 justify-center">
                <KeyRound size={22} className="text-emerald-400" />
                Reset Password
              </h3>
              {resetStep === "enter" && (
                <>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full px-4 py-3 rounded-full border-2 border-blue-200 text-gray-700 font-semibold bg-[#f7f5fe] focus:outline-none mb-1"
                  />
                  <motion.button
                    className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold mt-1 transition text-base"
                    whileHover={{ scale: 1.03 }}
                    disabled={resetLoading}
                    onClick={handleRequestOtp}
                  >
                    {resetLoading ? <Loader2 size={17} className="animate-spin inline" /> : "Send OTP"}
                  </motion.button>
                </>
              )}
              {resetStep === "verify" && (
                <>
                  <input
                    type="text"
                    value={resetOtp}
                    onChange={e => setResetOtp(e.target.value)}
                    placeholder="OTP from email"
                    className="w-full px-4 py-3 rounded-full border-2 border-blue-200 text-gray-700 font-semibold bg-[#f7f5fe] focus:outline-none mb-1"
                  />
                  <button
                    className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold mt-1 text-base"
                    disabled={resetLoading}
                    onClick={handleVerifyOtp}
                  >
                    {resetLoading ? <Loader2 size={17} className="animate-spin inline" /> : "Verify OTP"}
                  </button>
                </>
              )}
              {resetStep === "set" && (
                <>
                  <input
                    type="password"
                    value={resetNewPwd}
                    onChange={e => setResetNewPwd(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 rounded-full border-2 border-blue-200 text-gray-700 font-semibold bg-[#f7f5fe] focus:outline-none mb-1"
                  />
                  <button
                    className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold mt-1 text-base"
                    disabled={resetLoading}
                    onClick={handleSetNewPwd}
                  >
                    {resetLoading ? <Loader2 size={17} className="animate-spin inline" /> : "Set Password"}
                  </button>
                </>
              )}
              {resetStatus && (
                <span
                  className={`block text-center font-semibold text-base ${
                    resetStatus.startsWith("✅")
                      ? "text-emerald-500"
                      : resetStatus.startsWith("❌")
                      ? "text-rose-500"
                      : "text-gray-500"
                  }`}
                >
                  {resetStatus}
                </span>
              )}
            </div>
          </motion.div>
        )}
        {status && (
          <motion.p
            className={`
              mt-6 mb-1 text-center text-base font-semibold transition
              ${
                status.startsWith('✅')
                  ? "text-green-500"
                  : status.startsWith('❌')
                  ? "text-pink-500"
                  : "text-[#a78bfa]"
              }
            `}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {status}
          </motion.p>
        )}
        <div className="mt-7 text-center">
          <p className="text-sm text-[#7c689c] mb-3">Don&apos;t have an account?</p>
          <motion.button
            onClick={() => router.push('/auth')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-full shadow-lg hover:from-green-600 hover:to-green-700 transition-all text-base"
          >
            Create Account
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
