export interface SharedWebBusinessHour {
  day_of_week: number;
  day_name: string;
  opening_time: string;
  closing_time: string;
  is_closed: boolean;
}

export interface SharedWebHoliday {
  holiday_date: string;
  reason?: string | null;
}

export interface SharedWebStats {
  total_services: number;
  total_staff: number;
  rating: number;
  reviews_count: number;
}

export interface SharedWebSettingsState {
  id: string;
  name: string;
  slug: string;
  phone: string;
  email: string;
  address: string;
  logo_url: string;
  cover_image_url: string;
  description: string;
  timezone: string;
  currency: string;
  theme: string;
  primary_color: string;
  secondary_color: string;
  show_services: boolean;
  show_products: boolean;
  show_prices: boolean;
  allow_online_booking: boolean;
  booking_requires_approval: boolean;
  whatsapp_number: string;
  facebook_url: string;
  instagram_url: string;
  seo_title: string;
  seo_description: string;
  business_hours: SharedWebBusinessHour[];
  holidays: SharedWebHoliday[];
  is_open_now: boolean;
  today_hours: string;
  stats?: SharedWebStats | null;
  is_published: boolean;
  published_at?: string | null;
  public_url: string;
}

export interface SharedWebSettingsUpdateRequest {
  name?: string;
  slug?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo_url?: string | null;
  cover_image_url?: string | null;
  description?: string | null;
  timezone?: string;
  currency?: string;
  theme?: string;
  primary_color?: string;
  secondary_color?: string;
  show_services?: boolean;
  show_products?: boolean;
  show_prices?: boolean;
  allow_online_booking?: boolean;
  booking_requires_approval?: boolean;
  whatsapp_number?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  is_published?: boolean;
}
