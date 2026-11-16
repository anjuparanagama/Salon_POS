import type { ComponentType } from "react";

export type SettingsSectionId =
  | "general"
  | "appointments"
  | "staff"
  | "layout"
  | "notifications"
  | "categories"
  | "referrals"
  | "shared-web";

export interface SettingsCardItem {
  id: SettingsSectionId;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean | "true" | "false" }>;
  bannerBg: string;
  badgeBg: string;
  accentColor: string;
  borderColor: string;
  badgeBorder: string;
}

export interface BusinessHourItem {
  day_of_week: number;
  day_name: string;
  opening_time: string;
  closing_time: string;
  is_closed: boolean;
}

export interface BusinessHourUpdateItem {
  day_of_week: number;
  opening_time?: string;
  closing_time?: string;
  is_closed?: boolean;
}

export interface GeneralSettingsState {
  salonName: string;
  phone: string;
  email: string;
  address: string;
  logoUrl?: string | null;
  currency: string;
  taxRate: number;
  timeZone: string;
  language?: string;
  openingTime: string;
  closingTime: string;
  businessHours?: BusinessHourItem[];
  updatedAt?: string;
}

export interface GeneralSettingsApiResponse {
  salon_id: string;
  salon_name: string;
  phone: string;
  email: string;
  address: string;
  logo_url?: string | null;
  currency: string;
  tax_rate: number;
  time_zone: string;
  language: string;
  opening_time: string;
  closing_time: string;
  business_hours: BusinessHourItem[];
  updated_at?: string;
}

export interface GeneralSettingsUpdateRequest {
  salon_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo_url?: string | null;
  currency?: string;
  tax_rate?: number;
  time_zone?: string;
  language?: string;
  opening_time?: string;
  closing_time?: string;
  business_hours?: BusinessHourUpdateItem[];
}
