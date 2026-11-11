import { useState, useEffect, type FormEvent } from "react";
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
  Plus,
  Trash2,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { staffService } from "../../../../services/staff.service";
import type { StaffRoleItem } from "../../../../interface/staff.types";
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

const DEFAULT_ROLES_META: Record<string, { badge: string; description: string }> = {
  salon_manager: {
    badge: "Full Control",
    description: "Has administrative access to all salon operations, staff, and financial data.",
  },
  receptionist: {
    badge: "Front Desk",
    description: "Manages bookings, client check-in/checkout, and client directory.",
  },
  cashier: {
    badge: "POS Counter",
    description: "Specialized in checkout terminal, processing bills, and printing receipts.",
  },
  senior_stylist: {
    badge: "Senior Specialist",
    description: "Can manage treatments, checkout clients, and view product inventory.",
  },
  stylist: {
    badge: "Service Staff",
    description: "View assigned bookings and service execution with restricted system access.",
  },
  colorist: {
    badge: "Color Specialist",
    description: "Specialized in hair coloring, tinting, and chemical treatments.",
  },
  esthetician: {
    badge: "Skin Specialist",
    description: "Performs facial treatments, waxing, and skincare procedures.",
  },
  nail_technician: {
    badge: "Nail Care",
    description: "Manages manicure, pedicure, and nail enhancement services.",
  },
  barber: {
    badge: "Master Barber",
    description: "Specialized in men's haircutting, grooming, and shaving services.",
  },
};

