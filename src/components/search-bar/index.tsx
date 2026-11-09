import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";

export type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChange?: (query: string) => void;
  onSubmit?: (query: string) => void;
  onClick?: () => void;
  className?: string;
};

export function SearchBar({
  placeholder,
  value,
  onChange,
  onSubmit,
  onClick,
  className = "",
}: SearchBarProps) {
  const { t } = useTranslation("common");
  const resolvedPlaceholder =
    placeholder ?? t("header.searchPlaceholder", "Search appointments, services, customers...");

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [internalQuery, setInternalQuery] = useState("");
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const query = isControlled ? value : internalQuery;

  useEffect(() => {
    if (!isSearchOpen) return;

    const focusTimer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 120);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
    onClick?.();
  };

  const handleCloseSearch = () => {
    if (!isControlled) {
      setInternalQuery("");
    }
    setIsSearchOpen(false);
    onChange?.("");
  };

  return (
    <div
      ref={searchContainerRef}
      role={isSearchOpen ? "search" : "button"}
      tabIndex={isSearchOpen ? undefined : 0}
      title={isSearchOpen ? undefined : "Search"}
      aria-label={isSearchOpen ? "Search" : "Open search"}
      onClick={() => {
        if (!isSearchOpen) {
          handleOpenSearch();
        }
      }}
      onKeyDown={(e) => {
        if (!isSearchOpen && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleOpenSearch();
        }
      }}
      className={[
        "relative flex h-8 sm:h-8.5 items-center overflow-hidden rounded-full bg-[#FCE8F0] transition-all duration-300 ease-in-out",
        isSearchOpen
          ? "w-48 sm:w-64 md:w-80 border border-pink-200/80 shadow-xs ring-2 ring-[#D9145A]/20"
          : "w-8 sm:w-8.5 cursor-pointer border border-transparent hover:bg-[#FAD9E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9145A]",
        className,
      ].join(" ")}
    >
      {/* Search Icon */}
      <div
        className={[
          "flex size-8 sm:size-8.5 shrink-0 items-center justify-center text-[#D9145A] transition-colors duration-200",
          isSearchOpen ? "" : "pointer-events-none",
        ].join(" ")}
      >
        <Search aria-hidden="true" className="size-3.5 sm:size-4" strokeWidth={2.25} />
      </div>

      {/* Search Input Field */}
      <input
        ref={searchInputRef}
        type="text"
        tabIndex={isSearchOpen ? 0 : -1}
        value={query}
        onChange={(e) => {
          if (!isControlled) {
            setInternalQuery(e.target.value);
          }
          onChange?.(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            handleCloseSearch();
          } else if (e.key === "Enter") {
            onSubmit?.(query);
          }
        }}
        placeholder={resolvedPlaceholder}
        className={[
          "min-w-0 flex-1 bg-transparent pr-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-opacity duration-200",
          isSearchOpen
            ? "opacity-100 delay-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Close Button */}
      <button
        type="button"
        title="Close search"
        aria-label="Close search"
        tabIndex={isSearchOpen ? 0 : -1}
        onClick={(e) => {
          e.stopPropagation();
          handleCloseSearch();
        }}
        className={[
          "mr-1 flex size-5 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition-all duration-200 cursor-pointer",
          isSearchOpen
            ? "opacity-100 scale-100 pointer-events-auto delay-75"
            : "opacity-0 scale-75 pointer-events-none",
        ].join(" ")}
      >
        <X aria-hidden="true" className="size-3" />
      </button>
    </div>
  );
}

export default SearchBar;
