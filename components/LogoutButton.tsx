"use client";

import { LogOut, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include", // ✅ Required to send cookies
        });
        const data = await res.json();
        setLoggedIn(data.loggedIn);
      } catch (error) {
        //console.error("Auth check failed:", error);
        setLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // ✅ Also needed here
      });

      if (res.ok) {
        window.location.href = "/";

      } else {
        alert("Failed to logout. Please try again.");
      }
    } catch (error) {
      //console.error("Logout error:", error);
      alert("Something went wrong during logout.");
    }
  };

  const handleLoginRedirect = () => {
    
    window.location.href = "/auth/login";

  };

  if (loggedIn === null) return null; // Optionally show spinner here

  return (
    <motion.button
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.96 }}
      onClick={loggedIn ? handleLogout : handleLoginRedirect}
      type="button"
      className="
        flex items-center gap-2
        px-5 py-2
        rounded-full
        bg-white
        text-[#5B3DF6]
        font-semibold
        shadow-md
        transition
        hover:bg-[#ffe158]
        hover:text-[#23185B]
        focus:outline-none
        focus:ring-2 focus:ring-offset-2 focus:ring-[#5B3DF6]
        text-base
      "
      title={loggedIn ? "Logout" : "Login"}
    >
      {loggedIn ? <LogOut size={18} /> : <LogIn size={18} />}
      {loggedIn ? "Logout" : "Login"}
    </motion.button>
  );
}
