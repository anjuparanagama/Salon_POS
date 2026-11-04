import type { ReactNode } from "react";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  placement?: TooltipPlacement;
  arrow?: boolean;
  className?: string;
  tooltipClassName?: string;
  disabled?: boolean;
};

