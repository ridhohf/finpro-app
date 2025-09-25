import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = Cookies.get("refreshToken");
      if (refreshToken) {
        try {
          const response = await api.post("/auth/refresh-token", {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          Cookies.set("accessToken", accessToken);

          return api(original);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          Cookies.remove("user");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "tenant";
  avatar?: string;
  tenantProfile?: TenantProfile;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TenantProfile {
  id: number;
  userId: number;
  companyName: string;
  phone?: string;
  address?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Auth API functions
export const authApi = {
  register: (data: {
    name: string;
    email: string;
    role: "user" | "tenant";
    companyName?: string;
    phone?: string;
    address?: string;
  }) => api.post<ApiResponse<{ userId: number }>>("/auth/register", data),

  verifyEmail: (
    token: string,
    data: { password: string; confirmPassword: string }
  ) => api.post<ApiResponse>(`/auth/verify-email/${token}`, data),

  login: (data: { email: string; password: string; role: "user" | "tenant" }) =>
    api.post<ApiResponse<LoginResponse>>("/auth/login", data),

  socialLogin: (data: {
    email: string;
    name: string;
    provider: string;
    providerId: string;
    role: "user" | "tenant";
    avatar?: string;
  }) => api.post<ApiResponse<LoginResponse>>("/auth/social-login", data),

  requestPasswordReset: (data: { email: string }) =>
    api.post<ApiResponse>("/auth/request-password-reset", data),

  resetPassword: (
    token: string,
    data: { password: string; confirmPassword: string }
  ) => api.post<ApiResponse>(`/auth/reset-password/${token}`, data),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string }>>("/auth/refresh-token", {
      refreshToken,
    }),

  resendVerification: (data: { email: string }) =>
    api.post<ApiResponse>("/auth/resend-verification", data),
};

// Profile API functions
export const profileApi = {
  getProfile: () => api.get<ApiResponse<User>>("/profile"),

  updateProfile: (data: {
    name?: string;
    companyName?: string;
    phone?: string;
    address?: string;
  }) => api.put<ApiResponse<User>>("/profile", data),

  updatePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => api.put<ApiResponse>("/profile/password", data),

  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return api.put<ApiResponse<{ avatar: string }>>(
      "/profile/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  updateEmail: (data: { newEmail: string }) =>
    api.put<ApiResponse>("/profile/email", data),
};
