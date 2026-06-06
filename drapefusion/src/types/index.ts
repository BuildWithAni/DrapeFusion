// DrapeFusion Type Definitions

export type Category =
  | "Shirt / Top"   // upper_body — shirts, t-shirts, jackets, hoodies, blazers
  | "Kurta"         // upper_body — ethnic tunic
  | "Jeans / Pants" // lower_body — jeans, trousers, pants, leggings, skirts
  | "Full Outfit"   // dresses    — complete set: kurta + pajama, full outfit
  | "Saree"         // dresses    — full-length draped garment
  | "Kids";         // upper_body — kids clothing

export type BackgroundPreset =
  | "Studio White"
  | "Gradient"
  | "Natural Light"
  | "Transparent";

export interface GenerationInput {
  garmentImageUrl: string;
  modelImageUrl: string;
  category: Category;
  background: BackgroundPreset;
  numOutputs: 1 | 2 | 4;
}

export interface GenerationResult {
  id: string;
  userId: string;
  garmentUrl: string;
  modelUrl: string;
  resultUrl: string;
  category: Category | null;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  credits: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  razorpayPaymentId: string | null;
  creditsAdded: number;
  amountInr: number;
  status: "pending" | "success" | "failed";
  createdAt: string;
}

export interface CreditPack {
  credits: number;
  price: number;
  label: string;
}

export const CREDIT_PACKS: CreditPack[] = [
  { credits: 5, price: 99, label: "Starter" },
  { credits: 12, price: 199, label: "Popular" },
  { credits: 35, price: 499, label: "Business" },
];

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface GenerateState {
  status: "idle" | "uploading" | "generating" | "done" | "error";
  progress: number;
  resultUrl: string | null;
  error: string | null;
  estimatedTimeLeft: number;
}
