"use client";

import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  CheckCircle2,
  DollarSign,
  Compass,
  FileText,
  ListCheck,
  Calendar,
  Image as ImageIcon,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { TrekkingPackage, RouteType, DifficultyLevel } from "@/types/cms";
import { parseArray } from "@/utils/jsonParser";
import ImageInputBox from "@/components/admin/ImageInputBox";
import MultiImageInputBox from "@/components/admin/MultiImageInputBox";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface PackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: TrekkingPackage | null;
  onSave: (pkg: TrekkingPackage) => void;
}

const defaultPackage: TrekkingPackage = {
  id: "",
  slug: "",
  title: "",
  route: "sembalun",
  durationDays: 3,
  durationNights: 2,
  difficulty: "Moderate - Hard",
  maxAltitude: "3,726M (Summit)",
  meetingPoint: "Senaru Basecamp / Office",
  priceUSD: 215,
  priceIDR: 3332500,
  depositPercentage: 30,
  isPopular: false,
  isFeatured: false,
  shortDescription: "Experience the ultimate Rinjani summit trek with our certified English-speaking guide and professional porters.",
  overview: "This comprehensive trekking package takes you from dense tropical rainforests up to the majestic 3,726-meter summit of Mount Rinjani, descending into the turquoise Segara Anak Crater Lake and soothing natural hot springs.",
  coverImage: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80",
  galleryImages: [
    "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80",
  ],
  packageTypes: {
    standard: {
      description: "<p>Standard packages are designed for budget-conscious trekkers.</p>",
      includes: [
        "Licensed English-Speaking Mountain Guide",
    "Local Experienced Porters for camping gear & food",
    "All National Park Entrance Tickets & E-Ticket Permits",
    "High-Quality Camping Equipment (Tent, Sleeping Bag, Mattress, Toilet Tent)",
    "All Nutritious Meals (Breakfast, Lunch, Dinner, Fresh Fruits, Hot Drinks)",
    "Free Pick-up & Transfer within Lombok Island (Airport/Senggigi/Bangsal)",
      ],
      excludes: [
        "Personal Trekking Gear (Shoes, Warm Jacket, Headlamp)",
    "Personal Porters for private luggage ($25/day)",
    "Tipping for Guide and Porters",
    "International & Domestic Flights",
      ],
    },
    private: {
      description: "<p>Private packages offer a premium, personalized trekking experience.</p>",
      includes: [
        "Licensed English-Speaking Mountain Guide",
    "Local Experienced Porters for camping gear & food",
    "All National Park Entrance Tickets & E-Ticket Permits",
    "High-Quality Camping Equipment (Tent, Sleeping Bag, Mattress, Toilet Tent)",
    "All Nutritious Meals (Breakfast, Lunch, Dinner, Fresh Fruits, Hot Drinks)",
    "Free Pick-up & Transfer within Lombok Island (Airport/Senggigi/Bangsal)",
        "Private Guide",
        "Extra Porters"
      ],
      excludes: [
        "Personal Trekking Gear (Shoes, Warm Jacket, Headlamp)",
    "Personal Porters for private luggage ($25/day)",
    "Tipping for Guide and Porters",
    "International & Domestic Flights",
      ],
    },
    meetingPoint: {
      description: "<p>Meeting Point packages are perfect for independent travelers.</p>",
      includes: [
        "Licensed English-Speaking Mountain Guide",
    "Local Experienced Porters for camping gear & food",
    "All National Park Entrance Tickets & E-Ticket Permits",
    "High-Quality Camping Equipment (Tent, Sleeping Bag, Mattress, Toilet Tent)",
    "All Nutritious Meals (Breakfast, Lunch, Dinner, Fresh Fruits, Hot Drinks)",
    "Free Pick-up & Transfer within Lombok Island (Airport/Senggigi/Bangsal)",
      ],
      excludes: [
        "Personal Trekking Gear (Shoes, Warm Jacket, Headlamp)",
    "Personal Porters for private luggage ($25/day)",
    "Tipping for Guide and Porters",
    "International & Domestic Flights",
        "Transport to/from Senaru"
      ],
    },
  },
  thingsToBring: [
    "Sturdy Trekking Shoes with good grip",
    "Warm Fleece & Windproof Jacket",
    "Headlamp with spare batteries",
    "Sunscreen, Sunglasses & Hat",
    "Personal Medication & Small Backpack",
  ],
  itinerary: [
    {
      day: 1,
      title: "Day 1: Basecamp to Crater Rim Campsite",
      description: "Start the trek through tropical montane forest up to the breathtaking crater rim where you will enjoy dinner under the stars.",
      altitude: "2,641M",
      meals: "Lunch, Dinner, Snacks",
      highlights: ["Tropical rainforest trail", "Crater rim sunset panoramic view"],
    },
    {
      day: 2,
      title: "Day 2: Summit Push (3,726M) & Lake Segara Anak",
      description: "Early morning 2:00 AM push to the summit for sunrise, followed by descent into the turquoise volcanic lake and hot springs.",
      altitude: "3,726M & 2,000M",
      meals: "Breakfast, Lunch, Dinner",
      highlights: ["Sunrise at 3,726M Summit", "Segara Anak Crater Lake", "Natural Hot Springs"],
    },
  ],
  faq: [
    {
      question: "How fit do I need to be for this trek?",
      answer: "A moderate to good fitness level is required. We recommend cardio exercises and leg workouts at least 2 weeks before arrival.",
    },
  ],
  seoTitle: "",
  seoDescription: "",
};

