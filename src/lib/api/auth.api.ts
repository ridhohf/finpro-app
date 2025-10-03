import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";
import type {
  AuthResponse,
  RegisterData,
  LoginData,
  VerifyEmailData,
  User,
  ResetPasswordData,
  ConfirmResetPasswordData,
  UpdateProfileData,
  UpdatePasswordData,
} from "../../types/auth.types";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

class AuthAPI {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  private async requestWithFile<T>(
    endpoint: string,
    formData: FormData,
    token?: string
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  async register(data: RegisterData): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.REGISTER, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData): Promise<AuthResponse> {
    return this.request(API_ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async socialLogin(provider: string, data: any): Promise<AuthResponse> {
    return this.request(API_ENDPOINTS.SOCIAL_LOGIN, {
      method: "POST",
      body: JSON.stringify({ ...data, provider }),
    });
  }

  async verifyEmail(data: VerifyEmailData): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.VERIFY_EMAIL, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async resendVerification(email: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.RESEND_VERIFICATION, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(email: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.RESET_PASSWORD, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async confirmResetPassword(
    data: ConfirmResetPasswordData
  ): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.CONFIRM_RESET_PASSWORD, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getProfile(token: string): Promise<ApiResponse<User>> {
    return this.request(API_ENDPOINTS.PROFILE, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateProfile(
    token: string,
    data: UpdateProfileData,
    avatar?: File
  ): Promise<ApiResponse> {
    if (avatar) {
      const formData = new FormData();
      formData.append("avatar", avatar);
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });
      return this.requestWithFile(API_ENDPOINTS.PROFILE, formData, token);
    }

    return this.request(API_ENDPOINTS.PROFILE, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async updatePassword(
    token: string,
    data: UpdatePasswordData
  ): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.UPDATE_PASSWORD, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }
}

export const authAPI = new AuthAPI();
