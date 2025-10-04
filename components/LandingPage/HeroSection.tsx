"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { PlusCircle, Compass } from "lucide-react";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 pt-10 pb-14 bg-gradient-to-br from-[#5B3DF6] via-[#755FF5] to-[#02afa5]">
      <div className="flex-1 flex flex-col gap-6 items-center md:items-start text-center md:text-left">
        <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight drop-shadow-md" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <span className="text-[#FFE158] animate-pulse">PASS</span> Karo,{" "}
          <span className="text-[#FFE158] animate-bounce">EARN</span> Karo
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white tracking-tight italic" style={{ fontFamily: "'Satisfy', cursive", textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
          College life gets better with <span className="relative font-extrabold text-[#FFE158] px-2 py-1 rounded-md bg-white/10 shimmer not-button">PassItOn<span className="absolute inset-0 shimmer-effect rounded-md pointer-events-none"></span></span> 🎒📚
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-sm">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 bg-[#FFE158] hover:bg-[#ffd900] text-[#23185B] font-bold flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg transition-all text-sm sm:text-base"
            onClick={() => router.push("/seller")}
          >
            <PlusCircle size={18} />
            List an item
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 bg-white hover:bg-[#e0d5fa] text-[#5B3DF6] font-bold flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg transition-all text-sm sm:text-base"
            onClick={() => router.push("/buyer")}
          >
            <Compass size={18} />
            Browse
          </motion.button>
        </div>
      </div>
      <div className="flex-1 w-full flex justify-center items-center mt-8 md:mt-0">
        <Image src="/student-illustration.svg" alt="Student illustration" width={280} height={280} className="object-contain max-w-full" priority />
      </div>
    </section>
  );
}
