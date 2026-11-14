export interface ReferralItem {
  id: string;
  referee_salon_name: string;
  referee_email?: string | null;
  joined_date: string;
  status: "completed" | "pending" | "rewarded" | string;
  reward_type: string;
  reward_status: string;
  reward_description: string;
}

export interface ReferralSummary {
  referral_code: string;
  referral_link: string;
  total_referrals: number;
  successful_referrals: number;
  free_months_earned: number;
  reward_balance: string;
  referred_by_salon_name?: string | null;
  recent_referrals: ReferralItem[];
}
