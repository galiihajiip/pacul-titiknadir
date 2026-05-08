import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserPreferences {
  notifications: boolean;
  publicProfile: boolean;
  weeklyReport: boolean;
  badgeNotifications: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  kecamatan?: string;
  bio?: string;
  avatarUrl?: string;
  avatarInitials: string;
  avatarColor?: string;
  level: number;
  xp: number;
  totalXP: number;
  rank: number;
  isVerified?: boolean;
  joinedAt?: string;
  preferences?: UserPreferences;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  setUser: (user: User) => void;
  updateUser: (partial: Partial<User>) => void;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  notifications: true,
  publicProfile: true,
  weeklyReport: true,
  badgeNotifications: true,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      logout: () =>
        set({ user: null, isAuthenticated: false, isLoading: false }),

      setUser: (user) =>
        set({
          user: { preferences: DEFAULT_PREFERENCES, ...user },
          isAuthenticated: true,
        }),

      updateUser: (partial) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...partial } } : {}
        ),
    }),
    {
      name: "pacul-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
