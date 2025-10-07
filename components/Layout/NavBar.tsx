"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { User, Menu, X, House, Info, Layers, List, Shield, ChevronDown, BookOpen, Smartphone, Sofa, Shirt, PenTool, Package, ShoppingBag, Briefcase, GraduationCap, Users, UserCheck } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import SearchBox from "../SearchBar";

export function NavBar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState<'products' | 'services' | null>(null);
  const [mobileCategoryView, setMobileCategoryView] = useState<'main' | 'products' | 'services'>('main');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data.loggedIn && data.user) {
          setUserRole(data.user.role);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesOpen) {
        setCategoriesOpen(false);
        setSelectedMainCategory(null);
      }
    };

    if (categoriesOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [categoriesOpen]);

  const categoryStructure = {
    products: {
      name: 'Products',
      icon: ShoppingBag,
      items: [
        { name: 'Books', icon: BookOpen, slug: 'books', href: '/buyer/books' },
        { name: 'Electronics', icon: Smartphone, slug: 'electronics', href: '/buyer/electronics' },
        { name: 'Furniture', icon: Sofa, slug: 'furniture', href: '/buyer/furniture' },
        { name: 'Clothing', icon: Shirt, slug: 'clothing', href: '/buyer/clothing' },
        { name: 'Stationery', icon: PenTool, slug: 'stationery', href: '/buyer/stationery' },
        { name: 'Other', icon: Package, slug: 'other', href: '/buyer/other' }
      ]
    },
    services: {
      name: 'Services',
      icon: Briefcase,
      items: [
        { name: 'Jobs', icon: Briefcase, slug: 'jobs', href: '/opportunities?type=jobs' },
        { name: 'Internships', icon: GraduationCap, slug: 'internships', href: '/opportunities?type=internship' },
        { name: 'Teaching', icon: Users, slug: 'teaching', href: '/opportunities?type=teaching' },
        { name: 'Coaching', icon: UserCheck, slug: 'coaching', href: '/opportunities?type=coaching' },
        { name: 'Mentorship', icon: User, slug: 'mentorship', href: '/opportunities?type=mentorship' },
        { name: 'Other Services', icon: Package, slug: 'other-services', href: '/opportunities?type=other' }
      ]
    }
  };

  const baseNavItems = [
    { name: "Home", icon: House, href: "/" },
    { name: "My Profile", icon: User, href: "/dashboard" },
    { name: "Sell", icon: Layers, href: "/seller" },
    { name: "Buy", icon: List, href: "/buyer" },
    { name: "About Us", icon: Info, href: "/about" },
  ];

  // Add admin dashboard for admin users
  const navItems = userRole === 'admin'
    ? [
        ...baseNavItems,
        { name: "Admin Dashboard", icon: Shield, href: "/admin" },
      ]
    : baseNavItems;

  return (
    <header className="w-full bg-[#FDF6FF] px-4 py-5 md:px-6 shadow-sm">
      <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#5B3DF6] via-[#E0D5FA] to-[#5B3DF6]" />
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding + Hamburger */}
        <div className="w-full md:w-auto flex items-center justify-between">
          {/* Branding Left */}
{/* Branding Left */}
<div
  className="flex items-center gap-3 cursor-pointer select-none"
  onClick={() => router.push("/")}
>
  <span className="inline-flex items-center justify-center rounded-full shadow-md">
    <Image
      src="/logo3.jpeg"
      alt="Brand Logo"
      width={84}   // doubled from 42
      height={84}  // doubled from 42
      className="rounded-full"
      priority
    />
  </span>
  <span
    className="text-[#5B3DF6] font-bold tracking-wider text-lg md:text-xl"
    style={{
      letterSpacing: "0.13em",
      fontFamily: "'Montserrat', 'Inter', Arial, sans-serif",
    }}
  >
    PASSITON
  </span>
  <span className="inline-flex items-center justify-center">
    <Image
      src="/startup_india.png"
      alt="Startup India"
      width={168}   // doubled from 84
      height={168}  // doubled from 84
      priority
    />
  </span>
