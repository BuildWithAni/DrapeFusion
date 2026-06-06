// Mock wallet API — no API keys needed.

import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  // Mock: always returns 3 credits
  return NextResponse.json({ credits: 3 });
}
