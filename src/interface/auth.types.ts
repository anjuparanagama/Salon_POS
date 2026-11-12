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
};

export type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token?: string, rememberMe?: boolean) => void;
  logout: () => void;
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
  onSubmit: (email: string) => Promise<boolean>;
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
  currency: string;
  timezone: string;
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

