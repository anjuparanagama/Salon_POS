import type { TooltipProps, TooltipPlacement } from "../../interface/tooltip.types";

export type { TooltipProps, TooltipPlacement };

export function Tooltip({
  content,
  children,
  placement = "top",
  arrow = true,
  className = "",
  tooltipClassName = "",
  disabled = false,
}: TooltipProps) {
  if (!content || disabled) {
    return <>{children}</>;
  }

  const getPlacementClasses = () => {
    switch (placement) {
      case "right":
        return {
          wrapper: "left-full top-1/2 -translate-y-1/2 ml-2 flex-row",
          arrow: "border-y-4 border-y-transparent border-r-4 border-r-slate-900",
        };
      case "left":
        return {
          wrapper: "right-full top-1/2 -translate-y-1/2 mr-2 flex-row-reverse",
          arrow: "border-y-4 border-y-transparent border-l-4 border-l-slate-900",
        };
      case "bottom":
        return {
          wrapper: "top-full left-1/2 -translate-x-1/2 mt-2 flex-col",
          arrow: "border-x-4 border-x-transparent border-b-4 border-b-slate-900 order-first",
        };
      case "top":
      default:
        return {
          wrapper: "bottom-full left-1/2 -translate-x-1/2 mb-1.5 flex-col",
          arrow: "border-x-4 border-x-transparent border-t-4 border-t-slate-900",
        };
    }
  };

  const { wrapper: placementWrapper, arrow: arrowClass } = getPlacementClasses();

  return (
    <div className={`relative inline-flex items-center group ${className}`}>
      {children}
      <div
        role="tooltip"
        className={[
          "pointer-events-none absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-150 flex items-center z-50",
          placementWrapper,
        ].join(" ")}
      >
        {arrow && <div className={`w-0 h-0 shrink-0 ${arrowClass}`} />}
        <div
          className={[
            "w-max max-w-xs sm:max-w-sm rounded-md bg-slate-900 px-2.5 py-1 text-left text-xs font-normal text-white shadow-lg leading-relaxed",
            tooltipClassName,
          ].join(" ")}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

export default Tooltip;

