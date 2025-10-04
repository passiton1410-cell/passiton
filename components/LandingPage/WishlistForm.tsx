"use client";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";

export default function WishlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || cooldown) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const item = formData.get("item")?.toString().trim() || "";
    const details = formData.get("details")?.toString().trim() || "";
    const phone = formData.get("phone")?.toString().trim() || "";

    if (!item) {
      alert("Please enter what you're looking for");
      return;
    }

    if (!validatePhone(phone)) {
      alert("Please enter a valid 10-digit phone number (starts with 6-9)");
      return;
    }

    setIsSubmitting(true);

    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, details, phone }),
    });

    if (res.ok) {
      alert("✅ Your wish has been submitted!");
      form.reset();
      setCooldown(true);
      setTimeout(() => setCooldown(false), 30000); // 30-second cooldown
    } else {
      alert("❌ Something went wrong.");
    }

    setIsSubmitting(false);
  };

  return (
    <motion.section
      className="w-full max-w-5xl px-4 sm:px-6 pt-2 pb-10 mx-auto"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1, duration: 0.5 }}
    >
      <div className="bg-white shadow px-6 py-7 flex flex-col items-center gap-4 rounded-2xl border border-gray-100">
        <div className="flex items-center gap-2">
          <Heart size={28} className="text-pink-500" />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Wish for Something?</h2>
        </div>
        <p className="text-center text-sm sm:text-base text-gray-500">
          <span className="text-pink-600 font-medium">Submit your wish</span> &amp; we’ll let sellers know!
        </p>

        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <input
            name="item"
            type="text"
            placeholder="What do you need? (e.g., Table, Calculator)"
            className="w-full px-5 py-3 rounded-full bg-white border border-gray-200 focus:border-pink-400 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none text-sm sm:text-base"
            required
          />
          <textarea
            name="details"
            rows={2}
            placeholder="Any details? Color, brand, etc. (optional)"
            className="w-full px-5 py-3 rounded-2xl bg-white border border-gray-200 focus:border-pink-400 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none text-sm sm:text-base"
          />
          <input
            name="phone"
            type="tel"
            placeholder="Your Phone Number"
            className="w-full px-5 py-3 rounded-full bg-white border border-gray-200 focus:border-pink-400 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none text-sm sm:text-base"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting || cooldown}
            className={`mt-1 px-6 py-3 rounded-full transition shadow font-semibold text-white text-sm sm:text-base flex items-center justify-center gap-2 ${
              isSubmitting || cooldown
                ? "bg-pink-300 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            <Heart size={18} className="inline-block" />
            {isSubmitting
              ? "Submitting..."
              : cooldown
              ? "Please wait 30s..."
              : "Submit Wish"}
          </button>
        </form>
      </div>
    </motion.section>
  );
}
