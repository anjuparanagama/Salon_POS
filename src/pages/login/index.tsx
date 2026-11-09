import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import axios from "axios";
import { ROUTES } from "../../routes/sidebar.routes";
import { BrandHero } from "./components/brand-hero";
import { LoginForm } from "./components/login-form";
import { RegisterModal } from "./components/register-modal";
import { useAuth } from "../../context/use-auth";
import { authService } from "../../services/auth.service";
import type {
  AuthSubmitStatus,
  AuthErrorState,
  LoginFormData,
} from "../../interface/auth.types";

function formatDisplayName(email: string): string {
  const localPart = email.split("@")[0] || "User";
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join(" ");
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "AR";
}

export function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [status, setStatus] = useState<AuthSubmitStatus>("idle");
  const [errors, setErrors] = useState<AuthErrorState>({});
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [passwordForm, setPasswordForm] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: true,
  });

  // If already authenticated, redirect directly to dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // Handle password login submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
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

    try {
      const response = await authService.login({
        email: passwordForm.email.trim(),
        password: passwordForm.password,
      });

      const displayName = formatDisplayName(passwordForm.email);
      const formattedRole = response.role
        ? response.role.charAt(0).toUpperCase() + response.role.slice(1)
        : "Salon Staff";

      // Authenticate session via AuthContext
      login(
        {
          name: displayName,
          role: formattedRole,
          initials: getInitials(displayName),
          isOnline: true,
          email: passwordForm.email.trim(),
          userId: response.user_id,
          salonId: response.salon_id,
        },
        response.access_token,
        passwordForm.rememberMe
      );

      setStatus("success");
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err: unknown) {
      setStatus("error");
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setErrors({
            general:
              "Unable to connect to the backend server. Please verify your connection or API URL in .env.",
          });
        } else if (err.response.status === 401) {
          const detail =
            typeof err.response.data?.detail === "string"
              ? err.response.data.detail
              : "Invalid email or password.";
          setErrors({ general: detail });
        } else if (err.response.status === 422) {
          setErrors({
            general: "Please enter a valid email address and password.",
          });
        } else {
          const detail =
            typeof err.response.data?.detail === "string"
              ? err.response.data.detail
              : "An unexpected error occurred during login. Please try again.";
          setErrors({ general: detail });
        }
      } else {
        setErrors({
          general: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-white">
      {/* Main Layout Grid matching reference */}
      <div className="flex h-full w-full flex-col lg:flex-row">
        {/* Left Side: Brand Hero with Organic Wave Contour */}
        <div className="relative hidden lg:flex lg:w-[50%] xl:w-[48%] h-full shrink-0">
          <BrandHero />
        </div>

        {/* Mobile Header for smaller screens */}
        <div className="relative lg:hidden w-full bg-linear-to-br from-primary-deep via-primary-dark to-primary py-6 px-6 text-center text-white shrink-0">
          <img
            src="/logo.png"
            alt="Logo"
            className="mx-auto h-auto w-48 sm:w-56 max-w-full object-contain drop-shadow-xs"
          />
          <p className="mt-1 text-xs font-medium tracking-wide text-primary-lighter/90">
            Salon Management
          </p>
        </div>

        {/* Right Side: Clean Centered Login Form Area */}
        <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto">
          <LoginForm
            formData={passwordForm}
            onChange={(fields) =>
              setPasswordForm((prev) => ({ ...prev, ...fields }))
            }
            onSubmit={handlePasswordSubmit}
            status={status}
            errors={errors}
            onRegisterClick={() => setIsRegisterOpen(true)}
          />
        </div>
      </div>

      {/* Registration Info Modal */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
}

export default Login;
