import * as dotenv from "dotenv";
dotenv.config();

import { db } from "./index";
import * as schema from "./schema";
import {
  initialWebsiteSettings,
  initialRoutes,
  initialTrekkingPackages,
  initialTransportationServices,
  initialETicketOptions,
  initialTestimonials,
  initialGallery,
  initialFAQs,
  initialBlogPosts,
  initialVouchers,
  initialBookings,
} from "../data/mockData";

async function seed() {
  console.log("🌱 Memulai seeding database MySQL Hostinger...");

  try {
    // 1. Website Settings
    console.log("Seeding Website Settings...");
    await db.insert(schema.websiteSettings).values({
      id: "default",
      companyName: initialWebsiteSettings.companyName || "Rinjani Hero",
      siteName: initialWebsiteSettings.siteName || "Rinjani Hero Expedition",
      tagline: initialWebsiteSettings.tagline || "",
      contactWhatsapp: initialWebsiteSettings.contactWhatsapp || "",
      contactPhone: initialWebsiteSettings.contactPhone || "",
      contactEmail: initialWebsiteSettings.contactEmail || "",
      address: initialWebsiteSettings.address || "",
      officeAddress: initialWebsiteSettings.officeAddress || "",
      googleMapsEmbed: initialWebsiteSettings.googleMapsEmbed || "",
      facebookUrl: initialWebsiteSettings.facebookUrl || "",
      instagramUrl: initialWebsiteSettings.instagramUrl || "",
      tripAdvisorUrl: initialWebsiteSettings.tripAdvisorUrl || "",
      youtubeUrl: initialWebsiteSettings.youtubeUrl || "",
      heroBadgeText: initialWebsiteSettings.heroBadgeText || "",
      heroHeading: initialWebsiteSettings.heroHeading || "",
      heroSubheading: initialWebsiteSettings.heroSubheading || "",
      heroBackgroundImage: initialWebsiteSettings.heroBackgroundImage || "",
    });

    // 2. Routes
    console.log("Seeding Routes Info...");
    for (const route of initialRoutes) {
      await db.insert(schema.routes).values({
        id: route.id,
        name: route.name,
        subtitle: route.subtitle,
        description: route.description,
        highlights: route.highlights || [],
        coverImage: route.coverImage,
        altitudeMapImage: route.altitudeMapImage,
        difficulty: route.difficulty,
        bestFor: route.bestFor,
      });
    }

    // 3. Trekking Packages
    console.log("Seeding Trekking Packages...");
    for (const pkg of initialTrekkingPackages) {
      await db.insert(schema.trekkingPackages).values({
        id: pkg.id,
        slug: pkg.slug,
        title: pkg.title,
        route: pkg.route,
        durationDays: pkg.durationDays,
        durationNights: pkg.durationNights,
        difficulty: pkg.difficulty,
        maxAltitude: pkg.maxAltitude,
        meetingPoint: pkg.meetingPoint,
        priceUSD: pkg.priceUSD,
        priceIDR: pkg.priceIDR,
        depositPercentage: pkg.depositPercentage,
        isPopular: pkg.isPopular || false,
        isFeatured: pkg.isFeatured || false,
        shortDescription: pkg.shortDescription,
        overview: pkg.overview,
        coverImage: pkg.coverImage,
        galleryImages: pkg.galleryImages || [],
        includes: pkg.includes || [],
        excludes: pkg.excludes || [],
        thingsToBring: pkg.thingsToBring || [],
        itinerary: pkg.itinerary || [],
        faq: pkg.faq || [],
        relatedPackageIds: pkg.relatedPackageIds || [],
        seoTitle: pkg.seoTitle,
        seoDescription: pkg.seoDescription,
      });
    }

    // 4. Transportation Services
    console.log("Seeding Transportation Services...");
    for (const item of initialTransportationServices) {
      await db.insert(schema.transportationServices).values({
        id: item.id,
        destination: item.destination,
        vehicleType: item.vehicleType,
        capacity: item.capacity,
        priceUSD: item.priceUSD,
        priceIDR: item.priceIDR,
        duration: item.duration,
        description: item.description,
        iconName: item.iconName,
      });
    }

    // 5. E-Tickets
    console.log("Seeding E-Tickets...");
    for (const item of initialETicketOptions) {
      await db.insert(schema.etickets).values({
        id: item.id,
        title: item.title,
        description: item.description,
        priceUSD: item.priceUSD,
        priceIDR: item.priceIDR,
        features: item.features || [],
        requirements: item.requirements || [],
      });
    }

    // 6. Testimonials
    console.log("Seeding Testimonials...");
    for (const item of initialTestimonials) {
      await db.insert(schema.testimonials).values({
        id: item.id,
        name: item.name,
        country: item.country,
        countryCode: item.countryCode,
        rating: item.rating,
        date: item.date,
        packageTitle: item.packageTitle,
        comment: item.comment,
        avatarUrl: item.avatarUrl || "",
        isVerified: item.isVerified !== undefined ? item.isVerified : true,
        source: item.source,
      });
    }

    // 7. Gallery
    console.log("Seeding Gallery Items...");
    for (const item of initialGallery) {
      await db.insert(schema.gallery).values({
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        category: item.category,
        date: item.date,
        location: item.location,
      });
    }

    // 8. FAQs
    console.log("Seeding FAQ Items...");
    for (const item of initialFAQs) {
      await db.insert(schema.faqs).values({
        id: item.id,
        question: item.question,
        answer: item.answer,
        category: item.category,
      });
    }

    // 9. Blog Posts
    console.log("Seeding Blog Posts...");
    for (const item of initialBlogPosts) {
      await db.insert(schema.blogPosts).values({
        id: item.id,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        coverImage: item.coverImage,
        category: item.category || "",
        tags: item.tags || [],
        author: item.author || "Rinjani Hero Team",
        publishedAt: item.publishedAt || item.date || "",
        date: item.date || "",
        readingTimeMinutes: item.readingTimeMinutes || 5,
        readTime: item.readTime || "5 min read",
        status: item.status || "Published",
        isPublished: item.isPublished !== undefined ? item.isPublished : true,
        metaTitle: item.metaTitle || item.seoTitle || item.title,
        seoTitle: item.seoTitle || item.metaTitle || item.title,
        metaDescription: item.metaDescription || item.seoDescription || item.excerpt,
        seoDescription: item.seoDescription || item.metaDescription || item.excerpt,
      });
    }

    // 10. Vouchers
    console.log("Seeding Vouchers...");
    for (const item of initialVouchers) {
      await db.insert(schema.vouchers).values({
        id: item.id,
        code: item.code,
        type: item.type || item.discountType || "percentage",
        discountType: item.discountType || item.type || "percentage",
        value: item.value || item.discountValue || 0,
        discountValue: item.discountValue || item.value || 0,
        minSpendUSD: item.minSpendUSD || 0,
        maxDiscountUSD: item.maxDiscountUSD || 0,
        validUntil: item.validUntil || item.expiresAt || "",
        expiresAt: item.expiresAt || item.validUntil || "",
        usageLimit: item.usageLimit || item.maxUsage || 100,
        maxUsage: item.maxUsage || item.usageLimit || 100,
        usedCount: item.usedCount || 0,
        isActive: item.isActive !== undefined ? item.isActive : true,
      });
    }

    // 11. Bookings
    console.log("Seeding Booking Orders...");
    for (const item of initialBookings) {
      await db.insert(schema.bookingOrders).values({
        id: item.id,
        orderNumber: item.orderNumber,
        createdAt: item.createdAt,
        serviceType: item.serviceType,
        packageId: item.packageId || "",
        packageTitle: item.packageTitle,
        trekDate: item.trekDate,
        participants: item.participants || {},
        customer: item.customer || {},
        pricing: item.pricing || {},
        paymentStatus: item.paymentStatus,
        paymentMethod: item.paymentMethod || "",
        paymentPaidAt: item.paymentPaidAt || "",
        trackingSource: item.trackingSource || {},
      });
    }

    console.log("✅ Seeding database berhasil selesai tanpa error!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat seeding:", error);
    process.exit(1);
  }
}

seed();
