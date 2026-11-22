import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "rectangular" | "circular" | "rounded" | "text";
}

/**
 * Atomic Skeleton component with a smooth, continuous gradient shimmer.
 */
export function Skeleton({
  className = "",
  variant = "rounded",
  ...props
}: SkeletonProps) {
  const variantStyles = {
    rectangular: "rounded-none",
    rounded: "rounded-lg",
    circular: "rounded-full",
    text: "rounded-md h-3.5",
  };

  return (
    <div
      className={`skeleton-shimmer ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}

/**
 * Exact replica of the user's mockup:
 * - Left side: 2 distinct content cards with avatar circles, title lines, and multiple content bars.
 * - Right side: Panel with title bar, divider, and a grid of chip / button placeholders.
 */
export function SplitViewSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 w-full ${className}`}>
      {/* Left Column (2 Cols on lg) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Card 1 */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs flex flex-col gap-5">
          {/* Avatar + Title Row */}
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" className="size-12 shrink-0" />
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <Skeleton className="h-4 w-44 rounded-md" />
              <Skeleton className="h-3 w-28 rounded-md opacity-80" />
            </div>
          </div>

          {/* Horizontal Text Bars */}
          <div className="flex flex-col gap-2.5 pt-1">
            <Skeleton className="h-3.5 w-full rounded-md" />
            <Skeleton className="h-3.5 w-[92%] rounded-md" />
            <Skeleton className="h-3.5 w-[76%] rounded-md" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs flex flex-col gap-5">
          {/* Avatar + Title Row */}
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" className="size-12 shrink-0" />
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <Skeleton className="h-4 w-48 rounded-md" />
              <Skeleton className="h-3 w-32 rounded-md opacity-80" />
            </div>
          </div>

          {/* Horizontal Text Bars */}
          <div className="flex flex-col gap-2.5 pt-1">
            <Skeleton className="h-3.5 w-full rounded-md" />
            <Skeleton className="h-3.5 w-[88%] rounded-md" />
            <Skeleton className="h-3.5 w-[65%] rounded-md" />
          </div>
        </div>
      </div>

      {/* Right Column (1 Col on lg) */}
      <div className="flex flex-col">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3 w-16 rounded-md opacity-70" />
          </div>

          <div className="border-t border-slate-100" />

          {/* Grid of Chip / Button Skeletons (3x2 grid) */}
          <div className="grid grid-cols-3 gap-2.5">
            <Skeleton className="h-9 rounded-xl" />
            <Skeleton className="h-9 rounded-xl" />
            <Skeleton className="h-9 rounded-xl" />
            <Skeleton className="h-9 rounded-xl" />
            <Skeleton className="h-9 rounded-xl" />
            <Skeleton className="h-9 rounded-xl" />
          </div>

          {/* Secondary Action / Info Skeletons */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
          </div>

          {/* Bottom details placeholder */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <Skeleton className="h-3 w-full rounded-md opacity-70" />
            <Skeleton className="h-3 w-3/4 rounded-md opacity-70" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Table Skeleton:
 * Mimics high-end data tables (Appointments, Customers, Staff, Ledger, etc.).
 */
export function TableSkeleton({
  rows = 5,
  columns = 5,
  className = "",
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/70 bg-white shadow-xs overflow-hidden ${className}`}
    >
      {/* Table Header Filter / Search Toolbar Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-100 bg-slate-50/40">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-5 gap-4 px-6 py-3.5 border-b border-slate-100 bg-slate-50/60">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-3.5 w-20 rounded-md" />
        ))}
      </div>

      {/* Row Items */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="grid grid-cols-5 gap-4 px-6 py-4 items-center">
            {/* Primary cell: Avatar / Title */}
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" className="size-8 shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <Skeleton className="h-3.5 w-24 rounded-md" />
                <Skeleton className="h-2.5 w-16 rounded-md opacity-70" />
              </div>
            </div>

            {/* Other cell columns */}
            <Skeleton className="h-3.5 w-28 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-3.5 w-24 rounded-md" />
            <div className="flex justify-end gap-2">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Single Card Skeleton:
 * Mimics Service and Product Card designs (Image, Badges, Title, Desc, Price/Actions).
 */
export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border border-slate-100 bg-white p-4 shadow-xs flex flex-col justify-between overflow-hidden ${className}`}
    >
      <div>
        {/* Cover Image Placeholder */}
        <div className="relative mb-3 aspect-[16/10] w-full overflow-hidden rounded-lg">
          <Skeleton className="size-full rounded-lg" />
        </div>

        {/* Badges Row */}
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton variant="circular" className="size-2.5" />
        </div>

        {/* Title and description */}
        <div className="mt-2.5 flex flex-col gap-1.5">
          <Skeleton className="h-4 w-40 rounded-md" />
          <Skeleton className="h-3 w-full rounded-md opacity-70" />
          <Skeleton className="h-3 w-3/4 rounded-md opacity-70" />
        </div>
      </div>

      {/* Footer: Price / Duration + Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-16 rounded-md opacity-70" />
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="size-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * Card Grid Skeleton:
 * Mimics card catalogs (Services, Products, Staff Grid).
 */
export function CardGridSkeleton({
  count = 6,
  showTabs = false,
  className = "",
}: {
  count?: number;
  showTabs?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {/* Category Tabs / Filter Row Skeleton (optional) */}
      {showTabs && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Skeleton className="h-9 w-20 rounded-full shrink-0" />
          <Skeleton className="h-9 w-24 rounded-full shrink-0" />
          <Skeleton className="h-9 w-28 rounded-full shrink-0" />
          <Skeleton className="h-9 w-24 rounded-full shrink-0" />
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Stat Card Skeleton:
 * Mimics individual KPI metrics card (Total Services, Active Products, etc.).
 */
export function StatCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full min-w-0 flex h-24 items-center justify-between rounded-2xl bg-white px-5 py-4 border border-slate-100 shadow-xs ${className}`}
    >
      <div className="flex flex-col min-w-0 flex-1 pr-3 justify-center gap-2">
        <Skeleton className="h-3.5 w-24 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>
      <Skeleton variant="circular" className="size-11 shrink-0" />
    </div>
  );
}

/**
 * Stat Cards Grid Skeleton:
 * 4-column responsive grid of stat cards.
 */
export function StatCardsGridSkeleton({
  count = 4,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Form / Settings Skeleton:
 * Mimics General Settings, Staff Permissions, Category Editor forms.
 */
export function FormSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-6 max-w-4xl ${className}`}>
      {/* Profile Card */}
      <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs flex flex-col gap-6">
        <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-4">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-3.5 w-72 rounded-md opacity-70" />
        </div>

        {/* Logo Upload Box Skeleton */}
        <div className="flex items-center gap-5 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <Skeleton className="size-20 rounded-2xl shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-3 w-64 rounded-md opacity-70" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-8 w-28 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        </div>

        {/* 2-Column Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/**
 * Dashboard Skeleton:
 * Top summary cards + Chart placeholders + Breakdown cards.
 */
export function DashboardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xs flex items-center justify-between gap-4"
          >
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-3 w-20 rounded-md opacity-70" />
              <Skeleton className="h-7 w-28 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-md opacity-70" />
            </div>
            <Skeleton variant="circular" className="size-12 shrink-0" />
          </div>
        ))}
      </div>

      {/* 2 Chart Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-7 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-7 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
