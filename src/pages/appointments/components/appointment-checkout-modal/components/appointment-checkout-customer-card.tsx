import { User, Phone } from "lucide-react";
import { Input } from "../../../../../components/input";

interface AppointmentCheckoutCustomerCardProps {
  clientName: string;
  setClientName: (name: string) => void;
  clientPhone: string;
  setClientPhone: (phone: string) => void;
  setWaPhone: (waPhone: string) => void;
}

export function AppointmentCheckoutCustomerCard({
  clientName,
  setClientName,
  clientPhone,
  setClientPhone,
  setWaPhone,
}: AppointmentCheckoutCustomerCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
      <div className="flex items-center gap-2">
        <User className="size-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Customer Info
        </span>
      </div>
      <div className="space-y-2">
        <Input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Customer Name"
          className="border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <Input
          type="text"
          value={clientPhone}
          onChange={(e) => {
            setClientPhone(e.target.value);
            const clean = e.target.value.replace(/[^\d+]/g, "");
            setWaPhone(clean.startsWith("0") ? `+94${clean.slice(1)}` : clean);
          }}
          placeholder="Customer Phone (+94...)"
          leftElement={<Phone className="size-3.5 text-slate-400" />}
          className="border-slate-200 py-1.5 text-xs font-medium text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}
