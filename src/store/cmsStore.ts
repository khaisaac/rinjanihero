import { create } from "zustand";
import { persist } from "zustand/middleware";
import { parseArray, parseJson } from "@/utils/jsonParser";
import {
  TrekkingPackage,
  TransportationService,
  ETicketOption,
  RouteInfo,
  Testimonial,
  GalleryItem,
  FAQItem,
  BlogPost,
  Voucher,
  WebsiteSettings,
  BookingOrder,
  PaymentStatus,
  ServiceType,
} from "@/types/cms";
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
} from "@/data/mockData";

const resolveMediaUrl = (url?: string, routeOrSlug?: string): string => {
  if (!url || typeof url !== "string" || url.includes("unsplash.com") || url.includes("placeholder")) {
    const key = (routeOrSlug || url || "").toLowerCase();
    if (key.includes("sembalun") || key.includes("2d1n-sembalun")) return "/sembalun.webp";
    if (key.includes("senaru") || key.includes("sunset") || key.includes("crater")) return "/senaru.webp";
    if (key.includes("torean") || key.includes("lake") || key.includes("3d2n")) return "/torean.webp";
    return "/hero-rinjani.webp";
  }
  return url;
};

const normalizePackage = (pkg: any): TrekkingPackage => ({
  ...pkg,
  coverImage: resolveMediaUrl(pkg?.coverImage, pkg?.route || pkg?.slug || pkg?.title),
  galleryImages: parseArray(pkg?.galleryImages).map((img: string) => resolveMediaUrl(img, pkg?.route || pkg?.slug)),
  includes: parseArray(pkg?.includes),
  excludes: parseArray(pkg?.excludes),
  thingsToBring: parseArray(pkg?.thingsToBring),
  itinerary: parseArray(pkg?.itinerary),
  faq: parseArray(pkg?.faq),
  relatedPackageIds: parseArray(pkg?.relatedPackageIds),
});

const normalizeRoute = (route: any): RouteInfo => ({
  ...route,
  coverImage: resolveMediaUrl(route?.coverImage, route?.id || route?.title),
  highlights: parseArray(route?.highlights),
});

const normalizeBlog = (blog: any): BlogPost => ({
  ...blog,
  coverImage: resolveMediaUrl(blog?.coverImage, blog?.slug || blog?.title),
  tags: parseArray(blog?.tags),
});

const normalizeETicket = (ticket: any): ETicketOption => ({
  ...ticket,
  features: parseArray(ticket?.features),
  requirements: parseArray(ticket?.requirements),
});

export interface BookingPrefill {
  serviceType: ServiceType;
  packageId?: string;
  route?: string;
  date?: string;
  adults?: number;
  returnUrl?: string;
}

