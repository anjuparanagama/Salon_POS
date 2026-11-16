import { useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, X, Loader2 } from "lucide-react";
import { Button } from "../button";
import { cn } from "../../lib/cn";

export type ConfirmationVariant = "danger" | "warning" | "info" | "success";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  isLoading?: boolean;
  className?: string;
}

const variantStyles: Record<
  ConfirmationVariant,
  {
    icon: typeof AlertTriangle;
    iconBg: string;
    iconColor: string;
    confirmBtnClass: string;
  }
> = {
  danger: {
    icon: AlertTriangle,
    iconBg: "bg-rose-50 ring-8 ring-rose-50/50 text-rose-600",
    iconColor: "text-rose-600",
    confirmBtnClass: "bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus:ring-rose-500/20",
  },
  warning: {
    icon: AlertCircle,
    iconBg: "bg-amber-50 ring-8 ring-amber-50/50 text-amber-600",
    iconColor: "text-amber-600",
    confirmBtnClass: "bg-amber-600 hover:bg-amber-700 text-white shadow-xs focus:ring-amber-500/20",
  },
  info: {
    icon: Info,
    iconBg: "bg-primary-subtle ring-8 ring-primary-subtle/50 text-primary",
    iconColor: "text-primary",
    confirmBtnClass: "bg-primary hover:bg-primary-dark text-white shadow-xs focus:ring-primary/20",
  },
  success: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-50 ring-8 ring-emerald-50/50 text-emerald-600",
    iconColor: "text-emerald-600",
    confirmBtnClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs focus:ring-emerald-500/20",
  },
};

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  className,
}: ConfirmationModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const config = variantStyles[variant] || variantStyles.danger;
  const IconComponent = config.icon;

  const handleConfirmClick = async () => {
    if (isLoading) return;
    await onConfirm();
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      {/* Modal Dialog Card */}
      <div
        className={cn(
          "relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 animate-in zoom-in-95 duration-150",
          className
        )}
      >
        {/* Close 'X' Button */}
        <Button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <X className="size-4" />
        </Button>

        {/* Icon & Title Header */}
        <div className="flex items-start gap-4 pr-6">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-2xl transition-transform",
              config.iconBg
            )}
          >
            <IconComponent className="size-5.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
            <div className="mt-1.5 text-xs text-slate-500 leading-relaxed">{message}</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-2 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            onClick={handleConfirmClick}
            disabled={isLoading}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-4.5 py-2 text-xs font-semibold transition cursor-pointer disabled:opacity-60",
              config.confirmBtnClass
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export interface ConfirmationOptions {
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  onConfirm?: () => void | Promise<void>;
}

export function useConfirmationModal() {
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmationOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);
    setIsLoading(false);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleClose = useCallback(() => {
    if (isLoading) return;
    setIsOpen(false);
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
  }, [isLoading]);

  const handleConfirm = useCallback(async () => {
    if (options?.onConfirm) {
      try {
        setIsLoading(true);
        await options.onConfirm();
      } finally {
        setIsLoading(false);
      }
    }
    setIsOpen(false);
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
    }
  }, [options]);

  const ConfirmationDialog = useCallback(() => {
    if (!options) return null;
    return (
      <ConfirmationModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        variant={options.variant}
        isLoading={isLoading}
      />
    );
  }, [isOpen, isLoading, options, handleClose, handleConfirm]);

  return { confirm, ConfirmationDialog };
}

export default ConfirmationModal;
