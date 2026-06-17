import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser } from "@/lib/types";

const PROFILE_KEY = "osstel_admin_profile";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AdminUser | null;
  setAuth: (
    accessToken: string,
    refreshToken: string,
    user: AdminUser
  ) => void;
  setUser: (user: AdminUser) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      setAuth: (accessToken, refreshToken, user) => {
        set({ accessToken, refreshToken, user });
      },

      setUser: (user) => set({ user }),

      logout: () => {
        set({ accessToken: null, refreshToken: null, user: null });
      },

      isAuthenticated: () => !!get().accessToken,
    }),
    {
      name: "osstel-admin-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);

export function getStoredProfile(): { name: string; avatarUrl: string | null } {
  if (typeof window === "undefined") {
    return { name: "", avatarUrl: null };
  }
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return { name: "", avatarUrl: null };
}

export function saveProfileProfile(data: {
  name: string;
  avatarUrl: string | null;
}) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
