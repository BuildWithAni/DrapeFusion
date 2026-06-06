"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UploadPanel } from "@/components/dashboard/UploadPanel";
import { GenerateButton } from "@/components/dashboard/GenerateButton";
import { ResultViewer } from "@/components/dashboard/ResultViewer";
import { CreditBadge } from "@/components/dashboard/CreditBadge";
import { useAppStore } from "@/stores/appStore";
import { useGenerate } from "@/hooks/useGenerate";
import { useCredits } from "@/hooks/useCredits";
import { mockAuth } from "@/lib/mock-data";
import { ChevronDown, Settings2, Tag } from "lucide-react";

// Each category maps to a VTON masking region:
// upper_body → shirt, t-shirt, jacket, kurta, hoodie, blazer
// lower_body  → jeans, trousers, pants, leggings, skirt
// dresses     → full-body garment (saree, kurta+pajama set, dress)
const categories = [
  { label: "Shirt / Top",        region: "upper",  emoji: "👕" },
  { label: "Kurta",              region: "upper",  emoji: "🧥" },
  { label: "Jeans / Pants",      region: "lower",  emoji: "👖" },
  { label: "Full Outfit",        region: "full",   emoji: "🧣" },
  { label: "Saree",              region: "full",   emoji: "🪷" },
  { label: "Kids",               region: "upper",  emoji: "👶" },
] as const;

type CategoryLabel = typeof categories[number]["label"];

const backgrounds = [
  "Studio White",
  "Gradient",
  "Natural Light",
  "Transparent",
] as const;

const outputOptions = [1, 2, 4] as const;

