import { useState, type FormEvent } from "react";
import { staffService } from "../../../../services/staff.service";
import type { StaffRoleItem } from "../../../../interface/staff.types";
import type { RolePermissions, StaffRoleType, StaffSettingsState } from "../../types";
import { useStaffRoles } from "../../../../hooks/settings";
import {
  defaultPermissions,
  defaultStaffSettings,
} from "../../../../constants/staff-settings.constants";
import type { StaffSettingsTab } from "../../../../interface/staff-settings.types";
import {
  RolesTab,
  PermissionsTab,
  PoliciesTab,
  AddRoleModal,
  EditRoleModal,
  DeleteRoleModal,
} from "./components";

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

  // Dynamic roles hook for table & database operations
  const {
    dbRoles,
    setDbRoles,
    isLoadingRoles,
    loadRoles,
    computedRolesList,
    filteredAndSortedRoles,
    paginatedRoles,
    totalItems,
    totalPages,
    searchField,
    setSearchField,
    roleSearchQuery,
    setRoleSearchQuery,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    handleSort,
    showColumnMenu,
    setShowColumnMenu,
    visibleColumns,
    setVisibleColumns,
    handleExportCSV,
    handleQuickToggleRole,
  } = useStaffRoles({ setFormData });

  // Modal States
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<StaffRoleItem | null>(null);
  const [deletingRole, setDeletingRole] = useState<StaffRoleItem | null>(null);

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

    const roleItem = dbRoles.find((r) => r.value === activeRole);
    const roleIdOrSlug = roleItem?.id || activeRole;

    try {
      await staffService.updateRole(roleIdOrSlug, {
        permissions: formData.rolesPermissions[activeRole] as unknown as Record<string, boolean>,
      });
      await loadRoles();
    } catch (err) {
      console.warn("Backend permissions sync note:", err);
    } finally {
      setIsSavingPermissions(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  const handleResetDefaults = () => {
    setFormData(defaultStaffSettings);
    setActiveRole("stylist");
    localStorage.removeItem("sribees_staff_permissions_settings");
  };

  return (
    <div className="flex flex-col gap-4 text-slate-900">
      {/* TAB 1: ROLE MANAGEMENT */}
      {activeTab === "roles" && (
        <RolesTab
          dbRoles={dbRoles}
          filteredAndSortedRoles={filteredAndSortedRoles}
          paginatedRoles={paginatedRoles}
          isLoadingRoles={isLoadingRoles}
          searchField={searchField}
          onSearchFieldChange={setSearchField}
          roleSearchQuery={roleSearchQuery}
          onRoleSearchQueryChange={(query) => {
            setRoleSearchQuery(query);
            setCurrentPage(1);
          }}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onSort={handleSort}
          showColumnMenu={showColumnMenu}
          setShowColumnMenu={setShowColumnMenu}
          visibleColumns={visibleColumns}
          onToggleColumn={(key) => setVisibleColumns((p) => ({ ...p, [key]: !p[key] }))}
          onRefresh={loadRoles}
          onExportCSV={handleExportCSV}
          onOpenAddRole={() => setIsAddRoleOpen(true)}
          onOpenEditRole={(roleItem) => setEditingRole(roleItem)}
          onDeleteRole={(roleItem) => setDeletingRole(roleItem)}
          onQuickToggleRole={handleQuickToggleRole}
          onConfigurePermissions={(roleId) => {
            setActiveRole(roleId);
            setActiveTab("permissions");
          }}
        />
      )}

      {/* TAB 2: PERMISSION MANAGEMENT */}
      {activeTab === "permissions" && (
        <PermissionsTab
          computedRolesList={computedRolesList}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          currentRolePerms={currentRolePerms}
          handleTogglePermission={handleTogglePermission}
          handleSelectAllForRole={handleSelectAllForRole}
          handleDeselectAllForRole={handleDeselectAllForRole}
          handleResetDefaults={handleResetDefaults}
          handleSavePermissions={handleSavePermissions}
          isSavingPermissions={isSavingPermissions}
          isSaved={isSaved}
          activeCount={activeCount}
          totalCount={totalCount}
        />
      )}

      {/* TAB 3: LOGIN & SHIFT POLICIES */}
      {activeTab === "policies" && (
        <PoliciesTab
          formData={formData}
          setFormData={setFormData}
          handleResetDefaults={handleResetDefaults}
          handleSavePermissions={handleSavePermissions}
          isSavingPermissions={isSavingPermissions}
          isSaved={isSaved}
        />
      )}

      {/* MODALS */}
      <AddRoleModal
        isOpen={isAddRoleOpen}
        onClose={() => setIsAddRoleOpen(false)}
        computedRolesList={computedRolesList}
        formData={formData}
        onRoleCreated={(created, templatePerms) => {
          setDbRoles((prev) => [...prev, created]);
          setFormData((prev) => ({
            ...prev,
            rolesPermissions: {
              ...prev.rolesPermissions,
              [created.value]: { ...templatePerms },
            },
          }));
          setActiveRole(created.value);
        }}
      />

      <EditRoleModal
        role={editingRole}
        onClose={() => setEditingRole(null)}
        onRoleUpdated={(roleValue, updated) => {
          setDbRoles((prev) =>
            prev.map((r) =>
              r.value === roleValue || (editingRole && r.id === editingRole.id)
                ? { ...r, ...updated }
                : r
            )
          );
        }}
      />

      <DeleteRoleModal
        role={deletingRole}
        onClose={() => setDeletingRole(null)}
        onRoleDeleted={(deleted) => {
          setDbRoles((prev) =>
            prev.filter((r) => r.id !== deleted.id && r.value !== deleted.value)
          );
          if (activeRole === deleted.value) {
            setActiveRole("stylist");
          }
        }}
      />
    </div>
  );
}

export default StaffSettingsView;
