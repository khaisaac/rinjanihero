"use client";

import Link from "next/link";
import {
  Mountain,
  MapPin,
  PhoneCall,
  Mail,
  ShieldCheck,
  CreditCard,
  Award,
  Heart,
  Globe,
  CheckCircle2,
  Share2,
  Compass,
} from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";

export default function Footer() {
  const { settings } = useCMSStore();

  return (
    <footer className="bg-[#122826] text-white pt-16 pb-10 border-t border-white/10 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#18979B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4A017]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand Info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group py-1">
              <img
                src="/rinjani.webp"
                alt="Rinjani Hero Logo"
                className="h-12 sm:h-14 w-auto object-contain group-hover:scale-105 transition drop-shadow-lg"
              />
            </Link>

            <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
              Official Senaru Village basecamp operator since 2013. We deliver high-altitude safety, storm-rated equipment, and fair porter welfare on Mount Rinjani.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" /> Official Licensed National Park Operator
              </span>
            </div>

            {/* Social Icons (SVGs + Lucide) */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#18979B] flex items-center justify-center transition text-white"
                aria-label="Instagram"
              >
                <Share2 className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#18979B] flex items-center justify-center transition text-white"
                aria-label="Facebook"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#18979B] flex items-center justify-center transition text-white"
                aria-label="YouTube"
              >
                <Compass className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#D4A017]">
              Expeditions
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/#packages" className="hover:text-white transition">
                  Sembalun Summit 2D1N
                </Link>
              </li>
              <li>
                <Link href="/#packages" className="hover:text-white transition">
                  Sembalun & Torean 3D2N
                </Link>
              </li>
              <li>
                <Link href="/#packages" className="hover:text-white transition">
                  Senaru Crater Sunset 2D1N
                </Link>
              </li>
              <li>
                <Link href="/#packages" className="hover:text-white transition">
                  Complete Lake Loop 4D3N
                </Link>
              </li>
              <li>
                <Link href="/#transportation" className="hover:text-white transition">
                  Private Lombok Transfers
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#D4A017]">
              Essential Guide
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/#about" className="hover:text-white transition">
                  About Senaru Guides
                </Link>
              </li>
              <li>
                <Link href="/#eticket" className="hover:text-white transition">
                  National Park E-Tickets
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition">
                  Trekking FAQ & Altitude
                </Link>
              </li>
              <li>
                <Link href="/#why-choose-us" className="hover:text-white transition">
                  Porter Welfare Standard
                </Link>
              </li>
              <li>
                <Link href="/#gallery" className="hover:text-white transition">
                  Expedition Moments
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#D4A017]">
              Direct Senaru Office
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#18979B] shrink-0 mt-1" />
                <span>{settings.officeAddress || settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-[#18979B] shrink-0" />
                <a href={`tel:${settings.contactPhone}`} className="hover:text-white">
                  {settings.contactWhatsapp} (24/7 WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#18979B] shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white">
                  {settings.contactEmail}
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/booking"
                className="inline-block bg-[#18979B] hover:bg-[#13797C] text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow transition"
              >
                Instant Permit Check
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {settings.siteName || settings.companyName}. All Rights Reserved.</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by Senaru Mountain Guides
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-gray-300 font-semibold">
              <CreditCard className="w-4 h-4 text-[#D4A017]" />
              <span>Secure DOKU Payment Gateway</span>
            </span>
            <span className="text-gray-500">|</span>
            <Link href="/admin" className="hover:text-[#18979B] transition">
              Basecamp Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
