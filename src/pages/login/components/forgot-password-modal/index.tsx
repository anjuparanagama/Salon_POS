import { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  KeyRound,
  RotateCw,
  ShieldAlert,
} from "lucide-react";
import { Button } from "../../../../components/button";
import { Input } from "../../../../components/input";
import { authService } from "../../../../services/auth.service";
import type {
  ForgotPasswordModalProps,
  ForgotPasswordStep,
} from "../../../../interface/auth.types";

interface ForgotPasswordDialogProps {
  initialEmail: string;
  onClose: () => void;
  onSuccess?: (email: string) => void;
}

function ForgotPasswordDialog({
  initialEmail,
  onClose,
  onSuccess,
}: ForgotPasswordDialogProps) {
  const [step, setStep] = useState<ForgotPasswordStep>("request");
  const [email, setEmail] = useState(initialEmail);
  const [sessionId, setSessionId] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Step 1: Request OTP
  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await authService.forgotPasswordInitiate({ email: cleanEmail });
      setSessionId(res.session_id);
      setMaskedEmail(res.masked_email);
      setDevOtp(res.dev_otp || null);
      setCooldown(res.cooldown_seconds || 30);
      setStep("verify");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setError("Unable to connect to the server. Please check your network connection.");
        } else if (err.response.status === 404) {
          setError(
            typeof err.response.data?.detail === "string"
              ? err.response.data.detail
              : "No active salon account found with this email address."
          );
        } else if (err.response.status === 429) {
          const detail = err.response.data?.detail;
          setError(typeof detail === "string" ? detail : "Too many requests. Please wait before retrying.");
        } else {
          const detail = err.response.data?.detail;
          setError(typeof detail === "string" ? detail : "Failed to send reset code. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await authService.forgotPasswordVerifyOtp({
        session_id: sessionId,
        email: email.trim(),
        otp: cleanOtp,
      });
      setVerificationToken(res.verification_token);
      setStep("reset");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        setError(typeof detail === "string" ? detail : "Invalid or expired code. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2b: Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0 || isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      const res = await authService.forgotPasswordResendOtp({
        session_id: sessionId,
        email: email.trim(),
      });
      setSessionId(res.session_id);
      setDevOtp(res.dev_otp || null);
      setCooldown(res.cooldown_seconds || 30);
      setOtp("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        setError(typeof detail === "string" ? detail : "Failed to resend code.");
      } else {
        setError("Failed to resend code. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Confirm New Password
  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await authService.forgotPasswordConfirm({
        verification_token: verificationToken,
        email: email.trim(),
        new_password: newPassword,
      });
      setStep("success");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        setError(
          typeof detail === "string"
            ? detail
            : "Failed to reset password. The session may have expired."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    if (onSuccess) {
      onSuccess(email.trim());
    }
    onClose();
  };

  return (
    <div
      className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <Button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
      >
        <X className="size-4" />
      </Button>

      {/* Global Error Banner */}
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 animate-in fade-in duration-150">
          <ShieldAlert className="size-4 shrink-0 text-red-600 mt-0.5" />
          <span className="flex-1">{error}</span>
        </div>
      )}

      {/* STEP 1: REQUEST CODE */}
      {step === "request" && (
        <form onSubmit={handleInitiate} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary-lighter text-primary shrink-0">
              <KeyRound className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight">
                Forgot Password?
              </h3>
              <p className="text-xs text-slate-500">
                Enter your registered salon email to receive a recovery code
              </p>
            </div>
          </div>

          <Input
            id="forgot-email-input"
            type="email"
            label="Registered Email Address"
            labelClassName="block text-xs font-semibold text-slate-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g., amanda@sribees.com"
            disabled={isLoading}
            autoFocus
            leftElement={<Mail className="size-4" />}
            helperText="We will send a 6-digit verification code to this address."
            className="rounded-xl border-slate-200 bg-white py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Code</span>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* STEP 2: VERIFY OTP */}
      {step === "verify" && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary-lighter text-primary shrink-0">
              <Mail className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight">
                Enter Verification Code
              </h3>
              <p className="text-xs text-slate-500">
                Code sent to <span className="font-semibold text-slate-700">{maskedEmail || email}</span>
              </p>
            </div>
          </div>

          {/* Dev OTP Helper Banner in DEV mode */}
          {devOtp && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-2.5 text-xs text-emerald-800 flex items-center justify-between">
              <span>Dev Quick OTP: <strong className="font-mono tracking-wider font-bold">{devOtp}</strong></span>
              <Button
                type="button"
                onClick={() => setOtp(devOtp)}
                className="text-xs underline text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
              >
                Auto-fill
              </Button>
            </div>
          )}

          <div>
            <Input
              id="forgot-otp-input"
              type="text"
              label="6-Digit Verification Code"
              labelClassName="block text-xs font-semibold text-slate-700"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              disabled={isLoading}
              autoFocus
              maxLength={6}
              className="rounded-xl border-slate-200 bg-white py-2.5 text-center text-lg font-mono tracking-widest text-slate-900 placeholder:text-slate-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />

            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Didn&apos;t receive code?</span>
              <Button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || isLoading}
                className="flex items-center gap-1 font-semibold text-primary hover:text-primary-dark disabled:opacity-50 transition cursor-pointer"
              >
                <RotateCw className={`size-3 ${isLoading ? "animate-spin" : ""}`} />
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              onClick={() => {
                setStep("request");
                setError(null);
              }}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              Change Email
            </Button>

            <Button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify Code</span>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* STEP 3: RESET PASSWORD */}
      {step === "reset" && (
        <form onSubmit={handleConfirmReset} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary-lighter text-primary shrink-0">
              <Lock className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight">
                Create New Password
              </h3>
              <p className="text-xs text-slate-500">
                Choose a new strong password for your account
              </p>
            </div>
          </div>

          <Input
            id="new-password-input"
            type={showPassword ? "text" : "password"}
            label="New Password"
            labelClassName="block text-xs font-semibold text-slate-700"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••••••"
            disabled={isLoading}
            autoFocus
            leftElement={<Lock className="size-4" />}
            rightElement={
              <Button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            }
            helperText="Must be at least 6 characters long."
            className="rounded-xl border-slate-200 bg-white py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />

          <Input
            id="confirm-password-input"
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm New Password"
            labelClassName="block text-xs font-semibold text-slate-700"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••••••"
            disabled={isLoading}
            leftElement={<Lock className="size-4" />}
            rightElement={
              <Button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            }
            className="rounded-xl border-slate-200 bg-white py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading || newPassword.length < 6 || newPassword !== confirmPassword}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Reset Password</span>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* STEP 4: SUCCESS */}
      {step === "success" && (
        <div className="text-center py-4 space-y-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-8" strokeWidth={2.2} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Password Reset Successfully!
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Your account password has been updated. You can now sign in using your new credentials.
            </p>
          </div>

          <div className="pt-2">
            <Button
              type="button"
              onClick={handleFinish}
              className="w-full rounded-xl bg-primary py-2.5 px-4 text-xs font-semibold text-white hover:bg-primary-dark transition cursor-pointer"
            >
              Back to Sign In
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ForgotPasswordModal({
  isOpen,
  initialEmail = "",
  onClose,
  onSuccess,
}: ForgotPasswordModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <ForgotPasswordDialog
        initialEmail={initialEmail}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </div>
  );
}

export default ForgotPasswordModal;
