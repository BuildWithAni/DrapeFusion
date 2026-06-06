"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { formatFileSize } from "@/lib/utils";

interface UploadPanelProps {
  type: "garment" | "model";
}

export function UploadPanel({ type }: UploadPanelProps) {
  const { garmentFile, garmentPreview, modelFile, modelPreview, setGarmentFile, setModelFile } = useAppStore();

  const file = type === "garment" ? garmentFile : modelFile;
  const preview = type === "garment" ? garmentPreview : modelPreview;
  const setFile = type === "garment" ? setGarmentFile : setModelFile;

  const [isDragOver, setIsDragOver] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const f = acceptedFiles[0];
      if (!f) return;

      // Validate file size (10MB max)
      if (f.size > 10 * 1024 * 1024) {
        return;
      }

      // Use FileReader to produce a base64 data URL.
      // Unlike blob: URLs (which are browser-memory-only), data URLs are
      // self-contained strings that work as <img> src AND can be sent to
      // the server for Cloudinary upload.
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setFile(f, dataUrl);
      };
      reader.readAsDataURL(f);
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false),
  });

  const clearImage = () => {
    // Data URLs don't need revocation (unlike blob: URLs)
    setFile(null, null);
  };

  const isActive = isDragActive || isDragOver;

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">
        {type === "garment" ? "Garment Image" : "Model Photo"}
      </label>

      {file && preview ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-xl overflow-hidden border border-border bg-bg-card"
        >
          <img
            src={preview}
            alt={`${type} preview`}
            className="w-full h-64 object-contain bg-bg-secondary"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="text-xs text-white/95 drop-shadow-md truncate max-w-[70%]">
              <p className="font-semibold truncate">{file.name}</p>
              <p>{formatFileSize(file.size)}</p>
            </div>
            <button
              onClick={clearImage}
              className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </motion.div>
      ) : (
        <div
          {...getRootProps()}
          className={`relative rounded-xl border-2 border-dashed p-6 cursor-pointer transition-all duration-200 ${
            isActive
              ? "border-accent-gold bg-accent-gold/5"
              : "border-border bg-bg-card hover:border-accent-gold/30 hover:bg-accent-gold/3"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-3 py-8">
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${
                isActive ? "bg-accent-gold/20" : "bg-accent-gold/5"
              }`}
            >
              {isActive ? (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Upload className="h-6 w-6 text-accent-gold" />
                </motion.div>
              ) : (
                <ImageIcon className="h-6 w-6 text-text-secondary" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-text-primary">
                {isActive
                  ? "Drop image here"
                  : "Drag & drop or click to browse"}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                JPEG, PNG, WEBP • Max 10MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Helpful tips to avoid bad generation */}
      <div className="text-[11px] text-text-secondary/60 bg-bg-secondary/40 rounded-lg p-2.5 border border-border/40">
        {type === "garment" ? (
          <p>
            💡 <strong>Tip:</strong> Use a flat-lay or model shot of the garment on a clean, solid background.
          </p>
        ) : (
          <div className="space-y-1">
            <p>
              💡 <strong>Requirement for Perfect Try-On:</strong>
            </p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Use a photo where the <strong>entire face & neck are fully visible</strong>.</li>
              <li>Standing straight, facing the camera with arms slightly away.</li>
              <li>Do not crop the neck or head, otherwise the AI has to invent a random face!</li>
            </ul>
          </div>
        )}
      </div>
    </div>

  );
}
