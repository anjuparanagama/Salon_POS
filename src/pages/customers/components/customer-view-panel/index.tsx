import { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Clock,
  Scissors,
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  Edit3,
} from "lucide-react";
import SidePanel from "../../../../components/side-panel";
import { formatPrice } from "../../../../helpers/price.helper";
import { customersService } from "../../../../services/customers.service";
import type { Customer, CustomerGender, ServiceHistoryItem } from "../../../../interface/customer.types";

export type CustomerViewPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onEdit?: (customer: Customer) => void;
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

export function CustomerViewPanel({
  isOpen,
  onClose,
  customer,
  onEdit,
}: CustomerViewPanelProps) {
  const [history, setHistory] = useState<ServiceHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && customer?.id) {
      if (customer.serviceHistory && customer.serviceHistory.length > 0) {
        setHistory(customer.serviceHistory);
      } else {
        setIsLoading(true);
        customersService
          .getCustomerHistory(customer.id)
          .then((items) => setHistory(items))
          .catch(() => setHistory([]))
          .finally(() => setIsLoading(false));
      }
    } else {
      setHistory([]);
    }
  }, [isOpen, customer]);

  if (!customer) return null;

  const genderTag = genderLabels[customer.gender] || genderLabels.prefer_not_to_say;

  const footer = (
    <div className="flex items-center justify-between gap-2.5">
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
      >
        Close
      </button>
      {onEdit && (
        <button
          type="button"
          onClick={() => {
            onClose();
            onEdit(customer);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-dark cursor-pointer"
        >
          <Edit3 className="size-3.5" />
          <span>Edit Customer</span>
        </button>
      )}
    </div>
  );

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={customer.name}
      description="Client profile details and chronological service history."
      size="lg"
      footer={footer}
    >
      <div className="flex flex-col gap-5 text-xs">
        {/* Customer Header Card */}
        <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-lighter text-primary font-bold text-sm">
            {getInitials(customer.name)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">{customer.name}</h3>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${genderTag.bg}`}
              >
                {genderTag.label}
              </span>
            </div>
            <div className="mt-2 flex flex-col gap-1 text-[11px] text-slate-600">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Phone className="size-3 text-slate-400" />
                {customer.phone}
              </span>
              {customer.email && (
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Mail className="size-3 text-slate-400" />
                  {customer.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3 Metric Summary Badges */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-2xs">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
              Total Visits
            </span>
            <span className="mt-1 text-base font-bold text-primary block">
              {customer.totalVisits}
            </span>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-2xs">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
              Total Spend
            </span>
            <span className="mt-1 text-base font-bold text-emerald-600 block">
              {formatPrice(customer.totalSpent)}
            </span>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-2xs">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
              Last Visit
            </span>
            <span className="mt-1 text-xs font-semibold text-slate-800 block truncate">
              {customer.lastVisit || "Never"}
            </span>
          </div>
        </div>

        {/* Chronological Service History Section */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Service History ({history.length})
            </h4>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-8 text-slate-400">
              <Loader2 className="size-6 animate-spin text-primary" />
              <span className="mt-2 text-xs">Loading service records...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <AlertCircle className="size-6 text-slate-400" />
              <p className="mt-2 font-medium text-slate-700">No service history yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Appointments and treatments booked for this customer will appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 transition hover:bg-slate-50/70"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-lighter text-primary mt-0.5">
                      <Scissors className="size-3.5" />
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900 text-xs">
                        {item.serviceName}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Calendar className="size-3 text-slate-400" />
                          {item.date || "Unknown date"}
                        </span>
                        {item.staffName && (
                          <span className="flex items-center gap-1 text-slate-600">
                            <User className="size-3 text-slate-400" />
                            {item.staffName}
                          </span>
                        )}
                        {item.durationMinutes && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="size-3" />
                            {item.durationMinutes}m
                          </span>
                        )}
                        {item.appointmentNumber && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            #{item.appointmentNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="font-bold text-slate-900 text-xs">
                      {formatPrice(item.price)}
                    </span>
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SidePanel>
  );
}

export default CustomerViewPanel;
