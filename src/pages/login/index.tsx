import { useState } from "react";
import { useNavigate } from "react-router";
import { ROUTES } from "../../routes/sidebar.routes";
import { LanguageSwitcher } from "../../components/language-switcher";
import { BrandHero } from "./components/brand-hero";
import { LoginForm } from "./components/login-form";
import { OtpLoginForm } from "./components/otp-login-form";
import { WhatsAppButton } from "./components/whatsapp-button";
import { RegisterModal } from "./components/register-modal";
import type {
  AuthMethod,
  AuthSubmitStatus,
  AuthErrorState,
  LoginFormData,
  OtpFormData,
} from "../../interface/auth.types";

export function Login() {
  const navigate = useNavigate();

  const [authMethod, setAuthMethod] = useState<AuthMethod>("password");
  const [status, setStatus] = useState<AuthSubmitStatus>("idle");
  const [errors, setErrors] = useState<AuthErrorState>({});
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Prefilled with demo credentials matching the reference screenshot style
  const [passwordForm, setPasswordForm] = useState<LoginFormData>({
    email: "demo@sribees.com",
    password: "Password123!",
    rememberMe: true,
  });

  const [otpForm, setOtpForm] = useState<OtpFormData>({
    emailOrPhone: "demo@sribees.com",
    otp: "",
    step: "request",
  });

  // Handle password login submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: AuthErrorState = {};
    if (!passwordForm.email.trim()) {
      newErrors.email = "Please enter your email.";
    }
    if (!passwordForm.password) {
      newErrors.password = "Please enter your password.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus("loading");

    setTimeout(() => {
      // Save authenticated session in localStorage
      localStorage.setItem(
        "salon_pos_user",
        JSON.stringify({
          name: "Amanda Ray",
          role: "Salon Manager",
          initials: "AR",
          isOnline: true,
        })
      );

      setStatus("success");
      navigate(ROUTES.DASHBOARD);
    }, 600);
  };

  // Handle OTP login submission
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!otpForm.otp || otpForm.otp.length < 4) {
      setErrors({ otp: "Please enter a valid verification code." });
      return;
    }

    setStatus("loading");

    setTimeout(() => {
      localStorage.setItem(
        "salon_pos_user",
        JSON.stringify({
          name: "Amanda Ray",
          role: "Salon Manager",
          initials: "AR",
          isOnline: true,
        })
      );

      setStatus("success");
      navigate(ROUTES.DASHBOARD);
    }, 600);
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-white">
      {/* Top right language switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
        <LanguageSwitcher />
      </div>

      {/* Main Layout Grid matching reference */}
      <div className="flex h-full w-full flex-col lg:flex-row">
        {/* Left Side: Brand Hero with Organic Wave Contour */}
        <div className="relative hidden lg:flex lg:w-[50%] xl:w-[48%] h-full shrink-0">
          <BrandHero />
        </div>

        {/* Mobile Header for smaller screens */}
        <div className="relative lg:hidden w-full bg-linear-to-br from-primary-deep via-primary-dark to-primary py-8 px-6 text-center text-white shrink-0">
          <div className="flex items-center justify-center gap-1.5 text-3xl font-black tracking-tight">
            <span>Sri</span>
            <span className="inline-flex items-center justify-center px-0.5">
              <svg
                className="h-7 w-9 text-white"
                viewBox="0 0 64 48"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M12 36 C6 36 2 31.5 2 24 C2 16.5 6 12 12 12 C18 12 24 17 28 24 C32 31 38 36 44 36 C52 36 58 29.5 58 24 C58 18.5 52 12 44 12 C38 12 32 17 28 24 C24 31 18 36 12 36 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="28" cy="24" r="3.5" fill="currentColor" />
              </svg>
            </span>
            <span>bees</span>
          </div>
          <p className="mt-1 text-xs font-medium tracking-wide text-primary-lighter/90">
            Salon Management
          </p>
        </div>

        {/* Right Side: Clean Centered Login Form Area */}
        <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto">
          {authMethod === "password" ? (
            <LoginForm
              formData={passwordForm}
              onChange={(fields) =>
                setPasswordForm((prev) => ({ ...prev, ...fields }))
              }
              onSubmit={handlePasswordSubmit}
              status={status}
              errors={errors}
              onSwitchToOtp={() => {
                setAuthMethod("otp");
                setErrors({});
              }}
              onRegisterClick={() => setIsRegisterOpen(true)}
            />
          ) : (
            <OtpLoginForm
              formData={otpForm}
              onChange={(fields) =>
                setOtpForm((prev) => ({ ...prev, ...fields }))
              }
              onSubmit={handleOtpSubmit}
              status={status}
              errors={errors}
              onBackToPassword={() => {
                setAuthMethod("password");
                setErrors({});
              }}
            />
          )}
        </div>
      </div>

      {/* Floating WhatsApp Support Button */}
      <WhatsAppButton />

      {/* Registration Info Modal */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
}

export default Login;
