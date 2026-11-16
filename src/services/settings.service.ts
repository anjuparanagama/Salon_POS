import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../config/api.config";
import type {
  GeneralSettingsApiResponse,
  GeneralSettingsState,
  GeneralSettingsUpdateRequest,
} from "../interface/settings.types";

const LOCAL_STORAGE_KEY = "sribees_general_settings";

export const DEFAULT_GENERAL_SETTINGS: GeneralSettingsState = {
  salonName: "Sribees Luxury Salon & Spa",
  phone: "+94 77 123 4567",
  email: "contact@sribeessalon.com",
  address: "No. 42, Galle Road, Colombo 03, Sri Lanka",
  logoUrl: null,
  currency: "LKR (Rs.)",
  taxRate: 2.5,
  timeZone: "Asia/Colombo (GMT+5:30)",
  language: "en",
  openingTime: "09:00",
  closingTime: "20:00",
};

function mapApiResponseToState(data: GeneralSettingsApiResponse): GeneralSettingsState {
  return {
    salonName: data.salon_name || DEFAULT_GENERAL_SETTINGS.salonName,
    phone: data.phone || DEFAULT_GENERAL_SETTINGS.phone,
    email: data.email || DEFAULT_GENERAL_SETTINGS.email,
    address: data.address || DEFAULT_GENERAL_SETTINGS.address,
    logoUrl: data.logo_url || null,
    currency: data.currency || DEFAULT_GENERAL_SETTINGS.currency,
    taxRate: typeof data.tax_rate === "number" ? data.tax_rate : DEFAULT_GENERAL_SETTINGS.taxRate,
    timeZone: data.time_zone || DEFAULT_GENERAL_SETTINGS.timeZone,
    language: data.language || DEFAULT_GENERAL_SETTINGS.language,
    openingTime: data.opening_time || DEFAULT_GENERAL_SETTINGS.openingTime,
    closingTime: data.closing_time || DEFAULT_GENERAL_SETTINGS.closingTime,
    businessHours: data.business_hours,
    updatedAt: data.updated_at,
  };
}

function mapStateToUpdateRequest(state: Partial<GeneralSettingsState>): GeneralSettingsUpdateRequest {
  const req: GeneralSettingsUpdateRequest = {};
  if (state.salonName !== undefined) req.salon_name = state.salonName;
  if (state.phone !== undefined) req.phone = state.phone;
  if (state.email !== undefined) req.email = state.email;
  if (state.address !== undefined) req.address = state.address;
  if (state.logoUrl !== undefined) req.logo_url = state.logoUrl;
  if (state.currency !== undefined) req.currency = state.currency;
  if (state.taxRate !== undefined) req.tax_rate = state.taxRate;
  if (state.timeZone !== undefined) req.time_zone = state.timeZone;
  if (state.language !== undefined) req.language = state.language;
  if (state.openingTime !== undefined) req.opening_time = state.openingTime;
  if (state.closingTime !== undefined) req.closing_time = state.closingTime;
  if (state.businessHours !== undefined) {
    req.business_hours = state.businessHours.map((bh) => ({
      day_of_week: bh.day_of_week,
      opening_time: bh.opening_time,
      closing_time: bh.closing_time,
      is_closed: bh.is_closed,
    }));
  }
  return req;
}

export const settingsService = {
  async getGeneralSettings(): Promise<GeneralSettingsState> {
    try {
      const res = await apiClient.get<GeneralSettingsApiResponse>(
        API_ENDPOINTS.SETTINGS.GENERAL
      );
      const mapped = mapApiResponseToState(res.data);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mapped));
      } catch {
        // ignore storage errors
      }
      return mapped;
    } catch (err) {
      console.warn("Failed fetching general settings from backend API, using local cache:", err);
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) return JSON.parse(cached);
      } catch {
        // ignore
      }
      return DEFAULT_GENERAL_SETTINGS;
    }
  },

  async updateGeneralSettings(
    payload: Partial<GeneralSettingsState>
  ): Promise<GeneralSettingsState> {
    const updateBody = mapStateToUpdateRequest(payload);
    const res = await apiClient.put<GeneralSettingsApiResponse>(
      API_ENDPOINTS.SETTINGS.GENERAL,
      updateBody
    );
    const mapped = mapApiResponseToState(res.data);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mapped));
    } catch {
      // ignore storage errors
    }
    return mapped;
  },

  async resetGeneralSettings(): Promise<GeneralSettingsState> {
    const res = await apiClient.post<GeneralSettingsApiResponse>(
      API_ENDPOINTS.SETTINGS.RESET_GENERAL
    );
    const mapped = mapApiResponseToState(res.data);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mapped));
    } catch {
      // ignore
    }
    return mapped;
  },

  async uploadSalonLogo(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post<{ logo_url: string; message: string }>(
      API_ENDPOINTS.SETTINGS.LOGO,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data.logo_url;
  },

  async deleteSalonLogo(): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SETTINGS.LOGO);
  },
};
