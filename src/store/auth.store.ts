import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TOKEN_COOKIE, TOKEN_KEY } from "@/services/api";
import type { User } from "@/types";
import { decodeJwt } from "@/utils/format";

interface AuthState {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  setSession: (token: string, user?: Partial<User>) => void;
  logout: () => void;
}

function writeCookie(token: string | null) {
  if (typeof document === "undefined") return;
  // The cookie only lets middleware gate pages; the API still validates the token itself.
  document.cookie = token
    ? `${TOKEN_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
    : `${TOKEN_COOKIE}=; path=/; max-age=0`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      hydrated: false,
      setSession: (token, user) => {
        const decoded = decodeJwt<{ id?: string; name?: string }>(token);
        const prev = get().user;
        set({
          token,
          user: {
            id: decoded?.id ?? prev?.id,
            name: user?.name ?? decoded?.name ?? prev?.name ?? "",
            email: user?.email ?? prev?.email ?? "",
            role: user?.role ?? prev?.role,
          },
        });
        writeCookie(token);
      },
      logout: () => {
        set({ token: null, user: null });
        writeCookie(null);
      },
    }),
    {
      name: TOKEN_KEY,
      partialize: (s) => ({ token: s.token, user: s.user }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          useAuthStore.setState({ hydrated: true });
          writeCookie(state.token);
        }
      },
    }
  )
);