export default function DashboardPage() {
  const router = useRouter();
  const {
    setUser,
    category,
    garmentDescription,
    background,
    numOutputs,
    setCategory,
    setGarmentDescription,
    setBackground,
    setNumOutputs,
  } = useAppStore();
  const { generate, state } = useGenerate();
  const { credits, fetchCredits } = useCredits();
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = mockAuth.getCurrentUser();
    if (!user) { router.push("/login"); return; }
    setUser({ id: user.id, email: user.email, fullName: user.fullName, avatarUrl: user.avatarUrl });
    fetchCredits();
  }, [router, setUser, fetchCredits]);

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-text-primary">
            Create Catalog Image
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Upload your garment and model photo to generate a studio-quality try-on
          </p>
        </div>
        <CreditBadge credits={credits} />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-4"
        >
          <UploadPanel type="garment" />

          {/* ── Garment Description ── CRITICAL: tells AI WHAT the garment is ── */}
          <div className="rounded-xl border border-border bg-bg-card px-5 py-4 space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-text-primary uppercase tracking-wider">
              <Tag className="h-3.5 w-3.5 text-accent-gold" />
              Describe Your Garment
            </label>
            <input
              type="text"
              value={garmentDescription}
              onChange={(e) => setGarmentDescription(e.target.value)}
              placeholder='e.g. "floral print shirt", "white kurta", "black saree"'
              className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-accent-gold/50 focus:border-accent-gold/50 transition-colors"
            />
            <p className="text-[10px] text-text-secondary/60 leading-relaxed">
              This tells the AI <em>exactly</em> what garment to apply. Leaving it blank may cause the wrong style to be generated.
            </p>
          </div>

          <UploadPanel type="model" />

          {/* Guidelines / Quality Guide */}
          <div className="rounded-xl border border-border bg-bg-card overflow-hidden">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("quality-guide-content");
                if (el) el.classList.toggle("hidden");
              }}
              className="flex w-full items-center justify-between px-5 py-3 text-xs font-semibold text-text-primary hover:bg-accent-gold/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-accent-gold">✨</span>
                How to get Perfect Try-On Results
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
            </button>
            <div id="quality-guide-content" className="hidden border-t border-border px-5 py-4 space-y-3 bg-bg-secondary/20 text-xs text-text-secondary">
              <div>
                <p className="font-semibold text-text-primary mb-1">1. Garment Image Cutout</p>
                <p className="leading-relaxed">
                  The garment image should show <strong>only the clothing item itself</strong>. If the garment photo has a hanger, body parts, or a white shirt layer underneath (like in the polo photo), the AI will try to draw those onto the model too.
                </p>
              </div>
              <div>
                <p className="font-semibold text-text-primary mb-1">2. Avoid Length Conflicts</p>
                <p className="leading-relaxed">
                  If you try on a short shirt/hoodie on a model wearing a long kurta, the bottom hem of the green kurta will peak out from below. Use a model wearing standard-length tops or trousers for shirts.
                </p>
              </div>
              <div>
                <p className="font-semibold text-text-primary mb-1">3. Clear Model Photo</p>
                <p className="leading-relaxed">
                  Use an upright, full-body portrait photo. The VTON model maps the new clothes perfectly to the model's posture and dimensions.
                </p>
              </div>
            </div>
          </div>

          {/* Settings Accordion */}

          <div className="rounded-xl border border-border bg-bg-card overflow-hidden">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex w-full items-center justify-between px-5 py-4 text-sm font-medium text-text-primary hover:bg-accent-gold/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-text-secondary" />
                Settings
              </div>
              <ChevronDown
                className={`h-4 w-4 text-text-secondary transition-transform duration-200 ${
                  showSettings ? "rotate-180" : ""
                }`}
              />
            </button>

            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="border-t border-border px-5 py-4 space-y-5"
              >
                {/* Category — controls WHERE mask is applied */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
                    Garment Type / Body Region
                  </label>
                  <p className="text-[10px] text-text-secondary/50 mb-2">
                    Pick what matches the garment you uploaded.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const isSelected = category === cat.label;
                      const regionColor = cat.region === "full"
                        ? (isSelected ? "bg-black/20 text-bg-primary" : "bg-purple-500/20 text-purple-400")
                        : cat.region === "lower"
                        ? (isSelected ? "bg-black/20 text-bg-primary" : "bg-blue-500/20 text-blue-400")
                        : (isSelected ? "bg-black/20 text-bg-primary" : "bg-green-500/20 text-green-400");

                      return (
                        <button
                          key={cat.label}
                          onClick={() => setCategory(cat.label as import("@/types").Category)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-accent-gold text-bg-primary"
                              : "bg-bg-secondary text-text-secondary hover:text-text-primary border border-border"
                          }`}
                        >
                          <span>{cat.emoji}</span>
                          <span>{cat.label}</span>
                          <span className={`text-[9px] px-1 py-0.5 rounded font-bold tracking-tight uppercase ${regionColor}`}>
                            {cat.region === "full" ? "FULL" : cat.region === "lower" ? "LOWER" : "TOP"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-3 mt-2">
                    {[
                      { badge: "TOP", color: "text-green-400", desc: "shirt, top, jacket" },
                      { badge: "LOWER", color: "text-blue-400", desc: "jeans, pants, skirt" },
                      { badge: "FULL", color: "text-purple-400", desc: "full outfit, saree" },
                    ].map(({ badge, color, desc }) => (
                      <span key={badge} className="flex items-center gap-1 text-[10px] text-text-secondary/50">
                        <span className={`font-bold ${color}`}>{badge}</span> = {desc}
                      </span>
                    ))}
                  </div>
                </div>


                {/* Background */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    Background
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {backgrounds.map((bg) => (
                      <button
                        key={bg}
                        onClick={() => setBackground(bg)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          background === bg
                            ? "bg-accent-gold text-bg-primary"
                            : "bg-bg-secondary text-text-secondary hover:text-text-primary border border-border"
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Outputs */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    Number of Outputs
                  </label>
                  <div className="flex gap-2">
                    {outputOptions.map((num) => (
                      <button
                        key={num}
                        onClick={() => setNumOutputs(num)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          numOutputs === num
                            ? "bg-accent-gold text-bg-primary"
                            : "bg-bg-secondary text-text-secondary hover:text-text-primary border border-border"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <GenerateButton onGenerate={generate} />
        </motion.div>

        {/* Right Panel — Result Viewer */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <ResultViewer />
        </motion.div>
      </div>
    </div>
  );
}
