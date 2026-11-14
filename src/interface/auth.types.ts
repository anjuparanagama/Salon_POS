export type AuthMethod = "password" | "otp";

export type AuthSubmitStatus = "idle" | "loading" | "success" | "error";

export type AuthUser = {
  name: string;
  role?: string;
  email?: string;
  avatarUrl?: string;
  initials?: string;
  isOnline?: boolean;
  userId?: string;
  salonId?: string;
  permissions?: Record<string, boolean>;
};

export type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token?: string, rememberMe?: boolean) => void;
  logout: () => void;
  hasPermission: (perm: string) => boolean;
};

export type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type OtpFormData = {
  emailOrPhone: string;
  otp: string;
  step: "request" | "verify";
};

export type QuickLoginProfile = {
  id: string;
  name: string;
  role: string;
  email: string;
  pin: string;
  initials: string;
  badge: string;
};

export type AuthErrorState = {
  email?: string;
  password?: string;
  otp?: string;
  general?: string;
};

export type ForgotPasswordModalProps = {
  isOpen: boolean;
  initialEmail?: string;
  onClose: () => void;
  onSuccess?: (email: string) => void;
};

export type RegisterInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// ==========================================
// 4-Step Registration Types
// ==========================================

export type RegistrationStep = 1 | 2 | 3 | 4;

export interface OwnerDetailsFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
  agreedToTerms: boolean;
}

export interface SalonDetailsFormData {
  salonName: string;
  slug?: string;
  salonPhone: string;
  salonEmail: string;
  address: string;
  city: string;
  district: string;
  salonType?: string;
  referralCode?: string;
  currency: string;
  timezone: string;
}

export interface ValidateReferralResponse {
  valid: boolean;
  referral_code: string;
  referrer_name?: string | null;
  reward_hint?: string | null;
  message: string;
}

export interface RegistrationSessionState {
  step: RegistrationStep;
  owner: OwnerDetailsFormData;
  salon: SalonDetailsFormData;
  sessionId: string;
  maskedEmail: string;
  maskedPhone: string;
  verificationToken: string;
  devOtp?: string;
  resendCooldown: number;
}

// ==========================================
// Forgot Password / Password Reset Types
// ==========================================

export type ForgotPasswordStep = "request" | "verify" | "reset" | "success";

export interface ForgotPasswordInitiatePayload {
  email: string;
}

export interface ForgotPasswordInitiateResult {
  success: boolean;
  session_id: string;
  masked_email: string;
  masked_phone?: string | null;
  expires_in: number;
  cooldown_seconds: number;
  dev_otp?: string | null;
  message: string;
}

export interface ForgotPasswordVerifyOtpPayload {
  session_id: string;
  email: string;
  otp: string;
}

export interface ForgotPasswordVerifyOtpResult {
  success: boolean;
  verified: boolean;
  verification_token: string;
  message: string;
}

export interface ForgotPasswordResendOtpPayload {
  session_id: string;
  email: string;
}

export interface ForgotPasswordResendOtpResult {
  success: boolean;
  session_id: string;
  expires_in: number;
  cooldown_seconds: number;
  dev_otp?: string | null;
  message: string;
}

export interface ForgotPasswordConfirmPayload {
  verification_token: string;
  email: string;
  new_password: string;
}

export interface ForgotPasswordConfirmResult {
  success: boolean;
  message: string;
}

