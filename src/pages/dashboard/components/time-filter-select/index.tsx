import { Filter } from "lucide-react";
import type { TimeFilterSelectProps } from "../../../../interface/dashboard.types";

export function TimeFilterSelect<T extends string>({
  value,
  onChange,
  options = [],
  ariaLabel = "Filter time period",
  className = "",
}: TimeFilterSelectProps<T>) {
  return (
    <div className={`relative inline-flex items-center gap-1 ${className}`}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-7 cursor-pointer appearance-none bg-transparent pr-5 text-xs font-bold text-sky-800 transition hover:text-sky-950 focus:outline-hidden"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white text-slate-800">
            {opt.label}
          </option>
        ))}
      </select>
      <Filter
        aria-hidden="true"
        className="pointer-events-none absolute right-0 size-3.5 text-sky-800"
      />
    </div>
  );
}

export default TimeFilterSelect;
