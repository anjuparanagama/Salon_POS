import type { ComponentType, SVGProps } from "react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  isCurrent?: boolean;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  onItemClick?: (item: BreadcrumbItem) => void;
  className?: string;
};