const FALLBACK_ROLES: { id: StaffRoleType; label: string; badge: string; description: string }[] = [
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

  // Dynamic roles state
  const [dbRoles, setDbRoles] = useState<StaffRoleItem[]>([]);

  // Add Role Modal State
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleCode, setNewRoleCode] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [cloneFromRole, setCloneFromRole] = useState<string>("stylist");
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [addRoleError, setAddRoleError] = useState<string | null>(null);

  // Delete Role State
  const [deletingRole, setDeletingRole] = useState<StaffRoleItem | null>(null);
  const [isDeletingRole, setIsDeletingRole] = useState(false);

  // Load roles from backend DB
  const loadRoles = async () => {
    try {
      const data = await staffService.getRoles();
      if (Array.isArray(data) && data.length > 0) {
        setDbRoles(data);
      }
    } catch (err) {
      console.error("Failed to load staff roles:", err);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  // Compute full display roles list
  const computedRolesList = dbRoles.length > 0
    ? dbRoles.map((r) => {
        const meta = DEFAULT_ROLES_META[r.value];
        const isCustom = Boolean(r.id && !r.id.startsWith("default-"));
        return {
          id: r.value,
          dbId: r.id,
          label: r.label,
          badge: isCustom ? "Custom Role" : (meta?.badge || "Role"),
          description: r.description || meta?.description || "Staff role with customizable permissions.",
          isCustom,
          staffCount: r.staffCount || 0,
        };
      })
    : FALLBACK_ROLES.map((r) => ({ ...r, isCustom: false, staffCount: 0 }));

  const currentRolePerms: RolePermissions =
    formData.rolesPermissions[activeRole] ||
    defaultPermissions[activeRole as keyof typeof defaultPermissions] ||
    defaultPermissions.stylist;

  const handleTogglePermission = (key: keyof RolePermissions) => {
    const base = formData.rolesPermissions[activeRole] || defaultPermissions[activeRole as keyof typeof defaultPermissions] || defaultPermissions.stylist;
    setFormData((prev) => ({
      ...prev,
      rolesPermissions: {
        ...prev.rolesPermissions,
        [activeRole]: {
          ...base,
          [key]: !base[key],
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

  // Create new role
  const handleOpenAddRole = () => {
    setNewRoleName("");
    setNewRoleCode("");
    setNewRoleDesc("");
    setCloneFromRole("stylist");
    setAddRoleError(null);
    setIsAddRoleOpen(true);
  };

  const handleRoleNameChange = (val: string) => {
    setNewRoleName(val);
    const slug = val
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    setNewRoleCode(slug);
  };

  const handleSaveNewRole = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = newRoleName.trim();
    if (!trimmedName) {
      setAddRoleError("Please enter a role name.");
      return;
    }

    const trimmedCode =
      newRoleCode.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_") ||
      trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "_");

    setIsSavingRole(true);
    setAddRoleError(null);

    // Initial permissions cloned from selected template role
    const templatePerms =
      formData.rolesPermissions[cloneFromRole] ||
      defaultPermissions[cloneFromRole as keyof typeof defaultPermissions] ||
      defaultPermissions.stylist;

    try {
      const created = await staffService.createRole({
        label: trimmedName,
        value: trimmedCode,
        description: newRoleDesc.trim() || undefined,
        permissions: templatePerms as unknown as Record<string, boolean>,
        active: true,
      });

      setDbRoles((prev) => [...prev, created]);
      setFormData((prev) => ({
        ...prev,
        rolesPermissions: {
          ...prev.rolesPermissions,
          [created.value]: { ...templatePerms },
        },
      }));
      setActiveRole(created.value);
      setIsAddRoleOpen(false);
    } catch (err: unknown) {
      console.error("Failed to create role:", err);
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setAddRoleError(detail || "Failed to create role. Please try again.");
    } finally {
      setIsSavingRole(false);
    }
  };

  // Delete custom role
  const handleConfirmDeleteRole = async () => {
    if (!deletingRole || !deletingRole.id) return;
    setIsDeletingRole(true);
    try {
      await staffService.deleteRole(deletingRole.id);
      setDbRoles((prev) => prev.filter((r) => r.id !== deletingRole.id));
      if (activeRole === deletingRole.value) {
        setActiveRole("stylist");
      }
      setDeletingRole(null);
    } catch (err) {
      console.error("Failed to delete role:", err);
    } finally {
      setIsDeletingRole(false);
    }
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
              onClick={handleOpenAddRole}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Role</span>
            </button>
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
          {computedRolesList.map((role) => {
            const isSelected = activeRole === role.id;
            return (
              <div
                key={role.id}
                className={[
                  "group flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border shrink-0",
                  isSelected
                    ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200/70 hover:bg-slate-100",
                ].join(" ")}
                onClick={() => setActiveRole(role.id)}
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

                {role.isCustom && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const matchRoleItem = dbRoles.find((r) => r.value === role.id);
                      if (matchRoleItem) setDeletingRole(matchRoleItem);
                    }}
                    className={[
                      "p-1 rounded-md transition cursor-pointer",
                      isSelected ? "hover:bg-amber-600 text-white/80" : "hover:bg-rose-50 text-slate-400 hover:text-rose-600",
                    ].join(" ")}
                    title="Delete Role"
                  >
                    <Trash2 className="size-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Inline Add Role Button */}
          <button
            type="button"
            onClick={handleOpenAddRole}
            className="flex items-center gap-1.5 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100/70 hover:border-amber-400 transition cursor-pointer shrink-0"
          >
            <Plus className="size-3.5" />
            <span>Add Role</span>
          </button>
        </div>

        {/* Role Description & Counter Banner */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-50/60 border border-amber-100/80 px-3.5 py-2 text-xs text-amber-900">
          <p className="font-medium text-[11px] sm:text-xs">
            {computedRolesList.find((r) => r.id === activeRole)?.description}
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

      {/* Add New Staff Role Modal */}
      {isAddRoleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <ShieldCheck className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add New Staff Role</h3>
                  <p className="text-[11px] text-slate-500">
                    Create a salon staff role with custom POS system permissions
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddRoleOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              {addRoleError && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{addRoleError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Color Specialist, Junior Barber"
                  value={newRoleName}
                  onChange={(e) => handleRoleNameChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Code / Identifier <span className="text-xs text-slate-400 font-normal">(slug)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. color_specialist"
                  value={newRoleCode}
                  onChange={(e) => setNewRoleCode(e.target.value)}
                  className="w-full font-mono rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Description <span className="text-xs text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the staff responsibilities..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clone Initial Permissions From:
                </label>
                <select
                  value={cloneFromRole}
                  onChange={(e) => setCloneFromRole(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  {computedRolesList.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-slate-400">
                  Permissions can be customized anytime after creating this role.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
              <button
                type="button"
                onClick={() => setIsAddRoleOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewRole}
                disabled={isSavingRole || !newRoleName.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-amber-600 transition disabled:opacity-50 cursor-pointer"
              >
                {isSavingRole && <Loader2 className="size-3.5 animate-spin" />}
                <span>Create Role</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl border border-slate-100 p-6 flex flex-col items-center text-center text-slate-900">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-3.5">
              <Trash2 className="size-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Delete "{deletingRole.label}" Role?
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-2">
              Are you sure you want to delete this custom staff role?
            </p>

            {(deletingRole.staffCount || 0) > 0 && (
              <div className="w-full rounded-xl bg-amber-50 border border-amber-200/80 p-2.5 text-[11px] text-amber-800 text-left mb-4">
                <strong>Notice:</strong> {deletingRole.staffCount} staff member(s) currently hold this role.
              </div>
            )}

            <div className="flex items-center gap-2.5 w-full mt-2">
              <button
                type="button"
                onClick={() => setDeletingRole(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteRole}
                disabled={isDeletingRole}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer"
              >
                {isDeletingRole && <Loader2 className="size-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

export default StaffSettingsView;
