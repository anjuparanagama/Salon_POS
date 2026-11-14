import type { Dispatch, SetStateAction } from "react";
import Pagination from "../../../../../components/pagination";
import type { StaffRoleItem } from "../../../../../interface/staff.types";
import type { StaffRoleType } from "../../../types";
import type {
  ComputedRole,
  RoleSearchField,
  RoleSortField,
  VisibleColumns,
} from "../../../../../interface/staff-settings.types";
import { RolesToolbar } from "./roles-toolbar";
import { RolesTable } from "./roles-table";

export interface RolesTabProps {
  dbRoles: StaffRoleItem[];
  filteredAndSortedRoles: ComputedRole[];
  paginatedRoles: ComputedRole[];
  isLoadingRoles: boolean;
  searchField: RoleSearchField;
  onSearchFieldChange: (field: RoleSearchField) => void;
  roleSearchQuery: string;
  onRoleSearchQueryChange: (query: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onSort: (field: RoleSortField) => void;
  showColumnMenu: boolean;
  setShowColumnMenu: Dispatch<SetStateAction<boolean>>;
  visibleColumns: VisibleColumns;
  onToggleColumn: (key: keyof VisibleColumns) => void;
  onRefresh: () => void;
  onExportCSV: () => void;
  onOpenAddRole: () => void;
  onOpenEditRole: (roleItem: StaffRoleItem) => void;
  onDeleteRole: (roleItem: StaffRoleItem) => void;
  onQuickToggleRole: (roleId: string, currentActive: boolean) => void;
  onConfigurePermissions: (roleId: StaffRoleType) => void;
}

export function RolesTab({
  dbRoles,
  filteredAndSortedRoles,
  paginatedRoles,
  isLoadingRoles,
  searchField,
  onSearchFieldChange,
  roleSearchQuery,
  onRoleSearchQueryChange,
  pageSize,
  onPageSizeChange,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onSort,
  showColumnMenu,
  setShowColumnMenu,
  visibleColumns,
  onToggleColumn,
  onRefresh,
  onExportCSV,
  onOpenAddRole,
  onOpenEditRole,
  onDeleteRole,
  onQuickToggleRole,
  onConfigurePermissions,
}: RolesTabProps) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-150">
      {/* Integrated Toolbar */}
      <RolesToolbar
        searchField={searchField}
        onSearchFieldChange={onSearchFieldChange}
        roleSearchQuery={roleSearchQuery}
        onRoleSearchQueryChange={onRoleSearchQueryChange}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        showColumnMenu={showColumnMenu}
        setShowColumnMenu={setShowColumnMenu}
        visibleColumns={visibleColumns}
        onToggleColumn={onToggleColumn}
        onRefresh={onRefresh}
        isLoadingRoles={isLoadingRoles}
        onExportCSV={onExportCSV}
        onOpenAddRole={onOpenAddRole}
      />

      {/* Clean Data Table Container */}
      <RolesTable
        dbRoles={dbRoles}
        paginatedRoles={paginatedRoles}
        visibleColumns={visibleColumns}
        isLoadingRoles={isLoadingRoles}
        roleSearchQuery={roleSearchQuery}
        onSort={onSort}
        onQuickToggleRole={onQuickToggleRole}
        onConfigurePermissions={onConfigurePermissions}
        onOpenEditRole={onOpenEditRole}
        onDeleteRole={onDeleteRole}
      />

      {/* Pagination Component Separated Below Table */}
      {filteredAndSortedRoles.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
          itemLabel="entries"
          className="mt-1"
        />
      )}
    </div>
  );
}

export default RolesTab;
