import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GovUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "government";
  governmentUnit: string;
  avatarInitials: string;
}

interface GovAuthStore {
  user: GovUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const MOCK_GOV_USERS: GovUser[] = [
  { id: "gov1", name: "Budi Santoso", email: "budi@surabaya.go.id", role: "government", governmentUnit: "Dinas Kebersihan Kota Surabaya", avatarInitials: "BS" },
  { id: "gov2", name: "Siti Rahma", email: "siti@surabaya.go.id", role: "government", governmentUnit: "BPLHD Surabaya", avatarInitials: "SR" },
  { id: "adm1", name: "Admin PACUL", email: "admin@pacul.gov.id", role: "admin", governmentUnit: "PACUL Platform", avatarInitials: "AP" },
];

export const useGovAuthStore = create<GovAuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        await new Promise((r) => setTimeout(r, 900));
        const isGovEmail = email.endsWith("@surabaya.go.id") || email.endsWith("@pacul.gov.id");
        if (!isGovEmail) return { success: false, error: "Gunakan email akun pemerintah (@surabaya.go.id atau @pacul.gov.id)" };
        if (password.length < 6) return { success: false, error: "Password salah." };
        const found = MOCK_GOV_USERS.find((u) => u.email === email) ?? {
          id: `gov-${Date.now()}`,
          name: email.split("@")[0],
          email,
          role: "government" as const,
          governmentUnit: "Dinas Kebersihan Kota Surabaya",
          avatarInitials: email.substring(0, 2).toUpperCase(),
        };
        set({ user: found, isAuthenticated: true });
        return { success: true };
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "pacul-gov-auth" }
  )
);
