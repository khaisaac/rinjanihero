/**
 * Super lightweight client-side image compressor & uploader using native browser Canvas API.
 * Zero external npm dependencies required.
 */
export async function compressAndUploadImage(
  file: File,
  maxDimension = 1400,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      return reject(new Error("Selected file is not an image."));
    }

    // If SVG or GIF, upload directly without compressing via Canvas
    if (file.type.includes("svg") || file.type.includes("gif")) {
      uploadToServer(file)
        .then(resolve)
        .catch(reject);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          uploadToServer(file).then(resolve).catch(reject);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              uploadToServer(file).then(resolve).catch(reject);
              return;
            }

            const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], cleanName, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            try {
              const url = await uploadToServer(compressedFile);
              resolve(url);
            } catch (err) {
              reject(err);
            }
          },
          "image/webp",
          quality
        );
      };

      img.onerror = () => {
        // Fallback to direct upload if canvas fails
        uploadToServer(file).then(resolve).catch(reject);
      };
    };

    reader.onerror = () => {
      reject(new Error("Failed to read local image file."));
    };
  });
}

async function uploadToServer(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.success && data.url) {
    return data.url;
  } else {
    throw new Error(data.error || "Server failed to process uploaded file.");
  }
}
