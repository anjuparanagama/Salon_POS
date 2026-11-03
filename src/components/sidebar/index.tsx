import { useState, useEffect, type ComponentType, type SVGProps } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CircleHelp,
  Clock,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";

type SidebarIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type SidebarItem = {
  label: string;
  href: string;
  icon: SidebarIcon;
};

export type SidebarProps = {
  items?: SidebarItem[];
  activeHref?: string;
  onNavigate?: (item: SidebarItem) => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onLogoutClick?: () => void;
  settingsHref?: string;
  helpHref?: string;
  logoutHref?: string;
};

const defaultItems: SidebarItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Appointments", href: "/appointments", icon: CalendarDays },
  { label: "Services", href: "/services", icon: ClipboardList },
];

export function Sidebar({
  activeHref = "/appointments",
  items = defaultItems,
  onNavigate,
  onSettingsClick,
  onHelpClick,
  onLogoutClick,
  settingsHref = "/settings",
  helpHref = "/help",
  logoutHref = "/logout",
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [userCarouselIndex, setUserCarouselIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const activeIndex = items.findIndex((item) => item.href === activeHref);
  const hasActiveItem = activeIndex !== -1;
  const activeItem = hasActiveItem ? items[activeIndex] : null;
  const beforeActive = hasActiveItem ? items.slice(0, activeIndex) : items;
  const afterActive = hasActiveItem ? items.slice(activeIndex + 1) : [];

  const isSettingsActive = activeHref === settingsHref;
  const isHelpActive = activeHref === helpHref;

  const defaultBottomIndex = isSettingsActive ? 0 : isHelpActive ? 1 : 0;
  const carouselIndex = userCarouselIndex ?? defaultBottomIndex;

  const handleSettings = (e: React.MouseEvent) => {
    if (onSettingsClick) {
      e.preventDefault();
      onSettingsClick();
    } else if (onNavigate) {
      e.preventDefault();
      onNavigate({ label: "Settings", href: settingsHref, icon: Settings });
    }
  };

  const handleHelp = (e: React.MouseEvent) => {
    if (onHelpClick) {
      e.preventDefault();
      onHelpClick();
    } else if (onNavigate) {
      e.preventDefault();
      onNavigate({ label: "Help", href: helpHref, icon: CircleHelp });
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    if (onLogoutClick) {
      e.preventDefault();
      onLogoutClick();
    } else if (onNavigate) {
      e.preventDefault();
      onNavigate({ label: "Logout", href: logoutHref, icon: LogOut });
    }
  };

  const bottomActions = [
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: settingsHref,
      isActive: isSettingsActive,
      onClick: handleSettings,
    },
    {
      id: "help",
      label: "Help",
      icon: CircleHelp,
      href: helpHref,
      isActive: isHelpActive,
      onClick: handleHelp,
    },
    {
      id: "logout",
      label: "Logout",
      icon: LogOut,
      href: logoutHref,
      isActive: false,
      onClick: handleLogout,
      isDanger: true,
    },
  ];

  const handlePrevAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserCarouselIndex((carouselIndex - 1 + bottomActions.length) % bottomActions.length);
  };

  const handleNextAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserCarouselIndex((carouselIndex + 1) % bottomActions.length);
  };

  const currentAction = bottomActions[carouselIndex];

  const getBottomButtonClass = (isActive = false) =>
    [
      "group flex items-center justify-center rounded-xl transition-colors cursor-pointer",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
      "flex-col gap-1 py-2 px-1 text-center w-full",
      isActive
        ? "bg-white text-[#D9145A] font-semibold shadow-sm"
        : "text-white/80 hover:bg-white/10 hover:text-white",
    ].join(" ");

  const renderItem = (item: SidebarItem, active = false) => {
    const Icon = item.icon;

    return (
      <a
        aria-current={active ? "page" : undefined}
        aria-label={isCollapsed ? item.label : undefined}
        title={isCollapsed ? item.label : undefined}
        className={[
          "flex min-h-9 items-center whitespace-nowrap font-medium transition-colors",
          isCollapsed
            ? "flex-col justify-center text-[9px] gap-1 rounded-xl px-0 py-2 text-sm"
            : "gap-2 px-3 text-xs",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9145A] focus-visible:ring-inset",
          active
            ? isCollapsed
              ? "text-white"
              : "min-h w-[calc(100%+0.5rem)] rounded-l-full rounded-r-none bg-white text-[#D9145A]"
            : "rounded-xl text-white hover:bg-white/10",
        ].join(" ")}
        href={item.href}
        onClick={(e) => {
          if (onNavigate) {
            e.preventDefault();
            onNavigate(item);
          }
        }}
      >
        <span
          className={[
            "flex shrink-0 items-center justify-center",
            isCollapsed ? "size-8 rounded-full bg-[#B31350]" : "size-4",
          ].join(" ")}
        >
          <Icon
            aria-hidden="true"
            className={isCollapsed ? "size-4" : "size-4"}
            strokeWidth={active ? 2.25 : 2}
          />
        </span>
        <span>{item.label}</span>
      </a>
    );
  };

  return (
    <aside
      className={[
        "ml-1 flex h-screen min-w-0 shrink-0 flex-col overflow-visible transition-[width] duration-200",
        isCollapsed ? "w-20" : "w-[max(13.2857vw,13rem)] bg-white",
      ].join(" ")}
    >
      <nav aria-label="Main navigation" className="flex h-full flex-col">
        <ul
          className={[
            "bg-[#D9145A] px-2 text-white",
            !isCollapsed && activeItem ? "rounded-br-xl" : "",
          ].join(" ")}
        >
          <li className="flex min-h-14 items-center justify-between gap-2 px-2">
            <span
              aria-label="Sribees POS"
              className={[
                "font-semibold tracking-tight",
                isCollapsed ? "mx-auto text-base" : "truncate text-lg",
              ].join(" ")}
            >
              {isCollapsed ? "S" : "Sribees POS"}
            </span>
            <button
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="shrink-0 rounded-xl p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              onClick={() => setIsCollapsed((collapsed) => !collapsed)}
              type="button"
            >
              {isCollapsed ? (
                <PanelLeftOpen aria-hidden="true" className="size-4" />
              ) : (
                <PanelLeftClose aria-hidden="true" className="size-4" />
              )}
            </button>
          </li>
          <div className="mb-3 border-b border-slate-50/5" />
          <div className="flex flex-col gap-1">
            {beforeActive.map((item) => (
              <li key={item.href} className="list-none">
                {renderItem(item)}
              </li>
            ))}
          </div>
        </ul>

        {activeItem && (
          <div
            className={[
              "relative z-10 bg-[#D9145A]",
              isCollapsed ? "px-2" : "pl-2",
            ].join(" ")}
          >
            {renderItem(activeItem, true)}
          </div>
        )}

        <div
          className={[
            "flex flex-1 flex-col justify-between bg-[#D9145A] px-2 pb-3 text-white",
            !isCollapsed && activeItem ? "rounded-tr-xl" : "",
          ].join(" ")}
        >
          <ul className="flex flex-col gap-1">
            {afterActive.map((item) => (
              <li key={item.href}>{renderItem(item)}</li>
            ))}
          </ul>

          {/* Bottom container: Date/Time (single line) + Divider + Action Buttons */}
          <div className="mt-auto pt-2">
            {/* Current Date and Time - Single Line without Year or Seconds */}
            <div
              className={[
                "flex items-center rounded-lg bg-white/10 px-2.5 py-1.5 text-white transition-all",
                isCollapsed ? "justify-center px-1" : "justify-between",
              ].join(" ")}
              title={`${formattedDate} • ${formattedTime}`}
            >
              {!isCollapsed && (
                <span className="text-[11px] font-medium text-white/80 whitespace-nowrap">
                  {formattedDate}
                </span>
              )}
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white tabular-nums whitespace-nowrap">
                <Clock
                  aria-hidden="true"
                  className="size-3 text-white/70 shrink-0"
                />
                <span className={isCollapsed ? "text-[10px]" : "text-[11px]"}>
                  {formattedTime}
                </span>
              </div>
            </div>

            {/* Border line separating Date/Time from Action Buttons */}
            <div className="my-2 border-t border-white/10" />

            {/* Bottom buttons: Carousel when collapsed, 3-button row when expanded */}
            {isCollapsed ? (
              <div className="flex flex-col items-center justify-center gap-1 w-full">
                <div className="flex items-center justify-between w-full px-0.5">
                  {/* Previous Arrow Button */}
                  <button
                    type="button"
                    title="Previous"
                    aria-label="Previous action"
                    onClick={handlePrevAction}
                    className="flex size-5 items-center justify-center rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer"
                  >
                    <ChevronLeft aria-hidden="true" className="size-3.5" />
                  </button>

                  {/* Single Action Icon Button (Carousel Active Item) */}
                  {currentAction.id === "logout" ? (
                    <button
                      type="button"
                      title={currentAction.label}
                      aria-label={currentAction.label}
                      onClick={currentAction.onClick}
                      className={[
                        "flex size-8 items-center justify-center rounded-xl transition-colors cursor-pointer",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                        currentAction.isActive
                          ? "bg-white text-[#D9145A] font-semibold shadow-sm"
                          : "text-white/80 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                    >
                      <currentAction.icon
                        aria-hidden="true"
                        className="size-4"
                        strokeWidth={2}
                      />
                    </button>
                  ) : (
                    <a
                      href={currentAction.href}
                      title={currentAction.label}
                      aria-label={currentAction.label}
                      aria-current={currentAction.isActive ? "page" : undefined}
                      onClick={currentAction.onClick}
                      className={[
                        "flex size-8 items-center justify-center rounded-xl transition-colors cursor-pointer",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                        currentAction.isActive
                          ? "bg-white text-[#D9145A] font-semibold shadow-sm"
                          : "text-white/80 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                    >
                      <currentAction.icon
                        aria-hidden="true"
                        className="size-4"
                        strokeWidth={currentAction.isActive ? 2.25 : 2}
                      />
                    </a>
                  )}

                  {/* Next Arrow Button */}
                  <button
                    type="button"
                    title="Next"
                    aria-label="Next action"
                    onClick={handleNextAction}
                    className="flex size-5 items-center justify-center rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer"
                  >
                    <ChevronRight aria-hidden="true" className="size-3.5" />
                  </button>
                </div>

                {/* Carousel Indicator Dots */}
                <div className="flex items-center justify-center gap-1">
                  {bottomActions.map((action, idx) => (
                    <button
                      key={action.id}
                      type="button"
                      title={action.label}
                      aria-label={`Go to ${action.label}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserCarouselIndex(idx);
                      }}
                      className={[
                        "h-1 rounded-full transition-all duration-200 cursor-pointer",
                        idx === carouselIndex
                          ? "w-2.5 bg-white"
                          : "w-1 bg-white/30 hover:bg-white/60",
                      ].join(" ")}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Expanded: All 3 buttons in a single row */
              <div className="grid grid-cols-3 gap-1">
                {bottomActions.map((action) => {
                  const Icon = action.icon;
                  const isLogout = action.id === "logout";

                  return isLogout ? (
                    <button
                      key={action.id}
                      type="button"
                      title={action.label}
                      aria-label={action.label}
                      onClick={action.onClick}
                      className={getBottomButtonClass(false)}
                    >
                      <Icon
                        aria-hidden="true"
                        className="size-4"
                        strokeWidth={2}
                      />
                      <span className="truncate text-[10px] font-medium leading-none tracking-tight">
                        {action.label}
                      </span>
                    </button>
                  ) : (
                    <a
                      key={action.id}
                      href={action.href}
                      title={action.label}
                      aria-label={action.label}
                      aria-current={action.isActive ? "page" : undefined}
                      onClick={action.onClick}
                      className={getBottomButtonClass(action.isActive)}
                    >
                      <Icon
                        aria-hidden="true"
                        className="size-4"
                        strokeWidth={action.isActive ? 2.25 : 2}
                      />
                      <span className="truncate text-[10px] font-medium leading-none tracking-tight">
                        {action.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
