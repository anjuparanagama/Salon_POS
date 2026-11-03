import { useState, useRef, useEffect, type ComponentType, type SVGProps } from "react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Home,
  Search,
  X,
} from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  isCurrent?: boolean;
};

export type UserProfile = {
  name: string;
  role?: string;
  avatarUrl?: string;
  initials?: string;
  isOnline?: boolean;
};

export type TopHeaderProps = {
  breadcrumbs?: BreadcrumbItem[];
  user?: UserProfile;
  hasNotification?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (query: string) => void;
  onSearchSubmit?: (query: string) => void;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onBreadcrumbClick?: (item: BreadcrumbItem) => void;
  className?: string;
};

const defaultBreadcrumbs: BreadcrumbItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Salon Management", href: "/salon-management" },
  { label: "Appointments", href: "/appointments", isCurrent: true },
];

const defaultUser: UserProfile = {
  name: "Amanda Ray",
  role: "Salon Manager",
  initials: "AR",
  isOnline: true,
};

export function TopHeader({
  breadcrumbs = defaultBreadcrumbs,
  user = defaultUser,
  hasNotification = true,
  searchPlaceholder = "Search appointments, services, customers...",
  onSearchChange,
  onSearchSubmit,
  onSearchClick,
  onNotificationClick,
  onProfileClick,
  onBreadcrumbClick,
  className = "",
}: TopHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSearchOpen) return;

    // Smoothly focus input when expanded
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
    onSearchClick?.();
  };

  const handleCloseSearch = () => {
    setSearchQuery("");
    setIsSearchOpen(false);
    onSearchChange?.("");
  };

  return (
    <header
      className={[
        "flex w-full shrink-0 items-center justify-between border-b border-slate-100 bg-white py-3 px-4 sm:px-6 transition-all",
        className,
      ].join(" ")}
    >
      {/* Left side: Breadcrumb navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 overflow-x-auto text-xs sm:text-sm">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isCurrent = item.isCurrent ?? isLast;
          const Icon = item.icon;

          return (
            <div key={`${item.label}-${index}`} className="flex items-center gap-2 shrink-0">
              {index > 0 && (
                <ChevronRight
                  aria-hidden="true"
                  className="size-3.5 text-slate-300 shrink-0"
                />
              )}

              {isCurrent ? (
                <span className="inline-flex items-center rounded-full bg-[#FDF2F7] px-3.5 py-1 text-xs font-semibold text-[#D9145A]">
                  {Icon && <Icon aria-hidden="true" className="mr-1.5 size-3.5 shrink-0" />}
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href || "#"}
                  onClick={(e) => {
                    if (onBreadcrumbClick) {
                      e.preventDefault();
                      onBreadcrumbClick(item);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 font-normal text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {Icon && <Icon aria-hidden="true" className="size-3.5 text-slate-400 shrink-0" />}
                  <span>{item.label}</span>
                </a>
              )}
            </div>
          );
        })}
      </nav>

      {/* Right side: Search, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-4">
        {/* Smooth Expandable Search Bar */}
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
            "relative flex h-9 sm:h-10 items-center overflow-hidden rounded-full bg-[#FDF2F7] transition-all duration-300 ease-in-out",
            isSearchOpen
              ? "w-48 sm:w-64 md:w-80 border border-pink-200/80 shadow-xs ring-2 ring-[#D9145A]/20"
              : "w-9 sm:w-10 cursor-pointer border border-transparent hover:bg-[#FCE8F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9145A]",
          ].join(" ")}
        >
          {/* Search Icon */}
          <div
            className={[
              "flex size-9 sm:size-10 shrink-0 items-center justify-center text-[#D9145A] transition-colors duration-200",
              isSearchOpen ? "" : "pointer-events-none",
            ].join(" ")}
          >
            <Search aria-hidden="true" className="size-4 sm:size-4.5" strokeWidth={2.25} />
          </div>

          {/* Search Input Field */}
          <input
            ref={searchInputRef}
            type="text"
            tabIndex={isSearchOpen ? 0 : -1}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearchChange?.(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                handleCloseSearch();
              } else if (e.key === "Enter") {
                onSearchSubmit?.(searchQuery);
              }
            }}
            placeholder={searchPlaceholder}
            className={[
              "min-w-0 flex-1 bg-transparent pr-1 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-opacity duration-200",
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
              "mr-1.5 flex size-6 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition-all duration-200 cursor-pointer",
              isSearchOpen
                ? "opacity-100 scale-100 pointer-events-auto delay-75"
                : "opacity-0 scale-75 pointer-events-none",
            ].join(" ")}
          >
            <X aria-hidden="true" className="size-3.5" />
          </button>
        </div>

        {/* Notification button with indicator dot */}
        <button
          type="button"
          title="Notifications"
          aria-label="Notifications"
          onClick={onNotificationClick}
          className="relative flex size-9 sm:size-10 items-center justify-center rounded-full bg-[#FDF2F7] text-[#D9145A] hover:bg-[#FCE8F0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9145A] cursor-pointer"
        >
          <Bell aria-hidden="true" className="size-4 sm:size-4.5" strokeWidth={2.25} />
          {hasNotification && (
            <span
              className="absolute top-2 right-2.5 size-2 rounded-full bg-[#D9145A] ring-2 ring-white"
              aria-label="New notifications"
            />
          )}
        </button>

        {/* Vertical divider */}
        <div className="h-7 w-px bg-slate-200 mx-0.5 sm:mx-1" />

        {/* User profile dropdown button */}
        <button
          type="button"
          title={user.name}
          aria-label={`User profile for ${user.name}`}
          onClick={onProfileClick}
          className="group flex items-center gap-2.5 rounded-full py-1 pl-1 pr-1.5 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9145A] cursor-pointer"
        >
          {/* Avatar with online status dot */}
          <div className="relative flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-full bg-[#FCE8F0] text-[#D9145A] font-bold text-xs sm:text-sm">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="size-full rounded-full object-cover"
              />
            ) : (
              <span>{user.initials || user.name.slice(0, 2).toUpperCase()}</span>
            )}
            {user.isOnline && (
              <span
                className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
                title="Online"
                aria-label="Online status"
              />
            )}
          </div>

          {/* User Name & Role */}
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-sm font-semibold text-slate-800 tracking-tight group-hover:text-slate-900 transition-colors">
              {user.name}
            </span>
            {user.role && (
              <span className="text-xs text-slate-400 font-normal">
                {user.role}
              </span>
            )}
          </div>

          {/* Dropdown Chevron */}
          <ChevronDown
            aria-hidden="true"
            className="size-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0"
          />
        </button>
      </div>
    </header>
  );
}

export default TopHeader;
