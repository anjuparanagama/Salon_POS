import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../config/api.config";
import type {
  Appointment,
  AppointmentStats,
  AppointmentFormData,
  AppointmentStatus,
} from "../interface/appointment.types";

export interface AppointmentQueryParams {
  search?: string;
  status?: string;
  staff_id?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  pageSize?: number;
}

export function normalizeStatus(status?: string): AppointmentStatus {
  if (!status) return "pending";
  const s = status.toLowerCase().trim().replace(/[\s-]+/g, "_");
  if (s === "open" || s === "pending") return "pending";
  if (s === "approved" || s === "confirmed") return "confirmed";
  if (s === "in_progress" || s === "inprogress") return "in_progress";
  if (s === "done" || s === "completed") return "completed";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  return "pending";
}

const KNOWN_CUSTOMERS: Record<string, { name: string; phone: string }> = {
  "c1000000-0000-0000-0000-000000000001": { name: "Emma Wilson", phone: "+1 (555) 234-5678" },
  "c1000000-0000-0000-0000-000000000002": { name: "Sophia Brown", phone: "+1 (555) 345-6789" },
  "c1000000-0000-0000-0000-000000000003": { name: "Mia Johnson", phone: "+1 (555) 456-7890" },
  "c1000000-0000-0000-0000-000000000004": { name: "Ava Smith", phone: "+1 (555) 567-8901" },
  "c1000000-0000-0000-0000-000000000005": { name: "Charlotte Davis", phone: "+1 (555) 678-9012" },
  "c1000000-0000-0000-0000-000000000006": { name: "Harper Lee", phone: "+1 (555) 789-0123" },
  "c1000000-0000-0000-0000-000000000007": { name: "Chloe Martin", phone: "+1 (555) 890-1234" },
  "c1000000-0000-0000-0000-000000000008": { name: "Grace Taylor", phone: "+1 (555) 901-2345" },
  "10000000-0000-0000-0000-000000000001": { name: "Nimal Perera", phone: "+94 77 100 0001" },
  "10000000-0000-0000-0000-000000000002": { name: "Kumari Silva", phone: "+94 77 100 0002" },
  "10000000-0000-0000-0000-000000000003": { name: "Amal Fernando", phone: "+94 77 100 0003" },
  "10000000-0000-0000-0000-000000000004": { name: "Samanthi Jayasuriya", phone: "+94 77 100 0004" },
  "10000000-0000-0000-0000-000000000005": { name: "Ruwan Dias", phone: "+94 77 100 0005" },
};

const KNOWN_STAFF: Record<string, string> = {
  "f1000000-0000-0000-0000-000000000001": "Amelia Vance",
  "f1000000-0000-0000-0000-000000000002": "Olivia Wilde",
  "f1000000-0000-0000-0000-000000000003": "Isabella Gomez",
  "f1000000-0000-0000-0000-000000000004": "Noah Sterling",
  "f1000000-0000-0000-0000-000000000005": "Sophia Chen",
  "20000000-0000-0000-0000-000000000001": "Chathuri",
  "20000000-0000-0000-0000-000000000002": "Dilshan",
  "20000000-0000-0000-0000-000000000003": "Ishara",
  "20000000-0000-0000-0000-000000000004": "Malith",
  "20000000-0000-0000-0000-000000000005": "Tharushi",
};

