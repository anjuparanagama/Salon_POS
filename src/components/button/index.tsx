import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "danger-outline"
  | "ghost"
  | "success"
  | "success-subtle"
  | "dark"
  | "unstyled";

export type ButtonSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "icon-xs"
  | "icon-sm"
  | "icon"
  | "none";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark shadow-xs focus-visible:ring-primary/25",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs focus-visible:ring-slate-300",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs focus-visible:ring-slate-300",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 shadow-2xs focus-visible:ring-rose-500/25",
  "danger-outline":
    "border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 hover:border-rose-300",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-300",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs focus-visible:ring-emerald-500/25",
  "success-subtle":
    "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100",
  dark:
    "bg-slate-900 text-white hover:bg-slate-800 shadow-xs focus-visible:ring-slate-800/25",
  unstyled: "",
};

const sizes: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-[11px] gap-1 rounded-md font-medium",
  sm: "px-3 py-1.5 text-xs gap-1.5 rounded-lg font-semibold",
  md: "px-4 py-2 text-xs sm:text-sm gap-2 rounded-xl font-semibold",
  lg: "px-5 py-2.5 text-sm sm:text-base gap-2 rounded-xl font-bold",
  "icon-xs": "p-1 rounded-md",
  "icon-sm": "p-1.5 rounded-lg",
  icon: "p-2 rounded-lg",
  none: "",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    children,
    disabled,
    fullWidth = false,
    isLoading = false,
    loadingText,
    leftIcon,
    rightIcon,
    size = "none",
    type = "button",
    variant = "unstyled",
    ...props
  },
  ref
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={cn(
        "inline-flex items-center justify-center transition cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
        fullWidth && "w-full",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin shrink-0" />
          {loadingText ? <span>{loadingText}</span> : children}
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

export default Button;
