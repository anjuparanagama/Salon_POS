import { useState, useEffect } from "react";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  Package,
  Settings,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  X,
  CreditCard,
  ChevronRight,
  Download,
  Smartphone,
  Share,
  PlusSquare,
} from "lucide-react";
import { useAuth } from "../../context/use-auth";
import { usePwaInstall } from "../../hooks/usePwaInstall";
import type { SidebarItem } from "../../interface/routes.types";
import { ROUTES } from "../../routes/sidebar.routes";

export type BottomNavProps = {
  activeHref?: string;
  onNavigate?: (item: SidebarItem) => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  onPosClick?: () => void;
};

export function BottomNav({
  activeHref = "/dashboard",
  onNavigate,
  onSettingsClick,
  onLogoutClick,
  onPosClick,
}: BottomNavProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const { user } = useAuth();
  const { canInstall, isInstalled, isIos, promptInstall } = usePwaInstall();

  // Close more menu when route changes
  useEffect(() => {
    setIsMoreOpen(false);
  }, [activeHref]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isMoreOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMoreOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMoreOpen) {
        setIsMoreOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMoreOpen]);

  const handleTabClick = (item: SidebarItem) => {
    setIsMoreOpen(false);
    if (onNavigate) {
      onNavigate(item);
    }
  };

  const isMoreRouteActive = [
    ROUTES.CUSTOMERS,
    ROUTES.STAFF,
    ROUTES.LEDGER_INCOME,
    ROUTES.LEDGER_EXPENSES,
    ROUTES.LEDGER,
    ROUTES.SETTINGS,
  ].some((path) => activeHref === path || activeHref.startsWith(path));

  const mainTabs: Array<{
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
    isActive: boolean;
  }> = [
    {
      label: "Dashboard",
      href: ROUTES.DASHBOARD,
      icon: LayoutDashboard,
      isActive: activeHref === ROUTES.DASHBOARD,
    },
    {
      label: "Appt",
      href: ROUTES.APPOINTMENTS,
      icon: CalendarDays,
      isActive:
        activeHref === ROUTES.APPOINTMENTS ||
        activeHref.startsWith(ROUTES.APPOINTMENTS),
    },
    {
      label: "Services",
      href: ROUTES.SERVICES,
      icon: ClipboardList,
      isActive:
        activeHref === ROUTES.SERVICES ||
        activeHref.startsWith(ROUTES.SERVICES),
    },
    {
      label: "Products",
      href: ROUTES.PRODUCTS,
      icon: Package,
      isActive:
        activeHref === ROUTES.PRODUCTS ||
        activeHref.startsWith(ROUTES.PRODUCTS),
    },
  ];

  const moreMenuItems = [
    {
      label: "Customers",
      href: ROUTES.CUSTOMERS,
      icon: Users,
      description: "Client directory & visit history",
      badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      iconBg: "bg-pink-500/15 text-pink-400",
    },
    {
      label: "Staff",
      href: ROUTES.STAFF,
      icon: UserCheck,
      description: "Stylists, commissions & roster",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      iconBg: "bg-purple-500/15 text-purple-400",
    },
    {
      label: "Income",
      href: ROUTES.LEDGER_INCOME,
      icon: TrendingUp,
      description: "Sales, invoices & total revenue",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      iconBg: "bg-emerald-500/15 text-emerald-400",
    },
    {
      label: "Expenses",
      href: ROUTES.LEDGER_EXPENSES,
      icon: TrendingDown,
      description: "Operating costs & vendor payments",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      iconBg: "bg-amber-500/15 text-amber-400",
    },
    {
      label: "Settings",
      href: ROUTES.SETTINGS,
      icon: Settings,
      description: "Salon profile, receipts & preferences",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      iconBg: "bg-blue-500/15 text-blue-400",
    },
  ];

  return (
    <>
      {/* ============================================================ */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Visible strictly on < md screens) */}
      {/* ============================================================ */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 block md:hidden select-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(46, 4, 28, 0.96) 0%, rgba(29, 2, 18, 0.98) 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 -8px 30px rgba(0, 0, 0, 0.4)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-lg items-center justify-around px-2 pb-[env(safe-area-inset-bottom,0px)]">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const active = tab.isActive && !isMoreOpen;

            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => handleTabClick({ label: tab.label, href: tab.href, icon: tab.icon })}
                className="group relative flex flex-1 flex-col items-center justify-center py-1 transition-all duration-200 active:scale-90"
              >
                {/* Active Indicator Top Glow Bar */}
                {active && (
                  <span className="absolute -top-[1.25px] h-[3px] w-8 rounded-full bg-gradient-to-r from-[#D81B60] via-[#F06292] to-[#D81B60] shadow-[0_0_10px_#EC4899]" />
                )}

                {/* Tab Icon with active pill background */}
                <div
                  className={`flex h-8 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-[#D81B60] to-[#AD1457] text-white shadow-md shadow-pink-600/30 scale-105"
                      : "text-white/60 group-hover:text-white/80"
                  }`}
                >
                  <Icon className={`size-4.5 transition-transform duration-200 ${active ? "scale-105" : ""}`} />
                </div>

                {/* Tab Label */}
                <span
                  className={`mt-1 text-[10px] font-medium tracking-tight transition-colors duration-200 ${
                    active ? "font-bold text-pink-300" : "text-white/55"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* Tab 5: "More" button */}
          <button
            type="button"
            onClick={() => setIsMoreOpen((prev) => !prev)}
            className="group relative flex flex-1 flex-col items-center justify-center py-1 transition-all duration-200 active:scale-90"
            aria-expanded={isMoreOpen}
            aria-label="More navigation options"
          >
            {/* Active Indicator Top Glow Bar for More */}
            {(isMoreOpen || isMoreRouteActive) && (
              <span className="absolute -top-[1.25px] h-[3px] w-8 rounded-full bg-gradient-to-r from-[#D81B60] via-[#F06292] to-[#D81B60] shadow-[0_0_10px_#EC4899]" />
            )}

            {/* Tab Icon with active pill */}
            <div
              className={`relative flex h-8 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
                isMoreOpen || isMoreRouteActive
                  ? "bg-gradient-to-r from-[#D81B60] to-[#AD1457] text-white shadow-md shadow-pink-600/30 scale-105"
                  : "text-white/60 group-hover:text-white/80"
              }`}
            >
              <MoreHorizontal className="size-4.5" />
              {/* Little notification dot if active on one of the 'More' pages */}
              {isMoreRouteActive && !isMoreOpen && (
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-pink-400 ring-2 ring-[#2E041C]" />
              )}
            </div>

            <span
              className={`mt-1 text-[10px] font-medium tracking-tight transition-colors duration-200 ${
                isMoreOpen || isMoreRouteActive ? "font-bold text-pink-300" : "text-white/55"
              }`}
            >
              More
            </span>
          </button>
        </div>
      </nav>

      {/* ============================================================ */}
      {/* "MORE" BOTTOM SHEET DRAWER (Mobile) */}
      {/* ============================================================ */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 block md:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMoreOpen(false)}
            aria-hidden="true"
          />

          {/* Bottom Sheet Modal Container */}
          <div
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-[1.75rem] border-t border-white/10 bg-[#250319] text-white shadow-2xl transition-transform duration-300 ease-out"
            style={{
              boxShadow: "0 -20px 40px rgba(0, 0, 0, 0.6)",
            }}
          >
            {/* Drag Handle Bar */}
            <div className="flex w-full items-center justify-center pt-3 pb-1">
              <div className="h-1.25 w-12 rounded-full bg-white/25 hover:bg-white/40 cursor-grab transition-colors" />
            </div>

            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400">
                  <MoreHorizontal className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white">More Options</h3>
                  <p className="text-[11px] text-white/50">Salon administration & records</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white active:scale-95 transition-all"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
              {/* User / Salon Badge Pill */}
              <div className="flex items-center justify-between rounded-2xl bg-white/[0.04] p-3 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#D81B60] to-[#E91E63] text-sm font-black text-white shadow-md shadow-pink-900/40">
                    {user?.initials || (user?.name ? user.name.slice(0, 2).toUpperCase() : "AD")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{user?.name || "Admin"}</span>
                      <span className="inline-block size-2 rounded-full bg-emerald-400 ring-2 ring-[#250319]" />
                    </div>
                    <span className="text-[11px] font-medium text-pink-300/80">
                      {user?.role || "Salon Administrator"}
                    </span>
                  </div>
                </div>

                {onPosClick && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreOpen(false);
                      onPosClick();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D81B60] to-[#8B1447] px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-95 active:scale-95 transition-all"
                  >
                    <CreditCard className="size-3.5" />
                    <span>POS</span>
                  </button>
                )}
              </div>

              {/* Menu Items Grid / List */}
              <div className="space-y-1.5">
                {moreMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isCurrent =
                    activeHref === item.href ||
                    activeHref.startsWith(item.href);

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setIsMoreOpen(false);
                        if (item.label === "Settings" && onSettingsClick) {
                          onSettingsClick();
                        } else {
                          handleTabClick({ label: item.label, href: item.href, icon: item.icon });
                        }
                      }}
                      className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-all duration-200 active:scale-[0.98] ${
                        isCurrent
                          ? "bg-gradient-to-r from-pink-500/20 to-transparent border border-pink-500/30 text-white font-semibold"
                          : "hover:bg-white/5 text-white/80 hover:text-white border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-9 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${item.iconBg}`}
                        >
                          <Icon className="size-4.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold">{item.label}</span>
                            {isCurrent && (
                              <span className="inline-flex rounded-full bg-pink-500/30 px-1.5 py-0.2 text-[9px] font-bold text-pink-300">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-white/50">{item.description}</p>
                        </div>
                      </div>

                      <ChevronRight
                        className={`size-4 text-white/40 transition-transform duration-200 group-hover:translate-x-0.5 ${
                          isCurrent ? "text-pink-400" : ""
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* PWA Mobile Install Banner Tile (Visible if not yet installed in standalone mode) */}
              {!isInstalled && (canInstall || isIos) && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={async () => {
                      if (canInstall) {
                        await promptInstall();
                        setIsMoreOpen(false);
                      } else if (isIos) {
                        setShowIosGuide(true);
                      }
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-pink-500/30 bg-gradient-to-r from-pink-500/15 to-purple-500/15 px-3.5 py-2.5 text-pink-200 hover:bg-pink-500/25 active:scale-[0.98] transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#D81B60] to-[#E91E63] text-white shadow-md shadow-pink-900/40">
                        <Download className="size-4.5" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          Install Salora App
                          <span className="rounded-full bg-pink-500/30 px-1.5 py-0.2 text-[9px] font-bold text-pink-300">
                            PWA
                          </span>
                        </div>
                        <div className="text-[10px] text-pink-200/70">
                          Add to home screen for full-screen offline access
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-pink-300/60" />
                  </button>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-white/10 pt-2">
                {/* Logout Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    if (onLogoutClick) {
                      onLogoutClick();
                    }
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-300 hover:bg-red-500/20 hover:text-red-200 active:scale-[0.98] transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                      <LogOut className="size-4.5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold">Sign Out</div>
                      <div className="text-[10px] text-red-300/60">Log out from your current session</div>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-red-400/50" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari Installation Modal Guide inside Mobile Drawer */}
      {showIosGuide && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl text-slate-800 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-pink-50 text-[#D81B60]">
                  <Smartphone className="size-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Install Salora on iOS</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="size-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-[11px] font-bold text-[#D81B60]">
                  1
                </span>
                <p>
                  Tap the <strong className="text-slate-800 inline-flex items-center gap-1">Share <Share className="inline size-3.5 text-blue-500" /></strong> button in Safari's bottom toolbar.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-[11px] font-bold text-[#D81B60]">
                  2
                </span>
                <p>
                  Scroll down and tap <strong className="text-slate-800 inline-flex items-center gap-1">Add to Home Screen <PlusSquare className="inline size-3.5 text-slate-700" /></strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="w-full rounded-xl bg-[#8B1447] py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#6e0f37] transition active:scale-98"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default BottomNav;
