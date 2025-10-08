import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  product: {
    _id: string;
    title: string;
    image: string;
    images?: string[];
    price: string;
    college: string;
    category: string;
    city?: string;
    state?: string;
    email?: string;
    phone?: string;
    sold?: boolean;
  };
}

// Helper for colored category badge
const categoryColor = (cat: string) => {
  switch (cat.toLowerCase()) {
    case 'books': return 'bg-[#5B3DF6]/90 text-white';
    case 'electronics': return 'bg-[#FFE158]/90 text-[#23185B]';
    case 'furniture': return 'bg-[#F87171]/90 text-white';
    case 'clothing': return 'bg-[#EC4899]/90 text-white';
    case 'stationery': return 'bg-[#34D399]/90 text-[#23185B]';
    default: return 'bg-[#38BDF8]/90 text-white';
  }
};

export function ProductCard({ product }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all available images (prioritize images array, fallback to single image)
  const allImages = product.images && product.images.length > 0
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const hasMultipleImages = allImages.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  //console.log(product); // Debug: show product details
  return (
    //<div style={{display: 'none'}}>{JSON.stringify(product)}</div>
    <Link href={`/product/${product._id}`} prefetch={false}>
      <motion.div
        whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(120,80,210,0.10)' }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        className="relative bg-white rounded-3xl shadow-xl border-2 border-[#E0D5FA] pb-5 overflow-hidden cursor-pointer transition-all group"
        style={{
          minHeight: 380
        }}
      >
        {product.sold && (
          <span className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-green-200 text-green-700 font-bold text-xs z-10">
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
        <div className="px-4 pt-4">
          <div className="w-full h-44 flex justify-center items-center rounded-2xl bg-[#faf7ed] relative overflow-hidden shadow-md border-2 border-[#f3e8ff]">
            {allImages.length > 0 ? (
              <>
                <img
                  src={allImages[currentImageIndex]}
                  alt={`${product.title} - Image ${currentImageIndex + 1}`}
                  loading="lazy"
                  className="object-contain h-40 w-40 rounded-xl transition-all duration-300 group-hover:opacity-90"
                />

                {/* Navigation arrows for multiple images */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <ChevronRight size={16} />
                    </button>

                    {/* Image dots indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {allImages.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex
                              ? 'bg-[#5B3DF6]'
                              : 'bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Image counter */}
                {hasMultipleImages && (
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {currentImageIndex + 1}/{allImages.length}
                  </div>
                )}
              </>
            ) : (
              <div className="text-[#a78bfa] text-center">
                <div className="text-2xl mb-2">📷</div>
                <div className="text-sm">No image</div>
              </div>
            )}
          </div>
        </div>
        <div className="px-5 pt-4 space-y-2">
          <h3 className="text-lg font-bold text-[#23185B] truncate">{product.title}</h3>
          <p className="text-sm text-[#6C4AB6] truncate">{product.college}</p>
          {product.city && product.state && (
            <p className="text-xs text-[#8B5CF6] truncate flex items-center gap-1">
              📍 {product.city}, {product.state}
            </p>
          )}
        </div>
        <div className="px-5 pt-2 pb-1 flex flex-row items-center gap-2">
          <span className={`${categoryColor(product.category)} px-3 py-1 rounded-full text-xs font-semibold capitalize shadow-sm`}>
            {product.category}
          </span>
          <span className="ml-auto text-xl font-black text-[#22C55E] tracking-wide drop-shadow-sm">
            ₹{product.price}
          </span>
        </div>
        <div className="px-5 flex flex-col gap-1 mt-3">
          {/* Contact */}
          {product.phone && (
            <p className="flex items-center gap-1 text-sm text-black font-semibold truncate">📞 {product.phone}</p>
          )}
          {product.email && (
            <p className="flex items-center gap-1 text-sm text-[#5B3DF6] font-semibold break-all">
              ✉️ <span className="underline">{product.email}</span>
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
