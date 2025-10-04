import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f8f4f0] text-[#3a2f45] px-6 py-12 font-[Inter,sans-serif]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:place-items-center md:place-items-start">
        {/* Logo and About */}
        <div className="flex flex-col items-center sm:items-center md:items-start text-center sm:text-center md:text-left">
          <Image src="/startup_india.png" alt="PassitOn Logo" width={120} height={40} />
          <p className="text-sm mt-4 text-[#5e5471] max-w-xs leading-relaxed">
            PassitOn is your student-to-student marketplace for buying and selling essentials at college-friendly prices.
          </p>
        </div>

        {/* Marketplace */}
        <div className="text-center sm:text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4 text-[#7e5a9b] tracking-wide">Marketplace</h3>
          <ul className="space-y-2 text-sm text-[#5e5471]">
            <li>
              <Link className="hover:text-[#aa7bb8] transition-colors" href="/buyer">
                Buy Something?
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#aa7bb8] transition-colors" href="/seller">
                Sell Something?
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="text-center sm:text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4 text-[#7e5a9b] tracking-wide">Quick Links</h3>
          <ul className="space-y-2 text-sm text-[#5e5471]">
            <li><Link className="hover:text-[#aa7bb8] transition-colors" href="/">Home</Link></li>
            <li><Link className="hover:text-[#aa7bb8] transition-colors" href="/about">About</Link></li>
            <li><Link className="hover:text-[#aa7bb8] transition-colors" href="#">FAQs</Link></li>
            <li><Link className="hover:text-[#aa7bb8] transition-colors" href="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact Icons */}
        <div className="text-center sm:text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4 text-[#7e5a9b] tracking-wide">Contact</h3>
          <div className="flex justify-center sm:justify-center md:justify-start space-x-5 text-[#7e5a9b]">
            <a href="https://www.linkedin.com/company/pass-it-on-–-pass-karo-earn-karo/" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-5 h-5 hover:text-[#aa7bb8] transition-colors" />
            </a>
            <a href="mailto:hi@passiton.cash" target="_blank" rel="noopener noreferrer">
              <Mail className="w-5 h-5 hover:text-[#aa7bb8] transition-colors" />
            </a>
            <a href="https://instagram.com/passiton.cash" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-5 h-5 hover:text-[#aa7bb8] transition-colors" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-[#e7d7ce] mt-10 pt-5 text-center text-sm text-[#6e5e87]">
        © {new Date().getFullYear()} PassitOn. All rights reserved.
      </div>
      <div className="text-center text-sm text-[#6e5e87]">
        Powered By Quantum Leap Systems LLP.
      </div>
    </footer>
  );
}
