"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, UploadCloud, X } from "lucide-react";
import CollegeAutocomplete from "@/components/CollegeAutocomplete";

// Title validation: 5-60 chars, not only numbers/symbols, not repeated numbers
function isValidTitle(title: string) {
  if (title.length < 5 || title.length > 60) return false;
  if (/^[^a-zA-Z0-9]+$/.test(title)) return false; // only symbols
  if (/^(\d)\1+$/.test(title)) return false; // repeated numbers
  if (/^\d+$/.test(title)) return false; // only numbers
  return true;
}

// Description validation: min 20 chars, no links/emails
function isValidDescription(desc: string) {
  if (desc.length < 20) return false;
  if (/(https?:\/\/|www\.|@)/i.test(desc)) return false; // no links/emails
  return true;
}

const allowedCategories = [
  "Books",
  "Electronics",
  "Furniture",
  "Clothing",
  "Stationery",
  "Other",
];

export default function SellerPage() {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    image: "",
    images: [] as string[],
    college: "",
    phone: "",
    description: "",
  });

  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 4) {
      setStatus("❌ Maximum 4 images allowed");
      return;
    }

    if (formData.images.length + files.length > 4) {
      setStatus(`❌ Can only add ${4 - formData.images.length} more images`);
      return;
    }

    setUploading(true);
    setStatus(`Uploading ${files.length} image(s)...`);

    const form = new FormData();
    for (let i = 0; i < files.length; i++) {
      form.append("files", files[i]);
    }

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    if (res.ok) {
      const newImages = data.images || [data.secure_url]; // Handle both single and multiple
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
        image: prev.images.length === 0 ? newImages[0] : prev.image, // Keep first image for compatibility
      }));
      setStatus(`✅ ${newImages.length} image(s) uploaded successfully`);
    } else {
      setStatus(`❌ Upload failed: ${data.error}`);
    }
    setUploading(false);
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, index) => index !== indexToRemove);
      return {
        ...prev,
        images: newImages,
        image: newImages[0] || "", // Update main image field
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, price, phone, description, category, image, images, college } = formData;
    const numericPrice = parseInt(price);

    if (!isValidTitle(title.trim())) {
      setStatus("❌ Title must be 5-60 characters, not just numbers/symbols.");
      return;
    }
    if (!allowedCategories.includes(category)) {
      setStatus("❌ Please select a valid category.");
      return;
    }
    if (!isValidDescription(description.trim())) {
      setStatus("❌ Description must be at least 20 characters, no links/emails.");
      return;
    }
    if (images.length === 0) {
      setStatus("❌ Please upload at least 1 product image.");
      return;
    }
    if (!college.trim()) {
      setStatus("❌ Please select or add your college.");
      return;
    }
    if (isNaN(numericPrice) || numericPrice < 10 || numericPrice > 50000) {
      setStatus("❌ Price must be between ₹10 and ₹50,000.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setStatus("❌ Phone number must be 10 digits.");
      return;
    }
    setStatus("Submitting...");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: numericPrice,
          images: images.length > 0 ? images : undefined // Send images array
        }),
      });
      if (res.ok) {
        setStatus("✅ Product listed successfully!");
        setFormData({
          title: "",
          price: "",
          category: "",
          image: "",
          images: [],
          college: "",
          phone: "",
          description: "",
        });
      } else {
        setStatus("❌ Failed to submit. Try again.");
      }
    } catch (err) {
      setStatus("❌ Error submitting the form.");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7ed] flex flex-col items-center justify-center">
      <div className="relative flex flex-col lg:flex-row items-center justify-center w-full h-full pt-10 pb-14 px-2 md:px-0 max-w-5xl mx-auto">
        {/* Bubbly Side Blob/Illustration for Desktop */}
        <div className="hidden lg:flex flex-1 flex-col justify-center items-center pr-10">
          <motion.img
            src="/student-illustration.svg"
            alt="Student listing illustration"
            className="w-64 max-w-xs drop-shadow-lg"
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          />
          <p className="mt-4 text-xl font-semibold text-[#5B3DF6] text-center">
            Ready to pass it on? <br /> List your unused items for your campus!
          </p>
        </div>

        {/* FORM CARD */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex-1 max-w-lg w-full bg-white/90 border-2 border-[#E0D5FA] shadow-2xl rounded-3xl p-8 md:p-10 flex flex-col gap-5 mx-auto"
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.13, duration: 0.57 }}
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#5B3DF6] mb-2 text-center flex items-center justify-center gap-2">
            <PlusCircle size={28} className="text-[#5B3DF6]" />
            List a Product
          </h2>

          {/* 2-col grid for more info above lg, single column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Item Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="px-5 py-3 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-[#5B3DF6] focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition"
            />
            <input
              type="text"
              name="price"
              placeholder="Price (INR)"
              value={formData.price}
              onChange={handleChange}
              required
              className="px-5 py-3 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-[#22C55E] focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition"
            />
            <input
              type="text"
              name="phone"
              placeholder="Contact Phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="px-5 py-3 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-[#EA4CA3] focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition"
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="px-5 py-3 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-[#5B3DF6] focus:outline-none text-base shadow font-semibold"
            >
              <option value="">Select Category</option>
              <option value="Books">Books</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
              <option value="Stationery">Stationery</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* DESCRIPTION FIELD */}
          <textarea
            name="description"
            placeholder="Describe your item (at least 20 characters, no links/emails)"
            value={formData.description}
            onChange={handleChange}
            required
            minLength={20}
            className="px-5 py-3 rounded-2xl bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-[#5B3DF6] focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition resize-none"
          />

          {/* IMAGE UPLOAD */}
          <div className="w-full flex flex-col gap-2 pt-2">
            <label className="text-base font-bold text-[#5B3DF6] flex items-center gap-1">
              <UploadCloud size={18} /> Product Images ({formData.images.length}/4)
            </label>
            <p className="text-sm text-[#7c689c] mb-2">
              Upload 1-4 images of your product. First image will be the main display image.
            </p>

            {formData.images.length < 4 && (
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full px-5 py-2 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] file:font-bold file:px-5 file:py-2 cursor-pointer"
                disabled={uploading}
              />
            )}

            {/* Image Preview Grid */}
            {formData.images.length > 0 && (
              <motion.div
                className="mt-4 grid grid-cols-2 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.28 }}
              >
                {formData.images.map((imageUrl, index) => (
                  <motion.div
                    key={index}
                    className="relative group"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <img
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-32 object-cover bg-[#ffe7fc] rounded-xl shadow border-2 border-[#f3e8ff]"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-[#5B3DF6] text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Main
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* COLLEGE AUTOCOMPLETE */}
          <CollegeAutocomplete
            value={formData.college}
            onChange={(value) => setFormData(prev => ({ ...prev, college: value }))}
            placeholder="Select or add your college"
            className="w-full mt-1"
            inputClassName="w-full px-5 py-3 rounded-full bg-[#faf7ed] border-2 border-[#E0D5FA] text-[#23185B] focus:ring-2 focus:ring-[#5B3DF6] focus:outline-none text-base shadow placeholder-[#a78bfa] font-semibold transition pr-10"
            required
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.035 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 mt-2 bg-[#FFE158] hover:bg-yellow-400 text-[#23185B] rounded-full font-bold shadow-lg transition-all disabled:opacity-70"
            disabled={uploading}
          >
            {uploading ? "Please wait..." : "Submit Product"}
          </motion.button>

          {status && (
            <motion.div
              className={`text-base text-center mt-3 font-bold ${
                status.startsWith("✅")
                  ? "text-green-500"
                  : status.startsWith("❌")
                  ? "text-pink-500"
                  : "text-[#5B3DF6]"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {status}
            </motion.div>
          )}
        </motion.form>
      </div>
    </div>
  )
}