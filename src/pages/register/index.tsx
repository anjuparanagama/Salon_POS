import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { ROUTES } from "../../routes/sidebar.routes";
import { BrandHero } from "../login/components/brand-hero";
import { useAuth } from "../../context/use-auth";
import { authService, type RegisterCompleteApiResponse } from "../../services/auth.service";
import type {
  RegistrationStep,
  OwnerDetailsFormData,
  SalonDetailsFormData,
} from "../../interface/auth.types";
import { StepIndicator } from "./components/step-indicator";
import { Step1OwnerDetails } from "./components/step1-owner-details";
import { Step2OtpVerification } from "./components/step2-otp-verification";
import { Step3SalonDetails } from "./components/step3-salon-details";
import { Step4RegistrationComplete } from "./components/step4-registration-complete";

export function Register() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [step, setStep] = useState<RegistrationStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Step 1 State: Owner details
  const [ownerForm, setOwnerForm] = useState<OwnerDetailsFormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  // Step 2 State: OTP & Session data
  const [sessionId, setSessionId] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [devOtp, setDevOtp] = useState<string | undefined>(undefined);
  const [verificationToken, setVerificationToken] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(60);

  // Step 3 State: Salon details
  const [salonForm, setSalonForm] = useState<SalonDetailsFormData>({
    salonName: "",
    salonPhone: "",
    salonEmail: "",
    address: "",
    city: "Colombo",
    district: "Colombo",
    currency: "LKR",
    timezone: "Asia/Colombo",
  });

  // Step 4 State: Final result from backend
  const [registrationResult, setRegistrationResult] = useState<RegisterCompleteApiResponse | null>(null);

  // If already authenticated and not in complete step, redirect to dashboard
  if (isAuthenticated && step !== 4) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // ----------------------------------------------------
  // Step 1 Handler: Initiate Registration & Request OTP
  // ----------------------------------------------------
  const handleInitiateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await authService.initiateRegister({
        full_name: ownerForm.fullName.trim(),
        email: ownerForm.email.trim(),
        phone: ownerForm.phone.trim(),
        password: ownerForm.password,
      });

      setSessionId(response.session_id);
      setMaskedEmail(response.masked_email);
      setMaskedPhone(response.masked_phone);
      setDevOtp(response.dev_otp);
      setCooldownSeconds(response.cooldown_seconds || 60);

      // Pre-fill salon contact details with owner details if empty
      setSalonForm((prev) => ({
        ...prev,
        salonPhone: prev.salonPhone || ownerForm.phone.trim(),
        salonEmail: prev.salonEmail || ownerForm.email.trim(),
      }));

      setStep(2);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axErr = err as { response?: { data?: { detail?: string } } };
        setErrorMessage(
          axErr.response?.data?.detail || "Failed to initiate registration. Please check your details."
        );
      } else {
        setErrorMessage("Network error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // Step 2 Handler: Verify OTP
  // ----------------------------------------------------
  const handleVerifyOtp = async (otp: string) => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await authService.verifyOtp({
        session_id: sessionId,
        email: ownerForm.email.trim(),
        otp: otp.trim(),
      });

      setVerificationToken(response.verification_token);
      setStep(3);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axErr = err as { response?: { data?: { detail?: string } } };
        setErrorMessage(axErr.response?.data?.detail || "Invalid or expired verification code.");
      } else {
        setErrorMessage("Verification failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // Step 2 Handler: Resend OTP
  // ----------------------------------------------------
  const handleResendOtp = async () => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await authService.resendOtp({
        session_id: sessionId,
        email: ownerForm.email.trim(),
      });

      setSessionId(response.session_id);
      setDevOtp(response.dev_otp);
      setCooldownSeconds(response.cooldown_seconds || 60);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axErr = err as { response?: { data?: { detail?: string } } };
        setErrorMessage(axErr.response?.data?.detail || "Could not resend code. Please wait before retrying.");
      } else {
        setErrorMessage("Resend failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // Step 3 Handler: Complete Registration
  // ----------------------------------------------------
  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await authService.completeRegister({
        verification_token: verificationToken,
        full_name: ownerForm.fullName.trim(),
        email: ownerForm.email.trim(),
        phone: ownerForm.phone.trim(),
        password: ownerForm.password,
        salon_name: salonForm.salonName.trim(),
        salon_phone: salonForm.salonPhone.trim() || undefined,
        salon_email: salonForm.salonEmail.trim() || undefined,
        address: salonForm.address.trim() || undefined,
        city: salonForm.city.trim() || undefined,
        district: salonForm.district.trim() || undefined,
        currency: salonForm.currency || "LKR",
        timezone: salonForm.timezone || "Asia/Colombo",
      });

      setRegistrationResult(response);
      setStep(4);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axErr = err as { response?: { data?: { detail?: string } } };
        setErrorMessage(
          axErr.response?.data?.detail || "Failed to complete registration. Please verify your salon details."
        );
      } else {
        setErrorMessage("Registration error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // Step 4 Handler: Launch POS Dashboard with Auto Login
  // ----------------------------------------------------
  const handleLaunchDashboard = () => {
    if (!registrationResult) {
      navigate(ROUTES.LOGIN);
      return;
    }

    const { user, salon, access_token } = registrationResult;

    login(
      {
        name: user.full_name || user.email.split("@")[0],
        role: "Salon Admin",
        initials: (user.full_name || "Owner").slice(0, 2).toUpperCase(),
        isOnline: true,
        email: user.email,
        userId: user.id,
        salonId: salon.id,
      },
      access_token,
      true
    );

    navigate(ROUTES.DASHBOARD, { replace: true });
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-white">
      {/* Main Layout Grid matching login page */}
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
            Salon Account Registration
          </p>
        </div>

        {/* Right Side: Clean Centered Registration Flow Area */}
        <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto">
          <div className="w-full max-w-[440px] mx-auto py-2">
            <StepIndicator currentStep={step} />

            {step === 1 && (
              <Step1OwnerDetails
                formData={ownerForm}
                onChange={(fields) => setOwnerForm((prev) => ({ ...prev, ...fields }))}
                onSubmit={handleInitiateSubmit}
                isLoading={isLoading}
                errorMessage={errorMessage}
                onGoToLogin={() => navigate(ROUTES.LOGIN)}
              />
            )}

            {step === 2 && (
              <Step2OtpVerification
                maskedEmail={maskedEmail}
                maskedPhone={maskedPhone}
                devOtp={devOtp}
                isLoading={isLoading}
                errorMessage={errorMessage}
                onVerify={handleVerifyOtp}
                onResend={handleResendOtp}
                onBack={() => {
                  setErrorMessage("");
                  setStep(1);
                }}
                cooldownSeconds={cooldownSeconds}
              />
            )}

            {step === 3 && (
              <Step3SalonDetails
                formData={salonForm}
                onChange={(fields) => setSalonForm((prev) => ({ ...prev, ...fields }))}
                onSubmit={handleCompleteSubmit}
                onBack={() => {
                  setErrorMessage("");
                  setStep(2);
                }}
                isLoading={isLoading}
                errorMessage={errorMessage}
              />
            )}

            {step === 4 && registrationResult && (
              <Step4RegistrationComplete
                registrationResult={registrationResult}
                onLaunchDashboard={handleLaunchDashboard}
                onGoToLogin={() => navigate(ROUTES.LOGIN)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
