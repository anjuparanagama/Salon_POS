import { useNavigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { TrendingUp, TrendingDown, ArrowLeftRight, BookOpen } from "lucide-react";
import { ROUTES } from "../../../../routes/sidebar.routes";
import type { LedgerTab } from "../../../../interface/ledger.types";
import Header from "../../../../components/header";

export type LedgerNavProps = {
  activeTab: LedgerTab;
};

export function LedgerNav({ activeTab }: LedgerNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(["ledger", "common"]);

  const tabs: { id: LedgerTab; label: string; href: string; icon: typeof TrendingUp; description: string }[] = [
    {
      id: "income",
      label: t("ledger:tabs.income", "Income & Sales"),
      href: ROUTES.LEDGER_INCOME,
      icon: TrendingUp,
      description: "Service & product sales revenue",
    },
    {
      id: "expenses",
      label: t("ledger:tabs.expenses", "Expenses & Overhead"),
      href: ROUTES.LEDGER_EXPENSES,
      icon: TrendingDown,
      description: "Rent, utilities, salaries & stock",
    },
    {
      id: "transactions",
      label: t("ledger:tabs.transactions", "Transactions & Refunds"),
      href: ROUTES.LEDGER_TRANSACTIONS,
      icon: ArrowLeftRight,
      description: "Payments ledger & customer refunds",
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Title block */}
      <Header
        icon={BookOpen}
        title={t("ledger:title", "Salon Financial Ledger")}
        description={t("ledger:subtitle", "Track income, operational expenses, transactions, and cash flow.")}
      />

      {/* Tabs list */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {tabs.map((tab) => {
          const isCurrent = activeTab === tab.id || location.pathname === tab.href;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => navigate(tab.href)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                isCurrent
                  ? "bg-primary text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LedgerNav;

