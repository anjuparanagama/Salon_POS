import { Calendar, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { AppointmentStats as StatsType } from "../../../../interface/appointment.types";

export type AppointmentStatsProps = {
  stats: StatsType;
};

export function AppointmentStats({ stats }: AppointmentStatsProps) {
  const cards = [
    {
      label: "Total Bookings",
      value: stats.total,
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary-lighter",
      subtext: "Today's schedule",
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      subtext: "Ready for service",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      subtext: "Currently serving",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
      subtext: "Slot opened",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.label}
            className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-xs transition hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className={`flex size-9 items-center justify-center rounded-lg ${card.bg} ${card.color}`}>
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="text-[11px] font-medium text-slate-400">{card.subtext}</span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-medium text-slate-500">{card.label}</p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">{card.value}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default AppointmentStats;

