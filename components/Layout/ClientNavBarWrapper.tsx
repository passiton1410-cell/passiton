"use client";
import { usePathname } from "next/navigation";
import { NavBar } from "@/components/Layout/NavBar";

export function ClientNavBarWrapper() {
  const pathname = usePathname();
  // Hide NavBar on /auth and /auth/login (and any future /auth/* pages)
  if (pathname.startsWith("/auth")) return null;
  return <NavBar />;
}