"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useAppStore } from "@/stores/appStore";

interface GenerateButtonProps {
  onGenerate: () => void;
}

export function GenerateButton({ onGenerate }: GenerateButtonProps) {
  const { garmentFile, modelFile, credits, generateState } = useAppStore();
  const { status } = generateState;

  const isUploaded = garmentFile !== null && modelFile !== null;
  const hasCredits = credits >= 1;
  const isProcessing = status === "uploading" || status === "generating";

  const getButtonText = () => {
    if (status === "uploading") return "Uploading images...";
    if (status === "generating") return "Generating... ~30s";
    if (!isUploaded) return "Upload both images to generate";
    if (!hasCredits) return "Insufficient credits — Buy more";
    return `Generate Catalog Image — 1 Credit`;
  };

  return (
    <div className="space-y-3">
      <motion.div
        whileTap={isProcessing ? undefined : { scale: 0.98 }}
        className="relative"
      >
        {isProcessing && (
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute inset-0 animate-shimmer opacity-50" />
          </div>
        )}
        <Button
          onClick={onGenerate}
          disabled={!isUploaded || !hasCredits || isProcessing}
          className="w-full h-12 relative overflow-hidden group"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {getButtonText()}
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              {getButtonText()}
            </>
          )}
        </Button>
      </motion.div>

      {!isUploaded && (
        <div className="flex items-center gap-2 rounded-lg border border-accent-gold/10 bg-accent-gold/5 px-3 py-2">
          <AlertCircle className="h-3.5 w-3.5 text-accent-gold shrink-0" />
          <p className="text-xs text-text-secondary">
            Upload both a garment image and a model photo to generate
          </p>
        </div>
      )}

      {!hasCredits && isUploaded && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/10 bg-destructive/5 px-3 py-2">
          <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
          <p className="text-xs text-text-secondary">
            You need at least 1 credit to generate. Buy more credits in your
            wallet.
          </p>
        </div>
      )}
    </div>
  );
}