</div>


          {/* Hamburger Right (Mobile only) */}
          <button
            className="p-2 rounded-full hover:bg-[#e0d5fa] transition block md:hidden"
            onClick={() => {
              setMenuOpen(true);
              setMobileCategoryView('main');
            }}
            aria-label="Open menu"
          >
            <Menu size={28} className="text-[#5B3DF6]" />
          </button>
        </div>

        {/* Search Box - full width mobile, center aligned desktop */}
        <div className="w-full md:flex-1 md:px-6">
          <SearchBox />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(({ name, icon: Icon, href }) => (
            <motion.button
              key={name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(href)}
              className="flex items-center gap-2 px-1 py-2 text-sm font-semibold text-[#5B3DF6] hover:bg-[#E0D5FA] transition rounded-full"
            >
              {name}
            </motion.button>
          ))}

          {/* Categories Dropdown */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setCategoriesOpen(!categoriesOpen);
                setSelectedMainCategory(null);
              }}
              className="flex items-center gap-2 px-1 py-2 text-sm font-semibold text-[#5B3DF6] hover:bg-[#E0D5FA] transition rounded-full"
            >
              Categories
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`}
              />
            </motion.button>

            {categoriesOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E0D5FA] z-50"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedMainCategory === null ? (
                  // Main category selection
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedMainCategory('products')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[#5B3DF6] hover:bg-[#E0D5FA] transition rounded-t-2xl border-b border-[#E0D5FA]"
                    >
                      <ShoppingBag size={18} />
                      Products
                      <ChevronDown size={14} className="ml-auto rotate-[-90deg]" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedMainCategory('services')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[#5B3DF6] hover:bg-[#E0D5FA] transition rounded-b-2xl"
                    >
                      <Briefcase size={18} />
                      Services
                      <ChevronDown size={14} className="ml-auto rotate-[-90deg]" />
                    </motion.button>
                  </>
                ) : (
                  // Sub-category selection
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E0D5FA] bg-[#E0D5FA]/50">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMainCategory(null)}
                        className="flex items-center gap-2 text-xs text-[#5B3DF6] hover:text-[#4a32d4]"
                      >
                        <ChevronDown size={12} className="rotate-90" />
                        Back
                      </motion.button>
                      <span className="text-sm font-semibold text-[#5B3DF6] flex-1">
                        {categoryStructure[selectedMainCategory].name}
                      </span>
                    </div>
                    {categoryStructure[selectedMainCategory].items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.slug}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            router.push(item.href);
                            setCategoriesOpen(false);
                            setSelectedMainCategory(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[#5B3DF6] hover:bg-[#E0D5FA] transition last:rounded-b-2xl"
                        >
                          <Icon size={18} />
                          {item.name}
                        </motion.button>
                      );
                    })}
                  </>
                )}
              </motion.div>
            )}
          </div>

          <LogoutButton />
        </nav>
      </div>

      {/* Mobile Slide-out Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex">
          <div className="bg-white w-72 h-full shadow-xl flex flex-col p-6 relative animate-slideInLeft">
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#e0d5fa] transition"
              onClick={() => {
                setMenuOpen(false);
                setMobileCategoryView('main');
              }}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col gap-6 mt-10">
              {navItems.map(({ name, icon: Icon, href }) => (
                <motion.button
                  key={name}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    router.push(href);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-5 py-3 rounded-full text-[#5B3DF6] font-medium bg-white hover:bg-[#ffe158] hover:text-[#23185B] shadow transition"
                >
                  <Icon size={22} />
                  {name}
                </motion.button>
              ))}

              {/* Categories Section in Mobile */}
              <div className="border-t border-[#E0D5FA] pt-4">
                {mobileCategoryView === 'main' ? (
                  <>
                    <div className="flex items-center justify-between px-5 mb-3">
                      <p className="text-sm font-semibold text-[#5B3DF6]">Categories</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setMobileCategoryView('products')}
                      className="flex items-center gap-3 px-5 py-3 rounded-full text-[#5B3DF6] font-medium bg-white hover:bg-[#ffe158] hover:text-[#23185B] shadow transition mb-2 w-full"
                    >
                      <ShoppingBag size={20} />
                      Products
                      <ChevronDown size={16} className="ml-auto rotate-[-90deg]" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setMobileCategoryView('services')}
                      className="flex items-center gap-3 px-5 py-3 rounded-full text-[#5B3DF6] font-medium bg-white hover:bg-[#ffe158] hover:text-[#23185B] shadow transition mb-2 w-full"
                    >
                      <Briefcase size={20} />
                      Services
                      <ChevronDown size={16} className="ml-auto rotate-[-90deg]" />
                    </motion.button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 px-5 mb-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMobileCategoryView('main')}
                        className="flex items-center gap-2 text-xs text-[#5B3DF6] hover:text-[#4a32d4]"
                      >
                        <ChevronDown size={12} className="rotate-90" />
                        Back
                      </motion.button>
                      <p className="text-sm font-semibold text-[#5B3DF6] flex-1">
                        {categoryStructure[mobileCategoryView].name}
                      </p>
                    </div>
                    {categoryStructure[mobileCategoryView].items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.slug}
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            router.push(item.href);
                            setMenuOpen(false);
                            setMobileCategoryView('main');
                          }}
                          className="flex items-center gap-3 px-5 py-3 rounded-full text-[#5B3DF6] font-medium bg-white hover:bg-[#ffe158] hover:text-[#23185B] shadow transition mb-2 w-full"
                        >
                          <Icon size={20} />
                          {item.name}
                        </motion.button>
                      );
                    })}
                  </>
                )}
              </div>

              <LogoutButton />
            </div>
          </div>
          <div className="flex-1" onClick={() => {
            setMenuOpen(false);
            setMobileCategoryView('main');
          }} />
            
        </div>
        
      )}
      
    </header>
    
  );
}
