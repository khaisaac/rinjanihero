import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: pathSegments } = await params;
    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json({ error: "No file specified" }, { status: 400 });
    }

    const filename = pathSegments.join("/");
    const ext = path.extname(filename).toLowerCase();

    // MIME type resolution
    const mimeTypes: Record<string, string> = {
      ".webp": "image/webp",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".svg": "image/svg+xml",
      ".gif": "image/gif",
      ".avif": "image/avif",
    };
    const mimeType = mimeTypes[ext] || "application/octet-stream";

    // Check possible storage locations in order of priority:
    // 1. Primary public/uploads/ path
    const primaryPath = path.join(process.cwd(), "public", "uploads", filename);
    // 2. Persistent home storage outside workspace (survives git push / cPanel rebuilds)
    const persistentPath = path.join(os.homedir(), ".rinjani_persistent_storage", "uploads", filename);
    // 3. Temporary OS storage
    const tmpPath = path.join(os.tmpdir(), "rinjani_uploads", filename);

    let targetPath = null;
    if (fs.existsSync(primaryPath)) {
      targetPath = primaryPath;
    } else if (fs.existsSync(persistentPath)) {
      targetPath = persistentPath;
      // Self-healing: restore missing file back to public/uploads automatically
      try {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        fs.copyFileSync(persistentPath, primaryPath);
      } catch (e) {
        // Ignore restore errors if filesystem is read-only
      }
    } else if (fs.existsSync(tmpPath)) {
      targetPath = tmpPath;
    }

    if (targetPath && fs.existsSync(targetPath)) {
      const fileBuffer = fs.readFileSync(targetPath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": mimeType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // GRACEFUL FALLBACK: If the file was wiped on server before persistent storage was enabled,
    // NEVER return 404 broken image icon. Return clean default route webp image!
    let fallbackImageName = "hero-rinjani.webp";
    const lowerName = filename.toLowerCase();
    if (lowerName.includes("sembalun") || lowerName.includes("2d1n")) {
      fallbackImageName = "sembalun.webp";
    } else if (lowerName.includes("senaru") || lowerName.includes("sunset") || lowerName.includes("crater")) {
      fallbackImageName = "senaru.webp";
    } else if (lowerName.includes("torean") || lowerName.includes("lake") || lowerName.includes("3d2n")) {
      fallbackImageName = "torean.webp";
    }

    const fallbackPath = path.join(process.cwd(), "public", fallbackImageName);
    if (fs.existsSync(fallbackPath)) {
      const fallbackBuffer = fs.readFileSync(fallbackPath);
      return new NextResponse(fallbackBuffer, {
        status: 200,
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  } catch (error: any) {
    console.error("[GET /uploads/[...path] Error]", error);
    return NextResponse.json({ error: "Internal server error reading file" }, { status: 500 });
  }
}
