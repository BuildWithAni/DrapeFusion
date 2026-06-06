"use client";

import { useCallback, useEffect } from "react";
import { useAppStore } from "@/stores/appStore";
import { mockAuth, mockWallet, mockTransactions, MOCK_CREDIT_PACKS } from "@/lib/mock-data";
import { toast } from "sonner";

export function useCredits() {
  const { credits, setCredits, user } = useAppStore();

  const fetchCredits = useCallback(() => {
    const currentUser = mockAuth.getCurrentUser();
    if (currentUser) {
      const wallet = mockWallet.getWallet(currentUser.id);
      setCredits(wallet.credits);
    }
  }, [setCredits]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits, user]);

  const buyCredits = useCallback(
    async (pack: { credits: number; price: number }) => {
      const currentUser = mockAuth.getCurrentUser();
      if (!currentUser) {
        toast.error("Please sign in to purchase credits.");
        return;
      }

      try {
        // Simulate Razorpay checkout with a delay
        toast.loading("Opening checkout...");

        await new Promise((r) => setTimeout(r, 1500));

        toast.dismiss();
        toast.success("Payment successful!");

        // Add credits to wallet
        mockWallet.addCredits(currentUser.id, pack.credits);

        // Record transaction
        mockTransactions.add({
          userId: currentUser.id,
          creditsAdded: pack.credits,
          amountInr: pack.price,
          status: "success",
        });

        // Update local state
        const wallet = mockWallet.getWallet(currentUser.id);
        setCredits(wallet.credits);

        toast.success(`${pack.credits} credits added to your wallet!`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Payment failed"
        );
      }
    },
    [setCredits]
  );

  return {
    credits,
    buyCredits,
    fetchCredits,
    creditPacks: MOCK_CREDIT_PACKS,
  };
}
