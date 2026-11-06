import { useState, useEffect, useCallback } from "react";
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
  const [staff, setStaff] = useState<StaffMember[]>(initialStaffList ?? []);
  const [roles, setRoles] = useState<Array<{ label: string; value: StaffRole }>>([]);
  const [stats, setStats] = useState<StaffStats>(defaultStats);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [staffRes, statsRes, rolesRes] = await Promise.allSettled([
        staffService.getStaff(params),
        staffService.getStats(),
        staffService.getRoles(),
      ]);

      if (staffRes.status === "fulfilled") {
        setStaff(staffRes.value.items);
        setTotal(staffRes.value.total);
      }
      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value);
      }
      if (rolesRes.status === "fulfilled") {
        setRoles(rolesRes.value);
      }
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load staff");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [staffRes, statsRes, rolesRes] = await Promise.allSettled([
          staffService.getStaff(params),
          staffService.getStats(),
          staffService.getRoles(),
        ]);

        if (!ignore) {
          if (staffRes.status === "fulfilled") {
            setStaff(staffRes.value.items);
            setTotal(staffRes.value.total);
          }
          if (statsRes.status === "fulfilled") {
            setStats(statsRes.value);
          }
          if (rolesRes.status === "fulfilled") {
            setRoles(rolesRes.value);
          }
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load staff");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      ignore = true;
    };
  }, [params]);

  const createStaff = async (data: StaffFormData) => {
    try {
      const created = await staffService.createStaff(data);
      setStaff((prev) => [created, ...prev]);
      return created;
    } catch {
      const fallback: StaffMember = {
        ...data,
        id: `st-${Date.now()}`,
        status: data.status || "active",
        joinedDate: new Date().toISOString().split("T")[0],
        completedAppointments: 0,
        revenueGenerated: 0,
        rating: 5.0,
        reviewsCount: 0,
      };
      setStaff((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  const updateStaff = async (id: string, data: Partial<StaffFormData>) => {
    try {
      const updated = await staffService.updateStaff(id, data);
      setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
      return updated;
    } catch {
      setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      await staffService.deleteStaff(id);
    } finally {
      setStaff((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const res = await staffService.toggleStatus(id);
      setStaff((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: res.status as StaffMember["status"] } : s
        )
      );
    } catch {
      setStaff((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, status: s.status === "active" ? "inactive" : "active" }
            : s
        )
      );
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

