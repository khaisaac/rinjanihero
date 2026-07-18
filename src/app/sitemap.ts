import { MetadataRoute } from "next";
import { db } from "@/db";
import { trekkingPackages, blogPosts } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://rinjanihero.org";

  // Default routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#packages`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    // Fetch packages
    const packages = await db.select({ slug: trekkingPackages.slug }).from(trekkingPackages);
    const packageRoutes: MetadataRoute.Sitemap = packages.map((pkg) => ({
      url: `${baseUrl}/packages/${pkg.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));
    routes.push(...packageRoutes);
  } catch (e) {
    console.error("Failed to fetch packages for sitemap:", e);
  }

  try {
    // Fetch blog posts
    const blogs = await db.select({ slug: blogPosts.slug, publishedAt: blogPosts.publishedAt }).from(blogPosts);
    const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.publishedAt ? new Date(blog.publishedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
    routes.push(...blogRoutes);
  } catch (e) {
    console.error("Failed to fetch blogs for sitemap:", e);
  }

  return routes;
}
