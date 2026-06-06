// Mock history API — no API keys needed.

import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  // In mock mode, the client reads history from localStorage directly
  return NextResponse.json({ generations: [] });
}
