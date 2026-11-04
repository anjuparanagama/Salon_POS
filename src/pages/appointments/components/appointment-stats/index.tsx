import { useTranslation } from "react-i18next";
import { CalendarDays, Calendar, CalendarX, CalendarClock } from "lucide-react";
import type { AppointmentStats as StatsType } from "../../../../interface/appointment.types";

export type AppointmentStatsProps = {
  stats: StatsType;
};

export function AppointmentStats({ stats }: AppointmentStatsProps) {
  const { t } = useTranslation(["appointments", "common"]);

  const cards = [
    {
      label: t("appointments:stats.today", "Today Appointments"),
      value: stats.today,
      icon: CalendarDays,
      color: "text-blue-600",
      bg: "bg-blue-50",
      subtext: "Today's bookings",
    },
    {
      label: t("appointments:stats.total", "Total Appointments"),
      value: stats.total,
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary-lighter",
      subtext: "All time bookings",
    },
    {
      label: t("appointments:stats.cancelled", "Cancel Appointments"),
      value: stats.cancelled,
      icon: CalendarX,
      color: "text-rose-600",
      bg: "bg-rose-50",
      subtext: "Cancelled bookings",
    },
    {
      label: t("appointments:stats.upcoming", "Upcoming Appointments"),
      value: stats.upcoming,
      icon: CalendarClock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      subtext: "Upcoming schedule",
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

