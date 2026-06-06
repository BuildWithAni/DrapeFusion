// File upload helper — tries Cloudinary first, falls back to local file storage.
// No mandatory API keys needed.

export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "drapefusion");

  // First try Cloudinary (if configured)
  const isCloudinaryConfigured =
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (isCloudinaryConfigured) {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      return data.url;
    }
    console.warn("[upload] Cloudinary failed, falling back to local storage");
  }

  // Fallback: local file storage (no API keys needed)
  const localRes = await fetch("/api/upload-local", {
    method: "POST",
    body: formData,
  });

  if (!localRes.ok) {
    const errorData = await localRes.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload failed with status ${localRes.status}`);
  }

  const data = await localRes.json();
  return data.url;
}

export function getOptimizedUrl(url: string, _width = 1024): string {
  // Cloudinary optimization parameters if it's a Cloudinary URL
  if (url.includes("cloudinary.com")) {
    return url.replace("/upload/", `/upload/q_auto,f_auto,w_${_width}/`);
  }
  return url;
}
