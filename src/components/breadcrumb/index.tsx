import { ChevronRight } from "lucide-react";
import type { BreadcrumbItem, BreadcrumbProps } from "../../interface/breadcrumb.types";

export type { BreadcrumbItem, BreadcrumbProps };

export function Breadcrumb({
  items,
  onItemClick,
  className = "",
}: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={["flex items-center gap-1.5 overflow-x-auto text-[11px] sm:text-xs", className].join(" ")}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isCurrent = item.isCurrent ?? isLast;
        const Icon = item.icon;

        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-1.5 shrink-0">
            {index > 0 && (
              <ChevronRight
                aria-hidden="true"
                className="size-3 text-slate-300 shrink-0"
              />
            )}

            {isCurrent ? (
              <span className="inline-flex items-center rounded-full bg-[#FCE8F0] px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-[#D9145A]">
                {Icon && <Icon aria-hidden="true" className="mr-1 size-3 shrink-0" />}
                {item.label}
              </span>
            ) : (
              <a
                href={item.href || "#"}
                onClick={(e) => {
                  if (onItemClick) {
                    e.preventDefault();
                    onItemClick(item);
                  }
                }}
                className="inline-flex items-center gap-1 font-normal text-slate-400 hover:text-slate-600 transition-colors"
              >
                {Icon && <Icon aria-hidden="true" className="size-3 text-slate-400 shrink-0" />}
                <span>{item.label}</span>
              </a>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;

