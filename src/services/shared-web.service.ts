import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../config/api.config";
import type {
  SharedWebSettingsState,
  SharedWebSettingsUpdateRequest,
} from "../interface/shared-web.types";

const LOCAL_STORAGE_KEY = "sribees_shared_web_settings";

export const sharedWebService = {
  async getSharedWebSettings(): Promise<SharedWebSettingsState> {
    try {
      const res = await apiClient.get<SharedWebSettingsState>(
        API_ENDPOINTS.SETTINGS.SHARED_WEB
      );
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.data));
      } catch {
        // ignore storage errors
      }
      return res.data;
    } catch (err) {
      console.warn("Failed fetching shared web settings from backend, trying cache:", err);
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) return JSON.parse(cached);
      } catch {
        // ignore
      }
      throw err;
    }
  },

  async updateSharedWebSettings(
    payload: SharedWebSettingsUpdateRequest
  ): Promise<SharedWebSettingsState> {
    const res = await apiClient.put<SharedWebSettingsState>(
      API_ENDPOINTS.SETTINGS.SHARED_WEB,
      payload
    );
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.data));
    } catch {
      // ignore
    }
    return res.data;
  },

  async publishWebsite(): Promise<SharedWebSettingsState> {
    const res = await apiClient.post<SharedWebSettingsState>(
      API_ENDPOINTS.SETTINGS.SHARED_WEB_PUBLISH
    );
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.data));
    } catch {
      // ignore
    }
    return res.data;
  },

  async unpublishWebsite(): Promise<SharedWebSettingsState> {
    const res = await apiClient.post<SharedWebSettingsState>(
      API_ENDPOINTS.SETTINGS.SHARED_WEB_UNPUBLISH
    );
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.data));
    } catch {
      // ignore
    }
    return res.data;
  },
};