export default function PackageFormModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: PackageFormModalProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "lists" | "itinerary">("basic");
  const [formData, setFormData] = useState<TrekkingPackage>(defaultPackage);

  // Helper strings for textarea lists
  const [bringStr, setBringStr] = useState("");
  const [galleryStr, setGalleryStr] = useState("");
  const [pkgTypeTab, setPkgTypeTab] = useState<"standard" | "private" | "meetingPoint">("standard");

  // Local state for Package Types
  const [pkgTypes, setPkgTypes] = useState(defaultPackage.packageTypes);

  useEffect(() => {
    if (initialData) {
      const normalized: TrekkingPackage = {
        ...defaultPackage,
        ...initialData,
        thingsToBring: parseArray(initialData.thingsToBring),
        galleryImages: parseArray(initialData.galleryImages),
        itinerary: parseArray(initialData.itinerary),
        faq: parseArray(initialData.faq),
        packageTypes: initialData.packageTypes || defaultPackage.packageTypes,
      };
      setFormData(normalized);
      setPkgTypes(normalized.packageTypes);
      setBringStr(normalized.thingsToBring.join("\n"));
      setGalleryStr(normalized.galleryImages.join("\n"));
    } else {
      const newId = `pkg-${Date.now().toString().slice(-6)}`;
      const fresh: TrekkingPackage = {
        ...defaultPackage,
        id: newId,
      };
      setFormData(fresh);
      setPkgTypes(fresh.packageTypes);
      setBringStr(fresh.thingsToBring.join("\n"));
      setGalleryStr(fresh.galleryImages.join("\n"));
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || slug,
      seoTitle: prev.seoTitle || `${title} - Rinjani Hero Trekking`,
    }));
  };

  const handlePriceChange = (usd: number) => {
    setFormData((prev) => ({
      ...prev,
      priceUSD: usd,
      priceIDR: usd * 18000,
    }));
  };

  const handleAddDay = () => {
    const nextDayNum = (formData.itinerary?.length || 0) + 1;
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...(prev.itinerary || []),
        {
          day: nextDayNum,
          title: `Day ${nextDayNum}: Title Here`,
          description: "Describe the trek activities, terrain, and campsite for this day.",
          altitude: "2,000M",
          meals: "Breakfast, Lunch, Dinner",
          highlights: ["Scenic viewpoints"],
        },
      ],
    }));
  };

  const handleRemoveDay = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }));
  };

  const handleItineraryChange = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.itinerary];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, itinerary: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanBring = bringStr
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const cleanGallery = galleryStr
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const finalPkg: TrekkingPackage = {
      ...formData,
      packageTypes: pkgTypes,
      thingsToBring: cleanBring.length > 0 ? cleanBring : formData.thingsToBring,
      galleryImages: cleanGallery.length > 0 ? cleanGallery : formData.galleryImages,
      slug: formData.slug || formData.id,
      seoTitle: formData.seoTitle || formData.title,
      seoDescription: formData.seoDescription || formData.shortDescription,
    };

    onSave(finalPkg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#122826] text-white px-6 py-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#18979B] to-[#D4A017] flex items-center justify-center font-black text-white text-lg shadow">
              {initialData ? "✏️" : "✨"}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">
                {initialData ? `Edit Package: ${initialData.title}` : "Create New Trekking Package"}
              </h3>
              <p className="text-xs text-gray-300">
                Configure pricing, itinerary days, inclusions, and difficulty level
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-gray-100 px-6 py-3 flex gap-2 border-b border-gray-200 shrink-0 overflow-x-auto">
          {[
            { id: "basic", label: "1. Basic & Pricing", icon: DollarSign },
            { id: "details", label: "2. Overview & Images", icon: FileText },
            { id: "lists", label: "3. Types & Items", icon: ListCheck },
            { id: "itinerary", label: `4. Itinerary (${formData.itinerary?.length || 0} Days)`, icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  isActive
                    ? "bg-[#18979B] text-white shadow"
                    : "bg-white text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BASIC & PRICING */}
          {activeTab === "basic" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                    Package Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3D2N Sembalun Summit & Crater Lake"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-sm text-[#122826] focus:outline-none focus:border-[#18979B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3d2n-sembalun-summit-lake"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-mono text-xs text-gray-700 bg-gray-50 focus:outline-none focus:border-[#18979B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                    Primary Route (Start Gate) *
                  </label>
                  <select
                    value={formData.route}
                    onChange={(e) => setFormData({ ...formData, route: e.target.value as RouteType })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-xs text-[#122826] focus:outline-none focus:border-[#18979B]"
                  >
                    <option value="sembalun">Sembalun Route (Summit Specialist)</option>
                    <option value="senaru">Senaru Route (Crater Rim & Sunset)</option>
                    <option value="torean">Torean Route (Lake & Waterfalls)</option>
                    <option value="private">Private VIP Expedition</option>
                    <option value="custom">Custom Trekking Circuit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                    Finish Route (Exit Gate)
                  </label>
                  <select
                    value={formData.finishRoute || ""}
                    onChange={(e) => setFormData({ ...formData, finishRoute: e.target.value as RouteType || undefined })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-xs text-[#122826] focus:outline-none focus:border-[#18979B]"
                  >
                    <option value="">Same as Start Gate</option>
                    <option value="sembalun">Sembalun Route (Summit Specialist)</option>
                    <option value="senaru">Senaru Route (Crater Rim & Sunset)</option>
                    <option value="torean">Torean Route (Lake & Waterfalls)</option>
                    <option value="private">Private VIP Expedition</option>
                    <option value="custom">Custom Trekking Circuit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                    Duration Days *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-sm text-[#122826]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                    Duration Nights *
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={14}
                    value={formData.durationNights}
                    onChange={(e) => setFormData({ ...formData, durationNights: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-sm text-[#122826]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                    Difficulty Level *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as DifficultyLevel })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-xs text-[#122826]"
                  >
                    <option value="Moderate">Moderate (Beginner Friendly)</option>
                    <option value="Moderate - Hard">Moderate - Hard (Standard Trekker)</option>
                    <option value="Hard">Hard (Requires Endurance)</option>
                    <option value="Extreme">Extreme (Summit Push & Steep Descent)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                    Starting Price (USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-gray-400">$</span>
                    <input
                      type="number"
                      required
                      min={10}
                      value={formData.priceUSD}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-300 font-extrabold text-sm text-emerald-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                    Required Deposit (%) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={formData.depositPercentage}
                      onChange={(e) => setFormData({ ...formData, depositPercentage: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-sm text-[#122826]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-extrabold text-gray-400">%</span>
                  </div>
                </div>
              </div>

              {/* Pricing Matrix Section */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#122826]">Advanced Pricing Matrix</h4>
                    <p className="text-xs text-gray-500">Set prices based on group size and package type. Used in checkout.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextId = String((formData.pricingMatrix?.length || 0) + 1);
                      setFormData({
                        ...formData,
                        pricingMatrix: [
                          ...(formData.pricingMatrix || []),
                          { id: nextId, groupSize: "1 person", minPax: 1, maxPax: 1, pricePrivate: 320, priceStandard: 195, priceMeetingPoint: 140 },
                        ],
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#18979B] hover:bg-[#13797C] text-white font-extrabold text-xs shadow flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Tier
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50 border-y border-gray-200">
                        <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase">Group Size Label</th>
                        <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase">Min-Max Pax</th>
                        <th className="px-3 py-2 text-[10px] font-bold text-[#D4A017] uppercase">Private ($)</th>
                        <th className="px-3 py-2 text-[10px] font-bold text-[#18979B] uppercase">Standard ($)</th>
                        <th className="px-3 py-2 text-[10px] font-bold text-gray-600 uppercase">Meeting Point ($)</th>
                        <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(formData.pricingMatrix || []).map((tier, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={tier.groupSize}
                              onChange={(e) => {
                                const newMatrix = [...(formData.pricingMatrix || [])];
                                newMatrix[idx] = { ...tier, groupSize: e.target.value };
                                setFormData({ ...formData, pricingMatrix: newMatrix });
                              }}
                              className="w-full px-2 py-1 rounded-lg border border-gray-300 text-xs font-bold"
                            />
                          </td>
                          <td className="px-2 py-2 flex items-center gap-1">
                            <input
                              type="number"
                              min={1}
                              value={tier.minPax}
                              onChange={(e) => {
                                const newMatrix = [...(formData.pricingMatrix || [])];
                                newMatrix[idx] = { ...tier, minPax: Number(e.target.value) };
                                setFormData({ ...formData, pricingMatrix: newMatrix });
                              }}
                              className="w-12 px-1 py-1 rounded-lg border border-gray-300 text-xs text-center"
                            />
                            <span className="text-gray-400 text-xs">-</span>
                            <input
                              type="number"
                              min={1}
                              value={tier.maxPax}
                              onChange={(e) => {
                                const newMatrix = [...(formData.pricingMatrix || [])];
                                newMatrix[idx] = { ...tier, maxPax: Number(e.target.value) };
                                setFormData({ ...formData, pricingMatrix: newMatrix });
                              }}
                              className="w-12 px-1 py-1 rounded-lg border border-gray-300 text-xs text-center"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              value={tier.pricePrivate}
                              onChange={(e) => {
                                const newMatrix = [...(formData.pricingMatrix || [])];
                                newMatrix[idx] = { ...tier, pricePrivate: Number(e.target.value) };
                                setFormData({ ...formData, pricingMatrix: newMatrix });
                              }}
                              className="w-full px-2 py-1 rounded-lg border border-gray-300 text-xs font-bold text-[#D4A017]"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              value={tier.priceStandard}
                              onChange={(e) => {
                                const newMatrix = [...(formData.pricingMatrix || [])];
                                newMatrix[idx] = { ...tier, priceStandard: Number(e.target.value) };
                                setFormData({ ...formData, pricingMatrix: newMatrix });
                              }}
                              className="w-full px-2 py-1 rounded-lg border border-gray-300 text-xs font-bold text-[#18979B]"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              value={tier.priceMeetingPoint}
                              onChange={(e) => {
                                const newMatrix = [...(formData.pricingMatrix || [])];
                                newMatrix[idx] = { ...tier, priceMeetingPoint: Number(e.target.value) };
                                setFormData({ ...formData, pricingMatrix: newMatrix });
                              }}
                              className="w-full px-2 py-1 rounded-lg border border-gray-300 text-xs font-bold text-gray-700"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newMatrix = [...(formData.pricingMatrix || [])];
                                newMatrix.splice(idx, 1);
                                setFormData({ ...formData, pricingMatrix: newMatrix });
                              }}
                              className="p-1 rounded text-red-500 hover:bg-red-50 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(formData.pricingMatrix || []).length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-4 text-center text-xs text-gray-500">
                            No pricing tiers added. It will fallback to Starting Price (USD).
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#18979B]/30 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-[#122826]">Mark as Featured / Popular Package</h4>
                  <p className="text-xs text-gray-500">
                    Displays a prominent golden badge on the website homepage and packages catalog
                  </p>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isPopular ?? false}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="w-4 h-4 rounded text-[#18979B] border-gray-300"
                    />
                    <span className="text-xs font-extrabold text-[#122826]">★ Popular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured ?? false}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#18979B] border-gray-300"
                    />
                    <span className="text-xs font-extrabold text-[#122826]">⚡ Featured</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OVERVIEW & IMAGES */}
          {activeTab === "details" && (
            <div className="space-y-5">
              <div>
                <ImageInputBox
                  label="Cover Image URL (Main Card & Hero Background)"
                  required={true}
                  value={formData.coverImage}
                  onChange={(url) => setFormData({ ...formData, coverImage: url })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                    Max Altitude Point *
                  </label>
                  <input
                    type="text"
                    value={formData.maxAltitude}
                    onChange={(e) => setFormData({ ...formData, maxAltitude: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-xs"
                    placeholder="e.g. 3,726M (Summit)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                    Meeting Point / Briefing *
                  </label>
                  <input
                    type="text"
                    value={formData.meetingPoint}
                    onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-xs"
                    placeholder="e.g. Senaru Basecamp Office / Hotel"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                  Short Summary (Catalog & Card Description) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs leading-relaxed font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1">
                  Full Detailed Overview (Package Detail Page) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs leading-relaxed font-medium"
                />
              </div>

              <div>
                <MultiImageInputBox
                  label="Additional Gallery Images"
                  images={parseArray(formData.galleryImages)}
                  onChange={(images) => {
                    setFormData({ ...formData, galleryImages: images });
                    setGalleryStr(images.join("\n"));
                  }}
                />
              </div>
            </div>
          )}

          {/* TAB 3: TYPES & ITEMS */}
          {activeTab === "lists" && (
            <div className="space-y-6">
              {/* Type Switcher */}
              <div className="flex p-1 bg-gray-100 rounded-2xl">
                {(["standard", "private", "meetingPoint"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPkgTypeTab(type)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                      pkgTypeTab === type
                        ? "bg-white text-[#18979B] shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {type === "standard" ? "Standard" : type === "private" ? "Private" : "Meeting Point"}
                  </button>
                ))}
              </div>

              <div className="p-5 border border-gray-200 rounded-2xl bg-[#F8FAF9] space-y-5">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                    {pkgTypeTab} Package Description
                  </label>
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-300">
                    <ReactQuill
                      theme="snow"
                      value={pkgTypes[pkgTypeTab].description}
                      onChange={(content) =>
                        setPkgTypes({
                          ...pkgTypes,
                          [pkgTypeTab]: { ...pkgTypes[pkgTypeTab], description: content },
                        })
                      }
                      className="h-32 mb-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-emerald-700 uppercase tracking-wider mb-1">
                      ✓ Included Services
                    </label>
                    <textarea
                      rows={6}
                      value={pkgTypes[pkgTypeTab].includes.join("\n")}
                      onChange={(e) => {
                        const arr = e.target.value.split("\n");
                        setPkgTypes({
                          ...pkgTypes,
                          [pkgTypeTab]: { ...pkgTypes[pkgTypeTab], includes: arr },
                        });
                      }}
                      className="w-full p-3 rounded-2xl border border-emerald-300 bg-emerald-50/30 text-xs font-medium leading-relaxed focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-red-700 uppercase tracking-wider mb-1">
                      ✕ Excluded Services
                    </label>
                    <textarea
                      rows={6}
                      value={pkgTypes[pkgTypeTab].excludes.join("\n")}
                      onChange={(e) => {
                        const arr = e.target.value.split("\n");
                        setPkgTypes({
                          ...pkgTypes,
                          [pkgTypeTab]: { ...pkgTypes[pkgTypeTab], excludes: arr },
                        });
                      }}
                      className="w-full p-3 rounded-2xl border border-red-300 bg-red-50/30 text-xs font-medium leading-relaxed focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#18979B] uppercase tracking-wider mb-1">
                  🎒 Things to Bring (Global for this Package)
                </label>
                <textarea
                  rows={4}
                  value={bringStr}
                  onChange={(e) => setBringStr(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-[#18979B]/30 bg-[#F8FAF9] text-xs font-medium leading-relaxed focus:outline-none focus:border-[#18979B]"
                  placeholder="Trekking shoes&#10;Fleece jacket&#10;Headlamp"
                />
              </div>
            </div>
          )}

          {/* TAB 4: ITINERARY PLAN */}
          {activeTab === "itinerary" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-[#122826]">Daily Trekking Itinerary</h4>
                  <p className="text-xs text-gray-500">Detail the daily schedule, altitude gain, and provided meals</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddDay}
                  className="px-4 py-2 rounded-xl bg-[#18979B] hover:bg-[#13797C] text-white font-extrabold text-xs shadow flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Day</span>
                </button>
              </div>

              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                {formData.itinerary?.map((day, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="bg-[#122826] text-white font-extrabold text-xs px-3 py-1 rounded-full">
                        Day {day.day || idx + 1}
                      </span>
                      {formData.itinerary.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDay(idx)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition"
                          title="Remove this day"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Day Title</label>
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) => handleItineraryChange(idx, "title", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gray-300 font-bold text-xs text-[#122826]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Campsite / Altitude</label>
                        <input
                          type="text"
                          value={day.altitude}
                          onChange={(e) => handleItineraryChange(idx, "altitude", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gray-300 font-bold text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Day Description</label>
                      <textarea
                        rows={2}
                        value={day.description}
                        onChange={(e) => handleItineraryChange(idx, "description", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Provided Meals</label>
                        <input
                          type="text"
                          value={day.meals}
                          onChange={(e) => handleItineraryChange(idx, "meals", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs"
                          placeholder="e.g. Breakfast, Lunch, Dinner"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Key Highlights (Comma separated)</label>
                        <input
                          type="text"
                          value={parseArray(day.highlights).join(", ")}
                          onChange={(e) =>
                            handleItineraryChange(
                              idx,
                              "highlights",
                              e.target.value.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
                            )
                          }
                          className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs"
                          placeholder="e.g. Rainforest, Crater Rim Sunset"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#18979B] to-[#13797C] hover:from-[#158588] hover:to-[#0D5E60] text-white font-extrabold text-xs shadow-xl shadow-[#18979B]/20 flex items-center gap-2 transition transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{initialData ? "Save Package Changes" : "Create Trekking Package"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
