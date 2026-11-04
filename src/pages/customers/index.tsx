import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { UserPlus } from "lucide-react";
import type {
  Customer,
  CustomerFilterState,
  CustomerFormData,
  CustomerStats as CustomerStatsType,
} from "../../interface/customer.types";

import CustomerStats from "./components/customer-stats";
import CustomerFilters from "./components/customer-filters";
import CustomerList from "./components/customer-list";
import CustomerModal from "./components/customer-modal";
import Header from "../../components/header";

const initialCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "Jessica Miller",
    phone: "+1 (555) 234-5678",
    email: "jessica.m@example.com",
    gender: "female",
    membershipTier: "platinum",
    status: "vip",
    totalVisits: 28,
    totalSpent: 2150.0,
    lastVisit: "2026-11-01",
    preferredStaff: "Amelia Vance",
    notes: "Prefers cold beverages; allergic to ammonia based dyes.",
    tags: ["Balayage", "Loyal VIP"],
    createdAt: "2025-01-14",
  },
  {
    id: "cust-2",
    name: "Olivia Davis",
    phone: "+1 (555) 345-6789",
    email: "olivia.davis@example.com",
    gender: "female",
    membershipTier: "gold",
    status: "active",
    totalVisits: 14,
    totalSpent: 920.0,
    lastVisit: "2026-10-28",
    preferredStaff: "Sophia Chen",
    notes: "Prefers organic facial oils and gentle scalp massage.",
    tags: ["Facials", "Skincare"],
    createdAt: "2025-04-10",
  },
  {
    id: "cust-3",
    name: "Marcus Vance",
    phone: "+1 (555) 456-7890",
    email: "marcus.v@example.com",
    gender: "male",
    membershipTier: "silver",
    status: "active",
    totalVisits: 9,
    totalSpent: 480.0,
    lastVisit: "2026-10-15",
    preferredStaff: "Noah Sterling",
    notes: "Classic fade haircut with beard sculpting.",
    tags: ["Fade", "Beard Care"],
    createdAt: "2025-06-22",
  },
  {
    id: "cust-4",
    name: "Sophia Martinez",
    phone: "+1 (555) 567-8901",
    email: "sophia.m@example.com",
    gender: "female",
    membershipTier: "platinum",
    status: "vip",
    totalVisits: 32,
    totalSpent: 3400.0,
    lastVisit: "2026-11-03",
    preferredStaff: "Isabella Gomez",
    notes: "Regular bridal trial client; loves Kerastase hair treatments.",
    tags: ["Bridal", "Colorist"],
    createdAt: "2024-11-18",
  },
  {
    id: "cust-5",
    name: "Liam Johnson",
    phone: "+1 (555) 678-9012",
    email: "liam.j@example.com",
    gender: "male",
    membershipTier: "regular",
    status: "active",
    totalVisits: 4,
    totalSpent: 190.0,
    lastVisit: "2026-09-12",
    preferredStaff: "Noah Sterling",
    notes: "Prefers matte pomade finish.",
    tags: ["Haircut"],
    createdAt: "2026-02-05",
  },
  {
    id: "cust-6",
    name: "Emily Clark",
    phone: "+1 (555) 789-0123",
    email: "emily.clark@example.com",
    gender: "female",
    membershipTier: "silver",
    status: "inactive",
    totalVisits: 6,
    totalSpent: 380.0,
    lastVisit: "2026-06-20",
    preferredStaff: "Olivia Wilde",
    notes: "Last visited for nail extensions; send re-engagement discount voucher.",
    tags: ["Manicure"],
    createdAt: "2025-08-30",
  },
];

export function Customers() {
  const { t } = useTranslation(["common"]);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [filters, setFilters] = useState<CustomerFilterState>({
    search: "",
    status: "all",
    membershipTier: "all",
    sortBy: "recent",
  });

  const handleFilterChange = (updated: Partial<CustomerFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
  };

  const handleSaveCustomer = (data: CustomerFormData) => {
    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id
            ? {
                ...c,
                ...data,
              }
            : c
        )
      );
    } else {
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        ...data,
        totalVisits: 0,
        totalSpent: 0,
        lastVisit: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCustomers((prev) => [newCustomer, ...prev]);
    }
  };

  // KPI Statistics
  const stats: CustomerStatsType = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.status === "active" || c.status === "vip").length;
    const vip = customers.filter(
      (c) => c.status === "vip" || c.membershipTier === "platinum" || c.membershipTier === "gold"
    ).length;
    const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);
    const avgSpend = total > 0 ? totalRevenue / total : 0;

    return {
      totalCustomers: total,
      activeCustomers: active,
      vipCustomers: vip,
      totalRevenue,
      avgSpendPerCustomer: avgSpend,
    };
  }, [customers]);

  // Filtered and sorted customers
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const matchesName = c.name.toLowerCase().includes(query);
          const matchesPhone = c.phone.toLowerCase().includes(query);
          const matchesEmail = c.email.toLowerCase().includes(query);
          if (!matchesName && !matchesPhone && !matchesEmail) return false;
        }

        if (filters.status !== "all" && c.status !== filters.status) {
          return false;
        }

        if (filters.membershipTier !== "all" && c.membershipTier !== filters.membershipTier) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "visits") return b.totalVisits - a.totalVisits;
        if (filters.sortBy === "spent") return b.totalSpent - a.totalSpent;
        if (filters.sortBy === "name") return a.name.localeCompare(b.name);
        // Default: most recent
        return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
      });
  }, [customers, filters]);

  return (
    <div className="flex flex-col gap-5 text-slate-900">
      {/* Top Header */}
      <Header
        title={t("customers.title", "Customer Directory")}
        description={t(
          "customers.subtitle",
          "Manage salon clients, client loyalty tiers, contact info, and visit history."
        )}
        actions={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-dark cursor-pointer"
          >
            <UserPlus className="size-4" />
            <span>{t("customers.addCustomer", "New Customer")}</span>
          </button>
        }
      />

      {/* KPI Stats */}
      <CustomerStats stats={stats} />

      {/* Filters & Search */}
      <CustomerFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Customers List Table */}
      <CustomerList
        customers={filteredCustomers}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Customer Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveCustomer}
        editingCustomer={editingCustomer}
      />
    </div>
  );
}

export default Customers;

