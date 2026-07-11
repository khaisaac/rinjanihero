import { Metadata } from "next";
import { notFound } from "next/navigation";
import { initialTrekkingPackages } from "@/data/mockData";
import { parseArray } from "@/utils/jsonParser";
import PackageDetailClient from "@/components/package/PackageDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return initialTrekkingPackages.map((pkg) => ({
    id: pkg.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const pkg = initialTrekkingPackages.find((p) => p.slug === id || p.id === id);

  if (!pkg) {
    return {
      title: "Package Not Found | Rinjani Hero",
    };
  }

  return {
    title: pkg.seoTitle || `${pkg.title} | Rinjani Hero`,
    description: pkg.seoDescription || pkg.shortDescription,
    openGraph: {
      title: pkg.title,
      description: pkg.shortDescription,
      images: [{ url: pkg.coverImage }],
    },
  };
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { id } = await params;
  const pkg = initialTrekkingPackages.find((p) => p.slug === id || p.id === id);

  if (!pkg) {
    notFound();
  }

  const relatedPackages = initialTrekkingPackages.filter((p) => p.id !== pkg.id).slice(0, 2);

  const touristTripSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.title,
    description: pkg.overview,
    touristType: ["Adventure Tourism", "Eco Tourism", "Mountain Climbing"],
    itinerary: parseArray(pkg.itinerary).map((day: any) => ({
      "@type": "Itinerary",
      day: day.day,
      name: day.title,
      description: day.description,
    })),
    offers: {
      "@type": "Offer",
      price: pkg.priceUSD,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://rinjanihero.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Packages",
        item: "https://rinjanihero.com/#packages",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: pkg.title,
        item: `https://rinjanihero.com/packages/${pkg.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristTripSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PackageDetailClient pkg={pkg} relatedPackages={relatedPackages} />
    </>
  );
}
