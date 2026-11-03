import { Navigate } from "react-router";
import { ROUTES } from "../../routes/sidebar.routes";

export function Ledger() {
  return <Navigate to={ROUTES.LEDGER_INCOME} replace />;
}

export default Ledger;

