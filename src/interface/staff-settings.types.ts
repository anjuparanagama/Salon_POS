import type { StaffRoleType, RolePermissions, StaffSettingsState } from "../pages/settings/types";
import type { StaffRoleItem } from "./staff.types";

export type StaffSettingsTab = "roles" | "permissions" | "policies";

export interface ComputedRole {
  id: StaffRoleType;
  dbId?: string;
  roleCode: string;
  label: string;
  badge: string;
  description: string;
  isCustom: boolean;
  active: boolean;
  staffCount: number;
}

export interface VisibleColumns {
  roleId: boolean;
  roleName: boolean;
  identifier: boolean;
  description: boolean;
  staffCount: boolean;
  status: boolean;
}

export type RoleSearchField = "name" | "slug" | "id" | "all";
export type RoleSortField = "roleCode" | "label" | "id" | "staffCount" | "active";

export type { StaffRoleItem, StaffRoleType, RolePermissions, StaffSettingsState };
