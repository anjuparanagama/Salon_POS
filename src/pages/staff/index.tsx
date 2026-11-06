import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { UserPlus } from "lucide-react";
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
  } = useStaff();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingStaff, setViewingStaff] = useState<StaffMember | null>(null);

  const [filters, setFilters] = useState<StaffFilterState>({
    search: "",
    role: "all",
    status: "all",
    sortBy: "name",
  });

  const handleFilterChange = (updated: Partial<StaffFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
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
          const matchesName = s.name.toLowerCase().includes(query);
          const matchesEmail = s.email.toLowerCase().includes(query);
          const matchesPhone = s.phone.toLowerCase().includes(query);
          const matchesSpecialty = s.specialties.some((spec) =>
            spec.toLowerCase().includes(query)
          );
          if (!matchesName && !matchesEmail && !matchesPhone && !matchesSpecialty) {
            return false;
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

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* Top Header */}
      <Header
        title={t("staff.title", "Staff & Stylists")}
        description={t(
          "staff.subtitle",
          "Manage salon team members, performance, and commission rates."
        )}
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
      <StaffFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Staff Table */}
      <StaffList
        staffList={filteredStaff}
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

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
