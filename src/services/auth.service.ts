import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../config/api.config";

export interface LoginApiRequest {
  email: string;
  password: string;
  salon_id?: string;
}

export interface LoginApiResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in?: number;
  user_id: string;
  salon_id: string;
  role: string;
  salon_name?: string;
}

export interface RegisterInitiateApiRequest {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterInitiateApiResponse {
  success: boolean;
  session_id: string;
  masked_email: string;
  masked_phone: string;
  expires_in: number;
  cooldown_seconds: number;
  dev_otp?: string;
  message: string;
}

export interface VerifyOtpApiRequest {
  session_id: string;
  email: string;
  otp: string;
}

export interface VerifyOtpApiResponse {
  success: boolean;
  verified: boolean;
  verification_token: string;
  message: string;
}

export interface ResendOtpApiRequest {
  session_id: string;
  email: string;
}

export interface ResendOtpApiResponse {
  success: boolean;
  session_id: string;
  expires_in: number;
  cooldown_seconds: number;
  dev_otp?: string;
  message: string;
}

export interface CheckSlugApiResponse {
  available: boolean;
  slug: string;
  message: string;
}

export interface RegisterCompleteApiRequest {
  verification_token: string;
  full_name: string;
  email: string;
  phone: string;
  password: string;
  salon_name: string;
  slug?: string;
  salon_phone?: string;
  salon_email?: string;
  address?: string;
  city?: string;
  district?: string;
  salon_type?: string;
  currency?: string;
  timezone?: string;
}

export interface RegisterCompleteApiResponse {
  success: boolean;
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    full_name?: string;
    role: string;
  };
  salon: {
    id: string;
    name: string;
    slug: string;
    phone?: string;
    email?: string;
    address?: string;
    currency: string;
    timezone: string;
  };
  message: string;
}

export const authService = {
  async login(credentials: LoginApiRequest): Promise<LoginApiResponse> {
    const response = await apiClient.post<LoginApiResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  },

  async initiateRegister(data: RegisterInitiateApiRequest): Promise<RegisterInitiateApiResponse> {
    const response = await apiClient.post<RegisterInitiateApiResponse>(
      API_ENDPOINTS.AUTH.REGISTER_INITIATE,
      data
    );
    return response.data;
  },

  async verifyOtp(data: VerifyOtpApiRequest): Promise<VerifyOtpApiResponse> {
    const response = await apiClient.post<VerifyOtpApiResponse>(
      API_ENDPOINTS.AUTH.REGISTER_VERIFY_OTP,
      data
    );
    return response.data;
  },

  async resendOtp(data: ResendOtpApiRequest): Promise<ResendOtpApiResponse> {
    const response = await apiClient.post<ResendOtpApiResponse>(
      API_ENDPOINTS.AUTH.REGISTER_RESEND_OTP,
      data
    );
    return response.data;
  },

  async checkSlug(slug: string): Promise<CheckSlugApiResponse> {
    const response = await apiClient.get<CheckSlugApiResponse>(
      API_ENDPOINTS.AUTH.REGISTER_CHECK_SLUG,
      { params: { slug } }
    );
    return response.data;
  },

  async completeRegister(data: RegisterCompleteApiRequest): Promise<RegisterCompleteApiResponse> {
    const response = await apiClient.post<RegisterCompleteApiResponse>(
      API_ENDPOINTS.AUTH.REGISTER_COMPLETE,
      data
    );
    return response.data;
  },
};

export default authService;
