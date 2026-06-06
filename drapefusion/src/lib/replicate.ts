// Client-side helper — calls POST /api/generate
// The server handles Replicate (primary) → HF Space (fallback) logic.

export interface IdmVtonInput {
  human_img:        string;
  garm_img:         string;
  garment_des:      string;   // user's description e.g. "floral shirt", "blue kurta"
  is_checked?:      boolean;
  is_checked_crop?: boolean;
  denoise_steps?:   number;
  seed?:            number;
  category?:        string;   // our app category: Kurta / Saree / Western / Full Outfit
}

export async function runVirtualTryOn(input: IdmVtonInput): Promise<string[]> {
  // Try the real AI generation API first
  try {
    const res = await fetch("/api/generate", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        garmentImageUrl:    input.garm_img,
        modelImageUrl:      input.human_img,
        category:           input.category ?? "Western",
        garmentDescription: input.garment_des,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.status === "succeeded" && data.imageUrl) {
        return [data.imageUrl];
      }
    }
    console.warn("[runVirtualTryOn] API failed, using canvas fallback");
  } catch (err) {
    console.warn("[runVirtualTryOn] API error, using canvas fallback:", err);
  }

  // Fallback: canvas-based simulation (always works, no API keys needed)
  const { simulateAiGeneration } = await import("./mock-data");
  const resultUrl = await simulateAiGeneration(input.garm_img, input.human_img);
  return [resultUrl];
}
