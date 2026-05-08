import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  level: number;
  xp: number;
  totalXP: number;
  rank: number;
  avatarInitials: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

const MOCK_USER: User = {
  id: "usr_001",
  name: "Aditya Pratama",
  email: "aditya@pacul.id",
  location: "Surabaya, Indonesia",
  level: 12,
  xp: 750,
  totalXP: 4200,
  rank: 12,
  avatarInitials: "AP",
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (_email: string, _password: string) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));
        set({ user: MOCK_USER, isAuthenticated: true, isLoading: false });
      },

      logout: () =>
        set({ user: null, isAuthenticated: false, isLoading: false }),

      setUser: (user) => set({ user, isAuthenticated: true }),
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
