export type AuthMethod = "password" | "otp";

export type AuthSubmitStatus = "idle" | "loading" | "success" | "error";

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
