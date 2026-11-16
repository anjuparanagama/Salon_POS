import type { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router";
import Login from "../pages/login";
import Register from "../pages/register";
import Dashboard from "../pages/dashboard";
import Appointments from "../pages/appointments";
import Services from "../pages/services";
import Customers from "../pages/customers";
import Staff from "../pages/staff";
import Products from "../pages/products";
import LedgerIncome from "../pages/ledger/income";
import LedgerExpenses from "../pages/ledger/expenses";
import LedgerTransactions from "../pages/ledger/transactions";
import Settings from "../pages/settings";
import PackagesPage from "../pages/packages";
import CheckoutPage from "../pages/checkout";
import { ROUTES } from "./sidebar.routes";
import { useAuth } from "../context/use-auth";

function ProtectedRoute({
  children,
  requiredPermission,
}: {
  children: ReactNode;
  requiredPermission?: string;
}) {
  const { isAuthenticated, hasPermission } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  return <>{children}</>;
}

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path="/login" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.APPOINTMENTS}
        element={
          <ProtectedRoute requiredPermission="viewAppointments">
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.SERVICES}
        element={
          <ProtectedRoute requiredPermission="manageServices">
            <Services />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.CUSTOMERS}
        element={
          <ProtectedRoute requiredPermission="viewCustomers">
            <Customers />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.STAFF}
        element={
          <ProtectedRoute requiredPermission="manageStaff">
            <Staff />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PRODUCTS}
        element={
          <ProtectedRoute requiredPermission="viewProducts">
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.LEDGER}
        element={<Navigate to={ROUTES.LEDGER_INCOME} replace />}
      />
      <Route
        path={ROUTES.LEDGER_INCOME}
        element={
          <ProtectedRoute requiredPermission="viewFinancialLedger">
            <LedgerIncome />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.LEDGER_EXPENSES}
        element={
          <ProtectedRoute requiredPermission="viewFinancialLedger">
            <LedgerExpenses />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.LEDGER_TRANSACTIONS}
        element={
          <ProtectedRoute requiredPermission="viewFinancialLedger">
            <LedgerTransactions />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.SETTINGS}
        element={
          <ProtectedRoute requiredPermission="manageStaff">
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PACKAGES}
        element={
          <ProtectedRoute>
            <PackagesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.CHECKOUT}
        element={
          <ProtectedRoute requiredPermission="accessPosCheckout">
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout/:appointmentId"
        element={
          <ProtectedRoute requiredPermission="accessPosCheckout">
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
            replace
          />
        }
      />
    </Routes>
  );
}

export default AppRoutes;
