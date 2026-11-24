import { api } from "./api";
import type { AuthResponse } from "@/types";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post<AuthResponse>("/auth/signin", { email, password });
    return data;
  },
  async register(payload: RegisterPayload) {
    const { data } = await api.post<AuthResponse>("/auth/signup", payload);
    return data;
  },
  /** Step 1 of password recovery: emails a 6-digit reset code. */
  async forgotPassword(email: string) {
    const { data } = await api.post<{ statusMsg: string; message: string }>("/auth/forgotPasswords", { email });
    return data;
  },
  /** Step 2: verify the code that was emailed. */
  async verifyResetCode(resetCode: string) {
    const { data } = await api.post<{ status: string }>("/auth/verifyResetCode", { resetCode });
    return data;
  },
  /** Step 3: set the new password. */
  async resetPassword(email: string, newPassword: string) {
    const { data } = await api.put<{ token: string }>("/auth/resetPassword", { email, newPassword });
    return data;
  },
  /** Requires being signed in. Returns a fresh token. */
  async changePassword(currentPassword: string, password: string, rePassword: string) {
    const { data } = await api.put<{ message: string; token: string }>("/users/changeMyPassword", {
      currentPassword,
      password,
      rePassword,
    });
    return data;
  },
  async verifyToken() {
    const { data } = await api.get<{ message: string; decoded: { id: string; name: string } }>("/auth/verifyToken");
    return data;
  },
};
