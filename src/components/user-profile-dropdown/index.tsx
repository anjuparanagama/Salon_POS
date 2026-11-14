import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import type { UserProfile, UserProfileDropdownProps } from "../../interface/user.types";
import { Button } from "../button";

const defaultUser: UserProfile = {
  name: "Amanda Ray",
  role: "Salon Manager",
  initials: "AR",
  isOnline: true,
};

export function UserProfileDropdown({
  user = defaultUser,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  className = "",
}: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (onProfileClick && !onSettingsClick && !onLogoutClick) {
      onProfileClick();
      return;
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        type="button"
        title={user.name}
        aria-label={`User profile for ${user.name}`}
        aria-expanded={isOpen}
        onClick={handleToggle}
        className="group flex items-center gap-2 rounded-full py-0.5 pl-0.5 pr-1 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9145A] cursor-pointer"
      >
        {/* Avatar with online status dot */}
        <div className="relative flex size-8 sm:size-8.5 shrink-0 items-center justify-center rounded-full bg-[#FCE8F0] text-[#D9145A] font-bold text-xs">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="size-full rounded-full object-cover"
            />
          ) : (
            <span>{user.initials || user.name.slice(0, 2).toUpperCase()}</span>
          )}
          {user.isOnline && (
            <span
              className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 ring-2 ring-white"
              title="Online"
              aria-label="Online status"
            />
          )}
        </div>

        {/* User Name & Role */}
        <div className="hidden sm:flex flex-col text-left leading-tight">
          <span className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight group-hover:text-slate-900 transition-colors">
            {user.name}
          </span>
          {user.role && (
            <span className="text-[11px] text-slate-400 font-normal">
              {user.role}
            </span>
          )}
        </div>

        {/* Dropdown Chevron */}
        <ChevronDown
          aria-hidden="true"
          className={`size-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg shadow-slate-200/50 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-800">{user.name}</p>
            {user.role && <p className="text-[11px] text-slate-400">{user.role}</p>}
          </div>

          <div className="py-1">
            <Button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onProfileClick?.();
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <User className="size-3.5 text-slate-400" />
              <span>My Profile</span>
            </Button>

            <Button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onSettingsClick?.();
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <Settings className="size-3.5 text-slate-400" />
              <span>Account Settings</span>
            </Button>
          </div>

          <div className="border-t border-slate-100 pt-1">
            <Button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogoutClick?.();
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="size-3.5 text-rose-500" />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfileDropdown;

