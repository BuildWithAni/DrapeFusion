import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getCloudinaryOptimizedUrl(
  url: string,
  width?: number
): string {
  if (!url.includes("cloudinary")) return url;
  const params = ["f_auto", "q_auto"];
  if (width) params.push(`w_${width}`);
  const separator = url.includes("upload/") ? "/" : "/";
  return url.replace("upload/", `upload/${params.join(",")}${separator}`);
}
