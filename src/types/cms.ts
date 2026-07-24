export type RouteType = "sembalun" | "senaru" | "torean" | "private" | "custom";
export type DifficultyLevel = "Moderate" | "Moderate - Hard" | "Hard" | "Extreme";
export type PaymentStatus = "Pending" | "Deposit Paid" | "Fully Paid" | "Expired" | "Cancelled";
export type ServiceType = "Trekking" | "Transportation" | "E-Ticket";
export type PackageType = "Private" | "Standard" | "Meeting Point";

export interface PricingTier {
  id: string; // e.g. "1", "2-3", "4-5"
  groupSize: string;
  minPax: number;
  maxPax: number;
  pricePrivate: number;
  priceStandard: number;
  priceMeetingPoint: number;
}

export interface TrekkingPackage {
  id: string;
  slug: string;
  title: string;
  route: RouteType;
  finishRoute?: RouteType;
  durationDays: number;
  durationNights: number;
  difficulty: DifficultyLevel;
  maxAltitude: string;
  meetingPoint: string;
  priceUSD: number; // Keep as fallback / starting price
  priceIDR: number;
  pricingMatrix?: PricingTier[];
  depositPercentage: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  shortDescription: string;
  overview: string;
  coverImage: string;
  galleryImages: string[];
  packageTypes: {
    standard: {
      description: string;
      includes: string[];
      excludes: string[];
    };
    private: {
      description: string;
      includes: string[];
      excludes: string[];
    };
    meetingPoint: {
      description: string;
      includes: string[];
      excludes: string[];
    };
  };
  thingsToBring: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    altitude: string;
    meals: string;
    highlights: string[];
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  relatedPackageIds?: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface TransportationService {
  id: string;
  destination: string;
  vehicleType: string;
  capacity: string;
  priceUSD: number;
  priceIDR: number;
  duration: string;
  description: string;
  iconName: string;
}

export interface ETicketOption {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
  priceIDR: number;
  features: string[];
  requirements: string[];
}

export interface RouteInfo {
  id: RouteType;
  name: string;
  subtitle: string;
  description: string;
  highlights: string[];
  coverImage: string;
  altitudeMapImage: string;
  difficulty: DifficultyLevel;
  bestFor: string;
}

export interface Testimonial {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  rating: number;
  date: string;
  packageTitle: string;
  comment: string;
  avatarUrl?: string;
  isVerified: boolean;
  source: "TripAdvisor" | "Google" | "Direct";
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: RouteType | "summit" | "lake" | "camp";
  date: string;
  location: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "Preparation" | "Permits & Ticket" | "Weather & Season" | "Safety & Guide" | "Payment & Booking";
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML Quill output
  coverImage: string;
  category?: string;
  tags: string[];
  author: any; // string or object { name, role, avatar }
  publishedAt?: string;
  date?: string;
  readingTimeMinutes?: number;
  readTime?: string;
  status?: "Draft" | "Published" | "Scheduled";
  isPublished?: boolean;
  metaTitle?: string;
  seoTitle?: string;
  metaDescription?: string;
  seoDescription?: string;
}

export interface Voucher {
  id: string;
  code: string;
  type?: "percentage" | "fixed_usd" | "fixed";
  discountType?: "percentage" | "fixed_usd" | "fixed";
  value?: number;
  discountValue?: number;
  minSpendUSD: number;
  maxDiscountUSD?: number;
  validUntil?: string;
  expiresAt?: string;
  usageLimit?: number;
  maxUsage?: number;
  usedCount: number;
  isActive: boolean;
}

export interface BookingOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  serviceType: ServiceType;
  packageId?: string;
  packageType?: PackageType;
  packageTitle: string;
  trekDate: string;
  participants: {
    adults: number;
    children: number;
    extraPorters: number;
    privateGuide: boolean;
    additionalTravelers?: {
      fullName: string;
      nationality: string;
      passportNumber?: string;
      birthday?: string;
      height?: string;
      weight?: string;
      dietaryNotes?: string;
    }[];
  };
  customer: {
    fullName: string;
    email: string;
    phone: string;
    whatsapp: string;
    nationality: string;
    passportNumber?: string;
    birthday?: string;
    height?: string;
    weight?: string;
    dietaryNotes?: string;
    pickupLocation?: string;
  };
  pricing: {
    basePricePerPerson: number;
    subtotal: number;
    extrasTotal: number;
    voucherCode?: string;
    discountAmount: number;
    totalUSD: number;
    totalIDR: number;
    depositRequiredUSD: number;
    remainingBalanceUSD: number;
  };
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentPaidAt?: string;
  trackingSource: {
    referrer: string;
    returnUrl: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    websiteSource: string;
  };
}

export interface WebsiteSettings {
  companyName: string;
  siteName?: string;
  tagline: string;
  contactWhatsapp: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  officeAddress?: string;
  googleMapsEmbed: string;
  facebookUrl: string;
  instagramUrl: string;
  tripAdvisorUrl: string;
  youtubeUrl: string;
  heroBadgeText: string;
  heroHeading: string;
  heroSubheading: string;
  heroBackgroundImage: string;
  packageStandardDesc?: string;
  packagePrivateDesc?: string;
  packageMeetingPointDesc?: string;
  whyChooseUs?: WhyChooseUsItem[];
}

export interface WhyChooseUsItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}
