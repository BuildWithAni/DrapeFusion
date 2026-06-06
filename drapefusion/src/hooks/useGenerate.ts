"use client";

import { useCallback, useRef } from "react";
import { useAppStore } from "@/stores/appStore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { runVirtualTryOn } from "@/lib/replicate";
import { mockAuth, mockWallet, mockGenerations } from "@/lib/mock-data";
import { toast } from "sonner";

export function useGenerate() {
  const {
    garmentFile,
    modelFile,
    category,
    garmentDescription,
    credits,
    generateState,
    setGenerateState,
    resetGenerateState,
    setCredits,
  } = useAppStore();

  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopProgressTicker = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const generate = useCallback(async () => {
    if (!garmentFile || !modelFile) {
      toast.error("Please ensure both a garment image and a model photo are selected.");
      return;
    }

    const user = mockAuth.getCurrentUser();
    if (!user) {
      toast.error("Authentication required to perform generation.");
      return;
    }

    if (credits < 1) {
      toast.error("Insufficient credits. Please purchase more to continue.");
      return;
    }

    setGenerateState({
      status: "uploading",
      progress: 0,
      error: null,
      resultUrl: null,
      estimatedTimeLeft: 60,
    });

    try {
      // Phase 1: Uploading
      setGenerateState({ status: "uploading", progress: 20, estimatedTimeLeft: 45 });
      
      const [garmentUrl, modelUrl] = await Promise.all([
        uploadToCloudinary(garmentFile),
        uploadToCloudinary(modelFile),
      ]);

      // Phase 2: Generating
      setGenerateState({
        status: "generating",
        progress: 40,
        estimatedTimeLeft: 30,
      });

      let currentProgress = 40;
      progressTimerRef.current = setInterval(() => {
        currentProgress = Math.min(currentProgress + 2, 90);
        const timeLeft = Math.max(5, Math.round((90 - currentProgress) / 1.2));
        setGenerateState({ progress: currentProgress, estimatedTimeLeft: timeLeft });
      }, 1000);

      const output = await runVirtualTryOn({
        human_img:       modelUrl,
        garm_img:        garmentUrl,
        garment_des:     garmentDescription?.trim() || "fashion garment",
        category:        category ?? "Western",
        is_checked:      true,
        is_checked_crop: true,
        denoise_steps:   30,
        seed:            Math.floor(Math.random() * 999_999),
      });

      stopProgressTicker();

      const resultUrl = Array.isArray(output) ? output[0] : output;

      // Phase 3: Finalizing
      mockWallet.deductCredit(user.id);
      const wallet = mockWallet.getWallet(user.id);
      setCredits(wallet.credits);

      mockGenerations.add({
        userId: user.id,
        garmentUrl,
        modelUrl,
        resultUrl,
        category,
      });

      setGenerateState({
        status: "done",
        progress: 100,
        resultUrl,
        estimatedTimeLeft: 0,
      });

      toast.success("Virtual try-on generation successful!");
    } catch (error) {
      stopProgressTicker();
      const message = error instanceof Error ? error.message : "An unexpected error occurred during generation.";
      setGenerateState({ status: "error", error: message, progress: 0, estimatedTimeLeft: 0, resultUrl: null });
      toast.error(message);
    }
  }, [
    garmentFile,
    modelFile,
    garmentDescription,
    category,
    credits,
    setGenerateState,
    setCredits,
  ]);

  const reset = useCallback(() => {
    stopProgressTicker();
    resetGenerateState();
  }, [resetGenerateState]);

  return {
    generate,
    reset,
    isGenerating: generateState.status === "generating",
    isDone:       generateState.status === "done",
    isError:      generateState.status === "error",
    state:        generateState,
  };
}
