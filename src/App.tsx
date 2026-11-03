import { BrowserRouter, useNavigate, useLocation } from "react-router";
import { Home } from "lucide-react";
import MainLayout from "./layout/main";
import { AppRoutes } from "./routes";
import { ROUTES } from "./routes/sidebar.routes";
import type { BreadcrumbItem } from "./components/topheader";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    switch (location.pathname) {
      case ROUTES.APPOINTMENTS:
        return [
          { label: "Home", href: ROUTES.DASHBOARD, icon: Home },
          { label: "Salon Management" },
          { label: "Appointments", href: ROUTES.APPOINTMENTS, isCurrent: true },
        ];
      case ROUTES.SERVICES:
        return [
          { label: "Home", href: ROUTES.DASHBOARD, icon: Home },
          { label: "Salon Management" },
          { label: "Services", href: ROUTES.SERVICES, isCurrent: true },
        ];
      default:
        return [
          { label: "Home", href: ROUTES.DASHBOARD, icon: Home },
          { label: "Dashboard", href: ROUTES.DASHBOARD, isCurrent: true },
        ];
    }
  };

  return (
    <MainLayout
      activeHref={location.pathname}
      onNavigate={(item) => navigate(item.href)}
      topHeaderProps={{
        breadcrumbs: getBreadcrumbs(),
        onBreadcrumbClick: (item) => {
          if (item.href) navigate(item.href);
        },
      }}
    >
      <AppRoutes />
    </MainLayout>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
