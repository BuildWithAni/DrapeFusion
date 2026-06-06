"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const examples = [
  {
    id: 1,
    title: "Silk Saree",
    category: "Ethnic Wear",
    beforeDesc: "Flat saree on hanger",
    afterDesc: "AI-generated on-model",
  },
  {
    id: 2,
    title: "Cotton Kurta",
    category: "Men's Wear",
    beforeDesc: "Folded kurta",
    afterDesc: "AI-generated on-model",
  },
  {
    id: 3,
    title: "Designer Gown",
    category: "Western Wear",
    beforeDesc: "Gown on mannequin",
    afterDesc: "AI-generated on-model",
  },
];

export function ExamplesGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAfter, setShowAfter] = useState(true);
  const active = examples[activeIndex];

  return (
    <section id="examples" className="relative py-24 bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-gold/20 bg-accent-gold/5 px-4 py-1.5 text-xs font-medium text-accent-gold mb-4">
            Real Results
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-text-primary mt-4">
            See It In Action
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Real AI-generated outputs from our virtual try-on model. No
            retouching, no editing.
          </p>
        </motion.div>

        {/* Tab Selector */}
        <div className="flex justify-center gap-2 mb-12">
          {examples.map((ex, i) => (
            <button
              key={ex.id}
              onClick={() => setActiveIndex(i)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                i === activeIndex
                  ? "bg-accent-gold text-bg-primary"
                  : "bg-bg-card text-text-secondary hover:text-text-primary border border-border"
              }`}
            >
              {ex.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto"
          >
            {/* Before */}
            <div className="text-center">
              <div className="aspect-[3/4] rounded-2xl bg-bg-card border border-border flex items-center justify-center mb-4 overflow-hidden">
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-accent-gold/5 mx-auto mb-3 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-accent-gold/30" />
                  </div>
                  <p className="text-sm text-text-secondary font-medium">
                    Flat Garment
                  </p>
                </div>
              </div>
              <p className="text-xs text-text-secondary">{active.beforeDesc}</p>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="hidden md:flex flex-col items-center gap-2">
                <ArrowRight className="h-8 w-8 text-accent-gold/40" />
                <span className="text-xs text-accent-gold/60 font-mono">AI</span>
              </div>
              <div className="md:hidden">
                <ArrowRight className="h-6 w-6 text-accent-gold/40 rotate-90" />
              </div>
            </div>

            {/* After */}
            <div className="text-center">
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-accent-gold/5 to-accent-gold/10 border border-accent-gold/20 flex items-center justify-center mb-4 overflow-hidden relative">
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-gold/20 px-2.5 py-1 text-[10px] font-medium text-accent-gold">
                    <Sparkles className="h-2.5 w-2.5" />
                    AI Generated
                  </span>
                </div>
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-accent-gold/10 mx-auto mb-3 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-accent-gold" />
                  </div>
                  <p className="text-sm text-accent-gold font-medium">
                    On Model
                  </p>
                </div>
              </div>
              <p className="text-xs text-accent-gold/60">{active.afterDesc}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-xs text-text-secondary/50 mt-12">
          * These are real AI outputs, not mockups. Results may vary based on
          input quality.
        </p>
      </div>
    </section>
  );
}
