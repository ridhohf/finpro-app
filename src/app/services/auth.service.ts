import { apiClient } from "@/lib/api";
import {
  LoginResponse,
  RegisterRequest,
  LoginRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth";

export const authService = {
  register: async (data: RegisterRequest) => {
    return await apiClient.post<{ message: string }>(
      "/api/auth/register",
      data
    );
  },

  verifyEmail: async (data: VerifyEmailRequest) => {
    return await apiClient.post<{ message: string }>(
      "/api/auth/verify-email",
      data
    );
  },

  login: async (data: LoginRequest) => {
    return await apiClient.post<LoginResponse>("/api/auth/login", data);
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    return await apiClient.post<{ message: string }>(
      "/api/auth/forgot-password",
      data
    );
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    return await apiClient.post<{ message: string }>(
      "/api/auth/reset-password",
      data
    );
  },
};
