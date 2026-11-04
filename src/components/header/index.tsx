import { isValidElement, type ComponentType, type ReactNode } from "react";
import { Info, type LucideIcon } from "lucide-react";

export type HeaderProps = {
  title?: ReactNode;
  description?: string;
  icon?: LucideIcon | ComponentType<{ className?: string }> | ReactNode;
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
  icon,
  showInfo = true,
  infoTooltip,
  onInfoClick,
  actions,
  children,
  className = "",
}: HeaderProps) {
  const tooltipText = infoTooltip || description;

  const renderIcon = () => {
    if (!icon) return null;
    if (isValidElement(icon)) {
      return icon;
    }
    const IconComp = icon as ComponentType<{ className?: string }>;
    return <IconComp className="size-4" />;
  };

  return (
    <div
      className={[
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-1",
        className,
      ].join(" ")}
    >
      {/* Title, Icon & Info with Tooltip on Left */}
      <div className="flex items-center gap-2">
        {icon && (
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary-lighter text-primary shrink-0">
            {renderIcon()}
          </span>
        )}

        <div className="flex items-center gap-1.5">
          <h1
            title={typeof tooltipText === "string" ? tooltipText : undefined}
            className="text-xl font-bold tracking-tight text-slate-900"
          >
            {title}
          </h1>

          {showInfo && tooltipText && (
            <div className="relative inline-flex items-center group">
              <button
                type="button"
                title={typeof tooltipText === "string" ? tooltipText : undefined}
                aria-label={typeof tooltipText === "string" ? tooltipText : "Information"}
                onClick={onInfoClick}
                className="inline-flex size-5 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
              >
                <Info aria-hidden="true" className="size-3.5" strokeWidth={2} />
              </button>

              {/* Tooltip Popup */}
              <div
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-150 flex flex-col items-center z-50"
              >
                <div className="w-max max-w-xs rounded-md bg-slate-900 px-2.5 py-1 text-center text-xs font-normal text-white shadow-md leading-relaxed">
                  {tooltipText}
                </div>
                <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900" />
              </div>
            </div>
          )}
        </div>
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

