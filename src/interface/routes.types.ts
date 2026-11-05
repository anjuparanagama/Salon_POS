import type { ComponentType, ReactNode, SVGProps } from "react";

export type SidebarIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type SidebarSubItem = {
  label: string;
  href: string;
  icon?: SidebarIcon;
};

export type SidebarItem = {
  label: string;
  href: string;
  icon: SidebarIcon;
  subItems?: SidebarSubItem[];
};

export type RouteConfig = {
  path: string;
  label: string;
  element: ReactNode;
  icon: SidebarIcon;
  showInSidebar?: boolean;
};
