import type { ElementType, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Skeleton } from "../skeleton";

export type StatCardColor =
  | "primary"
  | "indigo"
  | "emerald"
  | "amber"
  | "rose"
  | "blue"
  | "purple"
  | "sky";

export type StatCardProps = {
  label: ReactNode;
  value: ReactNode;
  icon?: ElementType;
  color?: StatCardColor;
  iconColor?: string;
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
};

const COLOR_CLASSES: Record<StatCardColor, string> = {
  primary: "border-primary text-primary",
  indigo: "border-indigo-500 text-indigo-500",
  emerald: "border-emerald-500 text-emerald-600",
  amber: "border-amber-600 text-amber-700",
  rose: "border-rose-500 text-rose-600",
  blue: "border-blue-500 text-blue-600",
  purple: "border-purple-500 text-purple-600",
  sky: "border-sky-500 text-sky-600",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  color = "primary",
  iconColor,
  className,
  onClick,
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <article
        className={cn(
          "w-full min-w-0 flex h-24 items-center justify-between rounded-2xl bg-white px-5 py-4 border border-slate-100 shadow-xs",
          className,
        )}
      >
        <div className="flex flex-col min-w-0 flex-1 pr-3 justify-center gap-2">
          <Skeleton className="h-3.5 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
        <Skeleton variant="circular" className="size-11 shrink-0" />
      </article>
    );
  }

  const resolvedIconColor = iconColor || COLOR_CLASSES[color] || COLOR_CLASSES.primary;
  const labelTooltip = typeof label === "string" ? label : undefined;
  const valueTooltip = typeof value === "string" || typeof value === "number" ? String(value) : undefined;

  return (
    <article
      onClick={onClick}
      className={cn(
        "w-full min-w-0 flex h-24 items-center justify-between rounded-2xl bg-white px-5 py-4 border border-slate-100 shadow-xs hover:shadow-sm transition-all duration-150",
        onClick && "cursor-pointer hover:border-slate-200",
        className,
      )}
    >
      <div className="flex flex-col min-w-0 flex-1 pr-3 justify-center">
        <span
          title={labelTooltip}
          className="text-xs sm:text-sm font-medium text-slate-500 truncate leading-tight"
        >
          {label}
        </span>
        <span
          title={valueTooltip}
          className="text-xl font-bold text-slate-900 tracking-tight mt-1 leading-tight truncate"
        >
          {value}
        </span>
      </div>

      {Icon && (
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-full border-2 shrink-0",
            resolvedIconColor,
          )}
        >
          <Icon className="size-5 stroke-[1.8]" />
        </div>
      )}
    </article>
  );
}

export default StatCard;
