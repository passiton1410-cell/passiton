'use client';

import Link from 'next/link';
import { Briefcase, Users, GraduationCap, Target } from 'lucide-react';

export default function OpportunitySection() {
  const opportunities = [
    {
      icon: <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />,
      title: "Jobs",
      description: "Find full-time positions from fellow students and alumni",
      count: "50+ opportunities"
    },
    {
      icon: <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />,
      title: "Internships",
      description: "Discover internship opportunities shared by your peers",
      count: "30+ internships"
    },
    {
      icon: <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />,
      title: "Mentorship",
      description: "Connect with mentors and coaching opportunities",
      count: "20+ mentors"
    },
    {
      icon: <Target className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />,
      title: "Teaching",
      description: "Find teaching and tutoring positions in your area",
      count: "15+ positions"
    }
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Discover{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Opportunities
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl lg:max-w-3xl mx-auto px-4">
            Explore job opportunities, internships, and mentorship programs shared by your college community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
          {opportunities.map((opportunity, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 mx-2 sm:mx-0"
            >
              <div className="mb-3 sm:mb-4">
                {opportunity.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {opportunity.title}
              </h3>
              <p className="text-gray-600 mb-3 text-sm sm:text-base leading-relaxed">
                {opportunity.description}
              </p>
              <div className="text-xs sm:text-sm font-medium text-blue-600">
                {opportunity.count}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center px-4">
          <Link
            href="/opportunities"
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
          >
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Explore All Opportunities
          </Link>
        </div>
      </div>
    </section>
  );
}