interface CMSStoreState {
  settings: WebsiteSettings;
  routes: RouteInfo[];
  packages: TrekkingPackage[];
  transportation: TransportationService[];
  eTickets: ETicketOption[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  faqs: FAQItem[];
  blogPosts: BlogPost[];
  vouchers: Voucher[];
  bookings: BookingOrder[];
  bookingPrefill: BookingPrefill | null;

  // Actions
  updateSettings: (newSettings: Partial<WebsiteSettings>) => void;

  // Packages
  addPackage: (pkg: TrekkingPackage) => void;
  updatePackage: (id: string, updated: Partial<TrekkingPackage>) => void;
  deletePackage: (id: string) => void;

  // Routes
  updateRoute: (id: string, updated: Partial<RouteInfo>) => void;

  // Transportation
  addTransportation: (item: TransportationService) => void;
  updateTransportation: (id: string, updated: Partial<TransportationService>) => void;
  deleteTransportation: (id: string) => void;

  // E-Tickets
  addETicket: (item: ETicketOption) => void;
  updateETicket: (id: string, updated: Partial<ETicketOption>) => void;
  deleteETicket: (id: string) => void;

  // Testimonials
  addTestimonial: (item: Testimonial) => void;
  updateTestimonial: (id: string, updated: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  // Gallery
  addGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;

  // FAQs
  addFAQ: (item: FAQItem) => void;
  updateFAQ: (id: string, updated: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;

  // Blogs
  blogs: BlogPost[];
  addBlogPost: (post: BlogPost) => void;
  addBlog: (post: BlogPost) => void;
  updateBlogPost: (id: string, updated: Partial<BlogPost>) => void;
  updateBlog: (id: string, updated: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  deleteBlog: (id: string) => void;

  // Vouchers
  addVoucher: (voucher: Voucher) => void;
  updateVoucher: (id: string, updated: Partial<Voucher>) => void;
  deleteVoucher: (id: string) => void;
  validateAndApplyVoucher: (code: string, subtotalUSD: number) => { valid: boolean; discountUSD: number; message: string; voucher?: Voucher };

  // Bookings
  addBooking: (booking: BookingOrder) => void;
  updateBookingStatus: (id: string, status: PaymentStatus, method?: string) => void;

  // Booking prefill & tracking
  setBookingPrefill: (prefill: BookingPrefill | null) => void;
  resetAllDataToDefault: () => void;
  initializeFromDatabase: () => Promise<void>;
}

export const useCMSStore = create<CMSStoreState>()(
  persist(
    (set, get) => ({
      settings: initialWebsiteSettings,
      routes: initialRoutes,
      packages: initialTrekkingPackages,
      transportation: initialTransportationServices,
      eTickets: initialETicketOptions,
      testimonials: initialTestimonials,
      gallery: initialGallery,
      faqs: initialFAQs,
      blogPosts: initialBlogPosts,
      blogs: initialBlogPosts,
      vouchers: initialVouchers,
      bookings: initialBookings,
      bookingPrefill: null,

      initializeFromDatabase: async () => {
        try {
          const [
            settingsRes,
            routesRes,
            packagesRes,
            transportationRes,
            eTicketsRes,
            testimonialsRes,
            galleryRes,
            faqsRes,
            blogsRes,
            vouchersRes,
            bookingsRes,
          ] = await Promise.all([
            fetch("/api/settings").then((r) => r.json()).catch(() => null),
            fetch("/api/routes").then((r) => r.json()).catch(() => null),
            fetch("/api/packages").then((r) => r.json()).catch(() => null),
            fetch("/api/transportation").then((r) => r.json()).catch(() => null),
            fetch("/api/etickets").then((r) => r.json()).catch(() => null),
            fetch("/api/testimonials").then((r) => r.json()).catch(() => null),
            fetch("/api/gallery").then((r) => r.json()).catch(() => null),
            fetch("/api/faqs").then((r) => r.json()).catch(() => null),
            fetch("/api/blogs").then((r) => r.json()).catch(() => null),
            fetch("/api/vouchers").then((r) => r.json()).catch(() => null),
            fetch("/api/bookings").then((r) => r.json()).catch(() => null),
          ]);

          set((state) => ({
            settings: settingsRes?.data || state.settings,
            routes: routesRes?.data?.length ? routesRes.data.map(normalizeRoute) : state.routes,
            packages: packagesRes?.data?.length ? packagesRes.data.map(normalizePackage) : state.packages,
            transportation: transportationRes?.data?.length ? transportationRes.data : state.transportation,
            eTickets: eTicketsRes?.data?.length ? eTicketsRes.data.map(normalizeETicket) : state.eTickets,
            testimonials: testimonialsRes?.data?.length ? testimonialsRes.data : state.testimonials,
            gallery: galleryRes?.data?.length ? galleryRes.data : state.gallery,
            faqs: faqsRes?.data?.length ? faqsRes.data : state.faqs,
            blogPosts: blogsRes?.data?.length ? blogsRes.data.map(normalizeBlog) : state.blogPosts,
            blogs: blogsRes?.data?.length ? blogsRes.data.map(normalizeBlog) : state.blogs,
            vouchers: vouchersRes?.data?.length ? vouchersRes.data : state.vouchers,
            bookings: bookingsRes?.data?.length ? bookingsRes.data : state.bookings,
          }));
        } catch (error) {
          console.error("Error initializing from database:", error);
        }
      },

      updateSettings: (newSettings) => {
        set((state) => ({ settings: { ...state.settings, ...newSettings } }));
        fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(get().settings),
        }).catch((err) => console.error("updateSettings API error:", err));
      },

      addPackage: (pkg) => {
        set((state) => ({ packages: [pkg, ...state.packages] }));
        fetch("/api/packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pkg),
        }).catch((err) => console.error("addPackage API error:", err));
      },
      updatePackage: (id, updated) => {
        set((state) => ({
          packages: state.packages.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        }));
        const current = get().packages.find((p) => p.id === id);
        if (current) {
          fetch(`/api/packages/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(current),
          }).catch((err) => console.error("updatePackage API error:", err));
        }
      },
      deletePackage: (id) => {
        set((state) => ({ packages: state.packages.filter((p) => p.id !== id) }));
        fetch(`/api/packages/${id}`, { method: "DELETE" }).catch((err) =>
          console.error("deletePackage API error:", err)
        );
      },

      updateRoute: (id, updated) => {
        set((state) => ({
          routes: state.routes.map((r) => (r.id === id ? { ...r, ...updated } : r)),
        }));
        const current = get().routes.find((r) => r.id === id);
        if (current) {
          fetch(`/api/routes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(current),
          }).catch((err) => console.error("updateRoute API error:", err));
        }
      },

      addTransportation: (item) => {
        set((state) => ({ transportation: [...state.transportation, item] }));
        fetch("/api/transportation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }).catch((err) => console.error("addTransportation API error:", err));
      },
      updateTransportation: (id, updated) => {
        set((state) => ({
          transportation: state.transportation.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        }));
        const current = get().transportation.find((t) => t.id === id);
        if (current) {
          fetch(`/api/transportation/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(current),
          }).catch((err) => console.error("updateTransportation API error:", err));
        }
      },
      deleteTransportation: (id) => {
        set((state) => ({ transportation: state.transportation.filter((t) => t.id !== id) }));
        fetch(`/api/transportation/${id}`, { method: "DELETE" }).catch((err) =>
          console.error("deleteTransportation API error:", err)
        );
      },

      addETicket: (item) => {
        set((state) => ({ eTickets: [...state.eTickets, item] }));
        fetch("/api/etickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }).catch((err) => console.error("addETicket API error:", err));
      },
      updateETicket: (id, updated) => {
        set((state) => ({
          eTickets: state.eTickets.map((e) => (e.id === id ? { ...e, ...updated } : e)),
        }));
        const current = get().eTickets.find((e) => e.id === id);
        if (current) {
          fetch(`/api/etickets/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(current),
          }).catch((err) => console.error("updateETicket API error:", err));
        }
      },
      deleteETicket: (id) => {
        set((state) => ({ eTickets: state.eTickets.filter((e) => e.id !== id) }));
        fetch(`/api/etickets/${id}`, { method: "DELETE" }).catch((err) =>
          console.error("deleteETicket API error:", err)
        );
      },

      addTestimonial: (item) => {
        set((state) => ({ testimonials: [item, ...state.testimonials] }));
        fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }).catch((err) => console.error("addTestimonial API error:", err));
      },
      updateTestimonial: (id, updated) => {
        set((state) => ({
          testimonials: state.testimonials.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        }));
        const current = get().testimonials.find((t) => t.id === id);
        if (current) {
          fetch(`/api/testimonials/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(current),
          }).catch((err) => console.error("updateTestimonial API error:", err));
        }
      },
      deleteTestimonial: (id) => {
        set((state) => ({ testimonials: state.testimonials.filter((t) => t.id !== id) }));
        fetch(`/api/testimonials/${id}`, { method: "DELETE" }).catch((err) =>
          console.error("deleteTestimonial API error:", err)
        );
      },

      addGalleryItem: (item) => {
        set((state) => ({ gallery: [item, ...state.gallery] }));
        fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }).catch((err) => console.error("addGalleryItem API error:", err));
      },
      deleteGalleryItem: (id) => {
        set((state) => ({ gallery: state.gallery.filter((g) => g.id !== id) }));
        fetch(`/api/gallery/${id}`, { method: "DELETE" }).catch((err) =>
          console.error("deleteGalleryItem API error:", err)
        );
      },

      addFAQ: (item) => {
        set((state) => ({ faqs: [...state.faqs, item] }));
        fetch("/api/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }).catch((err) => console.error("addFAQ API error:", err));
      },
      updateFAQ: (id, updated) => {
        set((state) => ({
          faqs: state.faqs.map((f) => (f.id === id ? { ...f, ...updated } : f)),
        }));
        const current = get().faqs.find((f) => f.id === id);
        if (current) {
          fetch(`/api/faqs/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(current),
          }).catch((err) => console.error("updateFAQ API error:", err));
        }
      },
      deleteFAQ: (id) => {
        set((state) => ({ faqs: state.faqs.filter((f) => f.id !== id) }));
        fetch(`/api/faqs/${id}`, { method: "DELETE" }).catch((err) =>
          console.error("deleteFAQ API error:", err)
        );
      },

