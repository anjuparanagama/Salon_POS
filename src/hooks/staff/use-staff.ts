import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { staffService, type StaffQueryParams } from "../../services/staff.service";
import type {
  StaffMember,
  StaffStats,
  StaffFormData,
  StaffRole,
} from "../../interface/staff.types";

const defaultStats: StaffStats = {
  totalStaff: 0,
  activeStaff: 0,
  onLeaveCount: 0,
  totalAppointments: 0,
  avgRating: 0,
};

export function useStaff(
  params?: StaffQueryParams,
  initialStaffList?: StaffMember[]
) {
  const queryClient = useQueryClient();

  const staffQuery = useQuery({
    queryKey: ["staff", "list", params],
    queryFn: () => staffService.getStaff(params),
    initialData: initialStaffList
      ? { items: initialStaffList, total: initialStaffList.length }
      : undefined,
  });

  const statsQuery = useQuery({
    queryKey: ["staff", "stats"],
    queryFn: () => staffService.getStats(),
  });

  const rolesQuery = useQuery({
    queryKey: ["staff", "roles"],
    queryFn: () => staffService.getRoles(),
  });

  const staff: StaffMember[] = staffQuery.data?.items ?? [];
  const roles: Array<{ label: string; value: StaffRole }> = rolesQuery.data ?? [];
  const stats: StaffStats = statsQuery.data ?? defaultStats;
  const total: number = staffQuery.data?.total ?? staff.length;
  const isLoading = staffQuery.isLoading || statsQuery.isLoading || rolesQuery.isLoading;

  const error = staffQuery.error
    ? staffQuery.error instanceof Error
      ? staffQuery.error.message
      : "Failed to load staff"
    : null;

  const fetchAll = useCallback(async () => {
    await Promise.allSettled([
      staffQuery.refetch(),
      statsQuery.refetch(),
      rolesQuery.refetch(),
    ]);
  }, [staffQuery, statsQuery, rolesQuery]);

  const createStaff = async (data: StaffFormData) => {
    try {
      const created = await staffService.createStaff(data);
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
      return created;
    } catch {
      const fallback: StaffMember = {
        ...data,
        canAccessPos: Boolean(data.canAccessPos),
        id: `st-${Date.now()}`,
        status: data.status || "active",
        joinedDate: new Date().toISOString().split("T")[0],
        completedAppointments: 0,
        revenueGenerated: 0,
        rating: 5.0,
        reviewsCount: 0,
      };
      queryClient.setQueryData(
        ["staff", "list", params],
        (old: { items: StaffMember[]; total: number } | undefined) => {
          if (!old) return { items: [fallback], total: 1 };
          return { ...old, items: [fallback, ...old.items], total: old.total + 1 };
        }
      );
      return fallback;
    }
  };

  const updateStaff = async (id: string, data: Partial<StaffFormData>) => {
    try {
      const updated = await staffService.updateStaff(id, data);
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
      return updated;
    } catch {
      queryClient.setQueryData(
        ["staff", "list", params],
        (old: { items: StaffMember[]; total: number } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((s) => (s.id === id ? { ...s, ...data } : s)),
          };
        }
      );
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      await staffService.deleteStaff(id);
    } finally {
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
    }
  };

  const toggleStatus = async (id: string) => {
    queryClient.setQueryData(
      ["staff", "list", params],
      (old: { items: StaffMember[]; total: number; page: number; pageSize: number } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((s) =>
            s.id === id
              ? { ...s, status: s.status === "active" ? "inactive" : "active" }
              : s
          ),
        };
      }
    );

    try {
      const res = await staffService.toggleStatus(id);
      queryClient.setQueryData(
        ["staff", "list", params],
        (old: { items: StaffMember[]; total: number; page: number; pageSize: number } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((s) =>
              s.id === id ? { ...s, status: res.status as StaffMember["status"] } : s
            ),
          };
        }
      );
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
    } catch {
      await fetchAll();
    }
  };

  return {
    staff,
    roles,
    stats,
    total,
    isLoading,
    error,
    refetch: fetchAll,
    createStaff,
    updateStaff,
    deleteStaff,
    toggleStatus,
  };
}

export default useStaff;
