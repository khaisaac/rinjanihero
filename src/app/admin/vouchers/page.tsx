"use client";

import { useState } from "react";
import { Tag, Plus, Edit, Trash2, Check, X, Percent, DollarSign, Sparkles } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useCMSStore } from "@/store/cmsStore";
import { Voucher } from "@/types/cms";

export default function AdminVouchersPage() {
  const { vouchers, addVoucher, updateVoucher, deleteVoucher } = useCMSStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"fixed" | "percentage">("fixed");
  const [discountValue, setDiscountValue] = useState<number>(30);
  const [minSpendUSD, setMinSpendUSD] = useState<number>(100);
  const [maxUsage, setMaxUsage] = useState<number>(100);
  const [expiresAt, setExpiresAt] = useState<string>("2026-12-31");
  const [isActive, setIsActive] = useState<boolean>(true);

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setCode("");
    setDiscountValue(30);
    setMinSpendUSD(100);
    setMaxUsage(100);
  };

  const handleOpenEdit = (v: Voucher) => {
    setIsCreating(false);
    setEditingId(v.id);
    setCode(v.code);
    setDiscountType((v.discountType || v.type || "fixed") as any);
    setDiscountValue(v.discountValue ?? v.value ?? 30);
    setMinSpendUSD(v.minSpendUSD);
    setMaxUsage(v.maxUsage ?? v.usageLimit ?? 100);
    setExpiresAt(v.expiresAt || v.validUntil || "2026-12-31");
    setIsActive(v.isActive);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    if (editingId) {
      updateVoucher(editingId, {
        code: code.toUpperCase().trim(),
        discountType,
        type: discountType as any,
        discountValue,
        value: discountValue,
        minSpendUSD,
        maxUsage,
        usageLimit: maxUsage,
        expiresAt,
        validUntil: expiresAt,
        isActive,
      });
      setEditingId(null);
    } else {
      const newId = `v-${Date.now()}`;
      addVoucher({
        id: newId,
        code: code.toUpperCase().trim(),
        discountType,
        type: discountType as any,
        discountValue,
        value: discountValue,
        minSpendUSD,
        maxUsage,
        usageLimit: maxUsage,
        usedCount: 0,
        expiresAt,
        validUntil: expiresAt,
        isActive,
      });
      setIsCreating(false);
    }
  };

  const handleToggleActive = (v: Voucher) => {
    updateVoucher(v.id, { isActive: !v.isActive });
  };

  return (
    <AdminLayout title="Promo Code & Voucher Management" subtitle="Create discount codes, monitor redemptions, and configure seasonal campaign promotions">
      <div className="space-y-6">
        {/* Top Actions Row */}
        <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-md border border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-[#122826]">Active Promotion Codes ({vouchers.length})</h3>
            <p className="text-xs text-gray-500">Trekkers can input these codes at checkout for instant verification and celebratory confetti</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-3 rounded-2xl bg-[#18979B] hover:bg-[#13797C] text-white font-bold text-xs transition flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Promo Voucher</span>
          </button>
        </div>

        {/* Create / Edit Form Modal/Box */}
        {(isCreating || editingId) && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#18979B] space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h4 className="text-base font-extrabold text-[#122826] flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#18979B]" />
                <span>{editingId ? `Edit Voucher Code: ${code}` : "Create New Promotional Voucher"}</span>
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

            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Code Name *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. HERO2026"
                  className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3 text-sm font-bold uppercase text-[#122826] focus:outline-none focus:border-[#18979B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3 text-sm font-bold text-[#122826] focus:outline-none focus:border-[#18979B]"
                >
                  <option value="fixed">Fixed USD Discount ($)</option>
                  <option value="percentage">Percentage Discount (%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Discount Value *</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3 text-sm font-bold text-[#122826] focus:outline-none focus:border-[#18979B]"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-bold text-gray-500">
                    {discountType === "fixed" ? "USD" : "%"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Minimum Order Spend (USD)</label>
                <input
                  type="number"
                  value={minSpendUSD}
                  onChange={(e) => setMinSpendUSD(Number(e.target.value))}
                  className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3 text-sm font-bold text-[#122826] focus:outline-none focus:border-[#18979B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Max Redemptions Limit</label>
                <input
                  type="number"
                  value={maxUsage}
                  onChange={(e) => setMaxUsage(Number(e.target.value))}
                  className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3 text-sm font-bold text-[#122826] focus:outline-none focus:border-[#18979B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3 text-sm font-bold text-[#122826] focus:outline-none focus:border-[#18979B]"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-between pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#18979B]"
                  />
                  <span className="text-xs font-bold text-[#122826]">Status: Active & Valid for checkouts</span>
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
                    {editingId ? "Save Changes" : "Create Promo Code"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Vouchers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vouchers.map((v) => (
            <div
              key={v.id}
              className={`rounded-3xl p-6 bg-white border transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md ${
                v.isActive ? "border-gray-200" : "border-gray-200 opacity-60 bg-gray-50"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-black bg-[#122826] text-[#D4A017] px-4 py-1.5 rounded-xl shadow-sm tracking-wider">
                    {v.code}
                  </span>
                  <button
                    onClick={() => handleToggleActive(v)}
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition ${
                      v.isActive
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-gray-200 text-gray-600 border border-gray-300"
                    }`}
                  >
                    {v.isActive ? "● Active" : "○ Inactive"}
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#122826]">
                    <span>Discount Value:</span>
                    <span className="text-base text-[#18979B]">
                      {(v.discountType || v.type) === "fixed_usd" || (v.discountType || v.type) === "fixed"
                        ? `$${v.discountValue ?? v.value ?? 30} USD`
                        : `${v.discountValue ?? v.value ?? 10}% OFF`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>Minimum Spend:</span>
                    <span>${v.minSpendUSD} USD</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>Redemptions:</span>
                    <span>{v.usedCount} / {v.maxUsage ?? v.usageLimit ?? 100} used</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>Expires On:</span>
                    <span>{v.expiresAt || v.validUntil || "2026-12-31"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(v)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-[#18979B] hover:text-white text-gray-700 transition"
                  title="Edit Voucher"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete promo code ${v.code}?`)) {
                      deleteVoucher(v.id);
                    }
                  }}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-red-500 hover:text-white text-gray-700 transition"
                  title="Delete Voucher"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
