export type AppointmentStatus =
  | "confirmed"
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export type AppointmentServiceItem = {
  id?: string;
  name: string;
  price: number;
  durationMinutes: number;
};

export type Appointment = {
  id: string;
  appointmentNumber?: string;
  clientName: string;
  clientPhone: string;
  clientAvatar?: string;
  serviceId: string;
  serviceName: string;
  services?: AppointmentServiceItem[];
  staffId: string;
  staffName: string;
  staffAvatar?: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:30 AM"
  durationMinutes: number;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  hasInvoice?: boolean;
  invoiceId?: string;
  invoiceNumber?: string;
};

export type AppointmentStats = {
  today: number;
  total: number;
  cancelled: number;
  upcoming: number;
  confirmed?: number;
  inProgress?: number;
  completed?: number;
};

export type AppointmentFilterState = {
  search: string;
  searchField?: "all" | "id" | "client" | "phone" | "service" | "staff";
  status: "all" | AppointmentStatus;
  staff: string;
  date?: string;
};

export type AppointmentFormData = {
  clientName: string;
  clientPhone: string;
  serviceId?: string;
  serviceName: string;
  services?: AppointmentServiceItem[];
  staffId?: string;
  staffName: string;
  date: string;
  time: string;
  durationMinutes: number;
  price: number;
  notes?: string;
};

