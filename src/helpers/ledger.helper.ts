import {
  Building,
  Zap,
  Droplet,
  Users,
  ShoppingCart,
  Wrench,
  PhoneCall,
  MoreHorizontal,
  Coffee,
  Package,
  Megaphone,
  Tag,
} from "lucide-react";
import type {
  ExpenseCategory,
  ExpenseItemCategory,
} from "../interface/ledger.types";

export const defaultExpenseCategories: { label: string; value: ExpenseItemCategory }[] = [
  { label: "Rent", value: "rent" },
  { label: "Electricity", value: "electricity" },
  { label: "Water", value: "water" },
  { label: "Utilities", value: "utilities" },
  { label: "Salaries", value: "salaries" },
  { label: "Inventory", value: "inventory" },
  { label: "Product Purchases", value: "product_purchases" },
  { label: "Equipment & Maintenance", value: "equipment_maintenance" },
  { label: "Internet & Telephone", value: "internet_telephone" },
  { label: "Refreshments", value: "refreshments" },
  { label: "Marketing", value: "marketing" },
  { label: "Other", value: "other" },
];

export const expenseCategoryFilterOptions: { label: string; value: ExpenseCategory }[] = [
  { label: "All Categories", value: "all" },
  ...defaultExpenseCategories,
];

export const categoryMeta: Record<
  string,
  { label: string; icon: typeof Building; style: string }
> = {
  rent: { label: "Rent", icon: Building, style: "bg-purple-50 text-purple-700 border-purple-200" },
  electricity: { label: "Electricity", icon: Zap, style: "bg-amber-50 text-amber-700 border-amber-200" },
  water: { label: "Water", icon: Droplet, style: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  utilities: { label: "Utilities", icon: Zap, style: "bg-amber-50 text-amber-700 border-amber-200" },
  salaries: { label: "Salaries", icon: Users, style: "bg-blue-50 text-blue-700 border-blue-200" },
  inventory: { label: "Inventory", icon: Package, style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  product_purchases: {
    label: "Product Purchases",
    icon: ShoppingCart,
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  equipment_maintenance: {
    label: "Equipment & Maintenance",
    icon: Wrench,
    style: "bg-rose-50 text-rose-700 border-rose-200",
  },
  internet_telephone: {
    label: "Internet & Telephone",
    icon: PhoneCall,
    style: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  refreshments: {
    label: "Refreshments",
    icon: Coffee,
    style: "bg-orange-50 text-orange-700 border-orange-200",
  },
  marketing: {
    label: "Marketing",
    icon: Megaphone,
    style: "bg-pink-50 text-pink-700 border-pink-200",
  },
  other: { label: "Other", icon: MoreHorizontal, style: "bg-slate-100 text-slate-700 border-slate-200" },
};

export function getCategoryMeta(categoryRaw?: string): {
  label: string;
  icon: typeof Building;
  style: string;
} {
  if (!categoryRaw) {
    return categoryMeta.other;
  }

  const key = categoryRaw.trim().toLowerCase();
  if (categoryMeta[key]) {
    return categoryMeta[key];
  }

  // Format label from raw string (e.g. "office_supplies" -> "Office Supplies")
  const humanLabel = key
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    label: humanLabel,
    icon: Tag,
    style: "bg-slate-100 text-slate-700 border-slate-200",
  };
}

