import { useMemo } from "react";
import { BrowserRouter, useNavigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import {
  // ArrowLeftRight,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Home,
  LayoutDashboard,
  Package,
  TrendingDown,
  TrendingUp,
  Users,
  UserCheck,
} from "lucide-react";
import MainLayout from "./layout/main";
import { AppRoutes } from "./routes";
import { ROUTES } from "./routes/sidebar.routes";
import { AuthProvider } from "./context/auth-provider";
import { useAuth } from "./context/use-auth";
import type { BreadcrumbItem } from "./components/topheader";
import type { SidebarItem } from "./interface/routes.types";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("common");
  const { user, isAuthenticated, logout } = useAuth();

  const translatedSidebarRoutes: SidebarItem[] = useMemo(
    () => [
      {
        label: t("nav.dashboard", "Dashboard"),
        href: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        label: t("nav.appointments", "Appointments"),
        href: ROUTES.APPOINTMENTS,
        icon: CalendarDays,
      },
      {
        label: t("nav.services", "Services"),
        href: ROUTES.SERVICES,
        icon: ClipboardList,
      },
      {
        label: t("nav.customers", "Customers"),
        href: ROUTES.CUSTOMERS,
        icon: Users,
      },
      {
        label: t("nav.staff", "Staff"),
        href: ROUTES.STAFF,
        icon: UserCheck,
      },
      {
        label: t("nav.products", "Products"),
        href: ROUTES.PRODUCTS,
        icon: Package,
      },
      {
        label: t("nav.ledger", "Ledger"),
        href: ROUTES.LEDGER_INCOME,
        icon: BookOpen,
        subItems: [
          {
            label: t("nav.income", "Income"),
            href: ROUTES.LEDGER_INCOME,
            icon: TrendingUp,
          },
          {
            label: t("nav.expenses", "Expenses"),
            href: ROUTES.LEDGER_EXPENSES,
            icon: TrendingDown,
          },
          // {
          //   label: t("nav.transactions", "Transactions"),
          //   href: ROUTES.LEDGER_TRANSACTIONS,
          //   icon: ArrowLeftRight,
          // },
        ],
      },
    ],
    [t]
  );

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    switch (location.pathname) {
      case ROUTES.APPOINTMENTS:
        return [
          { label: t("nav.home", "Home"), href: ROUTES.DASHBOARD, icon: Home },
          { label: t("nav.salonManagement", "Salon Management") },
          { label: t("nav.appointments", "Appointments"), href: ROUTES.APPOINTMENTS, isCurrent: true },
        ];
      case ROUTES.SERVICES:
        return [
          { label: t("nav.home", "Home"), href: ROUTES.DASHBOARD, icon: Home },
          { label: t("nav.salonManagement", "Salon Management") },
          { label: t("nav.services", "Services"), href: ROUTES.SERVICES, isCurrent: true },
        ];
      case ROUTES.CUSTOMERS:
        return [
          { label: t("nav.home", "Home"), href: ROUTES.DASHBOARD, icon: Home },
          { label: t("nav.salonManagement", "Salon Management") },
          { label: t("nav.customers", "Customers"), href: ROUTES.CUSTOMERS, isCurrent: true },
        ];
      case ROUTES.STAFF:
        return [
          { label: t("nav.home", "Home"), href: ROUTES.DASHBOARD, icon: Home },
          { label: t("nav.salonManagement", "Salon Management") },
          { label: t("nav.staff", "Staff & Stylists"), href: ROUTES.STAFF, isCurrent: true },
        ];
      case ROUTES.PRODUCTS:
        return [
          { label: t("nav.home", "Home"), href: ROUTES.DASHBOARD, icon: Home },
          { label: t("nav.salonInventory", "Salon Inventory") },
          { label: t("nav.products", "Products"), href: ROUTES.PRODUCTS, isCurrent: true },
        ];
      case ROUTES.LEDGER:
      case ROUTES.LEDGER_INCOME:
        return [
          { label: t("nav.home", "Home"), href: ROUTES.DASHBOARD, icon: Home },
          { label: t("nav.financialLedger", "Financial Ledger") },
          { label: t("nav.income", "Income & Sales"), href: ROUTES.LEDGER_INCOME, isCurrent: true },
        ];
      case ROUTES.LEDGER_EXPENSES:
        return [
          { label: t("nav.home", "Home"), href: ROUTES.DASHBOARD, icon: Home },
          { label: t("nav.financialLedger", "Financial Ledger") },
          { label: t("nav.expenses", "Operating Expenses"), href: ROUTES.LEDGER_EXPENSES, isCurrent: true },
        ];
      case ROUTES.LEDGER_TRANSACTIONS:
        return [
          { label: t("nav.home", "Home"), href: ROUTES.DASHBOARD, icon: Home },
          { label: t("nav.financialLedger", "Financial Ledger") },
          { label: t("nav.transactions", "Transactions & Refunds"), href: ROUTES.LEDGER_TRANSACTIONS, isCurrent: true },
        ];
      case ROUTES.SETTINGS:
        return [
          { label: t("nav.home", "Home"), href: ROUTES.DASHBOARD, icon: Home },
          { label: t("nav.system", "System") },
          { label: t("nav.settings", "Settings"), href: ROUTES.SETTINGS, isCurrent: true },
        ];
      default:
        return [
          { label: t("nav.home", "Home"), href: ROUTES.DASHBOARD, icon: Home },
          { label: t("nav.dashboard", "Dashboard"), href: ROUTES.DASHBOARD, isCurrent: true },
        ];
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  // If user is not authenticated or currently on the login page, render AppRoutes directly
  if (!isAuthenticated || location.pathname === ROUTES.LOGIN) {
    return <AppRoutes />;
  }

  return (
    <MainLayout
      activeHref={location.pathname}
      sidebarItems={translatedSidebarRoutes}
      onNavigate={(item) => navigate(item.href)}
      onSettingsClick={() => navigate(ROUTES.SETTINGS)}
      settingsHref={ROUTES.SETTINGS}
      onLogoutClick={handleLogout}
      logoutHref={ROUTES.LOGIN}
      topHeaderProps={{
        breadcrumbs: getBreadcrumbs(),
        user: user || undefined,
        onBreadcrumbClick: (item) => {
          if (item.href) navigate(item.href);
        },
        onLogoutClick: handleLogout,
      }}
    >
      <AppRoutes />
    </MainLayout>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
