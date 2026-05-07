// TODO: Auth custom hook — BLOK auth
import { useAuthStore } from "@/store/auth.store";

export function useAuth() {
  const { user, token, isAuthenticated, setUser, setToken, logout } =
    useAuthStore();
  return { user, token, isAuthenticated, setUser, setToken, logout };
}
