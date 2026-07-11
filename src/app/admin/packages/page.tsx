"use client";

import { useState } from "react";
import { Compass, Plus, Edit, Trash2, Check, X, TrendingUp, DollarSign, Clock } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useCMSStore } from "@/store/cmsStore";
import { TrekkingPackage, RouteType, DifficultyLevel } from "@/types/cms";

export default function AdminPackagesPage() {
  const { packages, updatePackage } = useCMSStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  // Edit fields
  const [priceUSD, setPriceUSD] = useState<number>(175);
  const [depositPercentage, setDepositPercentage] = useState<number>(30);
  const [isPopular, setIsPopular] = useState<boolean>(true);

  const handleOpenEdit = (p: TrekkingPackage) => {
    setEditingId(p.id);
    setPriceUSD(p.priceUSD);
    setDepositPercentage(p.depositPercentage);
    setIsPopular(p.isPopular ?? false);
  };

  const handleSave = (id: string) => {
    updatePackage(id, {
      priceUSD,
      priceIDR: priceUSD * 15500,
      depositPercentage,
      isPopular,
    });
    setEditingId(null);
  };

  return (
    <AdminLayout title="Packages & Routes Manager" subtitle="Modify all-inclusive rates, deposit requirements, and seasonal route status">
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-md border border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-[#122826]">Trekking Packages Catalog ({packages.length})</h3>
            <p className="text-xs text-gray-500">All prices listed are direct operator rates with zero middleman markup</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 transition flex flex-col justify-between">
              <div>
                <div className="h-48 relative">
                  <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-[#122826]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {p.route} Route
                  </span>
                  {p.isPopular && (
                    <span className="absolute top-3 right-3 bg-[#D4A017] text-[#122826] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase shadow">
                      ★ Popular
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <h4 className="text-lg font-extrabold text-[#122826] line-clamp-1">{p.title}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{p.shortDescription}</p>

                  {editingId === p.id ? (
                    <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#18979B] space-y-3 text-xs animate-in fade-in duration-200">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Price per person (USD)</label>
                        <input
                          type="number"
                          value={priceUSD}
                          onChange={(e) => setPriceUSD(Number(e.target.value))}
                          className="w-full bg-white border rounded-xl px-3 py-1.5 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Required Deposit (%)</label>
                        <input
                          type="number"
                          value={depositPercentage}
                          onChange={(e) => setDepositPercentage(Number(e.target.value))}
                          className="w-full bg-white border rounded-xl px-3 py-1.5 font-bold"
                        />
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={isPopular}
                          onChange={(e) => setIsPopular(e.target.checked)}
                          className="text-[#18979B]"
                        />
                        <span className="font-bold text-gray-700">Mark as Most Popular</span>
                      </label>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 py-2 rounded-xl bg-gray-200 font-bold text-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSave(p.id)}
                          className="flex-1 py-2 rounded-xl bg-[#18979B] font-bold text-white shadow"
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

              {editingId !== p.id && (
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#18979B]" />
                    {p.durationDays}D / {p.durationNights}N
                  </span>
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#122826] hover:bg-[#18979B] text-white font-bold transition flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Quick Edit</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
