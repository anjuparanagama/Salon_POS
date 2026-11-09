import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Package,
  BookOpen,
  TrendingUp,
  TrendingDown,
  // ArrowLeftRight,
  Users,
  UserCheck,
} from "lucide-react";
import type { SidebarItem } from "../interface/routes.types";

export const ROUTES = {
  DASHBOARD: "/",
  LOGIN: "/login",
  APPOINTMENTS: "/appointments",
  SERVICES: "/services",
  PRODUCTS: "/products",
  CUSTOMERS: "/customers",
  STAFF: "/staff",
  LEDGER: "/ledger",
  LEDGER_INCOME: "/ledger/income",
  LEDGER_EXPENSES: "/ledger/expenses",
  LEDGER_TRANSACTIONS: "/ledger/transactions",
  SETTINGS: "/settings",
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
  {
    label: "Customers",
    href: ROUTES.CUSTOMERS,
    icon: Users,
  },
  {
    label: "Staff",
    href: ROUTES.STAFF,
    icon: UserCheck,
  },
  {
    label: "Products",
    href: ROUTES.PRODUCTS,
    icon: Package,
  },
  {
    label: "Ledger",
    href: ROUTES.LEDGER_INCOME,
    icon: BookOpen,
    subItems: [
      {
        label: "Income",
        href: ROUTES.LEDGER_INCOME,
        icon: TrendingUp,
      },
      {
        label: "Expenses",
        href: ROUTES.LEDGER_EXPENSES,
        icon: TrendingDown,
      },
      // {
      //   label: "Transactions",
      //   href: ROUTES.LEDGER_TRANSACTIONS,
      //   icon: ArrowLeftRight,
      // },
    ],
  },
];
