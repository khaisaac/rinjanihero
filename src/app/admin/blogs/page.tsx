"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { FileText, Plus, Edit, Trash2, Check, X, Eye, Sparkles } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useCMSStore } from "@/store/cmsStore";
import { BlogPost } from "@/types/cms";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function AdminBlogsPage() {
  const { blogs, addBlog, updateBlog, deleteBlog } = useCMSStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80");
  const [tagsInput, setTagsInput] = useState("Preparation, Senaru, Tips");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("<p>Write your detailed Mount Rinjani guide, altitude tips, or Senaru local story here...</p>");
    setCoverImage("https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80");
    setTagsInput("Preparation, Senaru, Tips");
    setSeoTitle("");
    setSeoDescription("");
    setIsPublished(true);
  };

  const handleOpenEdit = (b: BlogPost) => {
    setIsCreating(false);
    setEditingId(b.id);
    setTitle(b.title);
    setSlug(b.slug);
    setExcerpt(b.excerpt);
    setContent(b.content);
    setCoverImage(b.coverImage);
    setTagsInput(b.tags.join(", "));
    setSeoTitle(b.seoTitle || b.metaTitle || "");
    setSeoDescription(b.seoDescription || b.metaDescription || "");
    setIsPublished(b.isPublished ?? (b.status === "Published"));
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId && !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    const tagsArray = tagsInput.split(",").map((t) => t.trim()).filter((t) => t.length > 0);

    if (editingId) {
      updateBlog(editingId, {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        tags: tagsArray,
        seoTitle: seoTitle || title,
        metaTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt,
        metaDescription: seoDescription || excerpt,
        isPublished,
        status: isPublished ? "Published" : "Draft",
      });
      setEditingId(null);
    } else {
      const newId = `b-${Date.now()}`;
      addBlog({
        id: newId,
        title,
        slug,
        excerpt,
        content,
        coverImage,
        category: "Senaru Guides",
        author: "Senaru Basecamp Lead Guide",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        publishedAt: new Date().toISOString().split("T")[0],
        readTime: "5 min read",
        readingTimeMinutes: 5,
        tags: tagsArray,
        seoTitle: seoTitle || title,
        metaTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt,
        metaDescription: seoDescription || excerpt,
        isPublished,
        status: isPublished ? "Published" : "Draft",
      });
      setIsCreating(false);
    }
  };

  return (
    <AdminLayout title="SEO Blogs & Article Editor" subtitle="Publish high-ranking guides, trail updates, and Senaru community stories">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-md border border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-[#122826]">Published Articles ({blogs.length})</h3>
            <p className="text-xs text-gray-500">All articles automatically generate schema tags to rank higher on Google Travel searches</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-3 rounded-2xl bg-[#18979B] hover:bg-[#13797C] text-white font-bold text-xs transition flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Write New SEO Article</span>
          </button>
        </div>

        {/* Editor Form Modal */}
        {(isCreating || editingId) && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#18979B] space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h4 className="text-base font-extrabold text-[#122826] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#18979B]" />
                <span>{editingId ? `Edit Article: ${title}` : "Create New SEO Article"}</span>
              </h4>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-xl transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Complete Guide to Plawangan Sembalun Summit Push"
                    className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3 text-sm font-bold text-[#122826] focus:outline-none focus:border-[#18979B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="complete-guide-plawangan-sembalun"
                    className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3 text-sm font-bold text-[#122826] focus:outline-none focus:border-[#18979B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Cover Image URL</label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3 text-sm font-bold text-[#122826] focus:outline-none focus:border-[#18979B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Preparation, Senaru, Equipment"
                    className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3 text-sm font-bold text-[#122826] focus:outline-none focus:border-[#18979B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Short Excerpt (For Cards & Preview)</label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Summarize key takeaways in 2 sentences..."
                  className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3 text-sm text-[#122826] focus:outline-none focus:border-[#18979B]"
                />
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Full Article Body (Rich Text)</label>
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-300">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    style={{ height: "260px", marginBottom: "45px" }}
                  />
                </div>
              </div>

              {/* SEO Metadata Box */}
              <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-gray-200 space-y-4">
                <span className="text-xs font-bold text-[#D4A017] uppercase tracking-wider block">Google SEO Preview & Schema</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">SEO Title</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder={title || "SEO Title"}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#122826] focus:outline-none focus:border-[#18979B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">SEO Meta Description</label>
                    <input
                      type="text"
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder={excerpt || "Meta description for search engines"}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#122826] focus:outline-none focus:border-[#18979B]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-[#18979B]"
                  />
                  <span className="text-xs font-bold text-[#122826]">Publish immediately to live website</span>
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingId(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#18979B] hover:bg-[#13797C] text-white font-bold text-xs transition shadow"
                  >
                    {editingId ? "Save Article Changes" : "Publish SEO Article"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Blogs List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 transition flex flex-col justify-between"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-44 h-48 sm:h-auto relative shrink-0">
                  <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />
                  <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${b.isPublished ? "bg-emerald-500 text-white" : "bg-gray-500 text-white"}`}>
                    {b.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {b.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-[#18979B]/10 text-[#18979B] font-bold px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h4 className="text-lg font-bold text-[#122826] line-clamp-2">{b.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{b.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-gray-100">
                    <span>{b.date} • {b.readTime}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#18979B] hover:text-white text-gray-700 transition"
                        title="Edit Article"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete article: "${b.title}"?`)) {
                            deleteBlog(b.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-500 hover:text-white text-gray-700 transition"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
