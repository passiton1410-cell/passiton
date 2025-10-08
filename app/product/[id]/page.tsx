"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Mail, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";

// Helper for colored category badge
const categoryColor = (cat: string) => {
  switch (cat.toLowerCase()) {
    case "books":
      return "bg-[#5B3DF6]/90 text-white";
    case "electronics":
      return "bg-[#FFE158]/90 text-[#23185B]";
    case "furniture":
      return "bg-[#F87171]/90 text-white";
    case "clothing":
      return "bg-[#EC4899]/90 text-white";
    case "stationery":
      return "bg-[#34D399]/90 text-[#23185B]";
    default:
      return "bg-[#38BDF8]/90 text-white";
  }
};

type ProductType = {
  _id: string;
  title: string;
  price: string;
  category: string;
  image: string;
  images?: string[];
  college: string;
  phone?: string;
  email?: string;
  sold?: boolean;
};

// Remove the server-side function - we'll fetch on client side

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data.product);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Get all available images (prioritize images array, fallback to single image)
  const allImages = product && product.images && Array.isArray(product.images) && product.images.length > 0
    ? product.images.filter(Boolean)
    : product && product.image
      ? [product.image]
      : [];

  const hasMultipleImages = allImages.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7ed] flex items-center justify-center">
        <div className="bg-white/90 rounded-2xl px-8 py-12 shadow-xl border border-[#E0D5FA] flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B3DF6] mb-4"></div>
          <p className="text-lg font-medium text-[#5B3DF6]">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#faf7ed] flex items-center justify-center">
        <div className="bg-white/90 rounded-2xl px-8 py-12 shadow-xl border border-pink-300 flex flex-col items-center">
          <span className="text-5xl mb-3">😢</span>
          <p className="text-2xl font-bold text-pink-500 mb-1">
            Product Not Found
          </p>
          <p className="text-[#7c689c] text-center">
            Sorry, we couldn&apos;t locate that item.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7ed] flex flex-col items-center justify-center py-10 px-3">
      <div className="w-full max-w-lg bg-white/90 rounded-3xl shadow-2xl border-2 border-[#E0D5FA] p-7 flex flex-col items-center relative">
        {/* Sold badge */}
        {product.sold && (
          <span className="absolute top-5 right-5 flex items-center gap-1 px-4 py-1 rounded-full bg-green-200 text-green-700 font-bold text-xs z-10">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M5 13l4 4L19 7"
                stroke="#15803d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Sold
          </span>
        )}
        <div className="w-full flex flex-col items-center gap-3">
          {/* Image Gallery */}
          <div className="w-full max-w-sm">
            {/* Main Image Display */}
            <div className="relative w-full h-80 bg-[#faf7ed] rounded-2xl shadow border-2 border-[#f3e8ff] flex items-center justify-center mb-4 overflow-hidden">
              {allImages.length > 0 ? (
                <>
                  <img
                    src={allImages[currentImageIndex]}
                    alt={`${product.title} - Image ${currentImageIndex + 1}`}
                    className="object-contain w-full h-full rounded-xl shadow"
                  />

                  {/* Navigation arrows */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 transition-all duration-200 z-10"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 transition-all duration-200 z-10"
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Image counter */}
                      <div className="absolute top-3 right-3 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                        {currentImageIndex + 1} / {allImages.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-[#a78bfa] text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <div className="text-sm">No image available</div>
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {hasMultipleImages && (
              <div className="flex gap-2 justify-center mb-4 overflow-x-auto py-2">
                {allImages.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentImageIndex
                        ? 'border-[#5B3DF6] ring-2 ring-[#5B3DF6]/30'
                        : 'border-gray-300 hover:border-[#5B3DF6]/50'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#5B3DF6] mb-1 text-center">
            {product.title}
          </h2>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl font-black text-[#22C55E] drop-shadow-sm">
              ₹{product.price}
            </span>
            <span
              className={`${categoryColor(product.category)} px-4 py-1 rounded-full text-xs font-bold capitalize shadow-sm`}
            >
              {product.category}
            </span>
          </div>

          <span className="text-sm text-[#7c689c] mb-4 font-medium">
            Posted from: {product.college}
          </span>
        </div>

        {/* Contact */}
        <div className="w-full mt-6">
          <h3 className="text-lg font-bold text-[#23185B] mb-4 text-center">Contact Seller</h3>
          <div className="flex flex-col gap-3">
            {product.phone && (
              <a
                href={`https://wa.me/91${product.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Contact seller via WhatsApp at ${product.phone}`}
                className="group w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-[#25D366] to-[#22C55E] text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
              >
                <MessageCircle size={20} className="group-hover:animate-pulse" />
                <span className="text-base">Chat on WhatsApp</span>
                <div className="ml-auto opacity-75">
                  <Phone size={16} />
                </div>
              </a>
            )}
            {product.email && (
              <a
                href={`mailto:${product.email}`}
                aria-label={`Send email to seller at ${product.email}`}
                className="group w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-[#5B3DF6] to-[#6C4AB6] text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
              >
                <Mail size={20} className="group-hover:animate-bounce" />
                <span className="text-base">Send Email</span>
                <div className="ml-auto opacity-75">
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Email</span>
                </div>
              </a>
            )}
          </div>

          {/* Contact Info Hint */}
          <div className="mt-4 p-3 bg-[#faf7ed] border border-[#E0D5FA] rounded-lg">
            <p className="text-xs text-[#7c689c] text-center leading-relaxed">
              <span className="font-medium">💡 Quick Tip:</span> WhatsApp is usually faster for instant replies.
              Both options will open in a new window.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
