import type { ReactNode } from "react";
import { Info } from "lucide-react";

export type HeaderProps = {
  title?: string;
  description?: string;
  showInfo?: boolean;
  infoTooltip?: string;
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
  onInfoClick,
  actions,
  children,
  className = "",
}: HeaderProps) {
  const tooltipText = infoTooltip || (description ? `${title} - ${description}` : title);

  return (
    <div
      className={[
        "flex w-full items-center justify-between gap-4 py-2",
        className,
      ].join(" ")}
    >
      {/* Title, Info Icon, Divider, and Subtitle */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        {showInfo && (
          <button
            type="button"
            title={tooltipText}
            aria-label={`Information about ${title}`}
            onClick={onInfoClick}
            className="inline-flex size-5 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
          >
            <Info aria-hidden="true" className="size-4" strokeWidth={1.8} />
          </button>
        )}

        {description && (
          <>
            <div
              aria-hidden="true"
              className="h-4 sm:h-5 w-px bg-slate-200 shrink-0"
            />
            <p className="text-xs sm:text-sm font-normal text-slate-500">
              {description}
            </p>
          </>
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

