import { Routes, Route } from "react-router";
import Dashboard from "../pages/dashboard";
import Appointments from "../pages/appointments";
import Services from "../pages/services";
import { ROUTES } from "./sidebar.routes";

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
      <Route path={ROUTES.APPOINTMENTS} element={<Appointments />} />
      <Route path={ROUTES.SERVICES} element={<Services />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
}

export default AppRoutes;
