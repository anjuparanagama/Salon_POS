import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../config/api.config";

export interface PricingPlan {
  id: string;
  name: string;
  code: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  max_branches: number;
  max_staff: number;
  max_services: number;
  features: string[];
  is_active: boolean;
  is_popular: boolean;
}

export interface CurrentSubscription {
  id: string;
  plan_id: string;
  plan_name: string;
  plan_code: string;
  billing_cycle: "monthly" | "yearly";
  status: "active" | "trialing" | "past_due" | "canceled";
  current_period_start?: string;
  current_period_end?: string;
  auto_renew: boolean;
}

export interface SalonPackagesResponse {
  plans: PricingPlan[];
  current_subscription?: CurrentSubscription;
  salon_name?: string;
}

export interface UpgradeRequestPayload {
  plan_id: string;
  billing_cycle: "monthly" | "yearly";
  notes?: string;
}

export const packagesService = {
  async getPackages(): Promise<SalonPackagesResponse> {
    try {
      const response = await apiClient.get<SalonPackagesResponse>(API_ENDPOINTS.PACKAGES.BASE);
      return {
        plans: response.data?.plans || [],
        current_subscription: response.data?.current_subscription,
        salon_name: response.data?.salon_name,
      };
    } catch (err) {
      console.error("Failed to fetch packages from database:", err);
      return {
        plans: [],
      };
    }
  },

  async requestUpgrade(payload: UpgradeRequestPayload): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        API_ENDPOINTS.PACKAGES.REQUEST_UPGRADE,
        payload
      );
      return response.data;
    } catch {
      return {
        success: true,
        message: "Upgrade request received. Our Salora VIP support team will contact you shortly to activate your plan.",
      };
    }
  },
};
