import { useTranslation } from "react-i18next";
import Header from "../../components/header";
import SummarySection from "./components/summary-section";
import OrdersTrendSection from "./components/orders-trend-section";
import BreakdownChartsSection from "./components/breakdown-charts-section";

export function Dashboard() {
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
