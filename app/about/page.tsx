// app/about/page.tsx
"use client";

import { motion } from "framer-motion";

const team = [
  {
    name: "Dhruv Jain",
    role: "Co-Founder & CEO",
    image: "/team/Dhruvjain.jpeg",
  },
  // {
  //   name: "Aadi Jain",
  //   role: "Co-founder & CTO",
  //   image: "/team/Aadijain.jpeg",
  // },
  {
    name: "Aryan Panwar",
    role: "Co-founder & CMO",
    image: "/team/aryanpanwar.jpeg",
  },
  // {
  //   name: "Devansh Rana",
  //   role: "Co-founder & COO",
  //   image: "/team/Devanshrana.jpeg",
  // },
  // {
  //   name: "Sudhanshu Gill",
  //   role: "UI/UX Designer",
  //   image: "/team/sudhanshu.jpeg",
  // },
  // {
  //   name: "Vikrant Baliyan",
  //   role: "Community Head",
  //   image: "/team/Vikrant.jpeg",
  // },
  // {
  //   name: "Akhilesh Chahar",
  //   role: "Marketing Lead",
  //   image: "/team/Akhilesh.jpeg",
  // },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf7ed] py-10 flex flex-col items-center">
      {/* About Heading */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.08 }}
        className="flex flex-col items-center mb-7"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#5B3DF6] text-center mb-4 drop-shadow">
          Meet Our Team{" "}
          <span className="block text-lg font-medium text-[#a78bfa]">
            PassItOn Startup
          </span>
        </h1>
        <p className="text-base sm:text-lg text-[#7c689c] max-w-2xl text-center">
          We are a group of passionate students, creators, and innovators on a
          mission to redefine campus commerce with trust, transparency and
          community.
        </p>
      </motion.div>

      {/* Team Grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.17 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 w-full max-w-5xl px-3"
      >
        {team.map((member, idx) => (
          <motion.div
            key={member.name}
            initial={{ y: 26, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.21 + idx * 0.04 }}
            className="bg-white border-2 border-[#E0D5FA] rounded-3xl shadow-xl flex flex-col items-center py-7 px-4 hover:shadow-2xl transition group"
          >
            <div className="w-24 h-24 mb-3 rounded-full overflow-hidden border-4 border-[#5B3DF6]/40 bg-[#faf7ed] flex items-center justify-center">
              <img
                src={member.image}
                alt={member.name}
                className="object-cover w-full h-full group-hover:scale-105 transition"
              />
            </div>
            <div className="text-xl font-extrabold text-[#23185B]">
              {member.name}
            </div>
            <div className="text-base font-semibold text-[#5B3DF6]/90">
              {member.role}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Powered by and Funded by Section */}
      <div className="w-full max-w-3xl mt-10 mb-2 flex flex-col lg:flex-row items-center justify-center gap-6">
        {/* Company Logo & info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center lg:items-end w-full"
        >
          <p className="text-sm md:text-base text-[#7c689c] font-normal mb-2 text-center lg:text-right"></p>
          <div className="flex justify-center items-center">
            <div className="text-lg font-bold text-[#5B3DF6] text-start">
              Powered By Quantum Leap Systems LLP.
            </div>
          </div>
        </motion.div>
        {/* Startup India Logo */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.34 }}
          className="flex flex-col items-center w-full"
        >
          <p className="text-sm md:text-base text-[#7c689c] font-normal mb-2 text-center">
            Recognised By
          </p>
          <img
            src="/startup_india.png"
            alt="Startup India"
            className="h-36 w-auto drop-shadow"
          />
        </motion.div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-4" />
    </div>
  );
}
