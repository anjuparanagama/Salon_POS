import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import type {
  StaffMember,
  StaffFilterState,
  StaffFormData,
} from "../../interface/staff.types";
import { useStaff } from "../../hooks/staff";

import StaffFilters from "./components/staff-filters";
import StaffList from "./components/staff-list";
import StaffPanel from "./components/staff-panel";
import StaffViewPanel from "./components/staff-view-panel";
import Header from "../../components/header";

export function Staff() {
  const { t } = useTranslation(["common"]);
  const {
    staff: staffList,
    createStaff,
    updateStaff,
    deleteStaff,
    toggleStatus,
    isLoading,
  } = useStaff();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingStaff, setViewingStaff] = useState<StaffMember | null>(null);

  const [filters, setFilters] = useState<StaffFilterState>({
    search: "",
    searchField: "name",
    role: "all",
    status: "all",
    sortBy: "name",
  });

  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    id: true,
    name: true,
    role: true,
    phone: true,
    email: true,
    status: true,
    actions: true,
  });

  const handleFilterChange = (updated: Partial<StaffFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleToggleColumn = (columnKey: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: prev[columnKey] === false ? true : false,
    }));
  };

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setIsPanelOpen(true);
  };

  const handleOpenEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setIsPanelOpen(true);
  };

  const handleOpenView = (staff: StaffMember) => {
    setViewingStaff(staff);
    setIsViewOpen(true);
  };

  const handleDelete = async (staffId: string) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      await deleteStaff(staffId);
    }
  };

  const handleToggleStatus = (staffId: string) => {
    toggleStatus(staffId);
  };

  const handleSaveStaff = async (data: StaffFormData) => {
    if (editingStaff) {
      await updateStaff(editingStaff.id, data);
    } else {
      await createStaff(data);
    }
  };

  // Filtered & sorted staff list
  const filteredStaff = useMemo(() => {
    return staffList
      .filter((s) => {
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const searchField = filters.searchField || "name";

          if (searchField === "name") {
            if (!s.name.toLowerCase().includes(query)) return false;
          } else if (searchField === "role") {
            if (!s.role.toLowerCase().includes(query)) return false;
          } else if (searchField === "phone") {
            if (!s.phone.toLowerCase().includes(query)) return false;
          } else if (searchField === "email") {
            if (!s.email.toLowerCase().includes(query)) return false;
          } else {
            const matchesName = s.name.toLowerCase().includes(query);
            const matchesEmail = s.email.toLowerCase().includes(query);
            const matchesPhone = s.phone.toLowerCase().includes(query);
            const matchesRole = s.role.toLowerCase().includes(query);
            const matchesSpecialty = s.specialties.some((spec) =>
              spec.toLowerCase().includes(query)
            );
            if (!matchesName && !matchesEmail && !matchesPhone && !matchesRole && !matchesSpecialty) {
              return false;
            }
          }
        }

        if (filters.role !== "all" && s.role !== filters.role) {
          return false;
        }

        if (filters.status !== "all" && s.status !== filters.status) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "rating") return b.rating - a.rating;
        if (filters.sortBy === "appointments") {
          return b.completedAppointments - a.completedAppointments;
        }
        if (filters.sortBy === "revenue") return b.revenueGenerated - a.revenueGenerated;
        return a.name.localeCompare(b.name);
      });
  }, [staffList, filters]);

  // Paginated staff
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStaff.slice(start, start + pageSize);
  }, [filteredStaff, currentPage, pageSize]);

  // Export to CSV
  const handleExportCsv = () => {
    if (filteredStaff.length === 0) return;
    const headers = ["Staff ID", "Name", "Role", "Phone", "Email", "Status", "Rating", "Completed Appointments"];
    const rows = filteredStaff.map((s) => [
      `"${s.id}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.role.replace(/"/g, '""')}"`,
      `"${s.phone}"`,
      `"${s.email}"`,
      s.status,
      s.rating,
      s.completedAppointments,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `staff_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* Top Header */}
      <Header
        title={t("staff.title", "Staff & Stylists")}
        description={t(
          "staff.subtitle",
          "Manage salon team members, performance, and commission rates."
        )}
        isLoading={isLoading}
        actions={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-dark cursor-pointer"
          >
            <UserPlus className="size-4" />
            <span>{t("staff.addStaff", "Add Staff Member")}</span>
          </button>
        }
      />

      {/* Filter and Search Controls */}
      <StaffFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
        onExportCsv={handleExportCsv}
      />

      {/* Staff Table */}
      <StaffList
        staffList={paginatedStaff}
        isLoading={isLoading}
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        visibleColumns={visibleColumns}
      />

      {/* Pagination Footer */}
      {filteredStaff.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-xs text-slate-600 border-t border-slate-100">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {Math.min((currentPage - 1) * pageSize + 1, filteredStaff.length)}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-900">
              {Math.min(currentPage * pageSize, filteredStaff.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {filteredStaff.length}
            </span>{" "}
            items
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="size-3.5" />
              <span>Previous</span>
            </button>
            <span className="px-2 font-medium text-slate-700">
              Page {currentPage} of {Math.max(1, Math.ceil(filteredStaff.length / pageSize))}
            </span>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < Math.ceil(filteredStaff.length / pageSize) ? prev + 1 : prev
                )
              }
              disabled={currentPage >= Math.ceil(filteredStaff.length / pageSize)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Slide-over Side Panel for Add & Edit */}
      <StaffPanel
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false);
          setEditingStaff(null);
        }}
        onSubmit={handleSaveStaff}
        editingStaff={editingStaff}
      />

      {/* Slide-over Side Panel for View */}
      <StaffViewPanel
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setViewingStaff(null);
        }}
        staff={viewingStaff}
        onEdit={handleOpenEdit}
      />
    </div>
  );
}

export default Staff;
