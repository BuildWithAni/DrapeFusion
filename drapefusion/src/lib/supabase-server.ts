// Mock server Supabase client — uses localStorage via mock-data.
// No API keys needed.

import { mockAuth, mockWallet } from "./mock-data";

export async function createServerSupabaseClient() {
  return {
    auth: {
      getUser: async () => {
        const user = mockAuth.getCurrentUser();
        return { data: { user }, error: null };
      },
    },
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (col: string, val: any) => ({
          single: async () => {
            if (table === "wallets") {
              const wallet = mockWallet.getWallet(val);
              return { data: wallet, error: null };
            }
            return { data: null, error: { message: "Not found", code: "404" } };
          },
        }),
        order: (col: string, opts?: { ascending?: boolean }) => ({
          limit: async (n: number) => {
            return { data: [], error: null };
          },
        }),
      }),
      insert: async (data: any) => {
        return { data, error: null };
      },
      update: (updates: any) => ({
        eq: async (col: string, val: any) => {
          return { data: updates, error: null };
        },
      }),
    }),
  };
}

export async function getAuthenticatedUser() {
  return mockAuth.getCurrentUser();
}
