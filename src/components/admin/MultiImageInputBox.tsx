"use client";

import { useState, useRef } from "react";
import { Upload, Link as LinkIcon, Image as ImageIcon, Loader2, X, Plus, AlertCircle } from "lucide-react";
import { compressAndUploadImage } from "@/utils/imageUploader";

interface MultiImageInputBoxProps {
  label?: string;
  images: string[];
  onChange: (images: string[]) => void;
}

export default function MultiImageInputBox({
  label = "Additional Gallery Images",
  images = [],
  onChange,
}: MultiImageInputBoxProps) {
  const [mode, setMode] = useState<"upload" | "urls">("upload");
  const [uploadingCount, setUploadingCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [urlsText, setUrlsText] = useState(images.join("\n"));
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingCount(files.length);
    setError(null);

    const uploadedUrls: string[] = [];
    const filesArray = Array.from(files);

    for (const file of filesArray) {
      try {
        const url = await compressAndUploadImage(file, 1400, 0.82);
        uploadedUrls.push(url);
      } catch (err: any) {
        console.error("Failed to upload image:", err);
        setError(`Some images failed to upload: ${err.message || ""}`);
      }
    }

    if (uploadedUrls.length > 0) {
      const updated = [...images, ...uploadedUrls];
      onChange(updated);
      setUrlsText(updated.join("\n"));
    }

    setUploadingCount(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
    setUrlsText(updated.join("\n"));
  };

  const handleUrlsTextChange = (text: string) => {
    setUrlsText(text);
    const cleanUrls = text
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    onChange(cleanUrls);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider">
            {label} ({images.length})
          </label>
          <span className="text-[10px] text-gray-500 block">
            Upload multiple photos or paste URLs. Displayed in package slider and gallery.
          </span>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-0.5 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              mode === "upload" ? "bg-[#18979B] text-white shadow-sm" : "text-gray-600 hover:text-black"
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload Files</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setUrlsText(images.join("\n"));
              setMode("urls");
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              mode === "urls" ? "bg-[#18979B] text-white shadow-sm" : "text-gray-600 hover:text-black"
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Paste URLs</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Upload Multiple Files */}
      {mode === "upload" && (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFilesSelect}
            accept="image/*"
            multiple
            className="hidden"
          />
          <div
            onClick={() => uploadingCount === 0 && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-5 text-center transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
              uploadingCount > 0
                ? "border-[#18979B] bg-[#18979B]/5 pointer-events-none"
                : "border-gray-300 hover:border-[#18979B] bg-gray-50 hover:bg-white"
            }`}
          >
            {uploadingCount > 0 ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <Loader2 className="w-6 h-6 text-[#18979B] animate-spin" />
                <span className="text-xs font-bold text-[#18979B]">
                  Processing & Uploading {uploadingCount} Photo(s)...
                </span>
                <span className="text-[10px] text-gray-500">
                  Resizing and converting to WebP for optimal performance
                </span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-[#18979B]/10 flex items-center justify-center text-[#18979B]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#122826] block">
                    Click to select multiple photos or drop them here
                  </span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">
                    Select 1 or many photos at once (WebP/JPEG/PNG)
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Paste URLs per line */}
      {mode === "urls" && (
        <div>
          <textarea
            rows={4}
            value={urlsText}
            onChange={(e) => handleUrlsTextChange(e.target.value)}
            className="w-full p-3 rounded-2xl border border-gray-300 font-mono text-xs focus:outline-none focus:border-[#18979B]"
            placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
          />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Gallery Grid Preview */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {images.map((imgUrl, idx) => (
            <div key={idx} className="relative h-28 rounded-2xl overflow-hidden border border-gray-200 group bg-gray-100">
              <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-lg transition"
                  title="Remove this photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded font-bold pointer-events-none">
                #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center text-xs text-gray-400 font-medium">
          No additional gallery photos added yet. Upload photos above.
        </div>
      )}
    </div>
  );
}
