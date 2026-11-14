import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../button";

export type SidePanelProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  backdropClassName?: string;
  side?: "left" | "right";
};

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function SidePanel({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
  backdropClassName,
  side = "right",
}: SidePanelProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLeft = side === "left";

  return (
    <div
      aria-modal="true"
      className={cn("fixed inset-0 z-50 flex", isLeft ? "justify-start" : "justify-end")}
      role="dialog"
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 bg-black/50 transition-opacity animate-in fade-in duration-200",
          backdropClassName
        )}
        onClick={onClose}
      />

      {/* Side Panel Drawer */}
      <div
        className={cn(
          "relative z-10 flex h-full w-full flex-col bg-white shadow-2xl duration-300",
          isLeft
            ? "border-r border-slate-100 animate-in slide-in-from-left"
            : "border-l border-slate-100 animate-in slide-in-from-right",
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900">{title}</h2>
            {description && (
              <p className="mt-0.5 text-xs text-slate-500">{description}</p>
            )}
          </div>
          <Button
            aria-label="Close panel"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="size-5" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="border-t border-slate-100 px-6 py-3.5 bg-slate-50/50 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default SidePanel;