export function normalizeAppointment(item: unknown, index = 0): Appointment {
  const raw = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
  const rawServices = Array.isArray(raw.services) ? (raw.services as Record<string, unknown>[]) : [];
  const firstService = rawServices[0] || null;

  const serviceName =
    (raw.serviceName as string) ||
    (rawServices.length > 0
      ? rawServices.map((s) => (s.name || s.service_name || "Service") as string).join(", ")
      : "Haircut & Styling");

  const totalDuration = rawServices.length > 0
    ? rawServices.reduce((acc, s) => acc + (Number(s.duration_minutes || s.duration || 0) * Number(s.quantity || 1)), 0)
    : Number(raw.durationMinutes || 45);

  const totalPrice = rawServices.length > 0
    ? rawServices.reduce((acc, s) => acc + (Number(s.unit_price || s.price || 0) * Number(s.quantity || 1)), 0)
    : Number(raw.price || 45);

  const rawDate = (raw.date || raw.appointment_date || new Date().toISOString().split("T")[0]) as string;
  let rawTime = (raw.time || raw.start_time || "09:00 AM") as string;
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(rawTime)) {
    const [hhStr, mmStr] = rawTime.split(":");
    let hh = parseInt(hhStr, 10);
    const mm = mmStr || "00";
    const ampm = hh >= 12 ? "PM" : "AM";
    hh = hh % 12 || 12;
    rawTime = `${String(hh).padStart(2, "0")}:${mm} ${ampm}`;
  }

  const customerId = raw.customer_id ? String(raw.customer_id).toLowerCase() : "";
  const knownCustomer = customerId ? KNOWN_CUSTOMERS[customerId] : undefined;

  const clientName =
    (raw.clientName as string) ||
    (raw.customer_name as string) ||
    (raw.customerName as string) ||
    knownCustomer?.name ||
    (customerId ? `Client #${customerId.slice(-4)}` : "Walk-in Client");

  const clientPhone =
    (raw.clientPhone as string) ||
    (raw.customer_phone as string) ||
    (raw.customerPhone as string) ||
    knownCustomer?.phone ||
    "+1 (555) 000-0000";

  const staffId = raw.assigned_staff_id ? String(raw.assigned_staff_id).toLowerCase() : "";
  const knownStaffName = staffId ? KNOWN_STAFF[staffId] : undefined;

  const staffName =
    (raw.staffName as string) ||
    (raw.staff_name as string) ||
    knownStaffName ||
    "Amelia Vance";

  const appointmentNumber =
    (raw.appointment_number as string) ||
    (raw.appointmentNumber as string) ||
    undefined;

  return {
    id: String(raw.id || `apt-${index + 1}`),
    appointmentNumber,
    clientName,
    clientPhone,
    clientAvatar: typeof raw.clientAvatar === "string" ? raw.clientAvatar : undefined,
    serviceId: String(raw.serviceId || firstService?.service_id || firstService?.id || "svc-1"),
    serviceName,
    staffId: String(raw.staffId || raw.assigned_staff_id || "st-1"),
    staffName,
    staffAvatar: typeof raw.staffAvatar === "string" ? raw.staffAvatar : undefined,
    date: rawDate,
    time: rawTime,
    durationMinutes: totalDuration || 45,
    price: totalPrice,
    status: normalizeStatus(raw.status as string),
    notes: typeof raw.notes === "string" ? raw.notes : undefined,
  };
}

export const appointmentsService = {
  async getAppointments(
    params?: AppointmentQueryParams
  ): Promise<{ items: Appointment[]; total: number }> {
    const res = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.BASE, { params });
    const rawItems =
      res.data && Array.isArray(res.data.items)
        ? res.data.items
        : Array.isArray(res.data)
        ? res.data
        : [];
    const total = typeof res.data?.total === "number" ? res.data.total : rawItems.length;

    return {
      items: rawItems.map((item: unknown, idx: number) => normalizeAppointment(item, idx)),
      total,
    };
  },

  async getSummary(): Promise<AppointmentStats> {
    const res = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.SUMMARY);
    const data = res.data || {};
    return {
      today: data.today ?? 0,
      total: data.total ?? data.total_appointments ?? 0,
      cancelled: data.cancelled ?? 0,
      upcoming: data.upcoming ?? (data.open ?? 0) + (data.approved ?? 0),
      confirmed: data.confirmed ?? data.approved ?? 0,
      inProgress: data.inProgress ?? data.in_progress ?? 0,
      completed: data.completed ?? data.done ?? 0,
    };
  },

  async getAppointmentById(id: string): Promise<Appointment> {
    const res = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.BY_ID(id));
    return normalizeAppointment(res.data);
  },

  async createAppointment(payload: AppointmentFormData): Promise<Appointment> {
    const res = await apiClient.post(API_ENDPOINTS.APPOINTMENTS.BASE, payload);
    return normalizeAppointment(res.data);
  },

  async updateAppointment(id: string, payload: Partial<AppointmentFormData>): Promise<Appointment> {
    const res = await apiClient.patch(API_ENDPOINTS.APPOINTMENTS.BY_ID(id), payload);
    return normalizeAppointment(res.data);
  },

  async updateStatus(id: string, status: string, reason?: string): Promise<Appointment> {
    const res = await apiClient.patch(
      API_ENDPOINTS.APPOINTMENTS.STATUS(id),
      { status, reason }
    );
    return normalizeAppointment(res.data);
  },

  async cancelAppointment(id: string, reason?: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.APPOINTMENTS.CANCEL(id), { reason });
  },

  async getInvoice(appointmentId: string): Promise<unknown> {
    const res = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.INVOICE(appointmentId));
    return res.data;
  },

  async addPayment(invoiceId: string, payload: { amount: number; method: string; reference?: string }): Promise<unknown> {
    const res = await apiClient.post(API_ENDPOINTS.APPOINTMENTS.PAYMENTS(invoiceId), payload);
    return res.data;
  },
};

export default appointmentsService;

