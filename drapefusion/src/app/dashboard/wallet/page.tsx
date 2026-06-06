"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockAuth, MOCK_CREDIT_PACKS, type MockCreditPack } from "@/lib/mock-data";
import { useCredits } from "@/hooks/useCredits";
import {
  Wallet,
  Sparkles,
  ArrowLeft,
  Check,
  Zap,
  CreditCard,
  History,
} from "lucide-react";

export default function WalletPage() {
  const router = useRouter();
  const { credits, buyCredits } = useCredits();
  const [loading, setLoading] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = mockAuth.getCurrentUser();
    if (!user) {
      router.push("/login");
    }
  }, [router]);

  const handleBuy = async (pack: MockCreditPack) => {
    setLoading(pack.label);
    try {
      await buyCredits(pack);
    } finally {
      setLoading(null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-bg-card transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-text-secondary" />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-bold text-text-primary">
            Wallet & Credits
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Purchase credits to generate more catalog images
          </p>
        </div>
      </div>

      {/* Current Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <Card className="bg-gradient-to-br from-accent-gold/5 to-bg-card border-accent-gold/20">
          <CardContent className="flex items-center justify-between py-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-accent-gold/10 flex items-center justify-center">
                <Wallet className="h-7 w-7 text-accent-gold" />
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">
                  Available Credits
                </p>
                <p className="text-4xl font-serif font-bold text-accent-gold">
                  {credits}
                </p>
              </div>
            </div>
            <div className="hidden sm:block">
              <Badge variant="default" className="text-xs px-3 py-1.5">
                <Sparkles className="h-3 w-3 mr-1" />
                1 credit = 1 image
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Credit Packs */}
      <div className="mb-10">
        <h2 className="text-lg font-serif font-semibold text-text-primary mb-6">
          Buy Credits
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {MOCK_CREDIT_PACKS.map((pack, index) => {
            const pricePerCredit = (pack.price / pack.credits).toFixed(0);
            return (
              <motion.div
                key={pack.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`relative h-full border ${
                    pack.recommended
                      ? "border-accent-gold/40 bg-gradient-to-b from-accent-gold/5 to-bg-card"
                      : "border-border"
                  }`}
                >
                  {pack.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent-gold px-3 py-0.5 text-[10px] font-semibold text-bg-primary">
                        <Zap className="h-2.5 w-2.5" />
                        Best Value
                      </span>
                    </div>
                  )}

                  <CardHeader className="text-center pt-7">
                    <CardTitle className="text-lg">
                      {pack.credits} Credits
                    </CardTitle>
                    <CardDescription>{pack.label} Pack</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div>
                      <span className="text-3xl font-serif font-bold text-text-primary">
                        ₹{pack.price}
                      </span>
                      <p className="text-xs text-text-secondary mt-1">
                        ₹{pricePerCredit}/credit
                      </p>
                    </div>

                    <div className="space-y-2 text-left">
                      {[
                        `${pack.credits} catalog images`,
                        "Commercial usage rights",
                        "High-resolution output",
                        "Instant delivery",
                      ].map((feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-2 text-xs text-text-secondary"
                        >
                          <Check className="h-3 w-3 text-accent-gold mt-0.5 shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full"
                      variant={
                        pack.recommended ? "default" : "outline"
                      }
                      onClick={() => handleBuy(pack)}
                      disabled={loading === pack.label}
                    >
                      {loading === pack.label ? (
                        "Processing..."
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Buy ₹{pack.price}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Transaction History Link */}
      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/history")}
          className="text-text-secondary"
        >
          <History className="mr-2 h-4 w-4" />
          View Generation History
        </Button>
      </div>
    </div>
  );
}
