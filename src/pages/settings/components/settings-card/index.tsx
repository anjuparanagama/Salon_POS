import { ArrowRight } from "lucide-react";
import type { SettingsCardItem } from "../../types";

export interface SettingsCardProps {
  item: SettingsCardItem;
  onClick: (id: SettingsCardItem["id"]) => void;
}

export function SettingsCard({ item, onClick }: SettingsCardProps) {
  const Icon = item.icon;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(item.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(item.id);
        }
      }}
      className={[
        "group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-200 cursor-pointer select-none",
        "hover:shadow-md hover:-translate-y-0.5",
        item.borderColor,
      ].join(" ")}
    >
      {/* Top Banner with soft pastel background and center icon badge */}
      <div
        className={`flex h-28 sm:h-32 w-full items-center justify-center transition-colors ${item.bannerBg}`}
      >
        <div
          className={`flex size-12 sm:size-13 items-center justify-center rounded-2xl shadow-xs transition-transform duration-200 group-hover:scale-110 ${item.badgeBg} ${item.badgeBorder}`}
        >
          <Icon aria-hidden="true" className="size-5 sm:size-6" strokeWidth={2} />
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-4 sm:p-5 bg-white">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm sm:text-base font-bold tracking-tight text-slate-800 transition-colors group-hover:text-slate-950">
            {item.title}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Action Link: "Open →" */}
        <div
          className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors pt-0.5 ${item.accentColor}`}
        >
          <span>Open</span>
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
          />
        </div>
      </div>
    </div>
  );
}

export default SettingsCard;

