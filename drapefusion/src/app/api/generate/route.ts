// Virtual Try-On API
// - upper_body (Shirt/Top, Kurta, Kids)  → Try free HF Space first, fallback to Replicate.
// - lower_body / dresses (Jeans, Saree, Full Outfit) → Replicate only (needs credits).

import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { Client, handle_file } from "@gradio/client";

export const maxDuration = 120;
const USE_LOCAL_VTON = process.env.USE_LOCAL_VTON?.toLowerCase() === "true";

type ReplicateCategory = "upper_body" | "lower_body" | "dresses";

function getVtonCategory(category: string): { region: ReplicateCategory } {
  const map: Record<string, { region: ReplicateCategory }> = {
    "Shirt / Top":   { region: "upper_body" },
    "Kurta":         { region: "upper_body" },
    "Jeans / Pants": { region: "lower_body" },
    "Full Outfit":   { region: "dresses" },
    "Saree":         { region: "dresses" },
    "Kids":          { region: "upper_body" },
  };
  return map[category] ?? { region: "upper_body" };
}

// ─── Replicate Engine ────────────────────────────────────────────────────────
async function runReplicate(
  modelImageUrl: string,
  garmentImageUrl: string,
  vtonCategory: ReplicateCategory,
  garmentDes: string,
): Promise<string> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("REPLICATE_API_TOKEN not configured");

  const replicate = new Replicate({ auth: token });
  console.log(`[generate] Replicate | category="${vtonCategory}" | desc="${garmentDes}"`);

  const output = await replicate.run(
    "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
    {
      input: {
        human_img:   modelImageUrl,
        garm_img:    garmentImageUrl,
        garment_des: garmentDes,
        category:    vtonCategory,
        crop:        true,
        steps:       30,
        seed:        Math.floor(Math.random() * 999_999),
        force_dc:    vtonCategory === "dresses",
      },
    }
  );

  if (Array.isArray(output) && output[0]) return String(output[0]);
  if (typeof output === "string") return output;
  const out = output as { url?: () => Promise<string>; toString?: () => string };
  if (out?.url) return String(await out.url());
  if (out?.toString) return out.toString();
  throw new Error("Replicate returned empty response");
}

// ─── HuggingFace Engine (FREE — uses yisol/IDM-VTON ZeroGPU Space) ──────────
async function runHuggingFace(
  modelImageUrl: string,
  garmentImageUrl: string,
  garmentDes: string,
): Promise<string> {
  const source = USE_LOCAL_VTON ? "Local VTON" : "HF Space";
  console.log(`[generate] ${source} (yisol/IDM-VTON) | desc="${garmentDes}"`);

  // Connect to the Space (with HF token for better rate limits)
  const client = USE_LOCAL_VTON
    ? await Client.connect("http://127.0.0.1:7860/", {})
    : await Client.connect("yisol/IDM-VTON", {
        token: (process.env.HF_TOKEN as `hf_${string}`) ?? undefined,
      });

  // The /tryon endpoint expects: [human_image, garment_image, description, auto_mask, auto_crop, steps, seed]
  let result;
  try {
    result = await client.predict("/tryon", [
      { background: handle_file(modelImageUrl), layers: [], composite: null },
      handle_file(garmentImageUrl),
      garmentDes,
      true,   // is_checked (auto-mask)
      true,   // is_checked_crop (auto-crop/resize)
      30,     // denoising steps
      Math.floor(Math.random() * 999_999),  // seed
    ]);
  } catch (predictErr) {
    console.error(`[generate] HF Space predict error:`, predictErr);
    throw new Error(`HF Space predict failed: ${predictErr instanceof Error ? predictErr.message : String(predictErr)}`);
  }

  if (result?.data && Array.isArray(result.data) && result.data[0]) {
    const outputData = result.data[0] as { url: string } | string;
    const imageUrl = typeof outputData === "string" ? outputData : outputData?.url;
    if (imageUrl) return imageUrl;
  }
  throw new Error(`${source} returned empty response`);
}

// ─── Extract Clean Error Message ─────────────────────────────────────────────
function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null) {
    const obj = err as Record<string, unknown>;
    if (typeof obj.message === "string") return obj.message;
    if (typeof obj.original_msg === "string") return obj.original_msg;
  }
  return String(err);
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { garmentImageUrl, modelImageUrl, category, garmentDescription } = await req.json();

    if (!garmentImageUrl || !modelImageUrl) {
      return NextResponse.json({ error: "Missing image URLs" }, { status: 400 });
    }

    const { region } = getVtonCategory(category ?? "Shirt / Top");
    const garmentDes = garmentDescription?.trim() || "fashion garment";

    let imageUrl: string | null = null;
    let usedEngine = "";

    // 1. Always try the FREE Hugging Face space first (handles all categories)
    try {
      imageUrl = await runHuggingFace(modelImageUrl, garmentImageUrl, garmentDes);
      usedEngine = "huggingface";
    } catch (hfErr) {
      const hfMsg = extractErrorMessage(hfErr);
      console.warn(`[generate] HF Space failed: ${hfMsg}. Falling back to Replicate...`);

      // Check if we hit ZeroGPU quota
      const isQuotaExceeded = hfMsg.includes("ZeroGPU quota") || hfMsg.includes("exceeded");

      try {
        imageUrl = await runReplicate(modelImageUrl, garmentImageUrl, region, garmentDes);
        usedEngine = "replicate";
      } catch (repErr) {
        const repMsg = extractErrorMessage(repErr);
        console.warn("[generate] Replicate fallback also failed:", repMsg);

        // If Replicate failed due to credits/402
        if (repMsg.includes("402") || repMsg.toLowerCase().includes("credit") || repMsg.toLowerCase().includes("payment")) {
          return NextResponse.json(
            { error: `Hugging Face free Space timed out (${hfMsg}). Your Replicate account also has insufficient credits.\n\nTo get more free generations, wait for the HF ZeroGPU quota to reset (daily).` },
            { status: 402 }
          );
        }

        if (isQuotaExceeded) {
          throw new Error(
            `Hugging Face free limit hit: ${hfMsg}.\n\n` +
            `HF ZeroGPU quota resets daily. You already have an HF_TOKEN in .env.local which should give better rate limits.`
          );
        }

        throw new Error(`Try-on failed. HF Free Space: ${hfMsg} | Replicate: ${repMsg}`);
      }
    }

    return NextResponse.json({ status: "succeeded", imageUrl, engine: usedEngine });
  } catch (error) {
    const errorMsg = extractErrorMessage(error);
    console.error("[/api/generate] Error:", errorMsg);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ status: "succeeded" });
}
