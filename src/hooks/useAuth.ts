"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import type { RegisterDTO, LoginDTO } from "@/services/auth.service";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, logout: clearStore, setUser, updateUser } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: LoginDTO) =>
      authService.login(email, password),
    onSuccess: (data) => {
      Cookies.set("pacul_token", data.token, { expires: 7, sameSite: "lax" });
      localStorage.setItem("pacul_token", data.token);
      setUser(data.user);
      toast.success(`Selamat datang, ${data.user.name}! 🌿`);
      router.push("/dashboard");
    },
    onError: () => {
      toast.error("Email atau password salah");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterDTO) => authService.register(data),
    onSuccess: (data) => {
      Cookies.set("pacul_token", data.token, { expires: 7, sameSite: "lax" });
      localStorage.setItem("pacul_token", data.token);
      setUser(data.user);
    },
    onError: () => {
      toast.error("Gagal membuat akun. Coba lagi.");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      Cookies.remove("pacul_token");
      localStorage.removeItem("pacul_token");
      localStorage.removeItem("pacul-auth");
      clearStore();
      router.push("/login");
    },
  });

  const loginAsGuest = () => {
    const guestToken = "guest_token_demo";
    Cookies.set("pacul_token", guestToken, { expires: 1, sameSite: "lax" });
    localStorage.setItem("pacul_token", guestToken);
    setUser({
      id: "guest_001",
      name: "Guest User",
      email: "guest@pacul.id",
      location: "Surabaya, Indonesia",
      avatarInitials: "GU",
      avatarColor: "#A8D5BA",
      level: 1,
      xp: 0,
      totalXP: 0,
      rank: 9999,
    });
    toast.success("Masuk sebagai Guest 👋");
    router.push("/dashboard");
  };

  return {
    user,
    isAuthenticated,
    loginMutation,
    registerMutation,
    logoutMutation,
    loginAsGuest,
    updateUser,
  };
}
