import { CalendarDays, ClipboardList, LayoutDashboard } from "lucide-react";
import type { SidebarItem } from "../interface/routes.types";

export const ROUTES = {
  DASHBOARD: "/",
  APPOINTMENTS: "/appointments",
  SERVICES: "/services",
} as const;

export const sidebarRoutes: SidebarItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Appointments",
    href: ROUTES.APPOINTMENTS,
    icon: CalendarDays,
  },
  {
    label: "Services",
    href: ROUTES.SERVICES,
    icon: ClipboardList,
  },
];

