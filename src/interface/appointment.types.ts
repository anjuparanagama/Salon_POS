export type AppointmentStatus =
  | "confirmed"
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export type Appointment = {
  id: string;
  clientName: string;
  clientPhone: string;
  clientAvatar?: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  staffAvatar?: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:30 AM"
  durationMinutes: number;
  price: number;
  status: AppointmentStatus;
  notes?: string;
};

export type AppointmentStats = {
  total: number;
  confirmed: number;
  inProgress: number;
  completed: number;
  cancelled: number;
};

export type AppointmentFilterState = {
  search: string;
  status: "all" | AppointmentStatus;
  staff: string;
  date: string;
};

export type AppointmentFormData = {
  clientName: string;
  clientPhone: string;
  serviceName: string;
  staffName: string;
  date: string;
  time: string;
  durationMinutes: number;
  price: number;
  notes?: string;
};

