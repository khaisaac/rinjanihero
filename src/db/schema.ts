import { mysqlTable, varchar, text, longtext, int, float, boolean, json } from "drizzle-orm/mysql-core";

// 1. Website Settings
export const websiteSettings = mysqlTable("website_settings", {
  id: varchar("id", { length: 50 }).primaryKey().default("default"),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  siteName: varchar("site_name", { length: 255 }),
  tagline: varchar("tagline", { length: 255 }).notNull(),
  contactWhatsapp: varchar("contact_whatsapp", { length: 100 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 100 }).notNull(),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  address: text("address").notNull(),
  officeAddress: text("office_address"),
  googleMapsEmbed: text("google_maps_embed").notNull(),
  facebookUrl: varchar("facebook_url", { length: 500 }).notNull(),
  instagramUrl: varchar("instagram_url", { length: 500 }).notNull(),
  tripAdvisorUrl: varchar("tripadvisor_url", { length: 500 }).notNull(),
  youtubeUrl: varchar("youtube_url", { length: 500 }).notNull(),
  heroBadgeText: varchar("hero_badge_text", { length: 255 }).notNull(),
  heroHeading: varchar("hero_heading", { length: 255 }).notNull(),
  heroSubheading: text("hero_subheading").notNull(),
  heroBackgroundImage: text("hero_background_image").notNull(),
  packageStandardDesc: text("package_standard_desc"),
  packagePrivateDesc: text("package_private_desc"),
  packageMeetingPointDesc: text("package_meeting_point_desc"),
});

// 2. Routes Info
export const routes = mysqlTable("routes", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }).notNull(),
  description: text("description").notNull(),
  highlights: json("highlights").notNull(), // string[]
  coverImage: text("cover_image").notNull(),
  altitudeMapImage: text("altitude_map_image").notNull(),
  difficulty: varchar("difficulty", { length: 100 }).notNull(),
  bestFor: varchar("best_for", { length: 255 }).notNull(),
});

// 3. Trekking Packages
export const trekkingPackages = mysqlTable("trekking_packages", {
  id: varchar("id", { length: 100 }).primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  route: varchar("route", { length: 100 }).notNull(),
  finishRoute: varchar("finish_route", { length: 100 }),
  durationDays: int("duration_days").notNull(),
  durationNights: int("duration_nights").notNull(),
  difficulty: varchar("difficulty", { length: 100 }).notNull(),
  maxAltitude: varchar("max_altitude", { length: 100 }).notNull(),
  meetingPoint: varchar("meeting_point", { length: 255 }).notNull(),
  priceUSD: float("price_usd").notNull(),
  priceIDR: float("price_idr").notNull(),
  depositPercentage: int("deposit_percentage").notNull(),
  isPopular: boolean("is_popular").default(false),
  isFeatured: boolean("is_featured").default(false),
  shortDescription: text("short_description").notNull(),
  overview: text("overview").notNull(),
  coverImage: text("cover_image").notNull(),
  galleryImages: json("gallery_images").notNull(), // string[]
  packageTypes: json("package_types").notNull(), // object
  thingsToBring: json("things_to_bring").notNull(), // string[]
  pricingMatrix: json("pricing_matrix"), // object[]
  itinerary: json("itinerary").notNull(), // object[]
  faq: json("faq").notNull(), // object[]
  relatedPackageIds: json("related_package_ids"), // string[]
  seoTitle: varchar("seo_title", { length: 255 }).notNull(),
  seoDescription: text("seo_description").notNull(),
});

// 4. Transportation Services
export const transportationServices = mysqlTable("transportation_services", {
  id: varchar("id", { length: 100 }).primaryKey(),
  destination: varchar("destination", { length: 255 }).notNull(),
  vehicleType: varchar("vehicle_type", { length: 255 }).notNull(),
  capacity: varchar("capacity", { length: 100 }).notNull(),
  priceUSD: float("price_usd").notNull(),
  priceIDR: float("price_idr").notNull(),
  duration: varchar("duration", { length: 100 }).notNull(),
  description: text("description").notNull(),
  iconName: varchar("icon_name", { length: 100 }).notNull(),
});

