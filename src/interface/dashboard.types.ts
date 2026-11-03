import type { ComponentType, SVGProps } from "react";

export type SummaryCardItem = {
  label: string;
  value: string;
  change: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export type RecentAppointment = {
  time: string;
  customer: string;
  service: string;
  staff: string;
};

