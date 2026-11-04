export type StaffRole =
  | "senior_stylist"
  | "stylist"
  | "colorist"
  | "esthetician"
  | "nail_technician"
  | "barber"
  | "receptionist"
  | "salon_manager";

export type StaffStatus = "active" | "on_leave" | "break" | "inactive";

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
  scheduleDays: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri"]
  status: StaffStatus;
  joinedDate: string; // YYYY-MM-DD
  bio?: string;
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
  scheduleDays: string[];
  status: StaffStatus;
  bio?: string;
};

