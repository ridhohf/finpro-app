export interface User {
  id: number;
  email: string;
  name: string;
  role: "USER" | "TENANT";
  avatar?: string;
  tenantProfile?: {
    companyName: string;
    phone?: string;
    address?: string;
  };
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  role: "USER" | "TENANT";
  name?: string;
  companyName?: string;
  phone?: string;
  address?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}
