// Mock auth callback — no API keys needed.

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { origin } = new URL(req.url);
  const next = req.nextUrl.searchParams.get("next") ?? "/dashboard";

  // In mock mode, just redirect
  return NextResponse.redirect(`${origin}${next}`);
}
