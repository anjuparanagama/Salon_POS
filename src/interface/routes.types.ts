import type { ComponentType, ReactNode, SVGProps } from "react";

export type SidebarIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type SidebarItem = {
  label: string;
  href: string;
  icon: SidebarIcon;
};

export type RouteConfig = {
  path: string;
  label: string;
  element: ReactNode;
  icon: SidebarIcon;
  showInSidebar?: boolean;
};

