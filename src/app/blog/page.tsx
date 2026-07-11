"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Calendar, Clock, ArrowRight, Tag, Search, Sparkles } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";

export default function BlogListingPage() {
  const { blogs } = useCMSStore();
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const publishedBlogs = blogs.filter((b) => b.isPublished);
  const allTags = ["All", ...Array.from(new Set(publishedBlogs.flatMap((b) => b.tags)))];

  const filteredBlogs = publishedBlogs.filter((b) => {
    const matchesTag = selectedTag === "All" || b.tags.includes(selectedTag);
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="bg-[#F8FAF9] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#18979B]/10 text-[#18979B] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Senaru Basecamp Journal & Guides</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#122826] tracking-tight">
            Mount Rinjani Expedition Insights
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Expert preparation advice, altitude sickness prevention, seasonal weather updates, and stories from our local Senaru guide community.
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto relative pt-2">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles (e.g. altitude, equipment, weather)..."
              className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:border-[#18979B]"
            />
          </div>

          {/* Tags Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedTag === tag
                    ? "bg-[#18979B] text-white shadow"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.length === 0 ? (
            <div className="col-span-3 text-center py-16 bg-white rounded-3xl border border-gray-200 text-gray-500">
              No matching articles found. Try another search keyword or tag.
            </div>
          ) : (
            filteredBlogs.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between group transform hover:-translate-y-1"
              >
                <div>
                  <Link href={`/blog/${post.slug}`}>
                    <div className="h-56 overflow-hidden relative">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="bg-[#122826]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#18979B]" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#D4A017]" />
                        {post.readTime}
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-extrabold text-[#122826] group-hover:text-[#18979B] transition line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-gray-100 mt-4">
                  <span className="text-xs font-bold text-gray-500">
                    By {typeof post.author === "string" ? post.author : post.author?.name || "Senaru Lead Guide"}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#18979B] group-hover:translate-x-1 transition"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
