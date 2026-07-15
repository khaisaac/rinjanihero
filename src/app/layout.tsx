import { Suspense } from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmartBackNav from "@/components/common/SmartBackNav";
import AnalyticsTracker from "@/components/common/AnalyticsTracker";
import DatabaseInitializer from "@/components/common/DatabaseInitializer";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Rinjani Hero | #1 Mount Rinjani Trekking Specialist & Tour Guide",
    template: "%s | Rinjani Hero Trekking Specialist",
  },
  description:
    "Explore Mount Rinjani with Lombok's #1 official local trekking operator since 2013. We provide unforgettable Sembalun, Senaru, and Torean trekking routes with professional guides, safety-first standards, and best price guarantee.",
  keywords: [
    "Mount Rinjani Trekking",
    "Rinjani Trekking Package",
    "Sembalun Route",
    "Senaru Route",
    "Torean Route",
    "Segara Anak Lake",
    "Rinjani Summit Trek",
    "Lombok Tour Operator",
    "E-Rinjani Ticket",
    "Rinjani Hero",
  ],
  authors: [{ name: "Rinjani Hero Team", url: "https://rinjanihero.com" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rinjanihero.com",
    title: "Rinjani Hero | Mount Rinjani Trekking & Tour Specialist",
    description:
      "Experience the beauty of Mount Rinjani with experienced local guides. Sembalun, Senaru, & Torean routes. Safe, reliable, and best price guaranteed.",
    siteName: "Rinjani Hero",
    images: [
      {
        url: "/hero-rinjani.webp",
        width: 1200,
        height: 630,
        alt: "Mount Rinjani Summit & Crater Lake Segara Anak",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rinjani Hero | #1 Mount Rinjani Trekking Specialist",
    description: "Book your unforgettable Mount Rinjani trekking adventure with professional local guides.",
    images: ["/hero-rinjani.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Rinjani Hero",
    image: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80",
    description: "Official local trekking operator in Lombok specializing in Mount Rinjani expeditions since 2013.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jalan Pariwisata Senaru",
      addressLocality: "Senaru, Bayan",
      addressRegion: "North Lombok",
      postalCode: "83354",
      addressCountry: "ID",
    },
    telephone: "+6285338938083",
    email: "rinjanihero@gmail.com",
    url: "https://rinjanihero.com",
    priceRange: "$$-$$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "824",
    },
  };

  return (
    <html lang="en" className={`${jakartaSans.variable} h-full antialiased scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F8FAF9] text-[#122826] selection:bg-[#18979B] selection:text-white">
        <Suspense fallback={null}>
          <AnalyticsTracker />
          <DatabaseInitializer />
        </Suspense>
        <Navbar />
        <SmartBackNav />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
