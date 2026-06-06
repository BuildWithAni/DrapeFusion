"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Share2,
  Sparkles,
  ImageIcon,
  AlertTriangle,
  Loader2,
  Check,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { useCallback } from "react";
import { toast } from "sonner";

export function ResultViewer() {
  const { generateState, category, resetGenerateState } = useAppStore();
  const { status, progress, resultUrl, error, estimatedTimeLeft } = generateState;

  const handleDownload = useCallback(
    async (format: "png" | "jpg") => {
      if (!resultUrl) return;
      try {
        const response = await fetch(resultUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `drapefusion-${Date.now()}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        toast.success(`Downloaded as ${format.toUpperCase()}`);
      } catch {
        // Fallback: direct link
        const link = document.createElement("a");
        link.href = resultUrl;
        link.download = `drapefusion-${Date.now()}.${format}`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    [resultUrl]
  );

  const handleShare = useCallback(async () => {
    if (!resultUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: "DrapeFusion Try-On", url: resultUrl });
      } else {
        await navigator.clipboard.writeText(resultUrl);
        toast.success("Image URL copied to clipboard!");
      }
    } catch {
      toast.error("Could not share image.");
    }
  }, [resultUrl]);

  return (
    <div className="rounded-2xl border border-border bg-bg-card overflow-hidden min-h-[560px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-text-primary">Result Preview</h3>
          {status === "done" && resultUrl && (
            <Badge className="gap-1 text-xs bg-green-500/15 text-green-400 border-green-500/30">
              <Check className="h-3 w-3" />
              AI Generated
            </Badge>
          )}
          {(status === "uploading" || status === "generating") && (
            <Badge className="gap-1 text-xs bg-accent-gold/15 text-accent-gold border-accent-gold/30">
              <Loader2 className="h-3 w-3 animate-spin" />
              {status === "uploading" ? "Uploading…" : "Generating…"}
            </Badge>
          )}
        </div>
        {status === "done" && resultUrl && (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" onClick={() => handleDownload("jpg")}>
              <Download className="h-3 w-3" />
              JPG
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" onClick={() => handleDownload("png")}>
              <Download className="h-3 w-3" />
              PNG
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" onClick={handleShare}>
              <Share2 className="h-3 w-3" />
              Share
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {status === "idle" && <EmptyState key="idle" />}
          {status === "uploading" && <UploadingState key="uploading" progress={progress} />}
          {status === "generating" && (
            <GeneratingState key="generating" progress={progress} estimatedTimeLeft={estimatedTimeLeft} />
          )}
          {status === "done" && resultUrl && (
            <ResultDisplay key="done" url={resultUrl} category={category} />
          )}
          {status === "error" && (
            <ErrorState key="error" error={error} onRetry={resetGenerateState} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center text-center gap-4"
    >
      {/* Phantom model silhouette */}
      <div className="relative">
        <div className="w-28 h-40 rounded-2xl border-2 border-dashed border-border/60 bg-bg-secondary/40 flex items-end justify-center overflow-hidden">
          <div className="w-14 h-28 bg-gradient-to-t from-border/30 to-transparent rounded-t-full" />
        </div>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-dashed border-border/60 bg-bg-secondary/40" />
        <div className="absolute -right-3 top-10 w-7 h-16 rounded-xl border-2 border-dashed border-border/40 bg-bg-secondary/30" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-text-primary mb-1">
          Your result will appear here
        </h4>
        <p className="text-xs text-text-secondary max-w-52 leading-relaxed">
          Upload a garment &amp; model photo, then click Generate to get your AI try-on.
        </p>
      </div>
      <div className="flex flex-col gap-1.5 text-xs text-text-secondary/60 items-start">
        {["Upload garment image", "Upload model photo", "Click Generate"].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-bg-secondary border border-border flex items-center justify-center text-[10px] font-medium">
              {i + 1}
            </span>
            {step}
            {i < 2 && <ChevronRight className="h-3 w-3 opacity-30" />}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function UploadingState({ progress }: { progress: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex flex-col items-center justify-center text-center w-full max-w-xs gap-5"
    >
      <div className="relative h-16 w-16">
        <div className="h-16 w-16 rounded-full bg-accent-gold/10 flex items-center justify-center">
          <Loader2 className="h-7 w-7 text-accent-gold animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-accent-gold/20 animate-pulse" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-text-primary mb-1">Uploading Images</h4>
        <p className="text-xs text-text-secondary">Preparing your images for AI generation…</p>
      </div>
      <div className="w-full space-y-1.5">
        <Progress value={progress} className="h-1.5 w-full" />
        <p className="text-xs text-text-secondary/60 text-right font-mono">{Math.round(progress)}%</p>
      </div>
    </motion.div>
  );
}

function GeneratingState({
  progress,
  estimatedTimeLeft,
}: {
  progress: number;
  estimatedTimeLeft: number;
}) {
  const messages = [
    "Analysing garment features…",
    "Estimating body pose…",
    "Running diffusion model…",
    "Compositing final image…",
  ];
  const msgIdx = Math.min(Math.floor((progress - 20) / 18), messages.length - 1);
  const currentMsg = messages[Math.max(0, msgIdx)];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="flex flex-col items-center justify-center text-center w-full max-w-xs gap-5"
    >
      {/* Animated sparkle ring */}
      <div className="relative h-20 w-20">
        <div className="h-20 w-20 rounded-full bg-accent-gold/10 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-accent-gold animate-pulse" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-accent-gold/30 border-t-accent-gold animate-spin" />
        <div className="absolute -inset-2 rounded-full border border-accent-gold/10 border-b-accent-gold/20 animate-spin [animation-direction:reverse] [animation-duration:3s]" />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-text-primary mb-1">
          IDM-VTON is working…
        </h4>
        <motion.p
          key={currentMsg}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-text-secondary"
        >
          {currentMsg}
        </motion.p>
      </div>

      <div className="w-full space-y-1.5">
        <Progress value={progress} className="h-1.5 w-full" />
        <div className="flex justify-between text-xs text-text-secondary/60 font-mono">
          <span>{Math.round(progress)}%</span>
          <span>~{estimatedTimeLeft}s left</span>
        </div>
      </div>

      <p className="text-[10px] text-text-secondary/40 max-w-48 leading-relaxed">
        Free GPU queue — this typically takes 30–90 seconds.
      </p>
    </motion.div>
  );
}

function ResultDisplay({
  url,
  category,
}: {
  url: string;
  category: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex flex-col gap-4"
    >
      {/* Image — 3:4 portrait, contain so full body is always visible */}
      <div
        className="relative rounded-xl overflow-hidden border border-border bg-bg-secondary mx-auto"
        style={{ aspectRatio: "3/4", width: "100%", maxWidth: "420px" }}
      >
        <img
          src={url}
          alt="AI generated virtual try-on"
          className="absolute inset-0 w-full h-full object-contain"
        />
        {/* Subtle shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Metadata row */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge className="gap-1 text-xs bg-green-500/15 text-green-400 border-green-500/30">
          <Sparkles className="h-3 w-3" />
          IDM-VTON
        </Badge>
        {category && (
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
        )}
        <Badge variant="secondary" className="text-xs">
          768 × 1024
        </Badge>
      </div>
    </motion.div>
  );
}

function ErrorState({
  error,
  onRetry,
}: {
  error: string | null;
  onRetry: () => void;
}) {
  const isCreditsError = error?.toLowerCase().includes("402") || error?.toLowerCase().includes("insufficient credit") || error?.toLowerCase().includes("payment");
  const isQueueError = error?.toLowerCase().includes("queue") || error?.toLowerCase().includes("timeout");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center text-center gap-4 max-w-sm"
    >
      <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center">
        <AlertTriangle className="h-6 w-6 text-red-400" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-text-primary mb-1">
          {isCreditsError ? "Replicate Credits Needed" : "Generation Failed"}
        </h4>
        <p className="text-xs text-text-secondary leading-relaxed mb-3">
          {isCreditsError
            ? "Your Replicate account has insufficient credits. Add $5 to get ~250 try-ons."
            : isQueueError
            ? "The AI queue is busy. Please try again in ~30 seconds."
            : error || "Something went wrong. Please try again."}
        </p>
      </div>

      {isCreditsError ? (
        <div className="w-full rounded-lg border border-accent-gold/30 bg-accent-gold/5 p-3 text-left space-y-2">
          <p className="text-xs font-semibold text-accent-gold">How to fix:</p>
          <ol className="space-y-1">
            {[
              "Go to replicate.com/account/billing",
              "Add $5 credit (= ~250 try-ons at $0.02 each)",
              "Come back and try again — it works instantly",
            ].map((step, i) => (
              <li key={step} className="flex items-start gap-1.5 text-xs text-text-secondary">
                <span className="text-accent-gold font-bold shrink-0">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
          <a
            href="https://replicate.com/account/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full mt-2 text-center text-xs py-1.5 px-3 rounded-md bg-accent-gold text-bg-primary font-semibold hover:opacity-90 transition-opacity"
          >
            Open Replicate Billing →
          </a>
        </div>
      ) : (
        <div className="w-full rounded-lg border border-border bg-bg-secondary/50 p-3 text-left space-y-1.5">
          <p className="text-xs font-medium text-text-secondary mb-2">Tips:</p>
          {[
            "Use a clear, full-body model photo",
            "Garment should be on a plain background",
            "Try again — HF queue may be busy",
          ].map((hint) => (
            <div key={hint} className="flex items-start gap-1.5">
              <span className="text-text-secondary/40 mt-0.5">•</span>
              <span className="text-xs text-text-secondary/70">{hint}</span>
            </div>
          ))}
        </div>
      )}

      <Button variant="outline" size="sm" className="gap-2" onClick={onRetry}>
        <RefreshCw className="h-3.5 w-3.5" />
        Try Again
      </Button>
    </motion.div>
  );
}

