"use client";

import { useState } from "react";
import { Compass, Plus, Edit, Trash2, Check, X, TrendingUp, DollarSign, Clock, Sparkles } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import PackageFormModal from "@/components/admin/PackageFormModal";
import { useCMSStore } from "@/store/cmsStore";
import { TrekkingPackage } from "@/types/cms";

export default function AdminPackagesPage() {
  const { packages, addPackage, updatePackage, deletePackage } = useCMSStore();
  
  // Quick Edit Price state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [priceUSD, setPriceUSD] = useState<number>(175);
  const [depositPercentage, setDepositPercentage] = useState<number>(30);
  const [isPopular, setIsPopular] = useState<boolean>(true);

  // Full Modal state (Add / Full Edit)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<TrekkingPackage | null>(null);

  const handleOpenQuickEdit = (p: TrekkingPackage) => {
    setEditingId(p.id);
    setPriceUSD(p.priceUSD);
    setDepositPercentage(p.depositPercentage);
    setIsPopular(p.isPopular ?? false);
  };

  const handleSaveQuickEdit = (id: string) => {
    updatePackage(id, {
      priceUSD,
      priceIDR: priceUSD * 15500,
      depositPercentage,
      isPopular,
    });
    setEditingId(null);
  };

  const handleOpenAddModal = () => {
    setSelectedPackage(null);
    setIsModalOpen(true);
  };

  const handleOpenFullEditModal = (p: TrekkingPackage) => {
    setSelectedPackage(p);
    setIsModalOpen(true);
  };

  const handleSaveModal = (pkg: TrekkingPackage) => {
    if (selectedPackage) {
      updatePackage(pkg.id, pkg);
    } else {
      addPackage(pkg);
    }
  };

  const handleDeletePackage = (p: TrekkingPackage) => {
    if (confirm(`Are you sure you want to delete "${p.title}"? This cannot be undone.`)) {
      deletePackage(p.id);
    }
  };

  return (
    <AdminLayout
      title="Packages & Routes Manager"
      subtitle="Modify all-inclusive rates, deposit requirements, and seasonal route status"
    >
      <div className="space-y-6">
        {/* Top Header & Action Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#18979B]/10 text-[#18979B] px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Basecamp Trekking Catalog</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#122826]">
              All Trekking Packages ({packages.length})
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl">
              Create new expedition packages, modify summit itinerary plans, update direct operator prices, or adjust inclusions.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#18979B] to-[#13797C] hover:from-[#158588] hover:to-[#0F6568] text-white font-extrabold text-sm shadow-xl shadow-[#18979B]/20 flex items-center justify-center gap-2 transition transform active:scale-95 shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>+ Add New Package</span>
          </button>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 transition flex flex-col justify-between"
            >
              <div>
                <div className="h-48 relative overflow-hidden group">
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#122826]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {p.route} Route
                  </span>
                  {p.isPopular && (
                    <span className="absolute top-3 right-3 bg-[#D4A017] text-[#122826] text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow">
                      ★ Popular
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <h4 className="text-lg font-extrabold text-[#122826] line-clamp-1" title={p.title}>
                    {p.title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {p.shortDescription}
                  </p>

                  {editingId === p.id ? (
                    <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#18979B] space-y-3 text-xs animate-in fade-in duration-200">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Price per person (USD)</label>
                        <input
                          type="number"
                          value={priceUSD}
                          onChange={(e) => setPriceUSD(Number(e.target.value))}
                          className="w-full bg-white border rounded-xl px-3 py-1.5 font-bold text-[#122826]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Required Deposit (%)</label>
                        <input
                          type="number"
                          value={depositPercentage}
                          onChange={(e) => setDepositPercentage(Number(e.target.value))}
                          className="w-full bg-white border rounded-xl px-3 py-1.5 font-bold text-[#122826]"
                        />
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={isPopular}
                          onChange={(e) => setIsPopular(e.target.checked)}
                          className="text-[#18979B] rounded"
                        />
                        <span className="font-bold text-gray-700">Mark as Most Popular</span>
                      </label>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 py-2 rounded-xl bg-gray-200 font-bold text-gray-700 hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveQuickEdit(p.id)}
                          className="flex-1 py-2 rounded-xl bg-[#18979B] hover:bg-[#13797C] font-bold text-white shadow transition"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#F8FAF9] border border-gray-100">
                        <span className="text-gray-400 block uppercase font-bold text-[10px]">Price (USD)</span>
                        <span className="text-lg font-black text-[#122826]">${p.priceUSD}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#F8FAF9] border border-gray-100">
                        <span className="text-gray-400 block uppercase font-bold text-[10px]">Deposit Req</span>
                        <span className="text-lg font-black text-emerald-600">{p.depositPercentage}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              {editingId !== p.id && (
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
                  <span className="flex items-center gap-1 font-bold text-gray-500 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-[#18979B]" />
                    {p.durationDays}D/{p.durationNights}N
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenQuickEdit(p)}
                      className="px-2.5 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs transition flex items-center gap-1"
                      title="Quick Edit Price"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Price</span>
                    </button>
                    <button
                      onClick={() => handleOpenFullEditModal(p)}
                      className="px-3 py-1.5 rounded-xl bg-[#122826] hover:bg-[#18979B] text-white font-bold text-xs transition flex items-center gap-1 shadow-sm"
                      title="Full Edit Details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Full Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeletePackage(p)}
                      className="p-1.5 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white text-red-600 transition"
                      title="Delete Package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Full Form Modal */}
      <PackageFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedPackage}
        onSave={handleSaveModal}
      />
    </AdminLayout>
  );
}
