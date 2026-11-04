import type { ReactNode } from "react";
import { Info } from "lucide-react";
import Tooltip, { type TooltipPlacement } from "../tooltip";

export type HeaderProps = {
  title?: ReactNode;
  description?: string;
  showInfo?: boolean;
  infoTooltip?: string;
  tooltipPlacement?: TooltipPlacement;
  onInfoClick?: () => void;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function Header({
  title = "Appointments",
  description = "Booking Schedule & Management",
  showInfo = true,
  infoTooltip,
  tooltipPlacement = "right",
  onInfoClick,
  actions,
  children,
  className = "",
}: HeaderProps) {
  const tooltipText = infoTooltip || description;

  return (
    <div
      className={[
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-0.5",
        className,
      ].join(" ")}
    >
      {/* Title & Info with Tooltip on Left (No icon) */}
      <div className="flex items-center gap-1.5">
        <h1
          title={typeof tooltipText === "string" ? tooltipText : undefined}
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          {title}
        </h1>

        {showInfo && tooltipText && (
          <Tooltip content={tooltipText} placement={tooltipPlacement}>
            <button
              type="button"
              aria-label={typeof tooltipText === "string" ? tooltipText : "Information"}
              onClick={onInfoClick}
              className="inline-flex size-5 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
            >
              <Info aria-hidden="true" className="size-3.5" strokeWidth={2} />
            </button>
          </Tooltip>
        )}
      </div>

      {/* Right side optional action buttons / children */}
      {(actions || children) && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
          {children}
        </div>
      )}
    </div>
  );
}

export default Header;
