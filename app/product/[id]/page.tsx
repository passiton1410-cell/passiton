import { use } from "react";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";

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
  college: string;
  phone?: string;
  email?: string;
  sold?: boolean;
};

async function getProduct(id: string): Promise<ProductType | null> {
  await connectToDatabase();
  const product = await Product.findById(id).lean();
  return product as ProductType | null;
}

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = use(getProduct(id));

  if (!product) {
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
          <div className="w-64 h-64 bg-[#faf7ed] rounded-2xl shadow border-2 border-[#f3e8ff] flex items-center justify-center mb-6 overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="object-contain w-60 h-60 rounded-xl shadow"
            />
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
        <div className="w-full flex flex-col gap-2 mt-2">
          {product.phone && (
            <a
              href={`https://wa.me/91${product.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#22C55E]/90 text-lg font-bold text-white shadow hover:bg-[#16a34a] transition"
            >
              📞 WhatsApp: {product.phone}
            </a>
          )}
          {product.email && (
            <a
              href={`mailto:${product.email}`}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#5B3DF6]/90 text-lg font-bold text-white shadow hover:bg-[#3a28a7] transition"
            >
              ✉️ Email: {product.email}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