// 5. E-Tickets
export const etickets = mysqlTable("etickets", {
  id: varchar("id", { length: 100 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  priceUSD: float("price_usd").notNull(),
  priceIDR: float("price_idr").notNull(),
  features: json("features").notNull(), // string[]
  requirements: json("requirements").notNull(), // string[]
});

// 6. Testimonials
export const testimonials = mysqlTable("testimonials", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  countryCode: varchar("country_code", { length: 20 }).notNull(),
  rating: int("rating").notNull(),
  date: varchar("date", { length: 100 }).notNull(),
  packageTitle: varchar("package_title", { length: 255 }).notNull(),
  comment: text("comment").notNull(),
  avatarUrl: text("avatar_url"),
  isVerified: boolean("is_verified").default(true).notNull(),
  source: varchar("source", { length: 100 }).notNull(),
});

// 7. Gallery Items
export const gallery = mysqlTable("gallery", {
  id: varchar("id", { length: 100 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  imageUrl: text("image_url").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  date: varchar("date", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
});

// 8. FAQ Items
export const faqs = mysqlTable("faqs", {
  id: varchar("id", { length: 100 }).primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
});

// 9. Blog Posts
export const blogPosts = mysqlTable("blog_posts", {
  id: varchar("id", { length: 100 }).primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: longtext("content").notNull(),
  coverImage: text("cover_image").notNull(),
  category: varchar("category", { length: 100 }),
  tags: json("tags").notNull(), // string[]
  author: json("author").notNull(), // any / object / string
  publishedAt: varchar("published_at", { length: 100 }),
  date: varchar("date", { length: 100 }),
  readingTimeMinutes: int("reading_time_minutes"),
  readTime: varchar("read_time", { length: 100 }),
  status: varchar("status", { length: 100 }).default("Published"),
  isPublished: boolean("is_published").default(true),
  metaTitle: varchar("meta_title", { length: 500 }),
  seoTitle: varchar("seo_title", { length: 500 }),
  metaDescription: text("meta_description"),
  seoDescription: text("seo_description"),
});

// 10. Vouchers
export const vouchers = mysqlTable("vouchers", {
  id: varchar("id", { length: 100 }).primaryKey(),
  code: varchar("code", { length: 100 }).notNull().unique(),
  type: varchar("type", { length: 100 }),
  discountType: varchar("discount_type", { length: 100 }),
  value: float("value"),
  discountValue: float("discount_value"),
  minSpendUSD: float("min_spend_usd").notNull(),
  maxDiscountUSD: float("max_discount_usd"),
  validUntil: varchar("valid_until", { length: 100 }),
  expiresAt: varchar("expires_at", { length: 100 }),
  usageLimit: int("usage_limit"),
  maxUsage: int("max_usage"),
  usedCount: int("used_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// 11. Booking Orders
export const bookingOrders = mysqlTable("booking_orders", {
  id: varchar("id", { length: 100 }).primaryKey(),
  orderNumber: varchar("order_number", { length: 100 }).notNull().unique(),
  createdAt: varchar("created_at", { length: 100 }).notNull(),
  serviceType: varchar("service_type", { length: 100 }).notNull(),
  packageId: varchar("package_id", { length: 100 }),
  packageType: varchar("package_type", { length: 100 }),
  packageTitle: varchar("package_title", { length: 255 }).notNull(),
  trekDate: varchar("trek_date", { length: 100 }).notNull(),
  participants: json("participants").notNull(), // object
  customer: json("customer").notNull(), // object
  pricing: json("pricing").notNull(), // object
  paymentStatus: varchar("payment_status", { length: 100 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 100 }),
  paymentPaidAt: varchar("payment_paid_at", { length: 100 }),
  trackingSource: json("tracking_source").notNull(), // object
});
