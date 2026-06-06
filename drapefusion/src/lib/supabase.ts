// Mock Supabase client — uses localStorage instead of a real Supabase backend.
// No API keys needed.

import { mockAuth, type MockUser } from "./mock-data";

type AuthChangeListener = (event: string, session: any) => void;

const listeners: AuthChangeListener[] = [];

function notify(event: string) {
  const user = mockAuth.getCurrentUser();
  const session = user ? { user } : null;
  listeners.forEach((fn) => fn(event, session));
}

function onAuthStateChange(callback: AuthChangeListener) {
  listeners.push(callback);
  return {
    data: { subscription: { unsubscribe: () => {} } },
  };
}

export function createClient() {
  return {
    auth: {
      getUser: async () => {
        const user = mockAuth.getCurrentUser();
        return { data: { user }, error: null };
      },
      signUp: async ({
        email,
        password,
        options,
      }: {
        email: string;
        password: string;
        options?: { data?: { full_name?: string } };
      }) => {
        try {
          const user = mockAuth.signUp(
            email,
            password,
            options?.data?.full_name
          );
          notify("SIGNED_IN");
          return { data: { user }, error: null };
        } catch (e: any) {
          return { data: null, error: e };
        }
      },
      signInWithPassword: async ({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) => {
        try {
          const user = mockAuth.signIn(email, password);
          notify("SIGNED_IN");
          return { data: { user }, error: null };
        } catch (e: any) {
          return { data: null, error: e };
        }
      },
      signInWithOAuth: async ({ provider }: { provider: string }) => {
        // Mock Google OAuth — auto-create/sign-in
        const email = `demo.${provider}@drapefusion.demo`;
        try {
          let user = mockAuth.getCurrentUser();
          if (!user) {
            user = mockAuth.signUp(email, "password123", "Demo User");
          }
          notify("SIGNED_IN");
          return { data: { provider }, error: null };
        } catch (e: any) {
          return { data: null, error: e };
        }
      },
      signOut: async () => {
        mockAuth.signOut();
        notify("SIGNED_OUT");
        return { error: null };
      },
      onAuthStateChange,
      exchangeCodeForSession: async () => {
        return { data: {}, error: null };
      },
    },
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (col: string, val: any) => ({
          single: async () => {
            // Return mock data based on table
            if (table === "wallets") {
              const { mockWallet } = await import("./mock-data");
              const currentUser = mockAuth.getCurrentUser();
              if (currentUser) {
                const wallet = mockWallet.getWallet(currentUser.id);
                return { data: wallet, error: null };
              }
              return { data: null, error: { message: "No user", code: "PGRST116" } };
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
