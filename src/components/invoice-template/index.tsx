import React from "react";
import {
  Sparkles,
  CheckCircle2,
  Crown,
  Receipt,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  User,
  Scissors,
} from "lucide-react";
import { formatPrice } from "../../helpers/price.helper";
import type { InvoiceTemplateId, LayoutSettingsState } from "../../pages/settings/types";
import { getActiveSalonProfile, type SalonProfileInfo } from "../../helpers/salon-profile.helper";

export interface InvoiceItemData {
  id?: string;
  name: string;
  category?: string;
  durationMinutes?: number;
  quantity?: number;
  unitPrice?: number;
  totalPrice: number;
  notes?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  staffName?: string;
  serviceCategory?: string;
  items: InvoiceItemData[];
  subtotal: number;
  discount?: number;
  tax?: number;
  total: number;
  paidAmount?: number;
  paymentStatus?: "PAID" | "PENDING" | "PARTIAL" | string;
  paymentMethod?: string;
  notes?: string;
}

export type SalonInfo = SalonProfileInfo;

export interface InvoiceRendererProps {
  invoice: InvoiceData;
  salon?: Partial<SalonInfo> | null;
  layoutSettings?: Partial<LayoutSettingsState>;
  templateOverride?: InvoiceTemplateId;
  containerId?: string;
}

