"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Calendar, Clock, ArrowRight, Tag, Search, Sparkles } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";
import { parseArray } from "@/utils/jsonParser";

export default function BlogListingPage() {
  const { blogs } = useCMSStore();
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const publishedBlogs = (Array.isArray(blogs) ? blogs : []).filter((b) => b.isPublished);
  const allTags = ["All", ...Array.from(new Set(publishedBlogs.flatMap((b) => parseArray(b.tags))))];

  const filteredBlogs = publishedBlogs.filter((b) => {
    const matchesTag = selectedTag === "All" || parseArray(b.tags).includes(selectedTag);
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="bg-[#F8FAF9] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="bg-[#18979B]/10 text-[#18979B] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Rinjani Expedition Journal
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#122826] tracking-tight">
            Trekking Guides & Insights
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Read expert tips, preparation guides, and stories from our local Senaru and Sembalun trekking masters.
          </p>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tags */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <Tag className="w-4 h-4 text-gray-400 shrink-0 ml-1 mr-1 hidden sm:block" />
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition whitespace-nowrap ${
                  selectedTag === tag
                    ? "bg-[#18979B] text-white shadow-md shadow-[#18979B]/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#18979B] bg-[#F8FAF9]"
            />
          </div>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#122826]">No Articles Found</h3>
            <p className="text-sm text-gray-500 mt-1">Try searching for another keyword or selecting "All" tags.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition border border-gray-100 flex flex-col justify-between group"
              >
                <div>
                  <Link href={`/blog/${post.slug}`}>
                    <div className="h-56 relative overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {parseArray(post.tags).slice(0, 2).map((t: string, idx: number) => (
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
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
