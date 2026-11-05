import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { ROUTES } from "../../routes/sidebar.routes";
import { BrandHero } from "./components/brand-hero";
import { LoginForm } from "./components/login-form";
import { RegisterModal } from "./components/register-modal";
import { useAuth } from "../../context/use-auth";
import type {
  AuthSubmitStatus,
  AuthErrorState,
  LoginFormData,
} from "../../interface/auth.types";

export function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [status, setStatus] = useState<AuthSubmitStatus>("idle");
  const [errors, setErrors] = useState<AuthErrorState>({});
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Prefilled with demo credentials matching the reference screenshot style
  const [passwordForm, setPasswordForm] = useState<LoginFormData>({
    email: "demo@sribees.com",
    password: "Password123!",
    rememberMe: true,
  });

  // If already authenticated, redirect directly to dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

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
      // Authenticate session via AuthContext
      login(
        {
          name: "Amanda Ray",
          role: "Salon Manager",
          initials: "AR",
          isOnline: true,
          email: passwordForm.email,
        },
        passwordForm.rememberMe
      );

      setStatus("success");
      navigate(ROUTES.DASHBOARD, { replace: true });
    }, 600);
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
          <p className="mt-2 text-xs font-medium tracking-wide text-primary-lighter/90">
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
