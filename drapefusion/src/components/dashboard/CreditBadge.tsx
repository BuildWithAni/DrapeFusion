"use client";

import { Sparkles } from "lucide-react";

interface CreditBadgeProps {
  credits: number;
  compact?: boolean;
}

export function CreditBadge({ credits, compact = false }: CreditBadgeProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-accent-gold/20 bg-accent-gold/5 px-3 py-1">
        <Sparkles className="h-3 w-3 text-accent-gold" />
        <span className="text-xs font-medium text-accent-gold">
          {credits} credits
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent-gold/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-accent-gold" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">
              Available Credits
            </p>
            <p className="text-2xl font-serif font-bold text-accent-gold">
              {credits}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
