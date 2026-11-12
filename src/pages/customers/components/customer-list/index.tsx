import { Edit3, Trash2, Phone, Mail, AlertCircle, Calendar, History, Loader2 } from "lucide-react";
import type { Customer, CustomerGender } from "../../../../interface/customer.types";
import { formatPrice } from "../../../../helpers/price.helper";

export type CustomerListProps = {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  onViewHistory: (customer: Customer) => void;
  isLoading?: boolean;
};

const genderLabels: Record<CustomerGender, { label: string; bg: string }> = {
  female: { label: "Female", bg: "bg-pink-50 text-pink-700 border-pink-200" },
  male: { label: "Male", bg: "bg-blue-50 text-blue-700 border-blue-200" },
  other: { label: "Other", bg: "bg-purple-50 text-purple-700 border-purple-200" },
  prefer_not_to_say: { label: "Not specified", bg: "bg-slate-50 text-slate-600 border-slate-200" },
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

export function CustomerList({
  customers,
  onEdit,
  onDelete,
  onViewHistory,
  isLoading = false,
}: CustomerListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-white p-12 text-center shadow-xs">
        <Loader2 className="size-7 animate-spin text-primary" />
        <p className="mt-3 text-xs font-medium text-slate-600">Loading customers...</p>
      </div>
    );
  }

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
              <th scope="col" className="px-5 py-3.5">Customer Name & Gender</th>
              <th scope="col" className="px-5 py-3.5">Contact Number & Email</th>
              <th scope="col" className="px-5 py-3.5">Last Visit</th>
              <th scope="col" className="px-5 py-3.5">Visits & Spends</th>
              <th scope="col" className="px-5 py-3.5 text-center">Service History</th>
              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => {
              const genderTag = genderLabels[customer.gender] || genderLabels.prefer_not_to_say;

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
                        </div>
                        <div className="mt-0.5">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.2 text-[10px] font-medium ${genderTag.bg}`}
                          >
                            {genderTag.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex flex-col gap-1 text-[11px] text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium text-slate-800">
                        <Phone className="size-3 text-slate-400" />
                        {customer.phone}
                      </span>
                      {customer.email ? (
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Mail className="size-3 text-slate-400" />
                          {customer.email}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[10px]">No email</span>
                      )}
                    </div>
                  </td>

                  {/* Last Visit */}
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-slate-400" />
                      <span className={customer.lastVisit ? "font-medium text-slate-800" : "text-slate-400 italic"}>
                        {customer.lastVisit || "Never"}
                      </span>
                    </div>
                  </td>

                  {/* Visits & Spends */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="font-bold text-slate-900 text-sm">
                      {formatPrice(customer.totalSpent)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      <span className="font-semibold text-primary">{customer.totalVisits}</span>{" "}
                      {customer.totalVisits === 1 ? "visit" : "visits"}
                    </div>
                  </td>

                  {/* Service History */}
                  <td className="whitespace-nowrap px-5 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => onViewHistory(customer)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-700 shadow-2xs transition hover:border-primary hover:bg-primary-lighter hover:text-primary cursor-pointer"
                    >
                      <History className="size-3.5 text-slate-500 group-hover:text-primary" />
                      <span>View Services</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(customer)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
                        title="Edit Customer"
                      >
                        <Edit3 className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(customer.id)}
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
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
