import { api } from "./api";
import type { User, UserPreferences } from "@/store/auth.store";
import { DEFAULT_PREFERENCES } from "@/store/auth.store";

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  location?: string;
  kecamatan?: string;
  bio?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateProfileDTO {
  name?: string;
  location?: string;
  kecamatan?: string;
  bio?: string;
  preferences?: Partial<UserPreferences>;
  avatarColor?: string;
}

export interface ChangePasswordDTO {
  current_password: string;
  password: string;
  password_confirmation: string;
}

function makeInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function makeMockUser(name: string, email: string, location = "Surabaya, Indonesia"): User {
  return {
    id: `usr_${Date.now()}`,
    name,
    email,
    location,
    avatarInitials: makeInitials(name),
    level: 1,
    xp: 50,
    totalXP: 50,
    rank: 999,
    isVerified: false,
    joinedAt: new Date().toISOString(),
    preferences: DEFAULT_PREFERENCES,
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      return await api.post<AuthResponse>("/auth/login", { email, password });
    } catch {
      await new Promise((r) => setTimeout(r, 700));
      if (password.length < 3) throw new Error("Email atau password salah");
      return {
        token: `mock_token_${Date.now()}`,
        user: makeMockUser("Aditya Pratama", email, "Surabaya, Indonesia"),
      };
    }
  },

  register: async (data: RegisterDTO): Promise<AuthResponse> => {
    try {
      return await api.post<AuthResponse>("/auth/register", data);
    } catch {
      await new Promise((r) => setTimeout(r, 700));
      return {
        token: `mock_token_${Date.now()}`,
        user: makeMockUser(data.name, data.email, data.location),
      };
    }
  },

  getMe: async (): Promise<User> => {
    return await api.get<User>("/auth/me");
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch {
      /* no-op */
    }
  },

  updateProfile: async (data: UpdateProfileDTO): Promise<User> => {
    try {
      return await api.put<User>("/auth/profile", data);
    } catch {
      await new Promise((r) => setTimeout(r, 400));
      throw new Error("API not available — changes saved locally");
    }
  },

  uploadAvatar: async (file: File): Promise<{ avatar_url: string }> => {
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      return await api.post<{ avatar_url: string }>("/auth/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch {
      const url = URL.createObjectURL(file);
      return { avatar_url: url };
    }
  },

  changePassword: async (data: ChangePasswordDTO): Promise<void> => {
    try {
      await api.put("/auth/password", data);
    } catch {
      await new Promise((r) => setTimeout(r, 500));
      if (data.current_password === "wrong") throw new Error("Password lama tidak sesuai");
    }
  },

  deleteAccount: async (): Promise<void> => {
    try {
      await api.delete("/auth/account");
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  },
};
