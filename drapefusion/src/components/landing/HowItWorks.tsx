"use client";

import { motion } from "framer-motion";
import { Upload, UserRound, ImageDown } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Garment",
    description:
      "Add your saree, kurta, dress, or any outfit photo. Supports JPEG, PNG, and WEBP formats.",
  },
  {
    number: "02",
    icon: UserRound,
    title: "Upload Model Photo",
    description:
      "Use your own model reference for brand consistency. Any pose, any angle.",
  },
  {
    number: "03",
    icon: ImageDown,
    title: "Generate & Download",
    description:
      "Get catalog-ready images in seconds. Commercial use included. Download in PNG or JPG.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-gold/20 bg-accent-gold/5 px-4 py-1.5 text-xs font-medium text-accent-gold mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-text-primary mt-4">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Three simple steps to transform your flat garments into stunning
            catalog-quality images.
          </p>
        </motion.div>

        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Connecting line (desktop) */}
          <svg
            className="absolute top-24 left-[15%] w-[70%] h-1 hidden md:block"
            viewBox="0 0 100 1"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="0.5"
              x2="100"
              y2="0.5"
              stroke="rgba(201, 168, 76, 0.2)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          </svg>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="rounded-2xl bg-bg-card border border-border p-8 h-full hover:border-accent-gold/30 transition-colors duration-300 group">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-5xl font-mono font-bold text-accent-gold/20 group-hover:text-accent-gold/40 transition-colors">
                      {step.number}
                    </span>
                    <div className="h-12 w-12 rounded-xl bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors">
                      <Icon className="h-6 w-6 text-accent-gold" />
                    </div>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
