import axios, { type AxiosRequestConfig } from "axios";

const _axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

/* ── Request: attach auth token ── */
_axios.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("pacul_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ── Response: unwrap data, handle 401 ── */
_axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("pacul_token");
      localStorage.removeItem("pacul-auth");
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data ?? error);
  }
);

/* ── Typed wrappers that reflect the interceptor-unwrapped response ── */
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    _axios.get(url, config) as unknown as Promise<T>,
  post: <T = void>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    _axios.post(url, data, config) as unknown as Promise<T>,
  put: <T = void>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    _axios.put(url, data, config) as unknown as Promise<T>,
  patch: <T = void>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    _axios.patch(url, data, config) as unknown as Promise<T>,
  delete: <T = void>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    _axios.delete(url, config) as unknown as Promise<T>,
};
