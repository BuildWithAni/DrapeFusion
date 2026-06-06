"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ChevronDown } from "lucide-react";

export function Hero() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(x, 5), 95));
  };

  // Auto-slide on mount
  useEffect(() => {
    let forward = true;
    const interval = setInterval(() => {
      setSliderPos((prev) => {
        if (prev >= 90) forward = false;
        if (prev <= 10) forward = true;
        return forward ? prev + 0.5 : prev - 0.5;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary to-bg-secondary" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-accent-gold/3 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column - Text */}
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-gold/20 bg-accent-gold/5 px-4 py-1.5 text-xs font-medium text-accent-gold">
                <Sparkles className="h-3 w-3" />
                AI-Powered Virtual Try-On
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-tight text-text-primary"
            >
              Turn Any Fabric Into a{" "}
              <span className="text-accent-gold">Catalog Photo</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-lg"
            >
              Upload your garment. Upload a model photo. Get studio-quality
              catalog images in seconds. No photoshoot. No studio. Just upload
              and generate.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto group">
                  Generate Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#examples">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  See Examples
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 text-sm text-text-secondary"
            >
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                10,000+ Brands
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-gold" />
                4.9/5 Rating
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-gold" />
                ₹20 per image
              </span>
            </motion.div>
          </div>

          {/* Right Column - Comparison Slider */}
          <motion.div
            variants={itemVariants}
            className="relative"
            ref={containerRef}
            onMouseMove={handleMouseMove}
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border shadow-2xl">
              {/* Before image (original garment) */}
              <div className="absolute inset-0 bg-bg-card">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-accent-gold/10 mx-auto mb-4 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-accent-gold/40" />
                    </div>
                    <p className="text-text-secondary text-sm font-medium">
                      Before
                    </p>
                    <p className="text-text-secondary/60 text-xs mt-1">
                      Flat garment on hanger
                    </p>
                  </div>
                </div>
                {/* Decorative grid lines */}
                <div className="absolute inset-0 opacity-[0.03]">
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />
                </div>
              </div>

              {/* After image (model wearing garment) */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-accent-gold/5 to-accent-gold/10 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-accent-gold/20 mx-auto mb-4 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-accent-gold" />
                    </div>
                    <p className="text-accent-gold text-sm font-medium">
                      After
                    </p>
                    <p className="text-accent-gold/60 text-xs mt-1">
                      AI-generated on-model
                    </p>
                  </div>
                </div>
              </div>

              {/* Slider handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-accent-gold cursor-ew-resize z-10"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-accent-gold shadow-lg shadow-accent-gold/30 flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-bg-primary"
                  >
                    <path
                      d="M6 4L3 8L6 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 4L13 8L10 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 animate-float">
              <div className="rounded-xl bg-bg-card border border-border px-4 py-2 shadow-xl">
                <p className="text-xs text-text-secondary">4.9</p>
                <div className="flex text-accent-gold">
                  {"★★★★★"}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-2 -left-4 animate-float" style={{ animationDelay: "1.5s" }}>
              <div className="rounded-xl bg-bg-card border border-border px-4 py-2 shadow-xl">
                <p className="text-xs font-medium text-text-primary">
                  10,000+ Brands
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-text-secondary/50">Scroll to explore</span>
        <ChevronDown className="h-4 w-4 text-text-secondary/50 animate-bounce" />
      </motion.div>
    </section>
  );
}
