import { forwardRef, type SelectHTMLAttributes, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  labelClassName?: string;
  wrapperClassName?: string;
  error?: ReactNode;
  helperText?: ReactNode;
  leftElement?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    className,
    error,
    helperText,
    id,
    label,
    labelClassName,
    leftElement,
    wrapperClassName,
    children,
    ...props
  },
  ref
) {
  const selectId = id ?? (typeof props.name === "string" ? props.name : undefined);

  return (
    <div className={cn("flex w-full flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label
          className={cn("text-sm font-medium text-slate-700", labelClassName)}
          htmlFor={selectId}
        >
          {label}
        </label>
      )}

      <div className="relative flex w-full items-center">
        {leftElement && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {leftElement}
          </div>
        )}
        <select
          {...props}
          ref={ref}
          id={selectId}
          className={cn(
            "w-full h-10 appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-9 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60 cursor-pointer",
            leftElement && "pl-9",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
          <ChevronDown className="size-4" strokeWidth={2} />
        </div>
      </div>

      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Select;
