"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mountain,
  PhoneCall,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [packagesDropdownOpen, setPackagesDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { settings, packages } = useCMSStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const popularPackages = (Array.isArray(packages) ? packages : []).filter((p) => p.isPopular || p.isFeatured).slice(0, 4);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#18979B]/95 backdrop-blur-md shadow-lg border-b border-white/20 py-3"
          : "bg-[#18979B] border-b border-white/15 py-4 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center group py-1">
            <img
              src="/rinjani.webp"
              alt="Rinjani Hero Logo"
              className="h-11 sm:h-13 w-auto object-contain group-hover:scale-105 transition duration-300 drop-shadow-md"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-white/85">
            <Link
              href="/"
              className={`hover:text-[#FEF9EB] transition py-1 ${
                pathname === "/" ? "text-[#FEF9EB] font-extrabold" : ""
              }`}
            >
              Home
            </Link>

            {/* Packages Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPackagesDropdownOpen(true)}
              onMouseLeave={() => setPackagesDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 hover:text-[#FEF9EB] transition py-1 ${
                  pathname.startsWith("/packages") ? "text-[#FEF9EB] font-extrabold" : ""
                }`}
              >
                <span>Trekking Packages</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${packagesDropdownOpen ? "rotate-180 text-[#FEF9EB]" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {packagesDropdownOpen && (
                <div className="absolute top-full left-0 w-80 bg-[#13797C] border border-white/20 rounded-2xl shadow-2xl p-3 grid gap-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="text-[11px] uppercase tracking-wider text-[#FEF9EB] font-bold px-3 py-1.5 border-b border-white/15 flex items-center justify-between">
                    <span>Popular Routes</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  {popularPackages.map((pkg) => (
                    <Link
                      key={pkg.id}
                      href={`/packages/${pkg.slug}`}
                      className="block p-2.5 rounded-xl hover:bg-white/15 transition group"
                    >
                      <div className="text-sm font-semibold text-white group-hover:text-[#FEF9EB] transition line-clamp-1">
                        {pkg.title}
                      </div>
                      <div className="text-xs text-white/80 flex items-center justify-between mt-1">
                        <span className="capitalize text-[#FEF9EB]/90 font-medium">{pkg.route} Route</span>
                        <span className="font-bold text-white">${pkg.priceUSD}</span>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href="/#packages"
                    className="mt-1 block text-center text-xs font-bold text-white bg-white/15 hover:bg-white/25 py-2 rounded-xl transition border border-white/20"
                  >
                    View All Trekking Packages →
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/#routes"
              className={`hover:text-[#FEF9EB] transition py-1 ${
                pathname === "/#routes" ? "text-[#FEF9EB] font-extrabold" : ""
              }`}
            >
              Routes
            </Link>

            <Link
              href="/#transportation"
              className={`hover:text-[#FEF9EB] transition py-1 ${
                pathname === "/#transportation" ? "text-[#FEF9EB] font-extrabold" : ""
              }`}
            >
              Transportation
            </Link>

            <Link
              href="/#eticket"
              className={`hover:text-[#FEF9EB] transition py-1 ${
                pathname === "/#eticket" ? "text-[#FEF9EB] font-extrabold" : ""
              }`}
            >
              E-Rinjani Ticket
            </Link>

            <Link
              href="/blog"
              className={`hover:text-[#FEF9EB] transition py-1 ${
                pathname.startsWith("/blog") ? "text-[#FEF9EB] font-extrabold" : ""
              }`}
            >
              Blog
            </Link>

            <Link
              href="/#faq"
              className={`hover:text-[#FEF9EB] transition py-1 ${
                pathname === "/#faq" ? "text-[#FEF9EB] font-extrabold" : ""
              }`}
            >
              FAQ
            </Link>
          </nav>

          {/* Right CTAs & Contact */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${settings.contactWhatsapp.replace(/[^0-9]/g, "")}?text=Hello%20Rinjani%20Hero,%20I%20would%20like%20to%20inquire%20about%20trekking%20packages.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-white bg-[#13797C] hover:bg-[#122826] border border-white/25 px-4 py-2.5 rounded-xl transition shadow-sm whitespace-nowrap shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#FEF9EB] animate-pulse shrink-0" />
              <span className="whitespace-nowrap font-extrabold">{settings.contactWhatsapp}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:text-white bg-white/15 rounded-lg border border-white/20"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-white/20 space-y-2 pb-3 animate-in slide-in-from-top duration-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/15 transition"
            >
              Home
            </Link>
            <Link
              href="/#packages"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/15 transition"
            >
              Trekking Packages
            </Link>
            <Link
              href="/#routes"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/15 transition"
            >
              Sembalun, Senaru & Torean Routes
            </Link>
            <Link
              href="/#transportation"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/15 transition"
            >
              Transportation Services
            </Link>
            <Link
              href="/#eticket"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/15 transition"
            >
              E-Rinjani Entrance Ticket
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/15 transition"
            >
              Trekking Blog & Guides
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/15 transition"
            >
              FAQ & Preparation
            </Link>
            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.contactWhatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#13797C] hover:bg-[#122826] text-white font-bold py-3 rounded-xl text-sm transition border border-white/20 shadow-md"
              >
                <PhoneCall className="w-4 h-4 animate-pulse" />
                <span>WhatsApp Us: {settings.contactWhatsapp}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
