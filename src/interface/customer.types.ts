export type CustomerGender = "female" | "male" | "other" | "prefer_not_to_say";

export type ServiceHistoryItem = {
  id: string;
  appointmentId?: string | null;
  invoiceId?: string | null;
  appointmentNumber?: string | null;
  invoiceNumber?: string | null;
  date: string; // YYYY-MM-DD
  serviceName: string;
  staffName?: string | null;
  price: number;
  durationMinutes?: number;
  status: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: CustomerGender;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string | null; // YYYY-MM-DD
  serviceHistory?: ServiceHistoryItem[];
  createdAt: string;
};

export type CustomerStats = {
  totalCustomers: number;
  totalVisits: number;
  totalRevenue: number;
  avgSpendPerCustomer: number;
};

export type CustomerFilterState = {
  search: string;
  searchField?: "all" | "name" | "phone" | "email";
  gender: "all" | CustomerGender;
  sortBy: "recent" | "visits" | "spent" | "name";
};

export type CustomerFormData = {
  name: string;
  phone: string;
  email: string;
  gender: CustomerGender;
};
