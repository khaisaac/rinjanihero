"use client";

import { useState, useRef } from "react";
import { Upload, Link as LinkIcon, Image as ImageIcon, Loader2, X, CheckCircle2, AlertCircle } from "lucide-react";
import { compressAndUploadImage } from "@/utils/imageUploader";

interface ImageInputBoxProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}

export default function ImageInputBox({
  label = "Cover Image URL",
  value,
  onChange,
  required = false,
}: ImageInputBoxProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);
    setError(null);

    try {
      const url = await compressAndUploadImage(file, 1400, 0.82);
      onChange(url);
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider">
            {label} {required && "*"}
          </label>
          <div className="flex bg-gray-100 rounded-xl p-0.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
                mode === "upload" ? "bg-[#18979B] text-white shadow-sm" : "text-gray-600 hover:text-black"
              }`}
            >
              <Upload className="w-3 h-3" />
              <span>Upload Photo</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("url")}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
                mode === "url" ? "bg-[#18979B] text-white shadow-sm" : "text-gray-600 hover:text-black"
              }`}
            >
              <LinkIcon className="w-3 h-3" />
              <span>Paste URL</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 1: Upload File Box */}
      {mode === "upload" && (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-5 text-center transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
              uploading
                ? "border-[#18979B] bg-[#18979B]/5 pointer-events-none"
                : "border-gray-300 hover:border-[#18979B] bg-gray-50 hover:bg-white"
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <Loader2 className="w-6 h-6 text-[#18979B] animate-spin" />
                <span className="text-xs font-bold text-[#18979B]">
                  Compressing & Uploading... (~100KB WebP)
                </span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-[#18979B]/10 flex items-center justify-center text-[#18979B]">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#122826] block">
                    Click to browse or drop cover image here
                  </span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">
                    Automatically compressed to WebP for fast page loads
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Paste URL Input */}
      {mode === "url" && (
        <div className="relative">
          <LinkIcon className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            required={required}
            placeholder="https://images.unsplash.com/..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 font-mono text-xs text-gray-700 focus:outline-none focus:border-[#18979B]"
          />
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Image Thumbnail Preview */}
      {value && (
        <div className="relative h-40 rounded-2xl overflow-hidden border border-gray-200 group bg-gray-100">
          <img src={value} alt="Cover Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white text-[#122826] font-bold text-xs shadow hover:bg-gray-100 transition"
            >
              Replace Photo
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow hover:bg-red-700 transition"
            >
              Remove
            </button>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 backdrop-blur-sm pointer-events-none">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Active Cover</span>
          </div>
        </div>
      )}
    </div>
  );
}
