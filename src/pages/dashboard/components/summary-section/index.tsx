import { useState } from "react";
import { Loader2 } from "lucide-react";
import { StatCardsGridSkeleton } from "@/components/skeleton";
import type { SummaryFilterOption } from "../../../../interface/dashboard.types";
import { SUMMARY_FILTER_OPTIONS } from "../../data/dashboard.mock";
import TimeFilterSelect from "../time-filter-select";
import { useDashboardSummary } from "../../../../hooks/dashboard";

export function SummarySection() {
  const [filter, setFilter] = useState<SummaryFilterOption>("today");
  const { cards, isLoading } = useDashboardSummary(filter);

  return (
    <section className="rounded-2xl border border-sky-100/80 bg-gradient-to-b from-sky-50/30 to-slate-50/10 p-5 shadow-xs">
      {/* Header Row: Title on Left, Filter on Right */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold tracking-tight text-slate-700 sm:text-base">
            Summary
          </h2>
          {isLoading && <Loader2 className="size-4 animate-spin text-slate-400" />}
        </div>

        {/* Right Corner Filter */}
        <TimeFilterSelect
          value={filter}
          onChange={(val) => setFilter(val as SummaryFilterOption)}
          options={SUMMARY_FILTER_OPTIONS}
          ariaLabel="Filter summary time range"
        />
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <StatCardsGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.id}
              className={`group relative min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradientClass} p-4 text-white shadow-md transition-all hover:scale-[1.01] hover:shadow-lg`}
            >
              {/* Top-left curved dark overlay shape */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 -left-8 size-28 rounded-full bg-black/20"
              />

              <div className="relative z-1 flex items-center justify-between gap-3">
                {/* Left Column: Label, Value, Total Count */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-white/90 truncate">
                    {card.title}
                  </p>

                  <p className="mt-1 text-base font-bold tracking-tight text-white sm:text-lg truncate">
                    {card.value}
                  </p>

                  <div className="mt-3">
                    <span className="inline-flex items-center rounded-md bg-black/20 px-2 py-0.5 text-[10px] font-medium text-white/95 backdrop-blur-xs">
                      Total Count : {card.count.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Right Column: Circular Gauge with Percentage */}
                <div
                  role="img"
                  aria-label={`${card.title} rate ${card.percentage}%`}
                  className="relative my-auto flex size-14 shrink-0 items-center justify-center rounded-full border-[5px] border-black/20 bg-black/5 shadow-inner"
                >
                  <span className="text-xs font-bold text-white drop-shadow-xs">
                    {card.percentage}%
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default SummarySection;
