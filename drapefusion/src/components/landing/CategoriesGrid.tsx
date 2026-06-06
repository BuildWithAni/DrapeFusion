"use client";

import { motion } from "framer-motion";
import {
  Shirt,
  User,
  Baby,
  IndianRupee,
  Watch,
} from "lucide-react";

const categories = [
  { icon: Shirt, label: "Women", count: "24 styles generated", color: "from-pink-500/20 to-rose-500/10" },
  { icon: User, label: "Men", count: "18 styles generated", color: "from-blue-500/20 to-cyan-500/10" },
  { icon: Baby, label: "Kids", count: "12 styles generated", color: "from-green-500/20 to-emerald-500/10" },
  { icon: IndianRupee, label: "Ethnic Wear", count: "30 styles generated", color: "from-amber-500/20 to-orange-500/10" },
  { icon: Watch, label: "Accessories", count: "8 styles generated", color: "from-purple-500/20 to-violet-500/10" },
];

export function CategoriesGrid() {
  return (
    <section className="relative py-24 bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-gold/20 bg-accent-gold/5 px-4 py-1.5 text-xs font-medium text-accent-gold mb-4">
            Categories
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-text-primary mt-4">
            Everything You Sell
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            From traditional wear to modern fashion, DrapeFusion works with all
            categories.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group cursor-pointer"
              >
                <div className="rounded-2xl bg-bg-card border border-border p-6 h-full hover:border-accent-gold/30 transition-all duration-300">
                  <div
                    className={`h-14 w-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-7 w-7 text-text-primary" />
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-text-primary mb-1">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-text-secondary">{cat.count}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
