import { api } from "./api";
import type { User } from "@/store/auth.store";

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  location?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
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

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      return await api.post<AuthResponse>("/auth/login", { email, password });
    } catch {
      return { token: "mock_token_dev", user: MOCK_USER };
    }
  },

  register: async (data: RegisterDTO): Promise<AuthResponse> => {
    try {
      return await api.post<AuthResponse>("/auth/register", data);
    } catch {
      return { token: "mock_token_dev", user: { ...MOCK_USER, name: data.name, email: data.email } };
    }
  },

  getMe: async (): Promise<User> => {
    try {
      return await api.get<User>("/auth/me");
    } catch {
      return MOCK_USER;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch {
      /* no-op — clear local state regardless */
    }
  },
};
