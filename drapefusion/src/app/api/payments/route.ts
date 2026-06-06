// Mock payments API — no API keys needed.

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { credits, amountInr } = await req.json();

    if (!credits || !amountInr) {
      return NextResponse.json(
        { error: "Missing credits or amount" },
        { status: 400 }
      );
    }

    // Return a mock Razorpay order
    return NextResponse.json({
      id: "order_mock_" + Date.now(),
      amount: amountInr * 100,
      currency: "INR",
      receipt: `credits_${credits}_${Date.now()}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
