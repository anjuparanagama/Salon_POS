import type { Appointment, AppointmentFormData } from "./appointment.types";
import type { InvoiceDetailResponse } from "../services/checkout.service";

export type AppointmentCheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onCheckoutSuccess?: (invoice: InvoiceDetailResponse) => void;
  onBookNextAppointment?: (prefill: Partial<AppointmentFormData>) => void;
};

export interface SelectedServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number;
  quantity: number;
}

export interface SelectedProductItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  quantity: number;
}

export interface WhatsAppStatusMsg {
  type: "success" | "error";
  text: string;
}
