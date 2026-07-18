"use client";

import { useState } from "react";
import { Settings, PhoneCall, Mail, MapPin, Check, ShieldCheck, Database, Save } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { useCMSStore } from "@/store/cmsStore";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useCMSStore();
  const [siteName, setSiteName] = useState(settings.siteName || settings.companyName);
  const [whatsapp, setWhatsapp] = useState(settings.contactWhatsapp);
  const [phone, setPhone] = useState(settings.contactPhone);
  const [email, setEmail] = useState(settings.contactEmail);
  const [address, setAddress] = useState(settings.officeAddress || settings.address);
  const [packageStandardDesc, setPackageStandardDesc] = useState(settings.packageStandardDesc || "");
  const [packagePrivateDesc, setPackagePrivateDesc] = useState(settings.packagePrivateDesc || "");
  const [packageMeetingPointDesc, setPackageMeetingPointDesc] = useState(settings.packageMeetingPointDesc || "");
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      companyName: siteName,
      siteName,
      contactWhatsapp: whatsapp,
      contactPhone: phone,
      contactEmail: email,
      address,
      officeAddress: address,
      packageStandardDesc,
      packagePrivateDesc,
      packageMeetingPointDesc,
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <AdminLayout title="System & Basecamp Settings" subtitle="Configure hotline numbers, basecamp office location, and package explanations">
      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-[#122826] flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-[#18979B]" />
              <span>Contact & Configuration</span>
            </h3>
            {savedMsg && (
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> Saved Successfully!
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Website Name</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3 text-sm font-bold text-[#122826] focus:outline-none focus:border-[#18979B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">24/7 WhatsApp Hotline *</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3 text-sm font-bold text-[#18979B] focus:outline-none focus:border-[#18979B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Official Office Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3 text-sm font-bold text-[#122826] focus:outline-none focus:border-[#18979B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Primary Contact & Invoice Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3 text-sm font-bold text-[#122826] focus:outline-none focus:border-[#18979B]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Senaru Basecamp Physical Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3 text-sm font-bold text-[#122826] focus:outline-none focus:border-[#18979B]"
                />
              </div>

              <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-[#122826] mb-4">Package Type Explanations</h4>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Standard Package Description</label>
                <div className="bg-white rounded-xl overflow-hidden border border-gray-300 focus-within:border-[#18979B]">
                  <ReactQuill 
                    theme="snow"
                    value={packageStandardDesc}
                    onChange={setPackageStandardDesc}
                    className="h-32 mb-10"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Private Package Description</label>
                <div className="bg-white rounded-xl overflow-hidden border border-gray-300 focus-within:border-[#18979B]">
                  <ReactQuill 
                    theme="snow"
                    value={packagePrivateDesc}
                    onChange={setPackagePrivateDesc}
                    className="h-32 mb-10"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Meeting Point Package Description</label>
                <div className="bg-white rounded-xl overflow-hidden border border-gray-300 focus-within:border-[#18979B]">
                  <ReactQuill 
                    theme="snow"
                    value={packageMeetingPointDesc}
                    onChange={setPackageMeetingPointDesc}
                    className="h-32 mb-10"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl bg-[#18979B] hover:bg-[#13797C] text-white font-extrabold text-sm transition flex items-center gap-2 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </button>
            </div>
          </form>
        </div>

        {/* National Park API Status Box */}
        <div className="bg-[#122826] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-[#D4A017]" />
              <span>E-Rinjani National Park Barcode API Integration</span>
            </h4>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-400/30">
              ● Live Sync Active
            </span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Connected directly to Gunung Rinjani National Park (BTIGR) ticketing server via Basecamp ID: <strong className="text-[#D4A017]">RH-SENARU-GATE-01</strong>. All passport details entered by customers in Step 1 automatically reserve digital e-permits.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
