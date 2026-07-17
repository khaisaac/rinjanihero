import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename and generate unique timestamp prefix
    const ext = path.extname(file.name) || ".webp";
    const cleanName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const filename = `rh-${Date.now()}-${cleanName.slice(0, 30)}${ext}`;

    // 1. Save to primary public/uploads directory (for local static serving when available)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    // 2. Save to persistent storage outside workspace (survives git push / deployment / build resets on Hostinger & VPS)
    try {
      const persistentDir = path.join(os.homedir(), ".rinjani_persistent_storage", "uploads");
      if (!fs.existsSync(persistentDir)) {
        fs.mkdirSync(persistentDir, { recursive: true });
      }
      const persistentFilePath = path.join(persistentDir, filename);
      fs.writeFileSync(persistentFilePath, buffer);
      console.log(`[Upload Service] File backed up to persistent storage: ${persistentFilePath}`);
    } catch (backupErr) {
      console.warn("[Upload Service Warning] Could not write to persistent backup dir:", backupErr);
    }

    // Return the relative public URL
    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({ success: true, url: publicUrl, filename });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file to server" },
      { status: 500 }
    );
  }
}
