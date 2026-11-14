import { useState } from "react";
import { X, Mail, CheckCircle2, Loader2, ArrowLeft, KeyRound } from "lucide-react";
import { Input } from "../../../../components/input";
import type { ForgotPasswordModalProps } from "../../../../interface/auth.types";

function ModalDialog({
  initialEmail,
  onClose,
  onSubmit,
}: {
  initialEmail: string;
  onClose: () => void;
  onSubmit: (email: string) => Promise<boolean>;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid staff email address.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const ok = await onSubmit(email);
      if (ok) {
        setIsSuccess(true);
      } else {
        setError("Unable to process request for this email. Check with your Salon Owner.");
      }
    } catch {
      setError("Network or server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
      >
        <X className="size-4" />
      </button>

      {isSuccess ? (
        <div className="text-center py-4 space-y-3">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-8" strokeWidth={2.2} />
          </div>

          <h3 className="text-lg font-bold text-slate-800">
            Recovery Instructions Sent
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
            We&apos;ve sent temporary login instructions and a password reset link to{" "}
            <span className="font-semibold text-slate-900">{email}</span>.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-primary py-2.5 px-4 text-xs font-semibold text-white hover:bg-primary-dark transition cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-lighter text-primary">
              <KeyRound className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Forgot Password?
              </h3>
              <p className="text-xs text-slate-500">
                Enter your registered salon email to reset
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
              {error}
            </div>
          )}

          <Input
            id="reset-email"
            type="email"
            label="Staff Email Address"
            labelClassName="block text-xs font-semibold text-slate-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g., amanda@sribees.com"
            disabled={isLoading}
            leftElement={<Mail className="size-4" />}
            helperText="If you forgot your PIN, please contact Amanda Ray (Salon Manager)."
            className="rounded-xl border-slate-200 bg-white py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              Cancel
            </button>

            <button
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
                <span>Send Reset Link</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function ForgotPasswordModal({
  isOpen,
  initialEmail = "",
  onClose,
  onSubmit,
}: ForgotPasswordModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <ModalDialog
        initialEmail={initialEmail}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default ForgotPasswordModal;
