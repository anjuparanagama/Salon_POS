import { useState, useEffect, useMemo, type Dispatch, type SetStateAction } from "react";
import { staffService } from "../../services/staff.service";
import type { StaffRoleItem } from "../../interface/staff.types";
import type { RolePermissions, StaffSettingsState } from "../../pages/settings/types";
import {
  defaultPermissions,
  DEFAULT_ROLES_META,
  FALLBACK_ROLES,
} from "../../constants/staff-settings.constants";
import type {
  ComputedRole,
  RoleSearchField,
  RoleSortField,
  VisibleColumns,
} from "../../interface/staff-settings.types";

export interface UseStaffRolesProps {
  setFormData: Dispatch<SetStateAction<StaffSettingsState>>;
}

export function useStaffRoles({ setFormData }: UseStaffRolesProps) {
  const [dbRoles, setDbRoles] = useState<StaffRoleItem[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [roleSearchQuery, setRoleSearchQuery] = useState("");

  const [searchField, setSearchField] = useState<RoleSearchField>("name");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<RoleSortField>("roleCode");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>({
    roleId: true,
    roleName: true,
    identifier: true,
    description: true,
    staffCount: true,
    status: true,
  });

  const loadRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const data = await staffService.getRoles();
      if (Array.isArray(data) && data.length > 0) {
        setDbRoles(data);
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

  const computedRolesList: ComputedRole[] = useMemo(() => {
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

  const totalItems = filteredAndSortedRoles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedRoles.slice(start, start + pageSize);
  }, [filteredAndSortedRoles, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSort = (field: RoleSortField) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

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

  return {
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
    sortField,
    sortAsc,
    handleSort,
    showColumnMenu,
    setShowColumnMenu,
    visibleColumns,
    setVisibleColumns,
    handleExportCSV,
    handleQuickToggleRole,
  };
}

export default useStaffRoles;
