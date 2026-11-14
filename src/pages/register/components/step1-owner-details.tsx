import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, AlertCircle, Gift, CheckCircle2 } from "lucide-react";
import { authService } from "../../../services/auth.service";
import type { OwnerDetailsFormData, ValidateReferralResponse } from "../../../interface/auth.types";

interface Step1OwnerDetailsProps {
  formData: OwnerDetailsFormData;
  onChange: (fields: Partial<OwnerDetailsFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  errorMessage?: string;
  onGoToLogin: () => void;
}

export function Step1OwnerDetails({
  formData,
  onChange,
  onSubmit,
  isLoading,
  errorMessage,
  onGoToLogin,
}: Step1OwnerDetailsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [validatingRef, setValidatingRef] = useState(false);
  const [referralStatus, setReferralStatus] = useState<ValidateReferralResponse | null>(null);

  useEffect(() => {
    if (formData.referralCode && formData.referralCode.trim().length >= 3) {
      handleValidateCode(formData.referralCode);
    }
  }, []);

  const handleValidateCode = async (codeToTest: string) => {
    const trimmed = codeToTest.trim();
    if (!trimmed) {
      setReferralStatus(null);
      return;
    }
    setValidatingRef(true);
    try {
      const res = await authService.validateReferralCode(trimmed);
      setReferralStatus(res);
    } catch {
      setReferralStatus({
        valid: false,
        referral_code: trimmed,
        message: "Could not verify referral code.",
      });
    } finally {
      setValidatingRef(false);
    }
  };

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errors.fullName = "Please enter your full name.";
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    const cleanPhone = formData.phone.trim();
    if (!cleanPhone || cleanPhone.length < 8) {
      errors.phone = "Please enter a valid mobile number (e.g. 077 123 4567).";
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.agreedToTerms) {
      errors.agreedToTerms = "Please agree to the Terms of Service.";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0) {
      onSubmit(e);
    }
  };

  return (
    <div className="w-full">
      {/* Title & Subtitle matching the Login page reference layout */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-primary-deep tracking-tight">
          Owner Details
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-normal">
          Please enter your owner details to register your salon
        </p>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 animate-in fade-in duration-200">
          <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={validateAndSubmit} className="space-y-3.5">
        {/* Full Name Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => {
              onChange({ fullName: e.target.value });
              if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: "" }));
            }}
            placeholder="e.g. Kasun Perera"
            disabled={isLoading}
            className={`w-full rounded-lg bg-primary-subtle border px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 ${
              fieldErrors.fullName ? "border-red-400" : "border-slate-200"
            }`}
          />
          {fieldErrors.fullName && (
            <p className="mt-1 text-[11px] text-red-600">{fieldErrors.fullName}</p>
          )}
        </div>

        {/* Email & Mobile Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => {
                onChange({ email: e.target.value });
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="kasun@example.com"
              disabled={isLoading}
              className={`w-full rounded-lg bg-primary-subtle border px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                fieldErrors.email ? "border-red-400" : "border-slate-200"
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-[11px] text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mobile Phone <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-2.5 rounded-l-lg border border-r-0 border-slate-200 bg-slate-100 text-slate-600 text-xs font-medium shrink-0">
                🇱🇰 +94
              </span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  onChange({ phone: e.target.value });
                  if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: "" }));
                }}
                placeholder="77 123 4567"
                disabled={isLoading}
                className={`w-full rounded-r-lg bg-primary-subtle border px-3 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  fieldErrors.phone ? "border-red-400" : "border-slate-200"
                }`}
              />
            </div>
            {fieldErrors.phone && (
              <p className="mt-1 text-[11px] text-red-600">{fieldErrors.phone}</p>
            )}
          </div>
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                  onChange({ password: e.target.value });
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
                }}
                placeholder="••••••••••••"
                disabled={isLoading}
                className={`w-full rounded-lg bg-primary-subtle border px-3.5 py-2.5 pr-9 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  fieldErrors.password ? "border-red-400" : "border-slate-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-[11px] text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => {
                  onChange({ confirmPassword: e.target.value });
                  if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                placeholder="••••••••••••"
                disabled={isLoading}
                className={`w-full rounded-lg bg-primary-subtle border px-3.5 py-2.5 pr-9 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  fieldErrors.confirmPassword ? "border-red-400" : "border-slate-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-[11px] text-red-600">{fieldErrors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Referral Code Field (Optional) */}
        <div className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-3">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Gift className="size-3.5 text-primary" />
              <span>Referral Code</span>
              <span className="text-slate-400 font-normal">(optional)</span>
            </span>
            {referralStatus?.valid && (
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                Bonus Applied
              </span>
            )}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.referralCode || ""}
              onChange={(e) => {
                const val = e.target.value.toUpperCase();
                onChange({ referralCode: val });
                if (referralStatus) setReferralStatus(null);
              }}
              onBlur={() => {
                if (formData.referralCode?.trim()) {
                  handleValidateCode(formData.referralCode);
                }
              }}
              placeholder="e.g. GLAM-7X9K2"
              disabled={isLoading}
              className={`w-full rounded-lg bg-white border px-3.5 py-2 pr-16 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 uppercase tracking-wider outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                referralStatus?.valid
                  ? "border-emerald-400 bg-emerald-50/20"
                  : referralStatus && !referralStatus.valid
                  ? "border-amber-300"
                  : "border-slate-200"
              }`}
            />
            {formData.referralCode?.trim() && (
              <button
                type="button"
                onClick={() => handleValidateCode(formData.referralCode || "")}
                disabled={isLoading || validatingRef}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition cursor-pointer"
              >
                {validatingRef ? <Loader2 className="size-3 animate-spin text-slate-500" /> : "Apply"}
              </button>
            )}
          </div>

          {/* Referral Status Feedback */}
          {referralStatus?.valid && (
            <div className="mt-2 flex items-start gap-1.5 rounded-md bg-emerald-50 border border-emerald-200 p-2 text-[11px] text-emerald-800 animate-in fade-in duration-200">
              <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-semibold">Referred by {referralStatus.referrer_name || "Partner Salon"}</p>
                <p className="text-emerald-700">{referralStatus.reward_hint || "1 Month Free SaaS Subscription applied!"}</p>
              </div>
            </div>
          )}

          {referralStatus && !referralStatus.valid && (
            <p className="mt-1 text-[11px] text-amber-600">
              {referralStatus.message || "Referral code not found. You can proceed without one."}
            </p>
          )}
        </div>

        {/* Terms agreement checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={(e) => {
                onChange({ agreedToTerms: e.target.checked });
                if (fieldErrors.agreedToTerms) setFieldErrors((prev) => ({ ...prev, agreedToTerms: "" }));
              }}
              className="mt-0.5 size-4 rounded border-slate-300 text-primary accent-primary focus:ring-primary/30"
            />
            <span className="text-xs text-slate-600 leading-tight">
              I agree to the <span className="text-primary font-medium">Terms of Service</span> & <span className="text-primary font-medium">Privacy Policy</span>.
            </span>
          </label>
          {fieldErrors.agreedToTerms && (
            <p className="mt-1 text-[11px] text-red-600">{fieldErrors.agreedToTerms}</p>
          )}
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-primary-dark active:scale-[0.99] disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                <span>Sending Code...</span>
              </div>
            ) : (
              <span>Continue to Verification</span>
            )}
          </button>
        </div>
      </form>

      {/* Already Have an Account? Sign In */}
      <p className="mt-5 text-center text-xs text-slate-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onGoToLogin}
          className="font-semibold text-primary hover:text-primary-dark hover:underline transition cursor-pointer"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}

export default Step1OwnerDetails;
