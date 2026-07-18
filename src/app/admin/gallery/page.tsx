"use client";

import { useState } from "react";
import { Camera, Plus, Trash2, X, Image as ImageIcon, MapPin, Calendar, Tag } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageInputBox from "@/components/admin/ImageInputBox";
import { useCMSStore } from "@/store/cmsStore";
import { GalleryItem } from "@/types/cms";

export default function AdminGalleryPage() {
  const { gallery, addGalleryItem, deleteGalleryItem } = useCMSStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    title: "",
    imageUrl: "",
    category: "summit",
    location: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleOpenModal = () => {
    setFormData({
      title: "",
      imageUrl: "",
      category: "summit",
      location: "",
      date: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl || !formData.category) {
      alert("Please fill all required fields.");
      return;
    }
    
    const newItem: GalleryItem = {
      id: `img-${Date.now().toString().slice(-6)}`,
      title: formData.title,
      imageUrl: formData.imageUrl,
      category: formData.category as any,
      location: formData.location || "Mount Rinjani",
      date: formData.date || new Date().toISOString().split("T")[0],
    };

    addGalleryItem(newItem);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteGalleryItem(id);
    }
  };

  return (
    <AdminLayout
      title="Expedition Gallery Manager"
      subtitle="Manage real photos from the mountain to showcase on the homepage"
    >
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#18979B]/10 text-[#18979B] px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Expedition Moments</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#122826]">
              Gallery Photos ({gallery.length})
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl">
              Upload and categorize photos from recent treks to show potential customers what they will experience.
            </p>
          </div>

          <button
            onClick={handleOpenModal}
            className="px-6 py-3.5 rounded-2xl bg-[#18979B] hover:bg-[#13797C] text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>+ Add New Photo</span>
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gallery.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 transition group flex flex-col">
              <div className="h-48 relative overflow-hidden bg-gray-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#122826]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  {item.category}
                </div>
              </div>
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-[#122826] text-sm line-clamp-1" title={item.title}>
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#18979B]" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#D4A017]" />
                      {item.date}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white text-red-600 transition"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {gallery.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white border border-gray-200 rounded-3xl">
              <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No photos uploaded yet. Click 'Add New Photo' to start.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#F8FAF9]">
              <div className="flex items-center gap-2 text-[#122826]">
                <Camera className="w-5 h-5 text-[#18979B]" />
                <h3 className="font-extrabold">Upload Expedition Photo</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-xl shadow-sm transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              <ImageInputBox
                label="Photo Upload *"
                value={formData.imageUrl || ""}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                required
              />

              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                  Photo Caption / Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Stunning Sunrise at Summit"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium text-sm text-[#122826] focus:outline-none focus:border-[#18979B]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 font-bold text-sm text-[#122826] focus:outline-none focus:border-[#18979B]"
                >
                  <option value="summit">🏔️ Summit 3,726m</option>
                  <option value="lake">🌊 Segara Anak Lake</option>
                  <option value="torean">🏞️ Torean Valley</option>
                  <option value="camp">⛺ Camping & Porters</option>
                  <option value="sembalun">🌾 Sembalun Route</option>
                  <option value="senaru">🌳 Senaru Forest</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Plawangan Sembalun"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium text-sm text-[#122826] focus:outline-none focus:border-[#18979B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium text-sm text-[#122826] focus:outline-none focus:border-[#18979B]"
                  />
                </div>
              </div>

            </form>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.title || !formData.imageUrl}
                className="px-6 py-2.5 rounded-xl bg-[#18979B] hover:bg-[#13797C] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold shadow-md transition"
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
