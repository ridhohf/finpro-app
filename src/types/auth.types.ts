export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "tenant";
  avatar?: string;
  isVerified: boolean;
  tenantProfile?: {
    id: number;
    companyName: string;
    phone?: string;
    address?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface RegisterData {
  name: string;
  email: string;
  role: "user" | "tenant";
  companyName?: string;
  phone?: string;
  address?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyEmailData {
  token: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ConfirmResetPasswordData {
  token: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
}

export interface UpdatePasswordData {
  oldPassword: string;
  newPassword: string;
}