export const InvoiceRenderer: React.FC<InvoiceRendererProps> = ({
  invoice,
  salon,
  layoutSettings = {},
  templateOverride,
  containerId = "printable-invoice",
}) => {
  const activeSalon = getActiveSalonProfile(salon);
  const template: InvoiceTemplateId =
    templateOverride || layoutSettings.selectedInvoiceTemplate || "modern";

  const showLogo = layoutSettings.showLogoOnReceipt ?? true;
  const showSpecialist = layoutSettings.showSpecialistOnReceipt ?? true;
  const showDuration = layoutSettings.showAppointmentDuration ?? true;

  // Dynamically replace legacy hardcoded salon names in header/footer notes
  const rawHeaderNote = layoutSettings.receiptHeader;
  const rawFooterNote = layoutSettings.receiptFooter;
  const headerNote = rawHeaderNote
    ? rawHeaderNote.replace(/Sribees (Luxury )?Salon & Spa/gi, activeSalon.name)
    : undefined;
  const footerNote = rawFooterNote
    ? rawFooterNote.replace(/@sribeessalon/gi, `@${activeSalon.name.toLowerCase().replace(/\s+/g, "")}`)
    : undefined;

  const isPaid = (invoice.paymentStatus || "PAID").toUpperCase() === "PAID";
  const statusLabel = (invoice.paymentStatus || "PAID").toUpperCase();

  // ---------------------------------------------------------------------------
  // TEMPLATE 1: MODERN SLEEK (Contemporary & Minimalist)
  // ---------------------------------------------------------------------------
  if (template === "modern") {
    return (
      <div
        id={containerId}
        className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs text-xs text-slate-800 transition-all font-sans"
      >
        {/* Top Header Note if configured */}
        {headerNote && (
          <div className="mb-4 rounded-xl bg-primary-subtle/70 border border-primary/20 px-3.5 py-2 text-center text-[11px] font-medium text-primary">
            {headerNote}
          </div>
        )}

        {/* Brand & Invoice Meta */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 border-b border-slate-100 pb-6">
          <div className="flex items-start gap-3.5">
            {showLogo && (
              <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-primary-light text-white shadow-sm shrink-0">
                <Sparkles className="size-5" />
              </span>
            )}
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                {activeSalon.name}
              </h2>
              <div className="mt-1 space-y-0.5 text-[11px] text-slate-500">
                {activeSalon.address && (
                  <p className="flex items-center gap-1.5">
                    <MapPin className="size-3 text-slate-400 shrink-0" />
                    <span>{activeSalon.address}</span>
                  </p>
                )}
                <p className="flex items-center gap-3">
                  {activeSalon.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="size-3 text-slate-400 shrink-0" />
                      <span>{activeSalon.phone}</span>
                    </span>
                  )}
                  {activeSalon.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="size-3 text-slate-400 shrink-0" />
                      <span>{activeSalon.email}</span>
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="sm:text-right flex flex-col sm:items-end">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                isPaid
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              <CheckCircle2 className="size-3" />
              <span>{statusLabel}</span>
            </span>
            <p className="mt-2 font-mono text-base font-bold tracking-tight text-slate-900">
              #{invoice.invoiceNumber}
            </p>
            <div className="mt-1 flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0.5 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="size-3 text-slate-400" />
                <span>{invoice.date}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3 text-slate-400" />
                <span>{invoice.time}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Client & Specialist Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 py-4">
          <div className="rounded-xl bg-slate-50/70 p-3.5 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Billed To
            </span>
            <p className="mt-1 font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <User className="size-3.5 text-slate-400" />
              <span>{invoice.clientName || "Valued Customer"}</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 ml-5">
              {invoice.clientPhone || "No contact info"}
            </p>
          </div>

          {showSpecialist && (
            <div className="rounded-xl bg-slate-50/70 p-3.5 border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Hair & Beauty Specialist
              </span>
              <p className="mt-1 font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Scissors className="size-3.5 text-primary" />
                <span>{invoice.staffName || "Senior Specialist"}</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 ml-5">
                Stylist Attribution & Service Care
              </p>
            </div>
          )}
        </div>

        {/* Items Table */}
        <div className="py-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-2.5">Description</th>
                {showDuration && <th className="pb-2.5 text-center">Duration</th>}
                <th className="pb-2.5 text-center">Qty</th>
                <th className="pb-2.5 text-right">Price</th>
                <th className="pb-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="py-3">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    {item.notes && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.notes}</p>
                    )}
                  </td>
                  {showDuration && (
                    <td className="py-3 text-center text-slate-600">
                      {item.durationMinutes ? `${item.durationMinutes} mins` : "—"}
                    </td>
                  )}
                  <td className="py-3 text-center text-slate-700 font-medium">
                    {item.quantity ?? 1}
                  </td>
                  <td className="py-3 text-right text-slate-600">
                    {formatPrice(item.unitPrice ?? item.totalPrice)}
                  </td>
                  <td className="py-3 text-right font-bold text-slate-900">
                    {formatPrice(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary */}
        <div className="flex justify-end border-t border-slate-200 pt-4">
          <div className="w-64 space-y-2 text-right">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatPrice(invoice.subtotal)}</span>
            </div>
            {invoice.discount ? (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount:</span>
                <span>-{formatPrice(invoice.discount)}</span>
              </div>
            ) : null}
            {invoice.tax ? (
              <div className="flex justify-between text-slate-600">
                <span>Tax / VAT:</span>
                <span>{formatPrice(invoice.tax)}</span>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
              <span>Grand Total:</span>
              <span className="text-primary text-base font-extrabold">
                {formatPrice(invoice.total)}
              </span>
            </div>
            {invoice.paymentMethod && (
              <div className="text-[11px] text-slate-500 pt-1">
                Paid via: <span className="font-semibold text-slate-700 capitalize">{invoice.paymentMethod}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        {footerNote && (
          <div className="mt-6 rounded-xl bg-slate-50 p-3.5 text-center text-[11px] text-slate-500 border border-slate-100">
            {footerNote}
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // TEMPLATE 2: CLASSIC THERMAL POS (80mm Monospace Receipt Roll)
  // ---------------------------------------------------------------------------
  if (template === "thermal") {
    return (
      <div
        id={containerId}
        className="max-w-[390px] mx-auto rounded-none border-2 border-dashed border-slate-300 bg-amber-50/20 p-5 shadow-xs text-xs font-mono text-slate-900 leading-relaxed transition-all"
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        {/* Scissor Cut Line Header */}
        <div className="text-center text-[10px] text-slate-400 mb-2 select-none tracking-widest">
          --- ✂ --- CUT RECEIPT HERE --- ✂ ---
        </div>

        {/* Salon Center Banner */}
        <div className="text-center pb-2">
          {showLogo && (
            <div className="flex justify-center mb-1">
              <span className="flex size-8 items-center justify-center rounded-md bg-slate-900 text-white">
                <Receipt className="size-4" />
              </span>
            </div>
          )}
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-950">
            *** {activeSalon.name} ***
          </h2>
          {activeSalon.address && (
            <p className="text-[10px] text-slate-600 mt-0.5">{activeSalon.address}</p>
          )}
          {activeSalon.phone && (
            <p className="text-[10px] text-slate-600">Tel: {activeSalon.phone}</p>
          )}
        </div>

        {/* Top Header Note if configured */}
        {headerNote && (
          <div className="my-1.5 text-center text-[10px] italic border-y border-dashed border-slate-300 py-1">
            "{headerNote}"
          </div>
        )}

        <div className="border-t border-dashed border-slate-400 my-2" />

        {/* Receipt Meta */}
        <div className="space-y-0.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-500">INVOICE NO:</span>
            <span className="font-bold">#{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">DATE & TIME:</span>
            <span>{invoice.date} {invoice.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">CUSTOMER:</span>
            <span className="font-bold">{invoice.clientName || "Walk-in"}</span>
          </div>
          {invoice.clientPhone && (
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-500">CONTACT:</span>
              <span>{invoice.clientPhone}</span>
            </div>
          )}
          {showSpecialist && invoice.staffName && (
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-500">SERVICED BY:</span>
              <span className="font-semibold">{invoice.staffName}</span>
            </div>
          )}
        </div>

        <div className="border-t border-dashed border-slate-400 my-2" />

        {/* Line Items */}
        <div className="space-y-2 text-[11px]">
          <div className="flex justify-between font-bold text-[10px] text-slate-600 pb-1 border-b border-dashed border-slate-300">
            <span>ITEM / SERVICE</span>
            <span>AMT</span>
          </div>
          {invoice.items.map((item, idx) => (
            <div key={item.id || idx} className="space-y-0.5">
              <div className="flex justify-between items-start">
                <span className="font-bold flex-1 pr-2">
                  {item.quantity && item.quantity > 1 ? `${item.quantity}x ` : ""}
                  {item.name}
                </span>
                <span className="font-semibold">{formatPrice(item.totalPrice)}</span>
              </div>
              {showDuration && item.durationMinutes ? (
                <div className="text-[10px] text-slate-500 italic pl-2">
                  Duration: {item.durationMinutes} min
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="border-t-2 border-dashed border-slate-900 my-2.5" />

        {/* Financial Summary */}
        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span>SUBTOTAL:</span>
            <span>{formatPrice(invoice.subtotal)}</span>
          </div>
          {invoice.discount ? (
            <div className="flex justify-between text-slate-700">
              <span>DISCOUNT:</span>
              <span>-{formatPrice(invoice.discount)}</span>
            </div>
          ) : null}
          {invoice.tax ? (
            <div className="flex justify-between text-slate-700">
              <span>TAX (VAT):</span>
              <span>{formatPrice(invoice.tax)}</span>
            </div>
          ) : null}

          <div className="border-t border-dashed border-slate-400 my-1.5" />

          <div className="flex justify-between text-sm font-black text-slate-950">
            <span>TOTAL DUE:</span>
            <span>{formatPrice(invoice.total)}</span>
          </div>

          <div className="flex justify-between text-[10px] text-slate-600 pt-0.5">
            <span>PAYMENT STATUS:</span>
            <span className="font-bold underline uppercase">{statusLabel}</span>
          </div>
          {invoice.paymentMethod && (
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>METHOD:</span>
              <span className="uppercase">{invoice.paymentMethod}</span>
            </div>
          )}
        </div>

        <div className="border-t border-dashed border-slate-400 my-3" />

        {/* Barcode Simulation */}
        <div className="flex flex-col items-center justify-center my-2 text-center">
          <div className="flex items-center gap-[2px] h-9 px-4 bg-white py-1 border border-slate-300">
            <span className="w-[2px] h-full bg-slate-900" />
            <span className="w-[1px] h-full bg-slate-900" />
            <span className="w-[3px] h-full bg-slate-900" />
            <span className="w-[1px] h-full bg-slate-900" />
            <span className="w-[4px] h-full bg-slate-900" />
            <span className="w-[2px] h-full bg-slate-900" />
            <span className="w-[1px] h-full bg-slate-900" />
            <span className="w-[3px] h-full bg-slate-900" />
            <span className="w-[2px] h-full bg-slate-900" />
            <span className="w-[4px] h-full bg-slate-900" />
            <span className="w-[1px] h-full bg-slate-900" />
            <span className="w-[2px] h-full bg-slate-900" />
            <span className="w-[3px] h-full bg-slate-900" />
          </div>
          <span className="text-[9px] tracking-widest text-slate-500 mt-1">
            *{invoice.invoiceNumber}*
          </span>
        </div>

        {/* Thermal Receipt Footer */}
        <div className="text-center text-[10px] space-y-1 text-slate-600 mt-3 pt-2 border-t border-dashed border-slate-300">
          <p className="font-bold uppercase tracking-wider">
            *** THANK YOU FOR YOUR VISIT! ***
          </p>
          {footerNote && <p className="italic text-[9px]">{footerNote}</p>}
          <p className="text-[9px] text-slate-400">Powered by Salora POS</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // TEMPLATE 3: LUXURY BOUTIQUE & SPA (Royal Executive / Editorial)
  // ---------------------------------------------------------------------------
  return (
    <div
      id={containerId}
      className="rounded-2xl border-2 border-amber-300/60 bg-white overflow-hidden shadow-md text-xs text-slate-800 transition-all font-sans"
    >
      {/* Luxury Dark & Gold Header */}
      <div className="bg-gradient-to-r from-slate-950 via-[#2d091e] to-slate-950 p-6 sm:p-7 text-white relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500" />

        {headerNote && (
          <div className="mb-3 text-center text-[10px] tracking-widest uppercase text-amber-200/90 font-medium">
            ✦ {headerNote} ✦
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {showLogo && (
              <span className="flex size-12 items-center justify-center rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-300 shadow-inner">
                <Crown className="size-6 text-amber-300" />
              </span>
            )}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-amber-300/90 font-bold block">
                Exclusive Salon & Day Spa
              </span>
              <h2 className="text-xl font-serif font-bold text-white tracking-wide">
                {activeSalon.name}
              </h2>
              {activeSalon.address && (
                <p className="text-[11px] text-slate-300 mt-0.5">{activeSalon.address}</p>
              )}
              {activeSalon.phone && (
                <p className="text-[10px] text-amber-200/80 mt-0.5">Tel: {activeSalon.phone}</p>
              )}
            </div>
          </div>

          <div className="sm:text-right flex flex-col sm:items-end">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 border border-amber-300/40 px-3 py-1 text-[11px] font-bold text-amber-300">
              <Sparkles className="size-3 text-amber-300" />
              <span>{statusLabel}</span>
            </div>
            <p className="mt-2 font-mono text-sm font-bold text-slate-200 tracking-wider">
              {invoice.invoiceNumber}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {invoice.date} • {invoice.time}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7 space-y-6">
        {/* Luxury Client & Staff cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-amber-200/50 bg-amber-50/30 p-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
              Honoured Guest
            </span>
            <p className="mt-1 font-serif text-base font-bold text-slate-900">
              {invoice.clientName || "Valued Client"}
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Contact: {invoice.clientPhone || "Private"}
            </p>
          </div>

          {showSpecialist && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Master Stylist & Specialist
              </span>
              <p className="mt-1 font-serif text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Scissors className="size-4 text-amber-600" />
                <span>{invoice.staffName || "Creative Director"}</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Signature Salon & Spa Care
              </p>
            </div>
          )}
        </div>

        {/* Detailed Service List */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b-2 border-amber-400/40 text-[11px] font-serif font-bold uppercase tracking-wider text-slate-700">
            <span>Service Experience & Products</span>
            <span>Investment</span>
          </div>

          <div className="divide-y divide-slate-100">
            {invoice.items.map((item, idx) => (
              <div key={item.id || idx} className="py-3.5 flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                    {showDuration && item.durationMinutes ? (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700">
                        ⏱ {item.durationMinutes} mins
                      </span>
                    ) : null}
                    {item.notes && <span className="italic">{item.notes}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-serif text-sm font-bold text-slate-900">
                    {formatPrice(item.totalPrice)}
                  </span>
                  {item.quantity && item.quantity > 1 ? (
                    <p className="text-[10px] text-slate-400">
                      {item.quantity} @ {formatPrice(item.unitPrice ?? item.totalPrice)}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grand Total & Signature section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
          <div className="space-y-3">
            <div className="text-[11px] text-slate-600 italic">
              "We take pride in providing bespoke luxury salon and spa experiences tailored to your elegance."
            </div>
            <div className="pt-2">
              <div className="border-b border-slate-300 w-44 mb-1" />
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                Authorized Signature / Stamp
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-900 text-white p-4 space-y-2 shadow-inner">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Subtotal</span>
              <span className="font-semibold text-white">{formatPrice(invoice.subtotal)}</span>
            </div>
            {invoice.discount ? (
              <div className="flex justify-between text-xs text-amber-300">
                <span>VIP Courtesy Discount</span>
                <span>-{formatPrice(invoice.discount)}</span>
              </div>
            ) : null}
            {invoice.tax ? (
              <div className="flex justify-between text-xs text-slate-300">
                <span>Tax & Service Charge</span>
                <span>{formatPrice(invoice.tax)}</span>
              </div>
            ) : null}

            <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
              <span className="font-serif text-sm text-amber-300 font-bold uppercase tracking-wider">
                Total Amount
              </span>
              <span className="font-serif text-xl font-bold text-white">
                {formatPrice(invoice.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Luxury Footer Disclaimer */}
        {footerNote && (
          <div className="text-center text-[11px] text-slate-500 pt-3 border-t border-dashed border-slate-200 font-serif">
            {footerNote}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceRenderer;

