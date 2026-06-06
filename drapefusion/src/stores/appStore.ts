import { create } from "zustand";
import type { GenerateState, Category, BackgroundPreset, UserProfile } from "@/types";

interface AppState {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Credits
  credits: number;
  setCredits: (credits: number) => void;

  // Uploads
  garmentFile: File | null;
  garmentPreview: string | null;
  modelFile: File | null;
  modelPreview: string | null;
  setGarmentFile: (file: File | null, preview: string | null) => void;
  setModelFile: (file: File | null, preview: string | null) => void;
  clearUploads: () => void;

  // Settings
  category: Category;
  garmentDescription: string; // ← user describes the garment: "floral shirt", "white kurta" etc.
  background: BackgroundPreset;
  numOutputs: 1 | 2 | 4;
  setCategory: (category: Category) => void;
  setGarmentDescription: (description: string) => void;
  setBackground: (background: BackgroundPreset) => void;
  setNumOutputs: (numOutputs: 1 | 2 | 4) => void;

  // Generation
  generateState: GenerateState;
  setGenerateState: (state: Partial<GenerateState>) => void;
  resetGenerateState: () => void;
}

const initialState: GenerateState = {
  status: "idle",
  progress: 0,
  resultUrl: null,
  error: null,
  estimatedTimeLeft: 0,
};

export const useAppStore = create<AppState>((set) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),

  // Credits
  credits: 0,
  setCredits: (credits) => set({ credits }),

  // Uploads
  garmentFile: null,
  garmentPreview: null,
  modelFile: null,
  modelPreview: null,
  setGarmentFile: (garmentFile, garmentPreview) =>
    set({ garmentFile, garmentPreview }),
  setModelFile: (modelFile, modelPreview) => set({ modelFile, modelPreview }),
  clearUploads: () =>
    set({
      garmentFile: null,
      garmentPreview: null,
      modelFile: null,
      modelPreview: null,
    }),

  // Settings
  category: "Shirt / Top" as Category,
  garmentDescription: "",
  background: "Studio White" as BackgroundPreset,
  numOutputs: 1 as 1 | 2 | 4,
  setCategory: (category) => set({ category }),
  setGarmentDescription: (garmentDescription) => set({ garmentDescription }),
  setBackground: (background) => set({ background }),
  setNumOutputs: (numOutputs) => set({ numOutputs }),

  // Generation
  generateState: initialState,
  setGenerateState: (state) =>
    set((prev) => ({
      generateState: { ...prev.generateState, ...state },
    })),
  resetGenerateState: () => set({ generateState: initialState }),
}));
