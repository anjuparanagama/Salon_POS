import type { UserProfile, UserProfileDropdownProps } from "../../interface/user.types";

const defaultUser: UserProfile = {
  name: "Amanda Ray",
  role: "Salon Manager",
  initials: "AR",
  isOnline: true,
};

export function UserProfileDropdown({
  user = defaultUser,
  className = "",
}: UserProfileDropdownProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        title={user.name}
        aria-label={`User profile for ${user.name}`}
        className="flex items-center gap-2 rounded-full py-0.5 pl-0.5 pr-2 select-none"
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
          <span className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight">
            {user.name}
          </span>
          {user.role && (
            <span className="text-[11px] text-slate-400 font-normal">
              {user.role}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfileDropdown;
