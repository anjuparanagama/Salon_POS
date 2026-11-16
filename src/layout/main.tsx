import type { PropsWithChildren } from "react";

import Sidebar, { type SidebarItem } from "../components/sidebar";
import TopHeader, { type TopHeaderProps } from "../components/topheader";
import BottomNav from "../components/bottom-nav";
import { OfflineIndicator } from "../components/pwa-install";

export type MainLayoutProps = PropsWithChildren<{
  activeHref?: string;
  sidebarItems?: SidebarItem[];
  onNavigate?: (item: SidebarItem) => void;
  onSettingsClick?: () => void;
  onPackagesClick?: () => void;
  onLogoutClick?: () => void;
  settingsHref?: string;
  packagesHref?: string;
  logoutHref?: string;
  showTopHeader?: boolean;
  topHeaderProps?: TopHeaderProps;
}>;

export function MainLayout({
  activeHref = "/appointments",
  children,
  sidebarItems,
  onNavigate,
  onSettingsClick,
  onPackagesClick,
  onLogoutClick,
  settingsHref,
  packagesHref,
  logoutHref,
  showTopHeader = true,
  topHeaderProps,
}: MainLayoutProps) {
  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #3A0524 0%, #5B0638 60%, #45052C 100%)",
      }}
    >
      {/* Offline Status Warning Indicator */}
      <OfflineIndicator />

      {/* Desktop Left Sidebar (hidden on mobile screens < md) */}
      <div className="hidden md:flex shrink-0">
        <Sidebar
          activeHref={activeHref}
          items={sidebarItems}
          onNavigate={onNavigate}
          onSettingsClick={onSettingsClick}
          onPackagesClick={onPackagesClick}
          onLogoutClick={onLogoutClick}
          settingsHref={settingsHref}
          packagesHref={packagesHref}
          logoutHref={logoutHref}
        />
      </div>

      {/* Main Content Area: edge-to-edge on mobile, rounded card on desktop */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#FFF4F7] m-0 rounded-none md:mt-2 md:mr-2 md:rounded-tl-[1.125rem] md:rounded-tr-[1.125rem]">
        {showTopHeader && <TopHeader {...topHeaderProps} />}
        <main className="min-h-0 flex-1 overflow-y-auto px-3.5 pt-2 pb-24 sm:px-6 sm:pt-2.5 sm:pb-6 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar & More Drawer (visible strictly on < md) */}
      <BottomNav
        activeHref={activeHref}
        onNavigate={onNavigate}
        onSettingsClick={onSettingsClick}
        onPackagesClick={onPackagesClick}
        onLogoutClick={onLogoutClick}
        onPosClick={topHeaderProps?.onPosClick}
      />
    </div>
  );
}

export default MainLayout;
