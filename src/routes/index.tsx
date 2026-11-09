import type { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router";
import Login from "../pages/login";
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
import { ROUTES } from "./sidebar.routes";
import { useAuth } from "../context/use-auth";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <>{children}</>;
}

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path="/login" element={<Navigate to={ROUTES.LOGIN} replace />} />
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
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.SERVICES}
        element={
          <ProtectedRoute>
            <Services />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.CUSTOMERS}
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.STAFF}
        element={
          <ProtectedRoute>
            <Staff />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PRODUCTS}
        element={
          <ProtectedRoute>
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
          <ProtectedRoute>
            <LedgerIncome />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.LEDGER_EXPENSES}
        element={
          <ProtectedRoute>
            <LedgerExpenses />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.LEDGER_TRANSACTIONS}
        element={
          <ProtectedRoute>
            <LedgerTransactions />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.SETTINGS}
        element={
          <ProtectedRoute>
            <Settings />
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
