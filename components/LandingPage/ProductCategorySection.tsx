'use client';

import Link from 'next/link';
import {
  Smartphone,
  Sofa,
  Shirt,
  BookOpen,
  Package,
  ShoppingBag
} from 'lucide-react';

export default function ProductCategorySection() {
  const categories = [
    {
      name: 'Electronics',
      icon: <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'group-hover:from-blue-600 group-hover:to-blue-700',
      shadowColor: 'group-hover:shadow-blue-500/30',
      textHover: 'group-hover:text-blue-600',
      countHover: 'group-hover:text-blue-500',
      count: '200+',
      slug: 'electronics'
    },
    {
      name: 'Furniture',
      icon: <Sofa className="w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />,
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'group-hover:from-emerald-600 group-hover:to-emerald-700',
      shadowColor: 'group-hover:shadow-emerald-500/30',
      textHover: 'group-hover:text-emerald-600',
      countHover: 'group-hover:text-emerald-500',
      count: '150+',
      slug: 'furniture'
    },
    {
      name: 'Clothing',
      icon: <Shirt className="w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />,
      color: 'from-pink-500 to-rose-500',
      hoverColor: 'group-hover:from-pink-600 group-hover:to-rose-600',
      shadowColor: 'group-hover:shadow-pink-500/30',
      textHover: 'group-hover:text-pink-600',
      countHover: 'group-hover:text-rose-500',
      count: '180+',
      slug: 'clothing'
    },
    {
      name: 'Stationary',
      icon: <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />,
      color: 'from-[#5B3DF6] to-[#755FF5]',
      hoverColor: 'group-hover:from-[#4c32d8] group-hover:to-[#6651e6]',
      shadowColor: 'group-hover:shadow-[#5B3DF6]/30',
      textHover: 'group-hover:text-[#5B3DF6]',
      countHover: 'group-hover:text-[#755FF5]',
      count: '120+',
      slug: 'stationary'
    },
    {
      name: 'Other',
      icon: <Package className="w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />,
      color: 'from-orange-500 to-amber-500',
      hoverColor: 'group-hover:from-orange-600 group-hover:to-amber-600',
      shadowColor: 'group-hover:shadow-orange-500/30',
      textHover: 'group-hover:text-orange-600',
      countHover: 'group-hover:text-amber-500',
      count: '90+',
      slug: 'other'
    }
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#faf7ed] via-white to-[#faf7ed] w-full relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#02afa5]/5 to-[#5B3DF6]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-[#755FF5]/5 to-[#02afa5]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Shop by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#02afa5] via-[#5B3DF6] to-[#755FF5] animate-pulse">
              Category
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl lg:max-w-3xl mx-auto px-4">
            Browse through our product categories to find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col items-center p-4 sm:p-6 rounded-2xl hover:bg-white/70 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-white/50 hover:shadow-xl"
            >
              <div className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br ${category.color} ${category.hoverColor} flex items-center justify-center text-white shadow-lg group-hover:shadow-2xl ${category.shadowColor} transition-all duration-500 mb-3 sm:mb-4 overflow-hidden`}>
                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                {/* Pulsing ring */}
                <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
                <div className="absolute inset-0 rounded-full border border-white/10 animate-pulse"></div>

                {category.icon}
              </div>
              <h3 className={`text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 text-center ${category.textHover} transition-colors duration-300`}>
                {category.name}
              </h3>
              <p className={`text-xs sm:text-sm text-gray-500 font-medium ${category.countHover} transition-colors duration-300`}>
                {category.count} items
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/products"
            className="group inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#02afa5] via-[#5B3DF6] to-[#755FF5] text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-[#5B3DF6]/30 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 text-sm sm:text-base relative overflow-hidden"
          >
            {/* Button shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span className="relative">Browse All Products</span>
          </Link>
        </div>
      </div>
    </section>
  );
}