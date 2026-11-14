import { X, Sparkles, Phone, Mail, CheckCircle2 } from "lucide-react";
import type { RegisterInfoModalProps } from "../../../../interface/auth.types";
import { Button } from "../../../../components/button";

export function RegisterModal({ isOpen, onClose }: RegisterInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
        >
          <X className="size-4" />
        </Button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-lighter text-primary">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              New Salon Account Registration
            </h2>
            <p className="text-xs text-slate-500">
              Terminal Workstation & Staff Provisioning
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            To activate a new terminal or add a stylist profile to this salon branch,
            please coordinate with your designated <strong>Salon Administrator</strong> or
            reach out directly to Sribees Support.
          </p>

          <div className="rounded-xl border border-slate-200 bg-primary-subtle/50 p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <Phone className="size-3.5 text-primary" />
              <span>Admin Hotline: +94 11 234 5678</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <Mail className="size-3.5 text-primary" />
              <span>Support Desk: support@sribees.com</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 font-medium">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span>Terminal Provisioning: Mon - Sat (8 AM - 8 PM)</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100">
          <Button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-primary py-2.5 px-4 text-xs font-semibold text-white hover:bg-primary-dark transition cursor-pointer"
          >
            Understood &bull; Return to Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;

