import { useState } from "react";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
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
};

export function LoginForm({
  formData,
  onChange,
  onSubmit,
  status,
  errors,
  onRegisterClick: _onRegisterClick,
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
          className="rounded-lg bg-primary-subtle border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:bg-white focus:border-primary focus:ring-primary/20"
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
            <button
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
            </button>
          }
          className="rounded-lg bg-primary-subtle border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:bg-white focus:border-primary focus:ring-primary/20"
        />

        {/* Remember Me Checkbox */}
        <div className="pt-0.5">
          <Input
            type="checkbox"
            label={<span className="text-xs text-slate-600">Remember Me</span>}
            checked={formData.rememberMe}
            onChange={(e) => onChange({ rememberMe: e.target.checked })}
            className="size-4 rounded border-slate-300 text-primary accent-primary focus:ring-primary/30"
          />
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

      {/* Don't Have an Account? Register Here */}
      <p className="mt-6 text-center text-xs text-slate-600">
        Don&apos;t Have an Account?{" "}
        <button
          type="button"
          onClick={_onRegisterClick}
          className="font-semibold text-primary hover:text-primary-dark hover:underline transition cursor-pointer"
        >
          Register Here
        </button>
      </p>
    </div>
  );
}

export default LoginForm;
