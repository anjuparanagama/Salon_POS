export type CustomerStatus = "active" | "inactive" | "vip";

export type CustomerGender = "female" | "male" | "other" | "prefer_not_to_say";

export type MembershipTier = "regular" | "silver" | "gold" | "platinum";

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  gender: CustomerGender;
  membershipTier: MembershipTier;
  status: CustomerStatus;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string; // YYYY-MM-DD
  preferredStaff?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
};

export type CustomerStats = {
  totalCustomers: number;
  activeCustomers: number;
  vipCustomers: number;
  totalRevenue: number;
  avgSpendPerCustomer: number;
};

export type CustomerFilterState = {
  search: string;
  status: "all" | CustomerStatus;
  membershipTier: "all" | MembershipTier;
  sortBy: "name" | "visits" | "spent" | "recent";
};

export type CustomerFormData = {
  name: string;
  phone: string;
  email: string;
  gender: CustomerGender;
  membershipTier: MembershipTier;
  status: CustomerStatus;
  preferredStaff: string;
  notes?: string;
};