      addBlogPost: (post) => {
        set((state) => ({ blogPosts: [post, ...state.blogPosts], blogs: [post, ...state.blogs] }));
        fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(post),
        }).catch((err) => console.error("addBlogPost API error:", err));
      },
      addBlog: (post) => {
        set((state) => ({ blogPosts: [post, ...state.blogPosts], blogs: [post, ...state.blogs] }));
        fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(post),
        }).catch((err) => console.error("addBlog API error:", err));
      },
      updateBlogPost: (id, updated) => {
        set((state) => ({
          blogPosts: state.blogPosts.map((b) => (b.id === id ? { ...b, ...updated } : b)),
          blogs: state.blogs.map((b) => (b.id === id ? { ...b, ...updated } : b)),
        }));
        const current = get().blogPosts.find((b) => b.id === id) || get().blogs.find((b) => b.id === id);
        if (current) {
          fetch(`/api/blogs/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(current),
          }).catch((err) => console.error("updateBlogPost API error:", err));
        }
      },
      updateBlog: (id, updated) => {
        set((state) => ({
          blogPosts: state.blogPosts.map((b) => (b.id === id ? { ...b, ...updated } : b)),
          blogs: state.blogs.map((b) => (b.id === id ? { ...b, ...updated } : b)),
        }));
        const current = get().blogPosts.find((b) => b.id === id) || get().blogs.find((b) => b.id === id);
        if (current) {
          fetch(`/api/blogs/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(current),
          }).catch((err) => console.error("updateBlog API error:", err));
        }
      },
      deleteBlogPost: (id) => {
        set((state) => ({
          blogPosts: state.blogPosts.filter((b) => b.id !== id),
          blogs: state.blogs.filter((b) => b.id !== id),
        }));
        fetch(`/api/blogs/${id}`, { method: "DELETE" }).catch((err) =>
          console.error("deleteBlogPost API error:", err)
        );
      },
      deleteBlog: (id) => {
        set((state) => ({
          blogPosts: state.blogPosts.filter((b) => b.id !== id),
          blogs: state.blogs.filter((b) => b.id !== id),
        }));
        fetch(`/api/blogs/${id}`, { method: "DELETE" }).catch((err) =>
          console.error("deleteBlog API error:", err)
        );
      },

      addVoucher: (voucher) => {
        set((state) => ({ vouchers: [...state.vouchers, voucher] }));
        fetch("/api/vouchers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(voucher),
        }).catch((err) => console.error("addVoucher API error:", err));
      },
      updateVoucher: (id, updated) => {
        set((state) => ({
          vouchers: state.vouchers.map((v) => (v.id === id ? { ...v, ...updated } : v)),
        }));
        const current = get().vouchers.find((v) => v.id === id);
        if (current) {
          fetch(`/api/vouchers/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(current),
          }).catch((err) => console.error("updateVoucher API error:", err));
        }
      },
      deleteVoucher: (id) => {
        set((state) => ({ vouchers: state.vouchers.filter((v) => v.id !== id) }));
        fetch(`/api/vouchers/${id}`, { method: "DELETE" }).catch((err) =>
          console.error("deleteVoucher API error:", err)
        );
      },

      validateAndApplyVoucher: (code, subtotalUSD) => {
        const normalized = code.trim().toUpperCase();
        const voucher = get().vouchers.find((v) => v.code.toUpperCase() === normalized && v.isActive);
        if (!voucher) {
          return { valid: false, discountUSD: 0, message: "Invalid promo code. Try HERO2026 or SUMMIT30." };
        }
        if (subtotalUSD < voucher.minSpendUSD) {
          return {
            valid: false,
            discountUSD: 0,
            message: `Minimum spend of $${voucher.minSpendUSD} required for voucher ${voucher.code}.`,
          };
        }
        let discount = 0;
        const val = voucher.value ?? voucher.discountValue ?? 0;
        const vType = voucher.type || voucher.discountType || "fixed";
        if (vType === "percentage") {
          discount = (subtotalUSD * val) / 100;
          if (voucher.maxDiscountUSD && discount > voucher.maxDiscountUSD) {
            discount = voucher.maxDiscountUSD;
          }
        } else {
          discount = val;
        }
        return {
          valid: true,
          discountUSD: Math.round(discount * 100) / 100,
          message: `Promo code ${voucher.code} applied! You saved $${discount}.`,
          voucher,
        };
      },

      addBooking: (booking) => {
        set((state) => ({ bookings: [booking, ...state.bookings] }));
        fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(booking),
        }).catch((err) => console.error("addBooking API error:", err));
      },
      updateBookingStatus: (id, status, method) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id
              ? {
                  ...b,
                  paymentStatus: status,
                  paymentMethod: method || b.paymentMethod,
                  paymentPaidAt: status === "Deposit Paid" || status === "Fully Paid" ? new Date().toISOString() : b.paymentPaidAt,
                }
              : b
          ),
        }));
        const current = get().bookings.find((b) => b.id === id);
        if (current) {
          fetch(`/api/bookings/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(current),
          }).catch((err) => console.error("updateBookingStatus API error:", err));
        }
      },

      setBookingPrefill: (prefill) => set({ bookingPrefill: prefill }),

      resetAllDataToDefault: () =>
        set({
          settings: initialWebsiteSettings,
          routes: initialRoutes,
          packages: initialTrekkingPackages,
          transportation: initialTransportationServices,
          eTickets: initialETicketOptions,
          testimonials: initialTestimonials,
          gallery: initialGallery,
          faqs: initialFAQs,
          blogPosts: initialBlogPosts,
          vouchers: initialVouchers,
          bookingPrefill: null,
        }),
    }),
    {
      name: "rinjani-hero-cms-v2",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.packages = (state.packages || []).map(normalizePackage);
          state.routes = (state.routes || []).map(normalizeRoute);
          state.blogPosts = (state.blogPosts || []).map(normalizeBlog);
          state.blogs = (state.blogs || state.blogPosts || []).map(normalizeBlog);
        }
      },
      partialize: (state) => ({
        settings: state.settings,
        routes: state.routes,
        packages: state.packages,
        transportation: state.transportation,
        eTickets: state.eTickets,
        testimonials: state.testimonials,
        gallery: state.gallery,
        faqs: state.faqs,
        blogPosts: state.blogPosts,
        vouchers: state.vouchers,
        bookings: state.bookings,
      }),
    }
  )
);
