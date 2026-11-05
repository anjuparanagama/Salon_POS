import { useState } from "react";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import type { OtpFormData, AuthSubmitStatus, AuthErrorState } from "../../../../interface/auth.types";

export type OtpLoginFormProps = {
  formData: OtpFormData;
  onChange: (fields: Partial<OtpFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  status: AuthSubmitStatus;
  errors: AuthErrorState;
  onBackToPassword: () => void;
};

export function OtpLoginForm({
  formData,
  onChange,
  onSubmit,
  status,
  errors,
  onBackToPassword,
}: OtpLoginFormProps) {
  const [codeSent, setCodeSent] = useState(false);
  const isLoading = status === "loading";

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.emailOrPhone.trim()) return;
    setCodeSent(true);
    onChange({ step: "verify", otp: "123456" });
  };

  return (
    <div className="w-full max-w-[360px] mx-auto animate-in fade-in duration-200">
      {/* Title & Subtitle */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-primary-deep tracking-tight">
          OTP Login
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-normal">
          {codeSent
            ? "Enter the 6-digit verification code sent to your device"
            : "Enter your registered salon mobile or email address"}
        </p>
      </div>

      <form onSubmit={codeSent ? onSubmit : handleSendOtp} className="space-y-4">
        {/* Email or Phone Input */}
        <div>
          <label
            htmlFor="otp-contact"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            Registered Mobile / Email
          </label>
          <input
            id="otp-contact"
            type="text"
            value={formData.emailOrPhone}
            onChange={(e) => onChange({ emailOrPhone: e.target.value })}
            placeholder="+94 77 123 4567 or amanda@sribees.com"
            disabled={codeSent || isLoading}
            className="w-full rounded-lg bg-primary-subtle border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Verification Code Input */}
        {codeSent && (
          <div className="animate-in fade-in">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="otp-code"
                className="block text-xs font-semibold text-slate-700"
              >
                Verification Code (Demo: 123456)
              </label>
              <button
                type="button"
                onClick={() => onChange({ otp: "123456" })}
                className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
              >
                Autofill
              </button>
            </div>
            <input
              id="otp-code"
              type="text"
              maxLength={6}
              value={formData.otp}
              onChange={(e) => onChange({ otp: e.target.value })}
              placeholder="123456"
              disabled={isLoading}
              className="w-full text-center tracking-[0.3em] font-mono font-bold rounded-lg bg-primary-subtle border border-slate-200 px-3.5 py-2.5 text-base text-slate-900 outline-none transition focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {errors.otp && (
              <p className="mt-1 text-[11px] text-red-600">{errors.otp}</p>
            )}
          </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-primary-dark active:scale-[0.99] disabled:opacity-70 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : codeSent ? (
            <span>Verify & Log In</span>
          ) : (
            <span>Send OTP Code</span>
          )}
        </button>

        {codeSent && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-medium">
            <ShieldCheck className="size-4" />
            <span>Code sent successfully</span>
          </div>
        )}
      </form>

      {/* Back to Password Login Button */}
      <div className="mt-6 border-t border-slate-200 pt-4 text-center">
        <button
          type="button"
          onClick={onBackToPassword}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary transition cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Password Login</span>
        </button>
      </div>
    </div>
  );
}

export default OtpLoginForm;

