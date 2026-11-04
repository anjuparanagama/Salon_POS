import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { UserPlus } from "lucide-react";
import type {
  StaffMember,
  StaffFilterState,
  StaffFormData,
  StaffStats as StaffStatsType,
} from "../../interface/staff.types";

import StaffStats from "./components/staff-stats";
import StaffFilters from "./components/staff-filters";
import StaffList from "./components/staff-list";
import StaffModal from "./components/staff-modal";
import Header from "../../components/header";

const initialStaff: StaffMember[] = [
  {
    id: "st-1",
    name: "Amelia Vance",
    role: "senior_stylist",
    email: "amelia.vance@salonpos.com",
    phone: "+1 (555) 234-5678",
    specialties: ["Balayage", "Bridal Updo", "Keratin Treatment"],
    commissionRate: 25,
    rating: 4.9,
    reviewsCount: 142,
    completedAppointments: 320,
    revenueGenerated: 24800,
    scheduleDays: ["Tue", "Wed", "Thu", "Fri", "Sat"],
    status: "active",
    joinedDate: "2023-03-15",
    bio: "Master colorist and senior stylist with 8 years of luxury salon experience.",
  },
  {
    id: "st-2",
    name: "Olivia Wilde",
    role: "nail_technician",
    email: "olivia.wilde@salonpos.com",
    phone: "+1 (555) 345-6789",
    specialties: ["Gel Extensions", "Nail Art", "Deluxe Pedicure"],
    commissionRate: 20,
    rating: 4.8,
    reviewsCount: 98,
    completedAppointments: 245,
    revenueGenerated: 14500,
    scheduleDays: ["Mon", "Wed", "Thu", "Fri", "Sat"],
    status: "active",
    joinedDate: "2023-07-20",
    bio: "Certified nail artist specializing in organic nail wellness and modern artistic sets.",
  },
  {
    id: "st-3",
    name: "Isabella Gomez",
    role: "colorist",
    email: "isabella.g@salonpos.com",
    phone: "+1 (555) 456-7890",
    specialties: ["Vivid Hair Colors", "Bleach & Tone", "Highlights"],
    commissionRate: 22,
    rating: 4.9,
    reviewsCount: 115,
    completedAppointments: 210,
    revenueGenerated: 21200,
    scheduleDays: ["Mon", "Tue", "Thu", "Fri", "Sun"],
    status: "active",
    joinedDate: "2024-01-10",
    bio: "Passionate about bold color transformations and hair repair chemistry.",
  },
  {
    id: "st-4",
    name: "Noah Sterling",
    role: "barber",
    email: "noah.sterling@salonpos.com",
    phone: "+1 (555) 567-8901",
    specialties: ["Skin Fades", "Hot Towel Shave", "Beard Sculpting"],
    commissionRate: 20,
    rating: 4.7,
    reviewsCount: 84,
    completedAppointments: 195,
    revenueGenerated: 11800,
    scheduleDays: ["Mon", "Tue", "Wed", "Fri", "Sat"],
    status: "active",
    joinedDate: "2024-05-18",
    bio: "Traditional barber craftsmanship mixed with cutting-edge men's grooming techniques.",
  },
  {
    id: "st-5",
    name: "Sophia Chen",
    role: "esthetician",
    email: "sophia.chen@salonpos.com",
    phone: "+1 (555) 678-9012",
    specialties: ["Hydra Facials", "Chemical Peels", "Microdermabrasion"],
    commissionRate: 22,
    rating: 5.0,
    reviewsCount: 160,
    completedAppointments: 280,
    revenueGenerated: 26400,
    scheduleDays: ["Wed", "Thu", "Fri", "Sat", "Sun"],
    status: "active",
    joinedDate: "2023-11-01",
    bio: "Licensed medical esthetician dedicated to customized skincare routines.",
  },
  {
    id: "st-6",
    name: "Elena Rostova",
    role: "salon_manager",
    email: "elena.rostova@salonpos.com",
    phone: "+1 (555) 789-0123",
    specialties: ["Salon Operations", "Customer Experience", "Staff Mentorship"],
    commissionRate: 10,
    rating: 4.9,
    reviewsCount: 45,
    completedAppointments: 90,
    revenueGenerated: 8500,
    scheduleDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    status: "on_leave",
    joinedDate: "2022-09-15",
    bio: "General manager overseeing everyday boutique salon flow and excellence.",
  },
];

export function Staff() {
  const { t } = useTranslation(["common"]);
  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaff);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

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
    setIsModalOpen(true);
  };

  const handleOpenEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleDelete = (staffId: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== staffId));
  };

  const handleToggleStatus = (staffId: string) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          const nextStatus = s.status === "active" ? "on_leave" : "active";
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const handleSaveStaff = (data: StaffFormData) => {
    if (editingStaff) {
      setStaffList((prev) =>
        prev.map((s) =>
          s.id === editingStaff.id
            ? {
                ...s,
                ...data,
              }
            : s
        )
      );
    } else {
      const newStaff: StaffMember = {
        id: `st-${Date.now()}`,
        ...data,
        rating: 5.0,
        reviewsCount: 0,
        completedAppointments: 0,
        revenueGenerated: 0,
        joinedDate: new Date().toISOString().split("T")[0],
      };
      setStaffList((prev) => [newStaff, ...prev]);
    }
  };

  // KPI Calculations
  const stats: StaffStatsType = useMemo(() => {
    const total = staffList.length;
    const active = staffList.filter((s) => s.status === "active").length;
    const onLeave = staffList.filter((s) => s.status === "on_leave").length;
    const totalAppointments = staffList.reduce((acc, s) => acc + s.completedAppointments, 0);
    const avgRating =
      total > 0
        ? staffList.reduce((acc, s) => acc + s.rating, 0) / total
        : 0;

    return {
      totalStaff: total,
      activeStaff: active,
      onLeaveCount: onLeave,
      totalAppointments,
      avgRating,
    };
  }, [staffList]);

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
          "Manage salon team members, working schedules, performance, and commission rates."
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

      {/* KPI Stats */}
      <StaffStats stats={stats} />

      {/* Filter and Search Controls */}
      <StaffFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Staff List Table */}
      <StaffList
        staffList={filteredStaff}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {/* Staff Modal */}
      <StaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveStaff}
        editingStaff={editingStaff}
      />
    </div>
  );
}

export default Staff;

