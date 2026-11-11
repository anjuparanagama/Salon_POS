import type { FC } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
  itemLabel?: string;
  showItemCount?: boolean;
}

/**
 * Generates pagination page numbers with smart ellipsis matching StoreMate / Salora standard
 * e.g., [1 (active), 2, 3, 4, 5, '...', 77]
 */
function getPaginationRange(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // When close to beginning
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  // When close to end
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // In between
  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className = "",
  itemLabel = "entries",
  showItemCount = true,
}) => {
  if (totalItems <= 0 && totalPages <= 1) {
    return null;
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <div
      className={[
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 py-2 text-xs text-slate-500 select-none",
        className,
      ].join(" ")}
    >
      {/* Left: Item Count Information */}
      {showItemCount && (
        <div className="font-normal text-slate-500">
          Showing {startItem} to {endItem} of {totalItems} {itemLabel}
        </div>
      )}

      {/* Right: Modern Circle Page Buttons */}
      <div className="flex items-center gap-1 self-end sm:self-auto">
        {/* Previous Chevron */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="size-7 flex items-center justify-center text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer rounded-full hover:bg-slate-100"
        >
          <ChevronLeft className="size-3.5" />
        </button>

        {/* Page items */}
        {pages.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="size-7 flex items-center justify-center text-slate-400 text-xs font-medium"
              >
                ...
              </span>
            );
          }

          const isActive = item === currentPage;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={isActive ? "page" : undefined}
              className={[
                "size-7 rounded-full text-xs transition cursor-pointer flex items-center justify-center",
                isActive
                  ? "bg-primary text-white font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-normal",
              ].join(" ")}
            >
              {item}
            </button>
          );
        })}

        {/* Next Chevron */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="size-7 flex items-center justify-center text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer rounded-full hover:bg-slate-100"
        >
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

