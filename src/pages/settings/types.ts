import type { ComponentType } from "react";

export type SettingsSectionId =
  | "general"
  | "appointments"
  | "staff"
  | "layout"
  | "notifications"
  | "categories"
  | "referrals";

export interface SettingsCardItem {
  id: SettingsSectionId;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean | "true" | "false" }>;
  bannerBg: string;
  badgeBg: string;
  accentColor: string;
  borderColor: string;
  badgeBorder: string;
}

export interface GeneralSettingsState {
  salonName: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  taxRate: number;
  timeZone: string;
  language?: string;
  openingTime: string;
  closingTime: string;
}

export interface AppointmentsSettingsState {
  defaultDuration: number;
  slotInterval: number;
  bufferMinutes: number;
  allowOnlineBooking: boolean;
  autoApprove: boolean;
  cancellationWindowHours: number;
  maxAdvanceBookingDays: number;
}

export type StaffRoleType =
  | "salon_manager"
  | "receptionist"
  | "senior_stylist"
  | "stylist"
  | "cashier"
  | (string & {});

export interface RolePermissions {
  // Appointments
  viewAppointments: boolean;
  createAppointments: boolean;
  editCancelAppointments: boolean;
  checkoutAppointments: boolean;
  // POS & Checkout
  accessPosCheckout: boolean;
  applyDiscounts: boolean;
  processRefunds: boolean;
  reprintReceipts: boolean;
  // Inventory & Services
  viewProducts: boolean;
  manageInventory: boolean;
  manageServices: boolean;
  // Customers & Financials
  viewCustomers: boolean;
  manageCustomers: boolean;
  viewFinancialLedger: boolean;
  manageStaff: boolean;
}

export interface StaffSettingsState {
  selectedRole: string;
  rolesPermissions: Record<string, RolePermissions>;
  requirePinForCheckout: boolean;
  autoLogoutMinutes: number;
  restrictLoginToWorkingHours: boolean;
  staffCanOnlyViewOwnBookings: boolean;
  autoAssignWalkIns: boolean;
  enforceBreakSchedule: boolean;
  breakDurationMinutes: number;
}

export type InvoiceTemplateId = "modern" | "thermal" | "luxury";

export interface LayoutSettingsState {
  selectedInvoiceTemplate?: InvoiceTemplateId;
  compactDensity: boolean;
  showLogoOnReceipt: boolean;
  showSpecialistOnReceipt: boolean;
  receiptHeader: string;
  receiptFooter: string;
  showAppointmentDuration: boolean;
}

export interface NotificationSettingsState {
  enableSmsReminders: boolean;
  smsAdvanceHours: number;
  enableBookingConfirmationSms: boolean;
  enableWhatsAppNotifications: boolean;
  enableLowStockEmail: boolean;
  managerNotificationEmail: string;
}

