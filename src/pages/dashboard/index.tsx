import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { CalendarDays } from "lucide-react";
import { ROUTES } from "../../routes/sidebar.routes";
import Header from "../../components/header";
import SummarySection from "./components/summary-section";
import OrdersTrendSection from "./components/orders-trend-section";
import BreakdownChartsSection from "./components/breakdown-charts-section";

export function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation(["dashboard", "common"]);

  return (
    <section className="flex flex-col gap-6 text-slate-900 pb-8">
      {/* Page Header */}
      <Header
        title={t("dashboard:title", "Dashboard")}
        description={t(
          "dashboard:subtitle",
          "Here's what's happening at your salon today."
        )}
        actions={
          <button
            type="button"
            onClick={() => navigate(ROUTES.APPOINTMENTS)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-dark transition cursor-pointer"
          >
            <CalendarDays aria-hidden="true" className="size-4" />
            <span>{t("dashboard:addAppointment", "Add appointment")}</span>
          </button>
        }
      />

      {/* 1. Summary Cards Section */}
      <SummarySection />

      {/* 2. Horizontal Line Charts: Orders based on Services & Products */}
      <OrdersTrendSection />

      {/* 3. Breakdown Charts: Top Products, Top Services, Payment Types */}
      <BreakdownChartsSection />
    </section>
  );
}

export default Dashboard;
