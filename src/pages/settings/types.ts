export type {
  SettingsSectionId,
  SettingsCardItem,
  GeneralSettingsState,
  BusinessHourItem,
  BusinessHourUpdateItem,
  GeneralSettingsApiResponse,
  GeneralSettingsUpdateRequest,
} from "../../interface/settings.types";

export type {
  SharedWebSettingsState,
  SharedWebSettingsUpdateRequest,
  SharedWebBusinessHour,
  SharedWebHoliday,
  SharedWebStats,
} from "../../interface/shared-web.types";

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

