import HeroBanner from "@/components/home/HeroBanner";
import AboutPreview from "@/components/home/AboutPreview";
import PopularPackages from "@/components/home/PopularPackages";
import SembalunRouteSection from "@/components/home/SembalunRouteSection";
import SenaruRouteSection from "@/components/home/SenaruRouteSection";
import ToreanRouteSection from "@/components/home/ToreanRouteSection";
import TransportationSection from "@/components/home/TransportationSection";
import ETicketSection from "@/components/home/ETicketSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import GallerySection from "@/components/home/GallerySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <AboutPreview />
      <PopularPackages />
      <SembalunRouteSection />
      <SenaruRouteSection />
      <ToreanRouteSection />
      <TransportationSection />
      <ETicketSection />
      <WhyChooseUs />
      <GallerySection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
