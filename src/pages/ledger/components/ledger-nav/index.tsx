import { useNavigate, useLocation } from "react-router";
import { TrendingUp, TrendingDown, ArrowLeftRight, BookOpen } from "lucide-react";
import { ROUTES } from "../../../../routes/sidebar.routes";
import type { LedgerTab } from "../../../../interface/ledger.types";

export type LedgerNavProps = {
  activeTab: LedgerTab;
};

const tabs: { id: LedgerTab; label: string; href: string; icon: typeof TrendingUp; description: string }[] = [
  {
    id: "income",
    label: "Income & Sales",
    href: ROUTES.LEDGER_INCOME,
    icon: TrendingUp,
    description: "Service & product sales revenue",
  },
  {
    id: "expenses",
    label: "Expenses & Overhead",
    href: ROUTES.LEDGER_EXPENSES,
    icon: TrendingDown,
    description: "Rent, utilities, salaries & stock",
  },
  {
    id: "transactions",
    label: "Transactions & Refunds",
    href: ROUTES.LEDGER_TRANSACTIONS,
    icon: ArrowLeftRight,
    description: "Payments ledger & customer refunds",
  },
];

export function LedgerNav({ activeTab }: LedgerNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col gap-3">
      {/* Title block */}
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary-lighter text-primary">
          <BookOpen className="size-4" />
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Salon Financial Ledger</h1>
          <p className="text-xs text-slate-500">
            Real-time income breakdown, operational expenditures, and payment reconciliation.
          </p>
        </div>
      </div>

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

