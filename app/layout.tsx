import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ClientNavBarWrapper } from "@/components/Layout/ClientNavBarWrapper";
import Footer from "@/components/Layout/Footer";
import { Suspense } from "react";
import LayoutWrapper from "@/components/Layout/LayoutWrapper";
import ClientOnly from "@/components/Layout/ClientOnly";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pass It On – Student Marketplace",
  description:
    "Pass It On is a student marketplace for college students to buy, sell, and exchange items easily and securely. Built by students, for students.",
  keywords: [
    "student marketplace",
    "buy college items",
    "sell textbooks",
    "Pass It On",
    "college resale platform",
    "Kiet Group Of Institutions",
    "used laptops",
    "used gadgets",
    "student deals",
  ],
openGraph: {
  title: "Pass It On – Pass Karo Earn Karo",
  description: "Buy & sell items within your college. Easy, fast, and secure.",
  url: "https://www.passiton.cash",
  siteName: "Pass It On",
  images: [
    {
      url: "https://www.passiton.cash/logo3.jpeg", // ✅ static path
      width: 1200,
      height: 630,
      alt: "Pass It On - Buy & Sell in College",
    },
  ],
  type: "website",
},
twitter: {
  card: "summary_large_image",
  title: "Pass It On – Student Marketplace",
  description: "Buy and sell your college items securely. Built by students, for students.",
  images: ["https://www.passiton.cash/logo3.jpeg"], // ✅ static path
  creator: "@passiton.cash",
},
  metadataBase: new URL("https://www.passiton.cash"),
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This hook only works in client components, so wrap NavBar in a client component
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href="https://www.passiton.cash" />
      </head>
      <body
        style={{ fontFamily: "Sora, sans-serif" }}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientOnly>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ClientOnly>
      </body>
    </html>
  );
}

// Client component to conditionally render NavBar
