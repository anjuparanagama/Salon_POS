import { useState, type FormEvent } from "react";
import {
  Calendar,
  Check,
  CreditCard,
  Package,
  RotateCcw,
  Save,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { RolePermissions, StaffRoleType, StaffSettingsState } from "../../types";

const defaultPermissions: Record<StaffRoleType, RolePermissions> = {
  salon_manager: {
    viewAppointments: true,
    createAppointments: true,
    editCancelAppointments: true,
    checkoutAppointments: true,
    accessPosCheckout: true,
    applyDiscounts: true,
    processRefunds: true,
    reprintReceipts: true,
    viewProducts: true,
    manageInventory: true,
    manageServices: true,
    viewCustomers: true,
    manageCustomers: true,
    viewFinancialLedger: true,
    manageStaff: true,
  },
  receptionist: {
    viewAppointments: true,
    createAppointments: true,
    editCancelAppointments: true,
    checkoutAppointments: true,
    accessPosCheckout: true,
    applyDiscounts: true,
    processRefunds: false,
    reprintReceipts: true,
    viewProducts: true,
    manageInventory: false,
    manageServices: false,
    viewCustomers: true,
    manageCustomers: true,
    viewFinancialLedger: false,
    manageStaff: false,
  },
  senior_stylist: {
    viewAppointments: true,
    createAppointments: true,
    editCancelAppointments: false,
    checkoutAppointments: true,
    accessPosCheckout: true,
    applyDiscounts: false,
    processRefunds: false,
    reprintReceipts: true,
    viewProducts: true,
    manageInventory: false,
    manageServices: false,
    viewCustomers: true,
    manageCustomers: false,
    viewFinancialLedger: false,
    manageStaff: false,
  },
  stylist: {
    viewAppointments: true,
    createAppointments: true,
    editCancelAppointments: false,
    checkoutAppointments: false,
    accessPosCheckout: false,
    applyDiscounts: false,
    processRefunds: false,
    reprintReceipts: false,
    viewProducts: true,
    manageInventory: false,
    manageServices: false,
    viewCustomers: true,
    manageCustomers: false,
    viewFinancialLedger: false,
    manageStaff: false,
  },
  cashier: {
    viewAppointments: true,
    createAppointments: false,
    editCancelAppointments: false,
    checkoutAppointments: true,
    accessPosCheckout: true,
    applyDiscounts: true,
    processRefunds: false,
    reprintReceipts: true,
    viewProducts: true,
    manageInventory: false,
    manageServices: false,
    viewCustomers: true,
    manageCustomers: false,
    viewFinancialLedger: false,
    manageStaff: false,
  },
};

const defaultStaffSettings: StaffSettingsState = {
  selectedRole: "stylist",
  rolesPermissions: defaultPermissions,
  requirePinForCheckout: true,
  autoLogoutMinutes: 30,
  restrictLoginToWorkingHours: false,
  staffCanOnlyViewOwnBookings: true,
  autoAssignWalkIns: true,
  enforceBreakSchedule: true,
  breakDurationMinutes: 30,
};

const ROLES_LIST: { id: StaffRoleType; label: string; badge: string; description: string }[] = [
  {
    id: "salon_manager",
    label: "Salon Manager",
    badge: "Full Control",
    description: "Has administrative access to all salon operations, staff, and financial data.",
  },
  {
    id: "receptionist",
    label: "Receptionist",
    badge: "Front Desk",
    description: "Manages bookings, client check-in/checkout, and client directory.",
  },
  {
    id: "cashier",
    label: "Cashier",
    badge: "POS Counter",
    description: "Specialized in checkout terminal, processing bills, and printing receipts.",
  },
  {
    id: "senior_stylist",
    label: "Senior Stylist",
    badge: "Senior Specialist",
    description: "Can manage treatments, checkout clients, and view product inventory.",
  },
  {
    id: "stylist",
    label: "Stylist / Specialist",
    badge: "Service Staff",
    description: "View assigned bookings and service execution with restricted system access.",
  },
];

export function StaffSettingsView() {
  const [formData, setFormData] = useState<StaffSettingsState>(() => {
    try {
      const saved = localStorage.getItem("sribees_staff_permissions_settings");
      return saved ? JSON.parse(saved) : defaultStaffSettings;
    } catch {
      return defaultStaffSettings;
    }
  });

  const [activeRole, setActiveRole] = useState<StaffRoleType>(formData.selectedRole || "stylist");
  const [isSaved, setIsSaved] = useState(false);

  const currentRolePerms = formData.rolesPermissions[activeRole] || defaultPermissions[activeRole];

  const handleTogglePermission = (key: keyof RolePermissions) => {
    setFormData((prev) => ({
      ...prev,
      rolesPermissions: {
        ...prev.rolesPermissions,
        [activeRole]: {
          ...prev.rolesPermissions[activeRole],
          [key]: !prev.rolesPermissions[activeRole][key],
        },
      },
    }));
  };

  const handleSelectAllForRole = () => {
    const allTrue = Object.keys(currentRolePerms).reduce((acc, k) => {
      acc[k as keyof RolePermissions] = true;
      return acc;
    }, {} as RolePermissions);

    setFormData((prev) => ({
      ...prev,
      rolesPermissions: {
        ...prev.rolesPermissions,
        [activeRole]: allTrue,
      },
    }));
  };

  const handleDeselectAllForRole = () => {
    const allFalse = Object.keys(currentRolePerms).reduce((acc, k) => {
      acc[k as keyof RolePermissions] = false;
      return acc;
    }, {} as RolePermissions);

    setFormData((prev) => ({
      ...prev,
      rolesPermissions: {
        ...prev.rolesPermissions,
        [activeRole]: allFalse,
      },
    }));
  };

  const activeCount = Object.values(currentRolePerms).filter(Boolean).length;
  const totalCount = Object.values(currentRolePerms).length;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("sribees_staff_permissions_settings", JSON.stringify(formData));
    } catch {
      // ignore
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    setFormData(defaultStaffSettings);
    setActiveRole("stylist");
    localStorage.removeItem("sribees_staff_permissions_settings");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-slate-900">
      {/* 1. Staff Role Permissions Matrix */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-800">Role-Based System Permissions</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Control what staff members are permitted to view and do once they log into the POS system.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAllForRole}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleDeselectAllForRole}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Roles selector buttons */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          {ROLES_LIST.map((role) => {
            const isSelected = activeRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setActiveRole(role.id)}
                className={[
                  "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border",
                  isSelected
                    ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200/70 hover:bg-slate-100",
                ].join(" ")}
              >
                <span>{role.label}</span>
                <span
                  className={[
                    "rounded-md px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold",
                    isSelected ? "bg-white/20 text-white" : "bg-white text-slate-500 border border-slate-200",
                  ].join(" ")}
                >
                  {role.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Role Description & Counter Banner */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-50/60 border border-amber-100/80 px-3.5 py-2 text-xs text-amber-900">
          <p className="font-medium text-[11px] sm:text-xs">
            {ROLES_LIST.find((r) => r.id === activeRole)?.description}
          </p>
          <span className="shrink-0 font-bold text-[11px] text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-200">
            {activeCount} of {totalCount} Enabled
          </span>
        </div>

        {/* Permissions Groups */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Group 1: Appointments & Bookings */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-xs">
              <Calendar className="size-3.5 text-primary" />
              <span>Appointments & Calendar</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">View Appointments Schedule</span>
                  <p className="text-[10px] text-slate-500">Can view the salon calendar and bookings list.</p>
                </div>
                <input
                  type="checkbox"
                  checked={currentRolePerms.viewAppointments}
                  onChange={() => handleTogglePermission("viewAppointments")}
                  className="size-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">Create New Bookings</span>
                  <p className="text-[10px] text-slate-500">Can book new client appointments for specialists.</p>
                </div>
                <input
                  type="checkbox"
                  checked={currentRolePerms.createAppointments}
                  onChange={() => handleTogglePermission("createAppointments")}
                  className="size-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">Edit & Cancel Appointments</span>
                  <p className="text-[10px] text-slate-500">Can modify service times or cancel bookings.</p>
                </div>
                <input
                  type="checkbox"
                  checked={currentRolePerms.editCancelAppointments}
                  onChange={() => handleTogglePermission("editCancelAppointments")}
                  className="size-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">Complete & Checkout Appointments</span>
                  <p className="text-[10px] text-slate-500">Can mark treatments as done and create customer bills.</p>
                </div>
                <input
                  type="checkbox"
                  checked={currentRolePerms.checkoutAppointments}
                  onChange={() => handleTogglePermission("checkoutAppointments")}
                  className="size-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Group 2: POS Checkout & Invoicing */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-xs">
              <CreditCard className="size-3.5 text-emerald-600" />
              <span>POS Billing & Cashiering</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">Access POS Counter Terminal</span>
                  <p className="text-[10px] text-slate-500">Can take cash, card, and digital client payments.</p>
                </div>
                <input
                  type="checkbox"
                  checked={currentRolePerms.accessPosCheckout}
                  onChange={() => handleTogglePermission("accessPosCheckout")}
                  className="size-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">Apply Custom Discounts</span>
                  <p className="text-[10px] text-slate-500">Can apply percentage or fixed discounts at checkout.</p>
                </div>
                <input
                  type="checkbox"
                  checked={currentRolePerms.applyDiscounts}
                  onChange={() => handleTogglePermission("applyDiscounts")}
                  className="size-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">Issue Refunds & Void Invoices</span>
                  <p className="text-[10px] text-slate-500">Can reverse payments or issue customer refunds.</p>
                </div>
                <input
                  type="checkbox"
                  checked={currentRolePerms.processRefunds}
                  onChange={() => handleTogglePermission("processRefunds")}
                  className="size-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">Reprint Customer Receipts</span>
                  <p className="text-[10px] text-slate-500">Can reprint past invoices and thermal receipts.</p>
                </div>
                <input
                  type="checkbox"
                  checked={currentRolePerms.reprintReceipts}
                  onChange={() => handleTogglePermission("reprintReceipts")}
                  className="size-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Group 3: Products & Catalog */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-xs">
              <Package className="size-3.5 text-blue-600" />
              <span>Inventory & Catalog Services</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">View Products & Stock Quantities</span>
                  <p className="text-[10px] text-slate-500">Can look up retail hair/skin product availability.</p>
                </div>
                <input
                  type="checkbox"
                  checked={currentRolePerms.viewProducts}
                  onChange={() => handleTogglePermission("viewProducts")}
                  className="size-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">Stock-in & Adjust Inventory</span>
                  <p className="text-[10px] text-slate-500">Can receive new stock or mark items damaged/lost.</p>
                </div>
                <input
                  type="checkbox"
                  checked={currentRolePerms.manageInventory}
                  onChange={() => handleTogglePermission("manageInventory")}
                  className="size-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">Add & Edit Salon Services</span>
                  <p className="text-[10px] text-slate-500">Can create treatments, modify pricing or durations.</p>
                </div>
                <input
                  type="checkbox"
                  checked={currentRolePerms.manageServices}
                  onChange={() => handleTogglePermission("manageServices")}
                  className="size-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Group 4: Customers & Administration */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-xs">
              <Users className="size-3.5 text-purple-600" />
              <span>Customers & Administration</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">View Customer Contact Details</span>
                  <p className="text-[10px] text-slate-500">Can view phone numbers and customer profiles.</p>
                </div>
                <input
                  type="checkbox"
                  checked={currentRolePerms.viewCustomers}
                  onChange={() => handleTogglePermission("viewCustomers")}
                  className="size-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">Create & Edit Customer Profiles</span>
                  <p className="text-[10px] text-slate-500">Can register new clients and edit medical/hair notes.</p>
                </div>
                <input
                  type="checkbox"
                  checked={currentRolePerms.manageCustomers}
                  onChange={() => handleTogglePermission("manageCustomers")}
                  className="size-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">View Financial Ledger & Cash Flow</span>
                  <p className="text-[10px] text-slate-500">Can inspect salon total sales, expenses, and profit.</p>
                </div>
                <input
                  type="checkbox"
                  checked={currentRolePerms.viewFinancialLedger}
                  onChange={() => handleTogglePermission("viewFinancialLedger")}
                  className="size-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">Manage Staff Accounts</span>
                  <p className="text-[10px] text-slate-500">Can add stylists, edit roles, or deactivate staff.</p>
                </div>
                <input
                  type="checkbox"
                  checked={currentRolePerms.manageStaff}
                  onChange={() => handleTogglePermission("manageStaff")}
                  className="size-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Staff Login & Security Policies Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Shield className="size-4 text-amber-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">Staff Login & Session Policies</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rules enforced when staff members are logged into the salon terminal.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3.5 text-xs">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800">Require Staff PIN for Checkout Transactions</span>
              <p className="text-[11px] text-slate-500">Staff must verify their 4-digit PIN before finishing each bill.</p>
            </div>
            <input
              type="checkbox"
              checked={formData.requirePinForCheckout}
              onChange={(e) => setFormData({ ...formData, requirePinForCheckout: e.target.checked })}
              className="size-4 accent-amber-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800">Restrict Stylists to View Only Their Own Bookings</span>
              <p className="text-[11px] text-slate-500">When logged in, stylists can only inspect their personal schedule and assigned clients.</p>
            </div>
            <input
              type="checkbox"
              checked={formData.staffCanOnlyViewOwnBookings}
              onChange={(e) => setFormData({ ...formData, staffCanOnlyViewOwnBookings: e.target.checked })}
              className="size-4 accent-amber-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800">Restrict Login to Working Hours Only</span>
              <p className="text-[11px] text-slate-500">Staff accounts cannot log in outside salon operating hours.</p>
            </div>
            <input
              type="checkbox"
              checked={formData.restrictLoginToWorkingHours}
              onChange={(e) => setFormData({ ...formData, restrictLoginToWorkingHours: e.target.checked })}
              className="size-4 accent-amber-600 rounded cursor-pointer"
            />
          </label>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div>
              <span className="font-semibold text-slate-800">Terminal Inactivity Auto-Lock</span>
              <p className="text-[11px] text-slate-500">Automatically logs out staff after idle period on the POS device.</p>
            </div>
            <select
              value={formData.autoLogoutMinutes}
              onChange={(e) => setFormData({ ...formData, autoLogoutMinutes: Number(e.target.value) })}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50 cursor-pointer"
            >
              <option value={5}>5 Minutes</option>
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes (Standard)</option>
              <option value={60}>1 Hour</option>
              <option value={0}>Never (Stay logged in)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Shift & Break Rules */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800">Shift Management & Auto-Assignment</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Rules for automated staff distribution and breaks in booking schedules.
        </p>

        <div className="mt-4 flex flex-col gap-3 text-xs">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800">Auto-assign Available Specialist for Walk-in Clients</span>
              <p className="text-[11px] text-slate-500">Picks the active staff member with lowest load in the current time slot.</p>
            </div>
            <input
              type="checkbox"
              checked={formData.autoAssignWalkIns}
              onChange={(e) => setFormData({ ...formData, autoAssignWalkIns: e.target.checked })}
              className="size-4 accent-amber-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800">Enforce Scheduled Break Times in Calendar</span>
              <p className="text-[11px] text-slate-500">Prevents appointments from being booked during marked staff breaks.</p>
            </div>
            <input
              type="checkbox"
              checked={formData.enforceBreakSchedule}
              onChange={(e) => setFormData({ ...formData, enforceBreakSchedule: e.target.checked })}
              className="size-4 accent-amber-600 rounded cursor-pointer"
            />
          </label>

          {formData.enforceBreakSchedule && (
            <div className="pl-4 pt-1 flex items-center gap-3">
              <label className="text-xs font-medium text-slate-700">Mandatory Break Duration:</label>
              <select
                value={formData.breakDurationMinutes}
                onChange={(e) => setFormData({ ...formData, breakDurationMinutes: Number(e.target.value) })}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50 cursor-pointer"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes (Recommended)</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes (1 Hour)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Actions bottom bar */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset Defaults</span>
        </button>

        <button
          type="submit"
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer ${
            isSaved
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-amber-600 hover:bg-amber-700"
          }`}
        >
          {isSaved ? (
            <>
              <Check className="size-4" />
              <span>Permissions Saved!</span>
            </>
          ) : (
            <>
              <Save className="size-4" />
              <span>Save Staff Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default StaffSettingsView;
