import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  DollarSign,
  MoreHorizontal,
  Users,
} from "lucide-react";
import { ROUTES } from "../../routes/sidebar.routes";
import Header from "../../components/header";
import type { RecentAppointment } from "../../interface/dashboard.types";
import { formatPrice } from "../../helpers/price.helper";

const appointments: RecentAppointment[] = [
  { time: "09:00 AM", customer: "Emma Wilson", service: "Haircut & Styling", staff: "Amelia" },
  { time: "10:30 AM", customer: "Sophia Brown", service: "Manicure", staff: "Olivia" },
  { time: "12:00 PM", customer: "Mia Johnson", service: "Hair Coloring", staff: "Amelia" },
  { time: "02:30 PM", customer: "Ava Smith", service: "Facial Treatment", staff: "Isabella" },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation(["dashboard", "common"]);

  const localizedSummaryCards = [
    {
      label: t("dashboard:stats.todayAppointments", "Today's appointments"),
      value: "24",
      change: "+12.5%",
      icon: CalendarDays,
    },
    {
      label: t("dashboard:stats.totalCustomers", "Total customers"),
      value: "1,248",
      change: "+8.2%",
      icon: Users,
    },
    {
      label: t("dashboard:stats.todayRevenue", "Today's revenue"),
      value: formatPrice(2840),
      change: "+14.8%",
      icon: DollarSign,
    },
    {
      label: t("dashboard:stats.avgServiceTime", "Average service time"),
      value: "42 min",
      change: "-4.3%",
      icon: Clock3,
    },
  ];

  return (
    <section className="flex flex-col gap-5 text-slate-900">
      <Header
        title={t("dashboard:greeting", "Good morning, Admin")}
        description={t("dashboard:subtitle", "Here's what's happening at your salon today.")}
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

      <div className="grid shrink-0 grid-cols-2 gap-3 xl:grid-cols-4">
        {localizedSummaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              className="rounded-xl border border-slate-100 bg-slate-50 p-4 shadow-sm"
              key={card.label}
            >
              <div className="flex items-start justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary-lighter text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="text-xs font-semibold text-emerald-600">{card.change}</span>
              </div>
              <p className="mt-4 text-xs font-medium text-slate-500">{card.label}</p>
              <p className="mt-1 text-xl font-semibold tracking-tight">{card.value}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.6fr)]">
        <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold">{t("dashboard:stats.todayAppointments", "Today's appointments")}</h2>
              <p className="mt-1 text-xs text-slate-500">{t("dashboard:upcomingSchedule", "Your upcoming schedule")}</p>
            </div>
            <button
              onClick={() => navigate(ROUTES.APPOINTMENTS)}
              className="text-sm font-semibold text-primary hover:underline cursor-pointer"
              type="button"
            >
              {t("dashboard:viewAll", "View all")}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3" scope="col">{t("dashboard:table.time", "Time")}</th>
                  <th className="px-5 py-3" scope="col">{t("dashboard:table.customer", "Customer")}</th>
                  <th className="hidden px-5 py-3 sm:table-cell" scope="col">{t("dashboard:table.service", "Service")}</th>
                  <th className="hidden px-5 py-3 md:table-cell" scope="col">{t("dashboard:table.staff", "Staff")}</th>
                  <th className="px-5 py-3" scope="col"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((appointment) => (
                  <tr className="text-slate-600" key={`${appointment.time}-${appointment.customer}`}>
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">
                      {appointment.time}
                    </td>
                    <td className="px-5 py-4">{appointment.customer}</td>
                    <td className="hidden px-5 py-4 sm:table-cell">{appointment.service}</td>
                    <td className="hidden px-5 py-4 md:table-cell">{appointment.staff}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        aria-label={`More options for ${appointment.customer}`}
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                        type="button"
                      >
                        <MoreHorizontal aria-hidden="true" className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-100 bg-primary p-5 text-white shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold">Monthly revenue</h2>
              <p className="mt-1 text-xs text-white/70">Compared with last month</p>
            </div>
            <ArrowUpRight aria-hidden="true" className="size-5 text-white/80" />
          </div>
          <p className="mt-8 text-3xl font-semibold">{formatPrice(18460)}</p>
          <div className="mt-6 flex h-24 items-end gap-2">
            {[35, 48, 42, 64, 58, 76, 68, 88, 74, 94, 82, 100].map((height, index) => (
              <span
                className="flex-1 rounded-t-sm bg-white/80"
                key={index}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-white/60">
            <span>Jan</span>
            <span>Jun</span>
            <span>Oct</span>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Dashboard;
