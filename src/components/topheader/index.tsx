import { Home, CreditCard } from "lucide-react";
import type { UserProfile } from "../../interface/user.types";
import type { BreadcrumbItem } from "../../interface/breadcrumb.types";
import Breadcrumb from "../breadcrumb";
import SearchBar from "../search-bar";
import NotificationButton from "../notification-button";
import UserProfileDropdown from "../user-profile-dropdown";
import { Button } from "../button";

export type { UserProfile, BreadcrumbItem };

export type TopHeaderProps = {
  breadcrumbs?: BreadcrumbItem[];
  user?: UserProfile;
  hasNotification?: boolean;
  notificationCount?: number;
  searchPlaceholder?: string;
  onSearchChange?: (query: string) => void;
  onSearchSubmit?: (query: string) => void;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  onBreadcrumbClick?: (item: BreadcrumbItem) => void;
  onPosClick?: () => void;
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
  notificationCount,
  searchPlaceholder,
  onSearchChange,
  onSearchSubmit,
  onSearchClick,
  onNotificationClick,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  onBreadcrumbClick,
  onPosClick,
  className = "",
}: TopHeaderProps) {
  return (
    <header
      className={[
        "flex w-full shrink-0 items-center justify-between border-b border-slate-100 bg-[#FFF4F7] py-2 px-4 sm:px-6 transition-all",
        className,
      ].join(" ")}
    >
      {/* Left side: Breadcrumb navigation */}
      <Breadcrumb items={breadcrumbs} onItemClick={onBreadcrumbClick} />

      {/* Right side: Search, Language, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-4">
        {/* Search Bar Component */}
        <SearchBar
          placeholder={searchPlaceholder}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          onClick={onSearchClick}
        />

        {/* POS Terminal Direct Button */}
        <Button
          type="button"
          onClick={onPosClick}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-[#7a053c] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:opacity-95 transition-all cursor-pointer shrink-0 active:scale-98"
          title="Open POS Terminal (Walk-in Sales & Direct Billing)"
        >
          <CreditCard className="size-3.5" />
          <span className="hidden sm:inline">POS Terminal</span>
        </Button>

        {/* Notification Button Component */}
        <NotificationButton
          hasNotification={hasNotification}
          notificationCount={notificationCount}
          onClick={onNotificationClick}
        />

        {/* Vertical divider */}
        <div className="h-5 w-px bg-slate-200 mx-0.5 sm:mx-1" />

        {/* User Profile Dropdown Component */}
        <UserProfileDropdown
          user={user}
          onProfileClick={onProfileClick}
          onSettingsClick={onSettingsClick}
          onLogoutClick={onLogoutClick}
        />
      </div>
    </header>
  );
}

export default TopHeader;
