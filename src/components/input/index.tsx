import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  labelClassName?: string;
  error?: ReactNode;
  helperText?: ReactNode;
  wrapperClassName?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    error,
    helperText,
    id,
    label,
    labelClassName,
    leftElement,
    rightElement,
    wrapperClassName,
    ...props
  },
  ref,
) {
  const inputId = id ?? (typeof props.name === "string" ? props.name : undefined);
  const isCheckboxOrRadio = props.type === "checkbox" || props.type === "radio";

  if (isCheckboxOrRadio) {
    return (
      <div className={cn("inline-flex items-center gap-2", wrapperClassName)}>
        <input
          {...props}
          ref={ref}
          id={inputId}
          className={cn(
            "rounded border-slate-300 text-primary accent-primary focus:ring-primary/20 cursor-pointer",
            props.type === "checkbox" ? "size-4 rounded" : "size-4 rounded-full",
            className,
          )}
        />
        {label && (
          <label
            htmlFor={inputId}
            className={cn("text-xs sm:text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none", labelClassName)}
          >
            {label}
          </label>
        )}
      </div>
    );
  }

  const hasAddon = Boolean(leftElement || rightElement);

  const inputNode = (
    <input
      {...props}
      ref={ref}
      aria-describedby={
        error && inputId
          ? `${inputId}-error`
          : helperText && inputId
          ? `${inputId}-helper`
          : props["aria-describedby"]
      }
      aria-invalid={error ? true : props["aria-invalid"]}
      className={cn(
        "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:disabled:bg-slate-800",
        leftElement && "pl-9",
        rightElement && "pr-10",
        error &&
          "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400 dark:focus:border-red-400",
        className,
      )}
      id={inputId}
    />
  );

  return (
    <div className={cn("flex w-full flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label
          className={cn("text-sm font-medium text-slate-700 dark:text-slate-200", labelClassName)}
          htmlFor={inputId}
        >
          {label}
        </label>
      )}

      {hasAddon ? (
        <div className="relative flex w-full items-center">
          {leftElement && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {leftElement}
            </div>
          )}
          {inputNode}
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightElement}
            </div>
          )}
        </div>
      ) : (
        inputNode
      )}

      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400" id={inputId ? `${inputId}-error` : undefined}>
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400" id={inputId ? `${inputId}-helper` : undefined}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
