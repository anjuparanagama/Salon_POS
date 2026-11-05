import { useState } from "react";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import type { LoginFormData, AuthSubmitStatus, AuthErrorState } from "../../../../interface/auth.types";

export type LoginFormProps = {
  formData: LoginFormData;
  onChange: (fields: Partial<LoginFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  status: AuthSubmitStatus;
  errors: AuthErrorState;
  onSwitchToOtp: () => void;
  onRegisterClick: () => void;
};

export function LoginForm({
  formData,
  onChange,
  onSubmit,
  status,
  errors,
  onSwitchToOtp,
  onRegisterClick,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isLoading = status === "loading";

  return (
    <div className="w-full max-w-[360px] mx-auto">
      {/* Title & Subtitle matching the reference layout */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-primary-deep tracking-tight">
          Log In
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-normal">
          Please login to your account to continue
        </p>
      </div>

      {/* Global Error Banner */}
      {errors.general && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
          <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email-input"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            Email
          </label>
          <input
            id="email-input"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="demo@sribees.com"
            disabled={isLoading}
            className={`w-full rounded-lg bg-primary-subtle border px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 ${
              errors.email ? "border-red-400" : "border-slate-200"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password-input"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => onChange({ password: e.target.value })}
              placeholder="••••••••••••"
              disabled={isLoading}
              className={`w-full rounded-lg bg-primary-subtle border px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                errors.password ? "border-red-400" : "border-slate-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-[11px] text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => onChange({ rememberMe: e.target.checked })}
              className="size-4 rounded border-slate-300 text-primary accent-primary focus:ring-primary/30"
            />
            <span className="text-xs text-slate-600">Remember Me</span>
          </label>
        </div>

        {/* Primary Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-primary-dark active:scale-[0.99] disabled:opacity-70 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>Logging in...</span>
            </div>
          ) : (
            <span>Login</span>
          )}
        </button>
      </form>

      {/* OR Divider */}
      <div className="relative my-4.5 flex items-center justify-center">
        <div className="w-full border-t border-slate-200" />
        <span className="absolute bg-white px-2.5 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          OR
        </span>
      </div>

      {/* Login with OTP Button */}
      <button
        type="button"
        onClick={onSwitchToOtp}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs active:scale-[0.99] cursor-pointer"
      >
        <span className="text-sm">🔐</span>
        <span>Login with OTP</span>
      </button>

      {/* Don't Have an Account? Register Here */}
      <p className="mt-6 text-center text-xs text-slate-600">
        Don&apos;t Have an Account?{" "}
        <button
          type="button"
          onClick={onRegisterClick}
          className="font-semibold text-primary hover:text-primary-dark hover:underline transition cursor-pointer"
        >
          Register Here
        </button>
      </p>
    </div>
  );
}

export default LoginForm;
