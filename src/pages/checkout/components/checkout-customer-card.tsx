import { User, Phone } from "lucide-react";
import { Input } from "../../../components/input";

export interface CheckoutCustomerCardProps {
  clientName: string;
  setClientName: (name: string) => void;
  clientPhone: string;
  setClientPhone: (phone: string) => void;
  setWaPhone: (phone: string) => void;
}

export function CheckoutCustomerCard({
  clientName,
  setClientName,
  clientPhone,
  setClientPhone,
  setWaPhone,
}: CheckoutCustomerCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs space-y-3">
      <div className="flex items-center gap-2">
        <User className="size-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Customer Details
        </span>
      </div>

      <div className="space-y-2.5">
        <Input
          type="text"
          label="Customer Name"
          labelClassName="text-[11px] font-semibold text-slate-500 block mb-0"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="e.g. Kasun Fernando"
          className="rounded-xl border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary"
        />

        <Input
          type="text"
          label="Phone Number (for WhatsApp Receipt)"
          labelClassName="text-[11px] font-semibold text-slate-500 block mb-0"
          value={clientPhone}
          onChange={(e) => {
            setClientPhone(e.target.value);
            const clean = e.target.value.replace(/[^\d+]/g, "");
            setWaPhone(clean.startsWith("0") ? `+94${clean.slice(1)}` : clean);
          }}
          placeholder="077 123 4567 or +94..."
          leftElement={<Phone className="size-3.5 text-slate-400" />}
          className="rounded-xl border-slate-200 py-2 text-xs font-medium text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}

export default CheckoutCustomerCard;
