"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AdminProfileFormData } from "@/lib/types";
import {
  getStoredProfile,
  saveProfileProfile,
  useAuthStore,
} from "@/lib/store/auth-store";

interface AuthContextValue {
  user: ReturnType<typeof useAuthStore.getState>["user"];
  avatarUrl: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  logout: () => void;
  updateProfile: (data: AdminProfileFormData) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const storeLogout = useAuthStore((s) => s.logout);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const applyStoredProfile = useCallback((currentUser: NonNullable<typeof user>) => {
    const profile = getStoredProfile();
    setAvatarUrl(profile.avatarUrl);
    if (profile.name && profile.name !== currentUser.name) {
      useAuthStore.getState().setUser({ ...currentUser, name: profile.name });
    }
  }, []);

  useEffect(() => {
    const currentUser = useAuthStore.getState().user;
    if (accessToken && currentUser) {
      applyStoredProfile(currentUser);
    }
    setIsLoading(false);
  }, [accessToken, user?.id, applyStoredProfile]);

  const logout = useCallback(() => {
    storeLogout();
  }, [storeLogout]);

  const updateProfile = useCallback((data: AdminProfileFormData) => {
    saveProfileProfile(data);
    setAvatarUrl(data.avatarUrl);
    if (user) {
      useAuthStore.getState().setUser({ ...user, name: data.name });
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      avatarUrl,
      isLoading,
      isLoggedIn: !!accessToken,
      logout,
      updateProfile,
    }),
    [user, avatarUrl, isLoading, accessToken, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
