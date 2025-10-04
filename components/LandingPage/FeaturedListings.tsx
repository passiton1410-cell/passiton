import Image from "next/image";
import Link from "next/link";

export default function FeaturedListings() {
  const items = [
    { img: "https://res.cloudinary.com/dgefzrn4v/image/upload/v1753890254/pass-it-on/bvvak4r6nz2gkrzpghou.jpg", label: "Physics (HC Verma  12th)", price: "₹399", slug: "688a3dfe8a1cb1e1f402f948" },
    { img: "/coset.jpg", label: "Co-Set", price: "₹599", slug: "6867f62e12721bf44f1cac84" },
    { img: "/laptop.jpg", label: "Laptop", price: "₹7999", slug: "6867f65012721bf44f1cacb5" },
    { img: "https://res.cloudinary.com/dgefzrn4v/image/upload/v1753890921/pass-it-on/lzy4soomuaawgrqjuyji.jpg", label: "JEE (MTG)", price: "₹459", slug: "688a407f8a1cb1e1f402f95b" },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-16">
      <div className="bg-[#fff9e8] rounded-3xl shadow-lg p-8 sm:p-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#23185B] text-center mb-12">
          🏷️ Featured Listings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <Link
              key={index}
              href={`/product/${item.slug}`}
              className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 group"
            >
              <div className="relative w-20 h-20 mx-auto mb-4">
                <Image
                  src={item.img}
                  alt={item.label}
                  layout="fill"
                  objectFit="contain"
                  className="transition-transform group-hover:scale-110"
                />
              </div>
              <h3 className="text-lg font-semibold text-[#23185B] mb-1">{item.label}</h3>
              <p className="text-sm text-[#444]">{item.price}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-[#fff0c9] text-center rounded-xl p-5 border border-[#ffd46b] shadow-inner animate-pulse">
          <p className="text-sm sm:text-base font-semibold text-[#23185B]">
            📞 For more details, call us at{" "}
            <span className="text-[#D93D04]">8273145433</span>
          </p>
        </div>
      </div>
    </section>
  );
}
