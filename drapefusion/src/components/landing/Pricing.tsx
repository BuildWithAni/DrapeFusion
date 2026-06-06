"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Pay-as-you-go",
    price: "₹20",
    unit: "per image",
    description: "Perfect for occasional use. No commitment required.",
    features: [
      "High-resolution output (1024x1024)",
      "Commercial usage rights",
      "JPEG & PNG download",
      "Email support",
      "Generation history",
    ],
    cta: "Start with 3 Free Credits",
    href: "/signup",
    popular: false,
  },
  {
    name: "Bulk / Business",
    price: "₹499",
    unit: "for 35 credits",
    description: "For brands and boutiques with regular catalog needs.",
    features: [
      "All pay-as-you-go features",
      "35 credits at ₹14.25/image",
      "Priority generation queue",
      "Dedicated support",
      "Batch processing",
      "Custom model profiles",
    ],
    cta: "Buy Business Pack",
    href: "/dashboard/wallet",
    popular: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-gold/20 bg-accent-gold/5 px-4 py-1.5 text-xs font-medium text-accent-gold mb-4">
            Simple Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-text-primary mt-4">
            One Credit = One Image
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Start with 3 free credits on signup. No hidden fees, no subscriptions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-accent-gold/40 bg-gradient-to-b from-accent-gold/5 to-bg-card animate-pulse-glow"
                  : "border-border bg-bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-gold px-4 py-1 text-xs font-semibold text-bg-primary">
                    <Sparkles className="h-3 w-3" />
                    Best Value
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-serif font-semibold text-text-primary">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-serif font-bold text-text-primary">
                    {plan.price}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {plan.unit}
                  </span>
                </div>
                <p className="mt-2 text-sm text-text-secondary">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-text-secondary"
                  >
                    <Check className="h-4 w-4 text-accent-gold mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
