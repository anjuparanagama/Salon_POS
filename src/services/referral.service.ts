import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../config/api.config";
import type { ReferralSummary } from "../interface/referral.types";

export const referralService = {
  async getReferralSummary(): Promise<ReferralSummary> {
    const response = await apiClient.get<ReferralSummary>(
      API_ENDPOINTS.REFERRALS.SUMMARY
    );
    return response.data;
  },
};

export default referralService;
