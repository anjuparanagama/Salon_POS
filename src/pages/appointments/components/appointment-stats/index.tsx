import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  Calendar,
  CalendarClock,
  CalendarX,
} from "lucide-react";
import { StatCard } from "../../../../components/stat-card";
import { StatCardsGridSkeleton } from "../../../../components/skeleton";
import type { AppointmentStats as StatsType } from "../../../../interface/appointment.types";

export type AppointmentStatsProps = {
  stats: StatsType;
  isLoading?: boolean;
};

export function AppointmentStats({ stats, isLoading = false }: AppointmentStatsProps) {
  if (isLoading) {
    return <StatCardsGridSkeleton count={4} />;
  }

  const { t } = useTranslation(["appointments", "common"]);

  const total = Number(stats?.total) || 0;
  const today = Number(stats?.today) || 0;
  const upcoming = Number(stats?.upcoming) || 0;
  const cancelled = Number(stats?.cancelled) || 0;

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label={t("appointments:stats.today", "Today Appointments")}
        value={today.toLocaleString()}
        icon={CalendarDays}
        color="indigo"
      />
      <StatCard
        label={t("appointments:stats.total", "Total Appointments")}
        value={total.toLocaleString()}
        icon={Calendar}
        color="primary"
      />
      <StatCard
        label={t("appointments:stats.upcoming", "Upcoming Appointments")}
        value={upcoming.toLocaleString()}
        icon={CalendarClock}
        color="amber"
      />
      <StatCard
        label={t("appointments:stats.cancelled", "Cancelled Appointments")}
        value={cancelled.toLocaleString()}
        icon={CalendarX}
        color="rose"
      />
    </div>
  );
}

export default AppointmentStats;
