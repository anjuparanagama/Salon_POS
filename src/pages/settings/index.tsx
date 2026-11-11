import { useSearchParams } from "react-router";
import {
  ArrowLeft,
  BellRing,
  CalendarClock,
  FolderTree,
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
import CategorySettingsView from "./components/category-settings";
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
  {
    id: "categories",
    title: "Category Settings",
    description: "Manage product categories and salon service categories, classifications, and active states.",
    icon: FolderTree,
    bannerBg: "bg-[#E6F8F0]",
    badgeBg: "bg-white text-emerald-600",
    badgeBorder: "border border-emerald-100",
    accentColor: "text-emerald-600 hover:text-emerald-700",
    borderColor: "hover:border-emerald-300",
  },
];

export function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read section from query params (?section=categories / staff / general / etc.)
  const rawSection = searchParams.get("section") as SettingsSectionId | null;
  const isValidSection = rawSection && SETTINGS_ITEMS.some((item) => item.id === rawSection);
  const activeSection: SettingsSectionId | null = isValidSection ? rawSection : null;

  // Read active tab from query params (?tab=...)
  const rawTab = searchParams.get("tab");

  const staffTab: "roles" | "permissions" | "policies" =
    rawTab === "permissions" || rawTab === "policies" ? rawTab : "roles";

  const categoryTab: "product" | "service" =
    rawTab === "service" ? "service" : "product";

  const generalTab: "profile" | "financial" | "operations" =
    rawTab === "financial" || rawTab === "operations" ? rawTab : "profile";

  const activeItem = SETTINGS_ITEMS.find((item) => item.id === activeSection);

  const handleSelectSection = (id: SettingsSectionId) => {
    if (id === "categories") {
      setSearchParams({ section: id, tab: categoryTab });
    } else if (id === "staff") {
      setSearchParams({ section: id, tab: staffTab });
    } else if (id === "general") {
      setSearchParams({ section: id, tab: generalTab });
    } else {
      setSearchParams({ section: id });
    }
  };

  const handleBackToSettings = () => {
    setSearchParams({});
  };

  const setStaffTab = (tab: "roles" | "permissions" | "policies") => {
    setSearchParams({ section: "staff", tab });
  };

  const setCategoryTab = (tab: "product" | "service") => {
    setSearchParams({ section: "categories", tab });
  };

  const setGeneralTab = (tab: "profile" | "financial" | "operations") => {
    setSearchParams({ section: "general", tab });
  };

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
        centerContent={
          activeSection === "staff" ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStaffTab("roles")}
                className={`rounded-full px-5 py-1.5 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  staffTab === "roles"
                    ? "border border-primary text-primary bg-primary-subtle/50 shadow-2xs font-semibold ring-1 ring-primary/20"
                    : "border border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary bg-white"
                }`}
              >
                Staff Roles
              </button>
              <button
                type="button"
                onClick={() => setStaffTab("permissions")}
                className={`rounded-full px-5 py-1.5 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  staffTab === "permissions"
                    ? "border border-primary text-primary bg-primary-subtle/50 shadow-2xs font-semibold ring-1 ring-primary/20"
                    : "border border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary bg-white"
                }`}
              >
                Permission Matrix
              </button>
              <button
                type="button"
                onClick={() => setStaffTab("policies")}
                className={`rounded-full px-5 py-1.5 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  staffTab === "policies"
                    ? "border border-primary text-primary bg-primary-subtle/50 shadow-2xs font-semibold ring-1 ring-primary/20"
                    : "border border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary bg-white"
                }`}
              >
                Login & Shift Policies
              </button>
            </div>
          ) : activeSection === "categories" ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCategoryTab("product")}
                className={`rounded-full px-5 py-1.5 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  categoryTab === "product"
                    ? "border border-primary text-primary bg-primary-subtle/50 shadow-2xs font-semibold ring-1 ring-primary/20"
                    : "border border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary bg-white"
                }`}
              >
                Product Categories
              </button>
              <button
                type="button"
                onClick={() => setCategoryTab("service")}
                className={`rounded-full px-5 py-1.5 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  categoryTab === "service"
                    ? "border border-primary text-primary bg-primary-subtle/50 shadow-2xs font-semibold ring-1 ring-primary/20"
                    : "border border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary bg-white"
                }`}
              >
                Service Categories
              </button>
            </div>
          ) : activeSection === "general" ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGeneralTab("profile")}
                className={`rounded-full px-5 py-1.5 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  generalTab === "profile"
                    ? "border border-primary text-primary bg-primary-subtle/50 shadow-2xs font-semibold ring-1 ring-primary/20"
                    : "border border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary bg-white"
                }`}
              >
                Salon Profile
              </button>
              <button
                type="button"
                onClick={() => setGeneralTab("financial")}
                className={`rounded-full px-5 py-1.5 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  generalTab === "financial"
                    ? "border border-primary text-primary bg-primary-subtle/50 shadow-2xs font-semibold ring-1 ring-primary/20"
                    : "border border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary bg-white"
                }`}
              >
                Financial Preference
              </button>
              <button
                type="button"
                onClick={() => setGeneralTab("operations")}
                className={`rounded-full px-5 py-1.5 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  generalTab === "operations"
                    ? "border border-primary text-primary bg-primary-subtle/50 shadow-2xs font-semibold ring-1 ring-primary/20"
                    : "border border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary bg-white"
                }`}
              >
                Daily Operations
              </button>
            </div>
          ) : undefined
        }
        actions={
          activeSection ? (
            <button
              type="button"
              onClick={handleBackToSettings}
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
              onClick={(id) => handleSelectSection(id)}
            />
          ))}
        </div>
      ) : (
        /* Detail View */
        <div className="flex flex-col gap-5">
          {/* Active Settings Detail Form */}
          {activeSection === "general" && (
            <GeneralSettingsView activeTab={generalTab} onTabChange={setGeneralTab} />
          )}
          {activeSection === "appointments" && <AppointmentsSettingsView />}
          {activeSection === "staff" && (
            <StaffSettingsView activeTab={staffTab} onTabChange={setStaffTab} />
          )}
          {activeSection === "layout" && <LayoutSettingsView />}
          {activeSection === "notifications" && <NotificationSettingsView />}
          {activeSection === "categories" && (
            <CategorySettingsView activeTab={categoryTab} onTabChange={setCategoryTab} />
          )}
        </div>
      )}
    </div>
  );
}

export default Settings;

