import { Metadata } from "next";
import { notFound } from "next/navigation";
import { parseArray } from "@/utils/jsonParser";
import PackageDetailClient from "@/components/package/PackageDetailClient";
import { db } from "@/db";
import { trekkingPackages } from "@/db/schema";
import { eq, or, not } from "drizzle-orm";

const normalizePackage = (pkg: any) => ({
  ...pkg,
  galleryImages: parseArray(pkg.galleryImages),
  packageTypes: typeof pkg.packageTypes === 'string' ? JSON.parse(pkg.packageTypes) : pkg.packageTypes,
  thingsToBring: parseArray(pkg.thingsToBring),
  itinerary: parseArray(pkg.itinerary),
  faq: parseArray(pkg.faq),
  relatedPackageIds: parseArray(pkg.relatedPackageIds),
});

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const packages = await db.select({ slug: trekkingPackages.slug }).from(trekkingPackages);
  return packages.map((pkg) => ({
    id: pkg.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const rawPkg = await db.select().from(trekkingPackages).where(or(eq(trekkingPackages.slug, id), eq(trekkingPackages.id, id))).limit(1);
  const pkg = rawPkg[0] ? normalizePackage(rawPkg[0]) : null;

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
  const rawPkg = await db.select().from(trekkingPackages).where(or(eq(trekkingPackages.slug, id), eq(trekkingPackages.id, id))).limit(1);
  const pkg = rawPkg[0] ? normalizePackage(rawPkg[0]) : null;

  if (!pkg) {
    notFound();
  }

  const rawRelatedPackages = await db.select().from(trekkingPackages).where(not(eq(trekkingPackages.id, pkg.id))).limit(2);
  const relatedPackages = rawRelatedPackages.map(normalizePackage);

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
        item: "https://rinjanihero.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Packages",
        item: "https://rinjanihero.org/#packages",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: pkg.title,
        item: `https://rinjanihero.org/packages/${pkg.slug}`,
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
