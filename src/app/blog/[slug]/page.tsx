"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Share2, Tag, ShieldCheck, Sparkles } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";
import { BlogPost } from "@/types/cms";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { blogs } = useCMSStore();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (slug) {
      const found = blogs.find((b) => b.slug === slug || b.id === slug);
      if (found) setPost(found);
    }
  }, [slug, blogs]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full space-y-4">
          <h2 className="text-2xl font-extrabold text-[#122826]">Article Not Found</h2>
          <p className="text-xs text-gray-500">The requested Mount Rinjani guide article could not be loaded.</p>
          <Link href="/blog" className="inline-block bg-[#18979B] text-white px-6 py-2.5 rounded-xl font-bold text-xs mt-2">
            Return to Blog Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAF9] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#18979B] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((t, idx) => (
              <span key={idx} className="bg-[#18979B]/10 text-[#18979B] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                {t}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#122826] tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200 text-xs text-gray-500 font-semibold">
            <div className="flex items-center gap-4">
              <span className="text-[#122826] font-bold">
                By {typeof post.author === "string" ? post.author : post.author?.name || "Senaru Lead Guide"}
              </span>
              <span>•</span>
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

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: post.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-[#18979B] transition"
            >
              <Share2 className="w-3.5 h-3.5 text-[#18979B]" />
              <span>Share Article</span>
            </button>
          </div>
        </div>

        {/* Cover Image */}
        <div className="h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl mb-10 border border-gray-200">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Article Content */}
        <div
          className="bg-white rounded-3xl p-6 sm:p-12 shadow-md border border-gray-100 prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Bottom CTA Box */}
        <div className="mt-12 bg-gradient-to-r from-[#122826] to-[#18979B] rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs text-[#D4A017] font-bold uppercase tracking-wider block">Ready to Conquer Mount Rinjani?</span>
            <h3 className="text-2xl font-extrabold text-white mt-1">Experience the Volcano with Our Local Team</h3>
            <p className="text-xs text-gray-200 mt-1">We take care of 100% of your permits, guides, porters, camping gear, and gourmet meals.</p>
          </div>
          <Link
            href="/#packages"
            className="px-6 py-3.5 bg-[#D4A017] hover:bg-[#F3C644] text-[#122826] font-extrabold rounded-2xl transition whitespace-nowrap shadow-lg text-sm"
          >
            Explore Trekking Packages
          </Link>
        </div>
      </div>
    </div>
  );
}
