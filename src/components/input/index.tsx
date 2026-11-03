import type { InputHTMLAttributes } from "react";

import { cn } from "../../lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  wrapperClassName?: string;
};

export function Input({
  className,
  error,
  id,
  label,
  wrapperClassName,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className={cn("flex w-full flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label
          className="text-sm font-medium text-slate-700 dark:text-slate-200"
          htmlFor={inputId}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        aria-describedby={error ? `${inputId}-error` : props["aria-describedby"]}
        aria-invalid={error ? true : props["aria-invalid"]}
        className={cn(
          "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:disabled:bg-slate-800",
          error &&
            "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400 dark:focus:border-red-400",
          className,
        )}
        id={inputId}
      />
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400" id={`${inputId}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
