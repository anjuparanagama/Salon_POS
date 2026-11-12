import { useState, useEffect, useMemo, type FormEvent } from "react";
import {
  Calendar,
  Check,
  CreditCard,
  Package,
  RotateCcw,
  Save,
  ShieldCheck,
  Users,
  Plus,
  Trash2,
  Edit2,
  X,
  Loader2,
  AlertCircle,
  Search,
  RefreshCw,
  KeyRound,
  ChevronDown,
  ChevronsUpDown,
  Download,
  Columns3,
  Pencil,
} from "lucide-react";
import Pagination from "../../../../components/pagination";
import { staffService } from "../../../../services/staff.service";
import type { StaffRoleItem } from "../../../../interface/staff.types";
import type { RolePermissions, StaffRoleType, StaffSettingsState } from "../../types";

type StaffSettingsTab = "roles" | "permissions" | "policies";

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

export interface StaffSettingsViewProps {
  activeTab?: StaffSettingsTab;
  onTabChange?: (tab: StaffSettingsTab) => void;
}

export function StaffSettingsView({
  activeTab: controlledTab,
  onTabChange,
}: StaffSettingsViewProps = {}) {
  // Navigation Tabs state: "roles" | "permissions" | "policies"
  const [internalActiveTab, setInternalActiveTab] = useState<StaffSettingsTab>("roles");
  const activeTab = controlledTab ?? internalActiveTab;
  const setActiveTab = (tab: StaffSettingsTab) => {
    setInternalActiveTab(tab);
    onTabChange?.(tab);
  };

  // Form & Permissions State
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
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);

  // Dynamic roles state
  const [dbRoles, setDbRoles] = useState<StaffRoleItem[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [roleSearchQuery, setRoleSearchQuery] = useState("");

  // Grid Controls & Table Preferences matching StoreMate styling
  const [searchField, setSearchField] = useState<"name" | "slug" | "id" | "all">("name");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<"roleCode" | "label" | "id" | "staffCount" | "active">("roleCode");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState({
    roleId: true,
    roleName: true,
    identifier: true,
    description: true,
    staffCount: true,
    status: true,
  });

  // Add Role Modal State
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleCode, setNewRoleCode] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [cloneFromRole, setCloneFromRole] = useState<string>("stylist");
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [addRoleError, setAddRoleError] = useState<string | null>(null);

  // Edit Role Modal State
  const [editingRole, setEditingRole] = useState<StaffRoleItem | null>(null);
  const [editRoleName, setEditRoleName] = useState("");
  const [editRoleDesc, setEditRoleDesc] = useState("");
  const [editRoleActive, setEditRoleActive] = useState(true);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Delete Role State
  const [deletingRole, setDeletingRole] = useState<StaffRoleItem | null>(null);
  const [isDeletingRole, setIsDeletingRole] = useState(false);

  // Load roles from backend DB
  const loadRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const data = await staffService.getRoles();
      if (Array.isArray(data) && data.length > 0) {
        setDbRoles(data);
        // Sync any custom role permissions into formData.rolesPermissions
        setFormData((prev) => {
          const nextPerms = { ...prev.rolesPermissions };
          data.forEach((r) => {
            if (r.permissions && typeof r.permissions === "object") {
              nextPerms[r.value] = {
                ...(defaultPermissions[r.value as keyof typeof defaultPermissions] || defaultPermissions.stylist),
                ...(r.permissions as unknown as RolePermissions),
              };
            }
          });
          return { ...prev, rolesPermissions: nextPerms };
        });
      }
    } catch (err) {
      console.error("Failed to load staff roles:", err);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  // Compute full roles list with clean Role ID (e.g. ROL-01, ROL-02)
  const computedRolesList = useMemo(() => {
    if (dbRoles.length > 0) {
      return dbRoles.map((r, index) => {
        const meta = DEFAULT_ROLES_META[r.value];
        const isCustom = Boolean(r.id && !r.id.startsWith("default-"));
        const roleCode = `ROL-${String(index + 1).padStart(2, "0")}`;
        return {
          id: r.value,
          dbId: r.id,
          roleCode,
          label: r.label,
          badge: isCustom ? "Custom Role" : (meta?.badge || "Role"),
          description: r.description || meta?.description || "Staff role with customizable permissions.",
          isCustom,
          active: r.active !== false,
          staffCount: r.staffCount || 0,
        };
      });
    }
    return FALLBACK_ROLES.map((r, index) => ({
      ...r,
      dbId: undefined,
      roleCode: `ROL-${String(index + 1).padStart(2, "0")}`,
      isCustom: false,
      active: true,
      staffCount: 0,
    }));
  }, [dbRoles]);

  // Filtered and sorted roles
  const filteredAndSortedRoles = useMemo(() => {
    const result = computedRolesList.filter((r) => {
      if (roleSearchQuery.trim()) {
        const q = roleSearchQuery.toLowerCase();
        if (searchField === "name") {
          return r.label.toLowerCase().includes(q);
        } else if (searchField === "slug") {
          return r.id.toLowerCase().includes(q);
        } else if (searchField === "id") {
          return r.roleCode.toLowerCase().includes(q) || (r.dbId && r.dbId.toLowerCase().includes(q));
        } else {
          return (
            r.label.toLowerCase().includes(q) ||
            r.id.toLowerCase().includes(q) ||
            r.roleCode.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q)
          );
        }
      }
      return true;
    });

    result.sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";
      if (sortField === "roleCode") {
        valA = a.roleCode;
        valB = b.roleCode;
      } else if (sortField === "label") {
        valA = a.label.toLowerCase();
        valB = b.label.toLowerCase();
      } else if (sortField === "id") {
        valA = a.id.toLowerCase();
        valB = b.id.toLowerCase();
      } else if (sortField === "staffCount") {
        valA = a.staffCount;
        valB = b.staffCount;
      } else if (sortField === "active") {
        valA = a.active ? 1 : 0;
        valB = b.active ? 1 : 0;
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [computedRolesList, roleSearchQuery, searchField, sortField, sortAsc]);

  // Pagination slicing
  const totalItems = filteredAndSortedRoles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedRoles.slice(start, start + pageSize);
  }, [filteredAndSortedRoles, currentPage, pageSize]);

  // Adjust current page if out of bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSort = (field: "roleCode" | "label" | "id" | "staffCount" | "active") => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // CSV Export for Download button
  const handleExportCSV = () => {
    const headers = ["ROLE ID", "ROLE NAME", "IDENTIFIER", "DESCRIPTION", "ASSIGNED STAFF", "STATUS"];
    const rows = filteredAndSortedRoles.map((r) => [
      r.roleCode,
      `"${r.label.replace(/"/g, '""')}"`,
      r.id,
      `"${(r.description || "").replace(/"/g, '""')}"`,
      r.staffCount,
      r.active ? "Active" : "Inactive",
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `staff_roles_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Current Role Permissions
  const currentRolePerms: RolePermissions =
    formData.rolesPermissions[activeRole] ||
    defaultPermissions[activeRole as keyof typeof defaultPermissions] ||
    defaultPermissions.stylist;

  const handleTogglePermission = (key: keyof RolePermissions) => {
    const base =
      formData.rolesPermissions[activeRole] ||
      defaultPermissions[activeRole as keyof typeof defaultPermissions] ||
      defaultPermissions.stylist;
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

  // Save Permissions to Backend DB & localStorage
  const handleSavePermissions = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingPermissions(true);

    try {
      localStorage.setItem("sribees_staff_permissions_settings", JSON.stringify(formData));
    } catch {}

    // Persist permissions for active role to backend DB
    const roleItem = dbRoles.find((r) => r.value === activeRole);
    const roleIdOrSlug = roleItem?.id || activeRole;

    try {
      await staffService.updateRole(roleIdOrSlug, {
        permissions: formData.rolesPermissions[activeRole] as unknown as Record<string, boolean>,
      });
      // Refresh DB roles to reflect updated permissions
      await loadRoles();
    } catch (err) {
      console.warn("Backend permissions sync note:", err);
    } finally {
      setIsSavingPermissions(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  // Quick toggle active status directly from Role Management table
  const handleQuickToggleRole = async (roleId: string, currentActive: boolean) => {
    const newActive = !currentActive;
    try {
      await staffService.updateRole(roleId, { active: newActive });
      setDbRoles((prev) =>
        prev.map((r) => (r.value === roleId || r.id === roleId ? { ...r, active: newActive } : r))
      );
    } catch (err) {
      console.error("Failed to toggle role active status:", err);
    }
  };

  // Open Create Role Modal
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

  // Open Edit Role Modal
  const handleOpenEditRole = (roleItem: StaffRoleItem) => {
    setEditingRole(roleItem);
    setEditRoleName(roleItem.label);
    setEditRoleDesc(roleItem.description || "");
    setEditRoleActive(roleItem.active !== false);
  };

  const handleSaveEditRole = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;
    const trimmedName = editRoleName.trim();
    if (!trimmedName) return;

    setIsUpdatingRole(true);
    try {
      const roleIdOrSlug = editingRole.id || editingRole.value;
      const updated = await staffService.updateRole(roleIdOrSlug, {
        label: trimmedName,
        description: editRoleDesc.trim() || undefined,
        active: editRoleActive,
      });

      setDbRoles((prev) =>
        prev.map((r) =>
          r.value === editingRole.value || r.id === editingRole.id ? { ...r, ...updated } : r
        )
      );
      setEditingRole(null);
    } catch (err) {
      console.error("Failed to update role:", err);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Delete custom role
  const handleConfirmDeleteRole = async () => {
    if (!deletingRole) return;
    setIsDeletingRole(true);
    try {
      const targetId = deletingRole.id || deletingRole.value;
      await staffService.deleteRole(targetId);
      setDbRoles((prev) => prev.filter((r) => r.id !== deletingRole.id && r.value !== deletingRole.value));
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

  const handleResetDefaults = () => {
    setFormData(defaultStaffSettings);
    setActiveRole("stylist");
    localStorage.removeItem("sribees_staff_permissions_settings");
  };

  return (
    <div className="flex flex-col gap-4 text-slate-900">
      {/* ========================================================= */}
      {/* TAB 1: ROLE MANAGEMENT (StoreMate-style Data Table)        */}
      {/* ========================================================= */}
      {activeTab === "roles" && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-150">
          {/* Integrated Toolbar matching reference image */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Left: Combined Search input with dropdown prefix [ Role Name ▾ | Search... 🔍 ] */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-2xs focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition w-full sm:w-96">
              <div className="relative border-r border-slate-200 shrink-0">
                <select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value as "name" | "slug" | "id" | "all")}
                  className="appearance-none bg-transparent pl-3 pr-7 py-2 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="name">Role Name</option>
                  <option value="slug">Identifier</option>
                  <option value="id">Role ID</option>
                  <option value="all">All Fields</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
              </div>

              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  value={roleSearchQuery}
                  onChange={(e) => {
                    setRoleSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent pl-3 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <Search className="pointer-events-none absolute right-2.5 size-4 text-slate-400" />
              </div>
            </div>

            {/* Right: Page Size, Column Toggle, Export CSV, + Add New Role */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
              {/* Page size selector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Page size</span>
                <div className="relative">
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none rounded-lg border border-slate-200 bg-white pl-2.5 pr-6 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-primary cursor-pointer shadow-2xs"
                  >
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
                </div>
              </div>

              {/* Column toggle button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColumnMenu((p) => !p)}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
                  title="Toggle visible columns"
                >
                  <Columns3 className="size-4" />
                </button>

                {showColumnMenu && (
                  <div className="absolute right-0 top-full mt-1.5 z-40 w-44 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl text-xs flex flex-col gap-1.5">
                    <div className="font-semibold text-slate-700 pb-1 border-b border-slate-100">
                      Visible Columns
                    </div>
                    <label className="flex items-center gap-2 px-1 py-0.5 rounded hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleColumns.roleId}
                        onChange={() => setVisibleColumns((p) => ({ ...p, roleId: !p.roleId }))}
                        className="rounded accent-primary"
                      />
                      <span>Role ID</span>
                    </label>
                    <label className="flex items-center gap-2 px-1 py-0.5 rounded hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleColumns.identifier}
                        onChange={() => setVisibleColumns((p) => ({ ...p, identifier: !p.identifier }))}
                        className="rounded accent-primary"
                      />
                      <span>Identifier / Slug</span>
                    </label>
                    <label className="flex items-center gap-2 px-1 py-0.5 rounded hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleColumns.description}
                        onChange={() => setVisibleColumns((p) => ({ ...p, description: !p.description }))}
                        className="rounded accent-primary"
                      />
                      <span>Description</span>
                    </label>
                    <label className="flex items-center gap-2 px-1 py-0.5 rounded hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleColumns.staffCount}
                        onChange={() => setVisibleColumns((p) => ({ ...p, staffCount: !p.staffCount }))}
                        className="rounded accent-primary"
                      />
                      <span>Assigned Staff</span>
                    </label>
                    <label className="flex items-center gap-2 px-1 py-0.5 rounded hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleColumns.status}
                        onChange={() => setVisibleColumns((p) => ({ ...p, status: !p.status }))}
                        className="rounded accent-primary"
                      />
                      <span>Status</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={loadRoles}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
                title="Refresh staff roles"
              >
                <RefreshCw className={`size-4 ${isLoadingRoles ? "animate-spin" : ""}`} />
              </button>

              {/* Export / Download CSV */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
                title="Download roles as CSV"
              >
                <Download className="size-4" />
              </button>

              {/* Primary Action Button: + Add New Role */}
              <button
                type="button"
                onClick={handleOpenAddRole}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white px-4 py-2 text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Add New Role</span>
              </button>
            </div>
          </div>

          {/* Clean Data Table Container */}
          <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#f4f7fb] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {visibleColumns.roleId && (
                      <th
                        onClick={() => handleSort("roleCode")}
                        className="px-4 py-3 min-w-[110px] cursor-pointer hover:bg-slate-200/60 select-none transition"
                      >
                        <div className="flex items-center gap-1">
                          <span>LOCATION ID</span>
                          <ChevronsUpDown className="size-3 text-slate-400" />
                        </div>
                      </th>
                    )}

                    <th
                      onClick={() => handleSort("label")}
                      className="px-4 py-3 min-w-[190px] cursor-pointer hover:bg-slate-200/60 select-none transition"
                    >
                      <div className="flex items-center gap-1">
                        <span>ROLE NAME</span>
                        <ChevronsUpDown className="size-3 text-slate-400" />
                      </div>
                    </th>

                    {visibleColumns.identifier && (
                      <th
                        onClick={() => handleSort("id")}
                        className="px-4 py-3 min-w-[150px] cursor-pointer hover:bg-slate-200/60 select-none transition"
                      >
                        <div className="flex items-center gap-1">
                          <span>IDENTIFIER</span>
                          <ChevronsUpDown className="size-3 text-slate-400" />
                        </div>
                      </th>
                    )}

                    {visibleColumns.description && (
                      <th className="px-4 py-3 min-w-[260px]">
                        <span>DESCRIPTION</span>
                      </th>
                    )}

                    {visibleColumns.staffCount && (
                      <th
                        onClick={() => handleSort("staffCount")}
                        className="px-4 py-3 text-center min-w-[130px] cursor-pointer hover:bg-slate-200/60 select-none transition"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>ASSIGNED STAFF</span>
                          <ChevronsUpDown className="size-3 text-slate-400" />
                        </div>
                      </th>
                    )}

                    {visibleColumns.status && (
                      <th
                        onClick={() => handleSort("active")}
                        className="px-4 py-3 text-center min-w-[110px] cursor-pointer hover:bg-slate-200/60 select-none transition"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>STATUS</span>
                          <ChevronsUpDown className="size-3 text-slate-400" />
                        </div>
                      </th>
                    )}

                    <th className="px-4 py-3 text-right min-w-[120px]">
                      <span>ACTIONS</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {isLoadingRoles ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Loader2 className="size-6 animate-spin mx-auto text-primary mb-2" />
                        <span>Loading staff roles...</span>
                      </td>
                    </tr>
                  ) : paginatedRoles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <Users className="size-8 mx-auto text-slate-300 mb-2" />
                        <p className="font-semibold text-slate-700">No staff roles found</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {roleSearchQuery
                            ? "Try adjusting your search keywords"
                            : 'Click "+ Add New Role" to register your first custom role.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedRoles.map((role) => {
                      const roleItemObj = dbRoles.find((r) => r.value === role.id) || {
                        id: role.dbId || `default-${role.id}`,
                        label: role.label,
                        value: role.id,
                        description: role.description,
                        active: role.active,
                        staffCount: role.staffCount,
                      };

                      return (
                        <tr key={role.id} className="hover:bg-slate-50/70 transition group">
                          {/* Role ID Code */}
                          {visibleColumns.roleId && (
                            <td className="px-4 py-3.5 font-mono text-xs font-semibold text-slate-700">
                              {role.roleCode}
                            </td>
                          )}

                          {/* Role Name */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 text-xs">
                                {role.label}
                              </span>
                              {role.isCustom && (
                                <span className="rounded-md bg-purple-50 px-1.5 py-0.5 text-[9px] font-bold text-purple-700 border border-purple-200">
                                  Custom
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Identifier / Slug */}
                          {visibleColumns.identifier && (
                            <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                              {role.id}
                            </td>
                          )}

                          {/* Description */}
                          {visibleColumns.description && (
                            <td className="px-4 py-3.5 text-slate-600 max-w-[280px]">
                              {role.description ? (
                                <span className="truncate block" title={role.description}>
                                  {role.description}
                                </span>
                              ) : (
                                <span className="text-slate-400 font-medium">-</span>
                              )}
                            </td>
                          )}

                          {/* Staff Count */}
                          {visibleColumns.staffCount && (
                            <td className="px-4 py-3.5 text-center">
                              <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                                {role.staffCount} staff
                              </span>
                            </td>
                          )}

                          {/* Status */}
                          {visibleColumns.status && (
                            <td className="px-4 py-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleQuickToggleRole(role.id, role.active)}
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition cursor-pointer ${
                                  role.active
                                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                }`}
                                title="Click to toggle status"
                              >
                                <span
                                  className={`size-1.5 rounded-full ${
                                    role.active ? "bg-emerald-500" : "bg-slate-400"
                                  }`}
                                />
                                <span>{role.active ? "Active" : "Inactive"}</span>
                              </button>
                            </td>
                          )}

                          {/* Actions: Pencil Edit icon, Permissions, Delete */}
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Manage Permissions Shortcut */}
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveRole(role.id);
                                  setActiveTab("permissions");
                                }}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer"
                                title="Configure Permissions"
                              >
                                <ShieldCheck className="size-4" />
                              </button>

                              {/* Pencil Edit Icon */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditRole(roleItemObj)}
                                className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-primary transition cursor-pointer"
                                title="Edit Role"
                              >
                                <Pencil className="size-4" />
                              </button>

                              {/* Delete button (custom roles only) */}
                              {role.isCustom && (
                                <button
                                  type="button"
                                  onClick={() => setDeletingRole(roleItemObj)}
                                  className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                                  title="Delete Role"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Component Separated Below Table */}
          {filteredAndSortedRoles.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              itemLabel="entries"
              className="mt-1"
            />
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PERMISSION MANAGEMENT (Role Permissions Matrix)    */}
      {/* ========================================================= */}
      {activeTab === "permissions" && (
        <form onSubmit={handleSavePermissions} className="flex flex-col gap-6 animate-in fade-in duration-150">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
            {/* Header with Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <KeyRound className="size-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Role-Based POS System Permissions
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a staff role below to configure what features, POS checkout tools, and data they can access.
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

            {/* Role selector pill tabs */}
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {computedRolesList.map((role) => {
                const isSelected = activeRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setActiveRole(role.id)}
                    className={[
                      "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border shrink-0",
                      isSelected
                        ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200/70 hover:bg-slate-100",
                    ].join(" ")}
                  >
                    <span>{role.label}</span>
                    <span
                      className={[
                        "rounded-md px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold",
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-white text-slate-500 border border-slate-200",
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
                {computedRolesList.find((r) => r.id === activeRole)?.description}
              </p>
              <span className="shrink-0 font-bold text-[11px] text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                {activeCount} of {totalCount} Enabled
              </span>
            </div>

            {/* Permissions Matrix 4 Groups */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Group 1: Appointments & Calendar */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <div className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-xs">
                  <Calendar className="size-3.5 text-primary" />
                  <span>Appointments & Calendar</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">View Appointments Schedule</span>
                      <p className="text-[11px] text-slate-400">Can view the salon calendar and bookings list.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(currentRolePerms.viewAppointments)}
                      onChange={() => handleTogglePermission("viewAppointments")}
                      className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">Create New Bookings</span>
                      <p className="text-[11px] text-slate-400">Can book new client appointments for specialists.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(currentRolePerms.createAppointments)}
                      onChange={() => handleTogglePermission("createAppointments")}
                      className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">Edit & Cancel Appointments</span>
                      <p className="text-[11px] text-slate-400">Can modify service times or cancel bookings.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(currentRolePerms.editCancelAppointments)}
                      onChange={() => handleTogglePermission("editCancelAppointments")}
                      className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">Complete & Checkout Appointments</span>
                      <p className="text-[11px] text-slate-400">Can mark treatments as done and create customer bills.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(currentRolePerms.checkoutAppointments)}
                      onChange={() => handleTogglePermission("checkoutAppointments")}
                      className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                  </label>
                </div>
              </div>

              {/* Group 2: POS Billing & Cashiering */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <div className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-xs">
                  <CreditCard className="size-3.5 text-blue-600" />
                  <span>POS Billing & Cashiering</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">Access POS Counter Terminal</span>
                      <p className="text-[11px] text-slate-400">Can take cash, card, and digital client payments.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(currentRolePerms.accessPosCheckout)}
                      onChange={() => handleTogglePermission("accessPosCheckout")}
                      className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">Apply Custom Discounts</span>
                      <p className="text-[11px] text-slate-400">Can apply percentage or fixed discounts at checkout.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(currentRolePerms.applyDiscounts)}
                      onChange={() => handleTogglePermission("applyDiscounts")}
                      className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">Issue Refunds & Void Invoices</span>
                      <p className="text-[11px] text-slate-400">Can reverse payments or issue customer refunds.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(currentRolePerms.processRefunds)}
                      onChange={() => handleTogglePermission("processRefunds")}
                      className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">Reprint Customer Receipts</span>
                      <p className="text-[11px] text-slate-400">Can reprint past invoices and thermal receipts.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(currentRolePerms.reprintReceipts)}
                      onChange={() => handleTogglePermission("reprintReceipts")}
                      className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                  </label>
                </div>
              </div>

              {/* Group 3: Inventory & Catalog Services */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <div className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-xs">
                  <Package className="size-3.5 text-purple-600" />
                  <span>Inventory & Catalog Services</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">View Products & Stock Quantities</span>
                      <p className="text-[11px] text-slate-400">Can look up retail hair/skin product availability.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(currentRolePerms.viewProducts)}
                      onChange={() => handleTogglePermission("viewProducts")}
                      className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">Stock-in & Adjust Inventory</span>
                      <p className="text-[11px] text-slate-400">Can receive new stock or mark items damaged/lost.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(currentRolePerms.manageInventory)}
                      onChange={() => handleTogglePermission("manageInventory")}
                      className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">Add & Edit Salon Services</span>
                      <p className="text-[11px] text-slate-400">Can create treatments, modify pricing or durations.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(currentRolePerms.manageServices)}
                      onChange={() => handleTogglePermission("manageServices")}
                      className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                  </label>
                </div>
              </div>

              {/* Group 4: Customers & Administration */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <div className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-xs">
                  <Users className="size-3.5 text-rose-600" />
                  <span>Customers & Administration</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">View Customer Contact Details</span>
                      <p className="text-[11px] text-slate-400">Can view phone numbers and customer profiles.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(currentRolePerms.viewCustomers)}
                      onChange={() => handleTogglePermission("viewCustomers")}
                      className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">Create & Edit Customer Profiles</span>
                      <p className="text-[11px] text-slate-400">Can register new clients and edit medical/hair notes.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(currentRolePerms.manageCustomers)}
                      onChange={() => handleTogglePermission("manageCustomers")}
                      className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">View Financial Ledger & Cash Flow</span>
                      <p className="text-[11px] text-slate-400">Can inspect salon total sales, expenses, and profit.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(currentRolePerms.viewFinancialLedger)}
                      onChange={() => handleTogglePermission("viewFinancialLedger")}
                      className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">Manage Staff Accounts</span>
                      <p className="text-[11px] text-slate-400">Can add stylists, edit roles, or deactivate staff.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(currentRolePerms.manageStaff)}
                      onChange={() => handleTogglePermission("manageStaff")}
                      className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              disabled={isSavingPermissions}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer ${
                isSaved
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {isSavingPermissions ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : isSaved ? (
                <>
                  <Check className="size-4" />
                  <span>Permissions Saved!</span>
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  <span>Save Role Permissions</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 3: LOGIN & SHIFT POLICIES                             */}
      {/* ========================================================= */}
      {activeTab === "policies" && (
        <form onSubmit={handleSavePermissions} className="flex flex-col gap-6 animate-in fade-in duration-150">
          {/* Card 1: Staff Login & Session Policies */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800">Staff Login & Session Policies</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rules enforced when staff members are logged into the salon terminal.
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">Require Staff PIN for Checkout Transactions</span>
                  <p className="text-[11px] text-slate-400">Staff must verify their 4-digit PIN before finishing each bill.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.requirePinForCheckout}
                  onChange={(e) => setFormData({ ...formData, requirePinForCheckout: e.target.checked })}
                  className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">Restrict Stylists to View Only Their Own Bookings</span>
                  <p className="text-[11px] text-slate-400">When logged in, stylists can only inspect their personal schedule and assigned clients.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.staffCanOnlyViewOwnBookings}
                  onChange={(e) => setFormData({ ...formData, staffCanOnlyViewOwnBookings: e.target.checked })}
                  className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">Restrict Login to Working Hours Only</span>
                  <p className="text-[11px] text-slate-400">Staff accounts cannot log in outside salon operating hours.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.restrictLoginToWorkingHours}
                  onChange={(e) => setFormData({ ...formData, restrictLoginToWorkingHours: e.target.checked })}
                  className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
              </label>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="font-semibold text-slate-800">Terminal Inactivity Auto-Lock</span>
                  <p className="text-[11px] text-slate-400">Automatically logs out staff after idle period on the POS device.</p>
                </div>
                <select
                  value={formData.autoLogoutMinutes}
                  onChange={(e) => setFormData({ ...formData, autoLogoutMinutes: Number(e.target.value) })}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/50 cursor-pointer"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes (Standard)</option>
                  <option value={60}>1 Hour</option>
                  <option value={0}>Never Auto-Lock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Shift Management & Auto-Assignment */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800">Shift Management & Auto-Assignment</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rules for automated staff distribution and breaks in booking schedules.
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">Auto-assign Available Specialist for Walk-in Clients</span>
                  <p className="text-[11px] text-slate-400">Picks the active staff member with lowest load in the current time slot.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoAssignWalkIns}
                  onChange={(e) => setFormData({ ...formData, autoAssignWalkIns: e.target.checked })}
                  className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">Enforce Scheduled Break Times in Calendar</span>
                  <p className="text-[11px] text-slate-400">Prevents appointments from being booked during marked staff breaks.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.enforceBreakSchedule}
                  onChange={(e) => setFormData({ ...formData, enforceBreakSchedule: e.target.checked })}
                  className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
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

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              disabled={isSavingPermissions}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer ${
                isSaved
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {isSavingPermissions ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving Policies...</span>
                </>
              ) : isSaved ? (
                <>
                  <Check className="size-4" />
                  <span>Policies Saved!</span>
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  <span>Save Staff Policies</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* MODALS                                                    */}
      {/* ========================================================= */}

      {/* 1. Add New Staff Role Modal */}
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

            <form onSubmit={handleSaveNewRole}>
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
                    Permissions can be tailored anytime in the Permission Management tab.
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
                  type="submit"
                  disabled={isSavingRole || !newRoleName.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-amber-600 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSavingRole && <Loader2 className="size-3.5 animate-spin" />}
                  <span>Create Role</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Staff Role Modal */}
      {editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Edit2 className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Edit Staff Role</h3>
                  <p className="text-[11px] text-slate-500">
                    Update role title, description, and active status
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingRole(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditRole}>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editRoleName}
                    onChange={(e) => setEditRoleName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Identifier (Slug)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editingRole.value}
                    className="w-full font-mono rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={editRoleDesc}
                    onChange={(e) => setEditRoleDesc(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Role Status</div>
                    <div className="text-[10px] text-slate-500">
                      Active roles appear in staff registration and assignment dropdowns
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={editRoleActive}
                    onClick={() => setEditRoleActive((prev) => !prev)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      editRoleActive ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                        editRoleActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingRole || !editRoleName.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-amber-600 transition disabled:opacity-50 cursor-pointer"
                >
                  {isUpdatingRole && <Loader2 className="size-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Delete Confirmation Modal */}
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
              Are you sure you want to delete this custom staff role? This action cannot be undone.
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
    </div>
  );
}

export default StaffSettingsView;
