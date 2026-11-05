export type StaffRole =
  | "senior_stylist"
  | "stylist"
  | "colorist"
  | "esthetician"
  | "nail_technician"
  | "barber"
  | "receptionist"
  | "salon_manager";

export type StaffStatus = "active" | "inactive" | "on_leave" | "break";

export type StaffMember = {
  id: string;
  name: string;
  role: StaffRole;
  email: string;
  phone: string;
  avatar?: string;
  specialties: string[];
  commissionRate: number; // percentage, e.g. 20
  rating: number; // 0 - 5.0
  reviewsCount: number;
  completedAppointments: number;
  revenueGenerated: number;
  status: StaffStatus;
  joinedDate: string; // YYYY-MM-DD
  bio?: string;
  canAccessPos?: boolean;
  password?: string;
};

export type StaffStats = {
  totalStaff: number;
  activeStaff: number;
  onLeaveCount: number;
  totalAppointments: number;
  avgRating: number;
};

export type StaffFilterState = {
  search: string;
  role: "all" | StaffRole;
  status: "all" | StaffStatus;
  sortBy: "name" | "rating" | "appointments" | "revenue";
};

export type StaffFormData = {
  name: string;
  role: StaffRole;
  email: string;
  phone: string;
  specialties: string[];
  commissionRate: number;
  status: StaffStatus;
  bio?: string;
  canAccessPos?: boolean;
  password?: string;
};


