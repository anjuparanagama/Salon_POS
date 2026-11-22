import { useState } from "react";
import { Eye, EyeOff, Loader2, AlertCircle, X } from "lucide-react";
import { Button } from "../../../../components/button";
import { Input } from "../../../../components/input";
import type {
  LoginFormData,
  AuthSubmitStatus,
  AuthErrorState,
} from "../../../../interface/auth.types";

export type LoginFormProps = {
  formData: LoginFormData;
  onChange: (fields: Partial<LoginFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  status: AuthSubmitStatus;
  errors: AuthErrorState;
  onRegisterClick: () => void;
  onForgotPasswordClick?: () => void;
  onDismissError?: () => void;
};

export function LoginForm({
  formData,
  onChange,
  onSubmit,
  status,
  errors,
  onRegisterClick: _onRegisterClick,
  onForgotPasswordClick,
  onDismissError,
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
        <div
          role="alert"
          aria-live="polite"
          className="mb-4 flex items-start justify-between gap-2.5 rounded-xl border border-rose-200 bg-rose-50/95 p-3 text-xs text-rose-800 shadow-xs animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <div className="flex items-start gap-2.5 flex-1">
            <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="leading-relaxed font-medium">{errors.general}</span>
          </div>
          {onDismissError && (
            <button
              type="button"
              onClick={onDismissError}
              aria-label="Dismiss error"
              className="text-rose-400 hover:text-rose-700 transition cursor-pointer p-0.5 -mr-1 -mt-0.5 rounded-md hover:bg-rose-100"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Email Field */}
        <Input
          id="email-input"
          type="email"
          label="Email"
          labelClassName="block text-xs font-semibold text-slate-700"
          autoComplete="email"
          value={formData.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="demo@sribees.com"
          disabled={isLoading}
          error={errors.email}
          className="rounded-lg bg-white border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
        />

        {/* Password Field */}
        <Input
          id="password-input"
          type={showPassword ? "text" : "password"}
          label="Password"
          labelClassName="block text-xs font-semibold text-slate-700"
          autoComplete="current-password"
          value={formData.password}
          onChange={(e) => onChange({ password: e.target.value })}
          placeholder="••••••••••••"
          disabled={isLoading}
          error={errors.password}
          rightElement={
            <Button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          }
          className="rounded-lg bg-white border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
        />

        {/* Remember Me Checkbox & Forgot Password Link */}
        <div className="flex items-center justify-between pt-0.5">
          <Input
            type="checkbox"
            label={<span className="text-xs text-slate-600">Remember Me</span>}
            checked={formData.rememberMe}
            onChange={(e) => onChange({ rememberMe: e.target.checked })}
            className="size-4 rounded border-slate-300 text-primary accent-primary focus:ring-primary/30"
          />

          {onForgotPasswordClick && (
            <Button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-xs font-semibold text-primary hover:text-primary-dark transition cursor-pointer"
            >
              Forgot Password?
            </Button>
          )}
        </div>

        {/* Primary Login Button */}
        <Button
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
        </Button>
      </form>

      {/* Don't Have an Account? Register Here */}
      <p className="mt-6 text-center text-xs text-slate-600">
        Don&apos;t Have an Account?{" "}
        <Button
          type="button"
          onClick={_onRegisterClick}
          className="font-semibold text-primary hover:text-primary-dark hover:underline transition cursor-pointer"
        >
          Register Here
        </Button>
      </p>
    </div>
  );
}

export default LoginForm;
