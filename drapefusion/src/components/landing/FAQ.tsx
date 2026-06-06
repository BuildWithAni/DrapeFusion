"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does DrapeFusion work?",
    a: "Upload a flat image of your garment and a model photo. Our AI-powered virtual try-on model (IDM-VTON) automatically generates a photorealistic image of the garment on your model. It's like having a photoshoot without the studio.",
  },
  {
    q: "What AI model powers this?",
    a: "We use IDM-VTON, one of the most advanced open-source virtual try-on models, running on Replicate's infrastructure. It's specifically trained for garment-to-model transfer with high fidelity.",
  },
  {
    q: "What image formats are supported?",
    a: "We support JPEG, PNG, and WEBP formats. For best results, we recommend high-resolution images (at least 1024x1024) with good lighting and minimal background clutter.",
  },
  {
    q: "How much does it cost?",
    a: "Each generation costs 1 credit (₹20). You get 3 free credits when you sign up. You can purchase additional credit packs starting at ₹99 for 5 credits.",
  },
  {
    q: "Can I use the generated images commercially?",
    a: "Yes! All images generated through DrapeFusion come with full commercial usage rights. You can use them for catalog listings, social media, advertisements, and any other commercial purpose.",
  },
  {
    q: "How long does generation take?",
    a: "Typically 20-40 seconds per image. The exact time depends on server load and image complexity. You'll see real-time progress in the dashboard.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your uploaded images are stored securely on Cloudinary with private access. They are only used to generate your requested images and are never shared or used for training.",
  },
  {
    q: "What if I'm not satisfied with the result?",
    a: "You can regenerate with different settings (seed, denoise steps) for the same 1 credit cost. If you're consistently unsatisfied, contact our support team for assistance.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 bg-bg-secondary">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-gold/20 bg-accent-gold/5 px-4 py-1.5 text-xs font-medium text-accent-gold mb-4">
            Got Questions?
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-text-primary mt-4">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="rounded-xl border border-border bg-bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-accent-gold/5"
                >
                  <span className="text-sm font-medium text-text-primary pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-accent-gold shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5">
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
