import { Edit3, Trash2, Phone, Mail, Crown, AlertCircle, Calendar, UserCheck } from "lucide-react";
import type { Customer, MembershipTier, CustomerStatus } from "../../../../interface/customer.types";

export type CustomerListProps = {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
};

const tierStyles: Record<MembershipTier, { bg: string; text: string; label: string }> = {
  platinum: {
    bg: "bg-purple-50 text-purple-700 border-purple-200",
    text: "text-purple-700",
    label: "Platinum",
  },
  gold: {
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    text: "text-amber-700",
    label: "Gold VIP",
  },
  silver: {
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    text: "text-slate-700",
    label: "Silver",
  },
  regular: {
    bg: "bg-slate-50 text-slate-600 border-slate-200",
    text: "text-slate-600",
    label: "Standard",
  },
};

const statusStyles: Record<CustomerStatus, { bg: string; dot: string; label: string }> = {
  active: {
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    label: "Active",
  },
  vip: {
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    label: "VIP",
  },
  inactive: {
    bg: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
    label: "Inactive",
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function CustomerList({ customers, onEdit, onDelete }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <AlertCircle className="size-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-800">No customers found</h3>
        <p className="mt-1 text-xs text-slate-500">
          Try clearing search filters or add a new customer to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50 font-semibold uppercase tracking-wider text-slate-600">
            <tr>
              <th scope="col" className="px-5 py-3.5">Customer</th>
              <th scope="col" className="px-5 py-3.5">Contact Information</th>
              <th scope="col" className="px-5 py-3.5">Tier & Status</th>
              <th scope="col" className="px-5 py-3.5">Visits & Spend</th>
              <th scope="col" className="px-5 py-3.5">Last Visit</th>
              <th scope="col" className="px-5 py-3.5">Preferred Stylist</th>
              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => {
              const tier = tierStyles[customer.membershipTier];
              const status = statusStyles[customer.status];

              return (
                <tr key={customer.id} className="transition-colors hover:bg-slate-50/70">
                  {/* Customer Info */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-lighter text-primary font-bold text-xs">
                        {getInitials(customer.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{customer.name}</span>
                          {customer.membershipTier === "platinum" && (
                            <Crown className="size-3.5 text-purple-600" />
                          )}
                          {customer.membershipTier === "gold" && (
                            <Crown className="size-3.5 text-amber-500" />
                          )}
                        </div>
                        {customer.notes && (
                          <div className="mt-0.5 max-w-[200px] truncate text-[11px] text-slate-400">
                            {customer.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex flex-col gap-1 text-[11px] text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Phone className="size-3 text-slate-400" />
                        {customer.phone}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Mail className="size-3 text-slate-400" />
                        {customer.email}
                      </span>
                    </div>
                  </td>

                  {/* Tier & Status */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex flex-col items-start gap-1.5">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${tier.bg}`}
                      >
                        {tier.label}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${status.bg}`}
                      >
                        <span className={`size-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>
                  </td>

                  {/* Visits & Spend */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="font-bold text-slate-900">
                      ${customer.totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {customer.totalVisits} {customer.totalVisits === 1 ? "visit" : "visits"}
                    </div>
                  </td>

                  {/* Last Visit */}
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Calendar className="size-3.5 text-slate-400" />
                      <span>{customer.lastVisit || "Never"}</span>
                    </div>
                  </td>

                  {/* Preferred Stylist */}
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {customer.preferredStaff ? (
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <UserCheck className="size-3.5 text-primary" />
                        <span>{customer.preferredStaff}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No preference</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(customer)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                        title="Edit Customer"
                      >
                        <Edit3 className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(customer.id)}
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                        title="Delete Customer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerList;

