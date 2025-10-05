"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pb-6 border-b-4 border-blue-500"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-blue-500 mb-4 drop-shadow-lg">
            🎓 PassItOn - All About Us 🎓
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600">
            Revolutionizing India's $18B+ Student Marketplace Ecosystem
          </p>
        </motion.div>

        {/* What We Do, Vision, Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 sm:p-8 lg:p-10 rounded-2xl mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-3">
                <span>💡</span> What We Do
              </h2>
              <p className="text-base sm:text-lg leading-relaxed">
                We're India's <strong>first campus-verified marketplace</strong> where 293 million students buy, sell, and share books, electronics, apparel, and STEM kits—saving <strong>₹23K-63K annually</strong> while building a sustainable future.
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-3">
                <span>🔮</span> Our Vision
              </h2>
              <p className="text-base sm:text-lg leading-relaxed">
                To become India's <strong>largest student ecosystem platform</strong>—creating a thriving <strong>$18B+ circular economy</strong> where every student has affordable access to quality education and lifestyle essentials.
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-3">
                <span>🎯</span> Our Mission
              </h2>
              <p className="text-base sm:text-lg leading-relaxed">
                To empower students with India's <strong>most trusted all-in-one marketplace</strong>—making education affordable, technology accessible, fashion sustainable, and enabling massive savings through smart reuse.
              </p>
            </div>
          </div>

          <div className="mt-6 p-5 bg-white/30 rounded-xl text-center">
            <p className="text-lg sm:text-xl font-bold leading-relaxed">
              📚 Books & STEM Kits | 📱 Mobiles & Laptops | 👕 Apparel & Footwear | 🌱 100% Sustainable
            </p>
          </div>
        </motion.div>

        {/* Mega Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-8"
        >
          {[
            { icon: "📚", value: "293M", label: "Total Students" },
            { icon: "💰", value: "$18B+", label: "Total Market 2025" },
            { icon: "📱", value: "$73B", label: "Mobile Market" },
            { icon: "♻️", value: "60-70%", label: "Reusability Rate" },
            { icon: "🌱", value: "₹50K+ Cr", label: "Annual Savings" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4 sm:p-6 rounded-2xl text-center transform transition-transform"
            >
              <div className="text-3xl sm:text-4xl mb-2">{stat.icon}</div>
              <div className="text-xl sm:text-2xl font-bold mb-2">{stat.value}</div>
              <div className="text-xs sm:text-sm opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Market Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 sm:p-8 rounded-2xl mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
            📊 COMPLETE MARKET BREAKDOWN 2025-2030
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                title: "📚 Educational Materials",
                stats: [
                  "Books: ₹86,000 Cr (70% reusable)",
                  "Stationery: $2.5B → $3.7B (8% CAGR)",
                  "STEM Kits: $1.6B → $3.6B (14.7% CAGR)",
                  "Lab Consumables: ₹8,000-16,000 Cr"
                ]
              },
              {
                title: "📱 Electronics & Tech",
                stats: [
                  "Mobiles: $73B global (22.6% CAGR)",
                  "Laptops: $8.9B → $10.8B (5.9% CAGR)",
                  "Savings: 40-80% vs new prices",
                  "Apple Share: 62.9% refurb market India"
                ]
              },
              {
                title: "👟 Apparel & Footwear",
                stats: [
                  "Secondhand Apparel: $3.5B India (13.2% CAGR)",
                  "Global Market: $208B → $521B by 2034",
                  "Footwear Reuse: 15% repairable, 75% recyclable",
                  "Savings: 50-70% on branded items"
                ]
              }
            ].map((market, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border-l-4 border-red-500">
                <h3 className="text-lg sm:text-xl font-bold text-blue-600 mb-4">{market.title}</h3>
                {market.stats.map((stat, statIndex) => (
                  <div key={statIndex} className="text-sm sm:text-base mb-2 text-gray-800">
                    <strong className="text-red-500">{stat.split(':')[0]}:</strong> {stat.split(':')[1]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Savings Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 sm:p-8 rounded-2xl mb-8"
        >
          <h2 className="text-2xl sm:text-4xl font-bold text-center mb-8">
            💰 STUDENT SAVINGS POTENTIAL PER YEAR
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "📚 Books & Materials",
                amount: "₹3,000-8,000",
                description: "60-70% savings on textbooks\n20-30% on stationery/STEM"
              },
              {
                title: "📱 Electronics",
                amount: "₹15,000-40,000",
                description: "40-80% off mobiles\n30-70% off laptops"
              },
              {
                title: "👕 Apparel & Footwear",
                amount: "₹5,000-15,000",
                description: "50-70% savings on brands\nSustainable fashion access"
              }
            ].map((saving, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm p-6 rounded-xl text-center">
                <h3 className="text-xl sm:text-2xl font-bold mb-4">{saving.title}</h3>
                <p className="text-lg sm:text-xl font-bold mb-4">{saving.amount}</p>
                <p className="text-sm sm:text-base whitespace-pre-line">{saving.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 text-xl sm:text-2xl font-bold bg-white/20 backdrop-blur-sm p-4 rounded-xl">
            💵 TOTAL AVERAGE SAVINGS: ₹23,000-63,000 PER STUDENT ANNUALLY
          </div>
        </motion.div>

        {/* Problem, Solution, Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Problem */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-2xl transform hover:scale-105 transition-transform">
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">THE MEGA PROBLEM</h3>
            <div className="space-y-3">
              {[
                "$18B+ total addressable market wasted",
                "293M students overpaying for essentials",
                "₹23K-63K lost per student yearly",
                "Massive e-waste from electronics",
                "Fast fashion environmental crisis"
              ].map((problem, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded-lg border-l-4 border-blue-500">
                  <strong className="text-gray-800">{problem}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-2xl transform hover:scale-105 transition-transform">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">OUR UNIFIED SOLUTION</h3>
            <div className="space-y-3">
              {[
                "All-in-One Platform: Books + Tech + Apparel",
                "Campus-Verified student community",
                "AI Price Analytics for fair deals",
                "Quality Certification for electronics",
                "Sustainability Tracking & rewards"
              ].map((solution, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-sm p-3 rounded-lg border-l-4 border-white">
                  <strong>{solution}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Impact */}
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-2xl transform hover:scale-105 transition-transform">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">TRANSFORMATIVE IMPACT</h3>
            <div className="space-y-3">
              {[
                "₹50,000+ Cr potential annual savings",
                "40-80% cost reduction for students",
                "Circular economy across all categories",
                "E-waste reduction & carbon savings",
                "Educational equity for all students"
              ].map((impact, index) => (
                <div key={index} className="bg-white/30 backdrop-blur-sm p-3 rounded-lg border-l-4 border-green-800">
                  <strong className="text-gray-800">{impact}</strong>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Impact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              icon: "💰",
              title: "FINANCIAL IMPACT",
              gradient: "from-blue-500 to-blue-600",
              stats: [
                "Students Save: ₹23K-63K/year",
                "Market Growth: 14.7% CAGR STEM",
                "Total TAM: $18B+ across categories",
                "Resale Value: 40-70% recovery",
                "Dropout Prevention: Financial relief"
              ]
            },
            {
              icon: "🌍",
              title: "ENVIRONMENTAL IMPACT",
              gradient: "from-green-500 to-green-600",
              stats: [
                "E-Waste: Millions kg diverted",
                "CO₂ Reduction: Lower production demand",
                "Water Saved: Textile manufacturing cut",
                "Trees Saved: Millions annually (paper)",
                "Circular Economy: 60-70% reuse rate"
              ]
            },
            {
              icon: "🤝",
              title: "SOCIAL IMPACT",
              gradient: "from-pink-500 to-pink-600",
              stats: [
                "Access: 293M students empowered",
                "Equity: Affordable tech for all",
                "Community: Campus connections",
                "Inclusion: Lower-income support",
                "Sustainable Fashion: Conscious choices"
              ]
            },
            {
              icon: "🎓",
              title: "EDUCATIONAL IMPACT",
              gradient: "from-purple-500 to-purple-600",
              stats: [
                "STEM Access: Affordable robotics kits",
                "Digital Divide: Laptops/tablets accessible",
                "Quality Materials: Books for all",
                "Skill Building: Tech literacy improved",
                "Retention: Reduced dropouts"
              ]
            }
          ].map((impact, index) => (
            <div key={index} className={`bg-gradient-to-br ${impact.gradient} text-white p-6 rounded-2xl text-center`}>
              <div className="text-4xl mb-4">{impact.icon}</div>
              <h3 className="text-lg font-bold mb-4">{impact.title}</h3>
              <div className="text-left space-y-1 text-sm">
                {impact.stats.map((stat, statIndex) => (
                  <div key={statIndex}>• {stat}</div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 sm:p-8 lg:p-10 rounded-2xl text-center"
        >
          <h2 className="text-2xl sm:text-4xl font-bold mb-8">
            🚀 JOIN INDIA'S LARGEST STUDENT REVOLUTION
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: "📚", title: "Books & STEM", savings: "60-70% Savings" },
              { icon: "📱", title: "Electronics", savings: "40-80% Savings" },
              { icon: "👕", title: "Apparel", savings: "50-70% Savings" },
              { icon: "🌱", title: "Sustainability", savings: "Eco Impact" }
            ].map((item, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm p-4 rounded-xl flex flex-col items-center justify-between min-h-[120px]">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-bold text-lg mb-1 text-center">{item.title}</div>
                <div className="text-sm opacity-95 text-center">{item.savings}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl mb-6">
            <p className="text-lg sm:text-xl font-bold leading-relaxed">
              293M Students | $18B+ Market | ₹50K+ Cr Annual Savings | Complete Circular Economy
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-2xl sm:text-3xl font-bold">www.passiton.cash</p>
            <p className="text-base sm:text-lg opacity-95">
              Powered by Quantum Leap Systems LLP | Transforming Student Life Across India 🇮🇳
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
