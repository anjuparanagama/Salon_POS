import { useState } from "react";
import {
  ArrowLeft,
  BellRing,
  CalendarClock,
  LayoutTemplate,
  SlidersHorizontal,
  UserCog,
} from "lucide-react";
import Header from "../../components/header";
import SettingsCard from "./components/settings-card";
import GeneralSettingsView from "./components/general-settings";
import AppointmentsSettingsView from "./components/appointments-settings";
import StaffSettingsView from "./components/staff-settings";
import LayoutSettingsView from "./components/layout-settings";
import NotificationSettingsView from "./components/notification-settings";
import type { SettingsCardItem, SettingsSectionId } from "./types";

export const SETTINGS_ITEMS: SettingsCardItem[] = [
  {
    id: "general",
    title: "General Settings",
    description: "Salon profile, operating hours, currency, tax rates, and regional format.",
    icon: SlidersHorizontal,
    bannerBg: "bg-[#EEF4FF]",
    badgeBg: "bg-white text-blue-600",
    badgeBorder: "border border-blue-100",
    accentColor: "text-blue-600 hover:text-blue-700",
    borderColor: "hover:border-blue-300",
  },
  {
    id: "appointments",
    title: "Appointments Settings",
    description: "Booking rules, slot durations, buffer intervals, and cancellation policies.",
    icon: CalendarClock,
    bannerBg: "bg-[#FFF0F4]",
    badgeBg: "bg-white text-[#D9145A]",
    badgeBorder: "border border-rose-100",
    accentColor: "text-[#D9145A] hover:text-[#B31350]",
    borderColor: "hover:border-rose-300",
  },
  {
    id: "staff",
    title: "Staff Settings",
    description: "Staff role permissions, POS checkout access, login policies, and shift rules.",
    icon: UserCog,
    bannerBg: "bg-[#FFF9EB]",
    badgeBg: "bg-white text-amber-600",
    badgeBorder: "border border-amber-100",
    accentColor: "text-amber-600 hover:text-amber-700",
    borderColor: "hover:border-amber-300",
  },
  {
    id: "layout",
    title: "Layout Settings",
    description: "POS receipt templates, invoice branding, compact views, and print layouts.",
    icon: LayoutTemplate,
    bannerBg: "bg-[#F5F0FF]",
    badgeBg: "bg-white text-purple-600",
    badgeBorder: "border border-purple-100",
    accentColor: "text-purple-600 hover:text-purple-700",
    borderColor: "hover:border-purple-300",
  },
  {
    id: "notifications",
    title: "Notification Settings",
    description: "SMS reminders, automated booking confirmations, customer alerts, and email notifications.",
    icon: BellRing,
    bannerBg: "bg-[#FFF3EB]",
    badgeBg: "bg-white text-orange-600",
    badgeBorder: "border border-orange-100",
    accentColor: "text-orange-600 hover:text-orange-700",
    borderColor: "hover:border-orange-300",
  },
];

export function Settings() {
  const [activeSection, setActiveSection] = useState<SettingsSectionId | null>(null);

  const activeItem = SETTINGS_ITEMS.find((item) => item.id === activeSection);

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* Top Header */}
      <Header
        title={activeItem ? activeItem.title : "Settings"}
        description={
          activeItem
            ? activeItem.description
            : "Manage your salon configurations, appointments, staff policies, layouts, and notifications."
        }
        actions={
          activeSection ? (
            <button
              type="button"
              onClick={() => setActiveSection(null)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to all settings</span>
            </button>
          ) : undefined
        }
      />

      {/* Main View: Either Cards Grid OR Active Configuration View */}
      {!activeSection ? (
        /* Cards Grid Layout: 4 cards per row */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {SETTINGS_ITEMS.map((item) => (
            <SettingsCard
              key={item.id}
              item={item}
              onClick={(id) => setActiveSection(id)}
            />
          ))}
        </div>
      ) : (
        /* Detail View with Quick Navigation Tabs */
        <div className="flex flex-col gap-5">
          {/* Quick Tabs to toggle between the 5 settings */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200/80">
            {SETTINGS_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeSection;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={[
                    "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary text-white font-semibold shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")}
                >
                  <Icon className="size-3.5" />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Settings Detail Form */}
          {activeSection === "general" && <GeneralSettingsView />}
          {activeSection === "appointments" && <AppointmentsSettingsView />}
          {activeSection === "staff" && <StaffSettingsView />}
          {activeSection === "layout" && <LayoutSettingsView />}
          {activeSection === "notifications" && <NotificationSettingsView />}
        </div>
      )}
    </div>
  );
}

export default Settings;

