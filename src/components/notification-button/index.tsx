import { Bell } from "lucide-react";

export type NotificationButtonProps = {
  hasNotification?: boolean;
  notificationCount?: number;
  onClick?: () => void;
  className?: string;
  title?: string;
};

export function NotificationButton({
  hasNotification = false,
  notificationCount,
  onClick,
  className = "",
  title = "Notifications",
}: NotificationButtonProps) {
  const showDot = hasNotification || (notificationCount !== undefined && notificationCount > 0);

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={[
        "relative flex size-8 sm:size-8.5 items-center justify-center rounded-full bg-[#FDF2F7] text-[#D9145A] hover:bg-[#FCE8F0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9145A] cursor-pointer",
        className,
      ].join(" ")}
    >
      <Bell aria-hidden="true" className="size-3.5 sm:size-4" strokeWidth={2.25} />
      {showDot && (
        <span
          className="absolute top-1.5 right-2 size-2 rounded-full bg-[#D9145A] ring-2 ring-white"
          aria-label={notificationCount ? `${notificationCount} unread notifications` : "New notifications"}
        />
      )}
    </button>
  );
}

export default NotificationButton;

