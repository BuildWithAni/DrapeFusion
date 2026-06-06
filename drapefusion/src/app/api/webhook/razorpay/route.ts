// Mock Razorpay webhook — no API keys needed.

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // In mock mode, always verify successfully
    return NextResponse.json({ status: "verified" });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
