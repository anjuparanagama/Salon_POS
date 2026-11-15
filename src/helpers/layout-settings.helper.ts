import type { LayoutSettingsState, InvoiceTemplateId } from "../pages/settings/types";

export const DEFAULT_LAYOUT_SETTINGS: LayoutSettingsState = {
  selectedInvoiceTemplate: "modern",
  compactDensity: false,
  showLogoOnReceipt: true,
  showSpecialistOnReceipt: true,
  receiptHeader: "Thank you for pampering yourself with us!",
  receiptFooter: "Thank you for your visit • We look forward to seeing you again!",
  showAppointmentDuration: true,
};

export const INVOICE_TEMPLATES_META: Array<{
  id: InvoiceTemplateId;
  name: string;
  subtitle: string;
  description: string;
  recommendedFor: string;
  tag: string;
  tagColor: string;
}> = [
  {
    id: "modern",
    name: "Modern Sleek",
    subtitle: "Contemporary Minimalist",
    description: "Crisp typography, balanced borders, emerald payment badge, and clear tabular layout. Ideal for digital receipts and standard A4 printing.",
    recommendedFor: "General Salon & Spa POS, Digital Invoices",
    tag: "Clean & Professional",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "thermal",
    name: "Classic Thermal POS",
    subtitle: "80mm Thermal Receipt Roll",
    description: "Authentic 80mm cashier receipt format featuring monospace font, dashed cut lines, centered salon headers, and simulated barcode.",
    recommendedFor: "80mm / 58mm Thermal Printers & Quick Billing",
    tag: "High Efficiency",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "luxury",
    name: "Luxury Boutique & Spa",
    subtitle: "Royal Executive / Elegant Serif",
    description: "Opulent dark banner with gold accents, refined serif typography, decorative borders, stylist attribution cards, and VIP presentation.",
    recommendedFor: "VIP Clients, Luxury Bridal, Full Day Spa Packages",
    tag: "Premium & Luxury",
    tagColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
];

export function getStoredLayoutSettings(): LayoutSettingsState {
  try {
    const saved = localStorage.getItem("sribees_layout_settings");
    if (!saved) return DEFAULT_LAYOUT_SETTINGS;
    const parsed = JSON.parse(saved);
    return {
      ...DEFAULT_LAYOUT_SETTINGS,
      ...parsed,
      selectedInvoiceTemplate: parsed.selectedInvoiceTemplate || "modern",
    };
  } catch {
    return DEFAULT_LAYOUT_SETTINGS;
  }
}

export function saveStoredLayoutSettings(settings: LayoutSettingsState): void {
  try {
    localStorage.setItem("sribees_layout_settings", JSON.stringify(settings));
    // Dispatch custom event so open components update immediately without page refresh
    window.dispatchEvent(new Event("sribees_layout_settings_updated"));
  } catch (e) {
    console.error("Failed to save layout settings", e);
  }
}

