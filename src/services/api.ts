import axios, { AxiosError } from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://ecommerce.routemisr.com/api/v1";

export const TOKEN_KEY = "freshcart-auth";
export const TOKEN_COOKIE = "fc_token";

/** Reads the persisted JWT (browser only). The API expects it in a `token` header. */
export function readToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { token?: string | null } };
    return parsed.state?.token ?? null;
  } catch {
    return null;
  }
}

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = readToken();
  if (token) config.headers.set("token", token);
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      // Session expired or invalid: clear it and send the user to sign in.
      window.localStorage.removeItem(TOKEN_KEY);
      document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
      const path = window.location.pathname;
      if (!path.startsWith("/login") && !path.startsWith("/register")) {
        window.location.href = `/login?redirect=${encodeURIComponent(path)}`;
      }
    }
    return Promise.reject(error);
  }
);

interface ApiErrorBody {
  message?: string;
  errors?: { msg?: string }[] | { message?: string };
}

/** Turns any thrown value into a message that is safe to show the user. */
export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return "Can't reach the server. Check your connection and try again.";
    const body = error.response.data as ApiErrorBody | undefined;
    if (body?.message) return body.message;
    if (Array.isArray(body?.errors) && body.errors[0]?.msg) return body.errors[0].msg as string;
    return fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function isNotFound(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}
