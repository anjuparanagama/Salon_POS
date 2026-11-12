import { useState } from "react";
import { CheckCircle2, Copy, LayoutDashboard, Sparkles, Store, Check, ArrowRight, UserCheck } from "lucide-react";
import type { RegisterCompleteApiResponse } from "../../../services/auth.service";

interface Step4RegistrationCompleteProps {
  registrationResult: RegisterCompleteApiResponse;
  onLaunchDashboard: () => void;
  onGoToLogin: () => void;
}

export function Step4RegistrationComplete({
  registrationResult,
  onLaunchDashboard,
  onGoToLogin,
}: Step4RegistrationCompleteProps) {
  const [copied, setCopied] = useState(false);
  const { salon, user } = registrationResult;

  const publicUrl = `https://${salon.slug}.salora.lk`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full text-center">
      {/* Animated Celebration Icon */}
      <div className="relative mx-auto mb-5 size-20 sm:size-24">
        <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-40" />
        <div className="relative flex size-full items-center justify-center rounded-full bg-linear-to-tr from-emerald-600 to-teal-500 text-white shadow-xl">
          <CheckCircle2 className="size-10 sm:size-12 stroke-[2.5]" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 mb-3">
        <Sparkles className="size-3.5" />
        <span>Registration Completed Successfully</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Welcome to Salora POS!
      </h2>
      <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
        Your salon workspace has been initialized with automated business hours, staff roles, and an online booking site.
      </p>

      {/* Salon Details Summary Card */}
      <div className="mt-6 mb-8 text-left rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary-lighter text-primary shrink-0">
            <Store className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{salon.name}</h3>
            <p className="text-xs text-slate-500">{salon.address || "Sri Lanka"}</p>
          </div>
        </div>

        {/* Public Website URL with Copy button */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Client Booking Storefront
            </span>
            <span className="text-xs sm:text-sm font-mono font-semibold text-primary truncate block">
              {publicUrl}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition shrink-0 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Provisioned features list */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
          <div className="flex items-center gap-2">
            <UserCheck className="size-3.5 text-emerald-600" />
            <span>Admin: <strong>{user.email}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="size-3.5 text-emerald-600" />
            <span>Currency: <strong>{salon.currency}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="size-3.5 text-emerald-600" />
            <span>POS Checkout Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="size-3.5 text-emerald-600" />
            <span>Multi-Staff Enabled</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={onLaunchDashboard}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all duration-200 active:scale-[0.99] cursor-pointer"
        >
          <LayoutDashboard className="size-4" />
          <span>Launch POS Dashboard</span>
          <ArrowRight className="size-4" />
        </button>

        <button
          type="button"
          onClick={onGoToLogin}
          className="w-full text-xs font-semibold text-slate-600 hover:text-slate-900 transition py-2 cursor-pointer"
        >
          Sign In Manually
        </button>
      </div>
    </div>
  );
}

export default Step4RegistrationComplete;
