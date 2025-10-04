"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function FeedbackForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      alert("Please enter your feedback message");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
  alert("✅ Thank you for your feedback!");
  setFormData({ name: "", email: "", message: "" });
} else if (res.status === 429) {
  alert("⏳ Please wait 30 seconds before submitting feedback again.");
} else {
  alert("❌ Failed to submit feedback. Please try again later.");
}

    } catch (err) {
      alert("❌ Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl w-full mx-auto bg-[#fff9e8] rounded-3xl p-8 shadow-lg flex flex-col gap-6
                 sm:p-10 md:flex-row md:gap-12"
    >
      {/* Left Side: info & icon */}
      <div className="flex flex-col items-center justify-center text-center md:text-left md:w-1/3">
        <div className="bg-[#5B3DF6] p-4 rounded-full mb-6 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-[#FFE158]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"
            />
          </svg>
        </div>
        <h2
          className="text-3xl font-extrabold text-[#23185B]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Your Feedback Matters
        </h2>
        <p
          className="mt-2 text-[#5B3DF6] font-semibold italic"
          style={{ fontFamily: "'Satisfy', cursive" }}
        >
          Help us improve PassItOn!
        </p>
      </div>

      {/* Right Side: Form */}
      <form
        className="flex flex-col gap-5 md:w-2/3"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Your Name (optional)"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-5 py-3 rounded-full border-2 border-[#5B3DF6] bg-white text-[#23185B] placeholder-[#a78bfa] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5B3DF6] transition"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Your Email (optional)"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-5 py-3 rounded-full border-2 border-[#5B3DF6] bg-white text-[#23185B] placeholder-[#a78bfa] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5B3DF6] transition"
        />

        {/* Message */}
        <textarea
          name="message"
          placeholder="Your Feedback..."
          value={formData.message}
          onChange={handleChange}
          disabled={loading}
          required
          rows={5}
          className="w-full px-5 py-4 rounded-2xl border-2 border-[#5B3DF6] bg-white text-[#23185B] placeholder-[#a78bfa] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5B3DF6] transition resize-none"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="self-end flex items-center gap-2 bg-[#FFE158] text-[#23185B] font-bold px-7 py-3 rounded-full shadow-lg hover:bg-[#ffd900] active:scale-95 transition select-none"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-[#23185B]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : null}
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </motion.div>
  );
}
