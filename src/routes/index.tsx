import { Routes, Route, Navigate } from "react-router";
import Dashboard from "../pages/dashboard";
import Appointments from "../pages/appointments";
import Services from "../pages/services";
import Customers from "../pages/customers";
import Staff from "../pages/staff";
import Products from "../pages/products";
import LedgerIncome from "../pages/ledger/income";
import LedgerExpenses from "../pages/ledger/expenses";
import LedgerTransactions from "../pages/ledger/transactions";
import { ROUTES } from "./sidebar.routes";

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
      <Route path={ROUTES.APPOINTMENTS} element={<Appointments />} />
      <Route path={ROUTES.SERVICES} element={<Services />} />
      <Route path={ROUTES.CUSTOMERS} element={<Customers />} />
      <Route path={ROUTES.STAFF} element={<Staff />} />
      <Route path={ROUTES.PRODUCTS} element={<Products />} />
      <Route path={ROUTES.LEDGER} element={<Navigate to={ROUTES.LEDGER_INCOME} replace />} />
      <Route path={ROUTES.LEDGER_INCOME} element={<LedgerIncome />} />
      <Route path={ROUTES.LEDGER_EXPENSES} element={<LedgerExpenses />} />
      <Route path={ROUTES.LEDGER_TRANSACTIONS} element={<LedgerTransactions />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
}

export default AppRoutes;
