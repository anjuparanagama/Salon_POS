import type { PropsWithChildren } from "react";

import Sidebar, { type SidebarItem } from "../components/sidebar";
import TopHeader, { type TopHeaderProps } from "../components/topheader";

export type MainLayoutProps = PropsWithChildren<{
  activeHref?: string;
  sidebarItems?: SidebarItem[];
  onNavigate?: (item: SidebarItem) => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onLogoutClick?: () => void;
  settingsHref?: string;
  helpHref?: string;
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
  onHelpClick,
  onLogoutClick,
  settingsHref,
  helpHref,
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
      <Sidebar
        activeHref={activeHref}
        items={sidebarItems}
        onNavigate={onNavigate}
        onSettingsClick={onSettingsClick}
        onHelpClick={onHelpClick}
        onLogoutClick={onLogoutClick}
        settingsHref={settingsHref}
        helpHref={helpHref}
        logoutHref={logoutHref}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-tl-[1.125rem] rounded-tr-[1.125rem] bg-[#FFF4F7] mt-2 mr-2">
        {showTopHeader && <TopHeader {...topHeaderProps} />}
        <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-2 pb-4 sm:px-6 sm:pt-2.5 sm:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
