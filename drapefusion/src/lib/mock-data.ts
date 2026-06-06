// ============================================================
// MOCK DATA LAYER — replaces Supabase, Cloudinary, Replicate,
// and Razorpay with localStorage-backed in-memory storage.
// No API keys needed. Works fully offline.
// ============================================================

// --------------- Types ---------------

export interface MockUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface MockWallet {
  userId: string;
  credits: number;
}

export interface MockGeneration {
  id: string;
  userId: string;
  garmentUrl: string;
  modelUrl: string;
  resultUrl: string;
  category: string | null;
  createdAt: string;
}

export interface MockTransaction {
  id: string;
  userId: string;
  creditsAdded: number;
  amountInr: number;
  status: "success";
  createdAt: string;
}

// --------------- Storage Keys ---------------

const KEYS = {
  users: "df_users",
  currentUser: "df_current_user",
  wallets: "df_wallets",
  generations: "df_generations",
  transactions: "df_transactions",
};

// --------------- Helpers ---------------

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full — ignore
  }
}

function generateId(): string {
  return "df_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// --------------- Auth ---------------

export const mockAuth = {
  getUsers(): MockUser[] {
    return getItem<MockUser[]>(KEYS.users, []);
  },

  saveUsers(users: MockUser[]): void {
    setItem(KEYS.users, users);
  },

  getCurrentUser(): MockUser | null {
    return getItem<MockUser | null>(KEYS.currentUser, null);
  },

  setCurrentUser(user: MockUser | null): void {
    setItem(KEYS.currentUser, user);
  },

  signUp(email: string, password: string, fullName?: string): MockUser {
    const users = this.getUsers();
    const existing = users.find((u) => u.email === email);
    if (existing) throw new Error("User already exists with this email");

    const user: MockUser = {
      id: generateId(),
      email,
      fullName: fullName || email.split("@")[0],
      createdAt: new Date().toISOString(),
    };

    // Store password alongside (simple mock — NOT for production)
    users.push({ ...user, ...{ _password: password } as any });
    this.saveUsers(users);

    // Auto-create wallet with 3 free credits
    mockWallet.createWallet(user.id);

    this.setCurrentUser(user);
    return user;
  },

  signIn(email: string, password: string): MockUser {
    const users = this.getUsers();
    const user = users.find(
      (u: any) => u.email === email && u._password === password
    );
    if (!user) throw new Error("Invalid email or password");

    // Strip _password before returning
    const { _password, ...safe } = user as any;
    this.setCurrentUser(safe);
    return safe;
  },

  signOut(): void {
    this.setCurrentUser(null);
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};

// --------------- Wallet ---------------

export const mockWallet = {
  getAllWallets(): MockWallet[] {
    return getItem<MockWallet[]>(KEYS.wallets, []);
  },

  saveAllWallets(wallets: MockWallet[]): void {
    setItem(KEYS.wallets, wallets);
  },

  createWallet(userId: string): MockWallet {
    const wallets = this.getAllWallets();
    const existing = wallets.find((w) => w.userId === userId);
    if (existing) return existing;

    const wallet: MockWallet = { userId, credits: 3 };
    wallets.push(wallet);
    this.saveAllWallets(wallets);
    return wallet;
  },

  getWallet(userId: string): MockWallet {
    const wallets = this.getAllWallets();
    let wallet = wallets.find((w) => w.userId === userId);
    if (!wallet) {
      wallet = this.createWallet(userId);
    }
    return wallet;
  },

  deductCredit(userId: string): boolean {
    const wallets = this.getAllWallets();
    const idx = wallets.findIndex((w) => w.userId === userId);
    if (idx === -1) return false;
    if (wallets[idx].credits < 1) return false;
    wallets[idx].credits -= 1;
    this.saveAllWallets(wallets);
    return true;
  },

  addCredits(userId: string, amount: number): void {
    const wallets = this.getAllWallets();
    const idx = wallets.findIndex((w) => w.userId === userId);
    if (idx === -1) {
      const wallet: MockWallet = { userId, credits: amount };
      wallets.push(wallet);
    } else {
      wallets[idx].credits += amount;
    }
    this.saveAllWallets(wallets);
  },
};

// --------------- Generations ---------------

export const mockGenerations = {
  getAll(userId: string): MockGeneration[] {
    const all = getItem<MockGeneration[]>(KEYS.generations, []);
    return all.filter((g) => g.userId === userId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  add(gen: Omit<MockGeneration, "id" | "createdAt">): MockGeneration {
    const all = getItem<MockGeneration[]>(KEYS.generations, []);
    const record: MockGeneration = {
      ...gen,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    all.push(record);
    setItem(KEYS.generations, all);
    return record;
  },
};

// --------------- Transactions ---------------

export const mockTransactions = {
  getAll(userId: string): MockTransaction[] {
    const all = getItem<MockTransaction[]>(KEYS.transactions, []);
    return all.filter((t) => t.userId === userId);
  },

  add(tx: Omit<MockTransaction, "id" | "createdAt">): MockTransaction {
    const all = getItem<MockTransaction[]>(KEYS.transactions, []);
    const record: MockTransaction = {
      ...tx,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    all.push(record);
    setItem(KEYS.transactions, record);
    return record;
  },
};

// --------------- Replicate Simulation ---------------

export async function simulateAiGeneration(
  garmentDataUrl: string,
  modelDataUrl: string
): Promise<string> {
  // Simulate AI processing time (3–6 seconds)
  const delay = 3000 + Math.random() * 3000;
  await new Promise((r) => setTimeout(r, delay));

  try {
    return await compositeImages(garmentDataUrl, modelDataUrl);
  } catch {
    return garmentDataUrl; // fallback: show garment photo clean
  }
}

/**
 * Virtual Try-On mock compositing (768 × 1024 canvas).
 *
 * Strategy:
 *  - GARMENT photo → full-frame hero (it already shows the outfit being worn)
 *  - MODEL photo   → small bottom-right reference card "SOURCE MODEL"
 *  - Decorative:   vignette, gold frame, "AI Try-On Result" badge, branding bar
 *
 * This avoids the ghost double-image from naive alpha-blending and produces
 * output that looks like a real AI virtual try-on result.
 */
function compositeImages(
  garmentDataUrl: string,
  modelDataUrl: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const W = 768;
    const H = 1024;

    const canvas = document.createElement("canvas");
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) { reject(new Error("Canvas not available")); return; }

    const garmentImg = new Image();
    const modelImg   = new Image();
    garmentImg.crossOrigin = "anonymous";
    modelImg.crossOrigin   = "anonymous";
    let loaded = 0;

    const tryDraw = () => {
      if (loaded < 2) return;

      // ── 1. Full-frame GARMENT photo (hero, cover-fit) ──────────────
      const gAR = garmentImg.naturalWidth / garmentImg.naturalHeight;
      const cAR = W / H;
      let sx = 0, sy = 0, sw = garmentImg.naturalWidth, sh = garmentImg.naturalHeight;
      if (gAR > cAR) {
        sw = garmentImg.naturalHeight * cAR;
        sx = (garmentImg.naturalWidth - sw) / 2;
      } else {
        sh = garmentImg.naturalWidth / cAR;
        sy = (garmentImg.naturalHeight - sh) / 2;
      }
      ctx.drawImage(garmentImg, sx, sy, sw, sh, 0, 0, W, H);

      // ── 2. Subtle edge vignette for studio depth ───────────────────
      const vign = ctx.createRadialGradient(W/2, H*0.45, H*0.25, W/2, H*0.45, H*0.72);
      vign.addColorStop(0, "rgba(0,0,0,0)");
      vign.addColorStop(1, "rgba(0,0,0,0.28)");
      ctx.fillStyle = vign;
      ctx.fillRect(0, 0, W, H);

      // ── 3. Gold catalog frame ──────────────────────────────────────
      ctx.strokeStyle = "rgba(201,168,76,0.6)";
      ctx.lineWidth   = 1.5;
      rrect(ctx, 14, 14, W - 28, H - 28, 8);
      ctx.stroke();

      // ── 4. "AI Try-On Result" pill badge — top-left ────────────────
      const badgeTxt = "✦  AI Try-On Result";
      ctx.font = "bold 11px sans-serif";
      const bW = ctx.measureText(badgeTxt).width + 22;
      const bH = 28, bX = 26, bY = 26;

      ctx.fillStyle = "rgba(10,9,7,0.72)";
      rrect(ctx, bX, bY, bW, bH, 14);
      ctx.fill();
      ctx.strokeStyle = "rgba(201,168,76,0.55)";
      ctx.lineWidth = 1;
      rrect(ctx, bX, bY, bW, bH, 14);
      ctx.stroke();
      ctx.fillStyle = "rgba(232,201,122,1)";
      ctx.textAlign = "left";
      ctx.fillText(badgeTxt, bX + 11, bY + 18);

      // ── 5. Source model reference card — bottom-right ──────────────
      const cW = 130, cH = 160;
      const cX = W - cW - 24;
      const cY = H - cH - 24;
      const cR = 12;

      // Drop shadow
      ctx.shadowColor   = "rgba(0,0,0,0.65)";
      ctx.shadowBlur    = 18;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = "rgba(12,11,9,0.85)";
      rrect(ctx, cX, cY, cW, cH, cR);
      ctx.fill();

      // Clear shadow
      ctx.shadowColor   = "transparent";
      ctx.shadowBlur    = 0;
      ctx.shadowOffsetY = 0;

      // Gold border
      ctx.strokeStyle = "rgba(201,168,76,0.4)";
      ctx.lineWidth   = 1;
      rrect(ctx, cX, cY, cW, cH, cR);
      ctx.stroke();

      // Model photo (cover-fit, clipped)
      const pad = 8;
      const iX = cX + pad, iY = cY + pad;
      const iW = cW - pad * 2, iH = cH - 34;

      ctx.save();
      rrect(ctx, iX, iY, iW, iH, 7);
      ctx.clip();

      const mAR = modelImg.naturalWidth / modelImg.naturalHeight;
      const iAR = iW / iH;
      let msx = 0, msy = 0, msw = modelImg.naturalWidth, msh = modelImg.naturalHeight;
      if (mAR > iAR) { msw = modelImg.naturalHeight * iAR; msx = (modelImg.naturalWidth - msw) / 2; }
      else           { msh = modelImg.naturalWidth  / iAR; msy = (modelImg.naturalHeight - msh) / 2; }
      ctx.drawImage(modelImg, msx, msy, msw, msh, iX, iY, iW, iH);
      ctx.restore();

      // Label
      ctx.fillStyle  = "rgba(201,168,76,0.8)";
      ctx.font       = "bold 8px monospace";
      ctx.textAlign  = "center";
      ctx.fillText("SOURCE MODEL", cX + cW / 2, cY + cH - 12);

      // ── 6. Bottom branding bar ─────────────────────────────────────
      const bGrad = ctx.createLinearGradient(0, H - 36, 0, H);
      bGrad.addColorStop(0, "rgba(0,0,0,0)");
      bGrad.addColorStop(1, "rgba(0,0,0,0.7)");
      ctx.fillStyle = bGrad;
      ctx.fillRect(0, H - 36, W, 36);

      ctx.fillStyle = "rgba(201,168,76,0.45)";
      ctx.font      = "9px monospace";
      ctx.textAlign = "right";
      ctx.fillText("DrapeFusion • Virtual Try-On", W - 20, H - 13);

      resolve(canvas.toDataURL("image/jpeg", 0.94));
    };

    garmentImg.onload  = () => { loaded++; tryDraw(); };
    modelImg.onload    = () => { loaded++; tryDraw(); };
    garmentImg.onerror = () => reject(new Error("Failed to load garment image"));
    modelImg.onerror   = () => reject(new Error("Failed to load model image"));

    garmentImg.src = garmentDataUrl;
    modelImg.src   = modelDataUrl;
  });
}

/** Draw a rounded-rectangle path (no stroke/fill applied). */
function rrect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y,     x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h,     x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y,         x + r, y);
  ctx.closePath();
}

// --------------- Local File Storage ---------------

export function storeFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// --------------- Mock Credit Packs ---------------

export interface MockCreditPack {
  credits: number;
  price: number;
  label: string;
  recommended?: boolean;
}

export const MOCK_CREDIT_PACKS: MockCreditPack[] = [
  { credits: 5,  price: 99,  label: "Starter" },
  { credits: 12, price: 199, label: "Popular", recommended: true },
  { credits: 35, price: 499, label: "Business" },
];
