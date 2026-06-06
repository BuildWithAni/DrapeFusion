"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAuth, mockGenerations } from "@/lib/mock-data";
import { formatTimestamp } from "@/lib/utils";
import type { MockGeneration } from "@/lib/mock-data";
import {
  History,
  Download,
 Trash2,
  Sparkles,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export default function HistoryPage() {
  const router = useRouter();
  const [generations, setGenerations] = useState<MockGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = mockAuth.getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Load from localStorage via mock data
    const gens = mockGenerations.getAll(user.id);
    setGenerations(gens);
    setLoading(false);
  }, [router]);

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "drapefusion-catalog.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded");
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-accent-gold/20 border-t-accent-gold animate-spin" />
          <p className="text-sm text-text-secondary">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-bg-card transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-text-primary">
              Generation History
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {generations.length} generation
              {generations.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>
      </div>

      {generations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[40vh] text-center"
        >
          <div className="h-20 w-20 rounded-2xl bg-bg-card border border-border flex items-center justify-center mb-6">
            <History className="h-8 w-8 text-text-secondary/40" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No generations yet
          </h3>
          <p className="text-sm text-text-secondary max-w-sm mb-6">
            Your generated catalog images will appear here. Start by uploading a
            garment and model photo.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Your First Image
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {generations.map((gen, index) => (
            <motion.div
              key={gen.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative rounded-xl overflow-hidden border border-border bg-bg-card hover:border-accent-gold/30 transition-colors cursor-pointer"
              onClick={() => setSelectedImage(gen.resultUrl)}
            >
              <div className="aspect-[3/4] relative">
                <img
                  src={gen.resultUrl}
                  alt="Generated catalog image"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge variant="default" className="text-[10px]">
                    <Sparkles className="h-2.5 w-2.5 mr-1" />
                    AI
                  </Badge>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(gen.resultUrl);
                      }}
                      className="h-7 w-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <Download className="h-3 w-3 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(gen.resultUrl, "_blank");
                      }}
                      className="h-7 w-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3 text-white" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px]">
                    {gen.category || "Fashion"}
                  </Badge>
                  <span className="text-[10px] text-text-secondary">
                    {formatTimestamp(gen.createdAt)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-3xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Generated catalog image"
              className="max-w-full max-h-[85vh] rounded-2xl border border-border"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-bg-card border border-border flex items-center justify-center hover:bg-bg-secondary transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5 text-text-secondary" />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
