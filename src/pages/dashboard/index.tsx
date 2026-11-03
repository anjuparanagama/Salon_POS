import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  DollarSign,
  MoreHorizontal,
  Users,
} from "lucide-react";

type SummaryCard = {
  label: string;
  value: string;
  change: string;
  icon: typeof CalendarDays;
};

const summaryCards: SummaryCard[] = [
  {
    label: "Today's appointments",
    value: "24",
    change: "+12.5%",
    icon: CalendarDays,
  },
  {
    label: "Total customers",
    value: "1,248",
    change: "+8.2%",
    icon: Users,
  },
  {
    label: "Today's revenue",
    value: "$2,840",
    change: "+14.8%",
    icon: DollarSign,
  },
  {
    label: "Average service time",
    value: "42 min",
    change: "-4.3%",
    icon: Clock3,
  },
];

const appointments = [
  { time: "09:00 AM", customer: "Emma Wilson", service: "Haircut & Styling", staff: "Amelia" },
  { time: "10:30 AM", customer: "Sophia Brown", service: "Manicure", staff: "Olivia" },
  { time: "12:00 PM", customer: "Mia Johnson", service: "Hair Coloring", staff: "Amelia" },
  { time: "02:30 PM", customer: "Ava Smith", service: "Facial Treatment", staff: "Isabella" },
];

export function Dashboard() {
  return (
    <section className="flex h-full min-h-0 flex-col gap-5 overflow-hidden text-slate-900">
      <header className="flex shrink-0 items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Wednesday, October 29, 2026</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Good morning, Admin
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s what&apos;s happening at your salon today.
          </p>
        </div>
        <button
          className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:inline-flex"
          type="button"
        >
          <CalendarDays aria-hidden="true" className="size-4" />
          Add appointment
        </button>
      </header>

      <div className="grid shrink-0 grid-cols-2 gap-3 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              className="rounded-xl border border-slate-100 bg-slate-50 p-4 shadow-sm"
              key={card.label}
            >
              <div className="flex items-start justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
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

      <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.6fr)]">
        <section className="min-h-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold">Today&apos;s appointments</h2>
              <p className="mt-1 text-xs text-slate-500">Your upcoming schedule</p>
            </div>
            <button
              className="text-sm font-semibold text-primary hover:underline"
              type="button"
            >
              View all
            </button>
          </div>
          <div className="overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3" scope="col">Time</th>
                  <th className="px-5 py-3" scope="col">Customer</th>
                  <th className="hidden px-5 py-3 sm:table-cell" scope="col">Service</th>
                  <th className="hidden px-5 py-3 md:table-cell" scope="col">Staff</th>
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
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
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
          <p className="mt-8 text-3xl font-semibold">$18,460</p>
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
