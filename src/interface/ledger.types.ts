export type LedgerTab = "income" | "expenses" | "transactions";

// ========================
// 1. Income Types
// ========================
export type IncomeCategory = "all" | "service_sale" | "product_sale";

export type IncomeRecord = {
  id: string;
  date: string;
  category: "service_sale" | "product_sale";
  sourceTitle: string; // e.g., "Haircut & Blowdry" or "Argan Oil Shampoo"
  customerName: string;
  amount: number;
  paymentMethod: "cash" | "card" | "online";
  invoiceNo: string;
};

export type IncomeStats = {
  totalIncome: number;
  serviceIncome: number;
  productIncome: number;
  todayIncome: number;
};

export type IncomeFilterState = {
  search: string;
  category: IncomeCategory;
  paymentMethod: "all" | "cash" | "card" | "online";
};

export type IncomeFormData = {
  date: string;
  category: "service_sale" | "product_sale";
  sourceTitle: string;
  customerName: string;
  amount: number;
  paymentMethod: "cash" | "card" | "online";
  invoiceNo: string;
};

// ========================
// 2. Expense Types
// ========================
export type ExpenseCategory =
  | "all"
  | "rent"
  | "electricity"
  | "salaries"
  | "product_purchases"
  | "maintenance"
  | "other";

export type ExpenseRecord = {
  id: string;
  date: string;
  category: "rent" | "electricity" | "salaries" | "product_purchases" | "maintenance" | "other";
  title: string;
  vendorOrStaff: string;
  amount: number;
  paymentMethod: "cash" | "bank_transfer" | "card";
  receiptNo: string;
  notes?: string;
};

export type ExpenseStats = {
  totalExpenses: number;
  salaries: number;
  productPurchases: number;
  utilitiesAndRent: number;
};

export type ExpenseFilterState = {
  search: string;
  category: ExpenseCategory;
};

export type ExpenseFormData = {
  date: string;
  category: "rent" | "electricity" | "salaries" | "product_purchases" | "maintenance" | "other";
  title: string;
  vendorOrStaff: string;
  amount: number;
  paymentMethod: "cash" | "bank_transfer" | "card";
  receiptNo: string;
  notes?: string;
};

// ========================
// 3. Transaction Types
// ========================
export type TransactionType = "all" | "payment" | "refund";
export type TransactionStatus = "all" | "completed" | "pending" | "failed";

export type TransactionRecord = {
  id: string;
  txnId: string;
  date: string;
  time: string;
  type: "payment" | "refund";
  amount: number;
  paymentMethod: "cash" | "credit_card" | "debit_card" | "online";
  customerName: string;
  status: "completed" | "pending" | "failed";
  reference: string;
};

export type TransactionStats = {
  totalVolume: number;
  paymentsCount: number;
  refundsCount: number;
  netCollected: number;
};

export type TransactionFilterState = {
  search: string;
  type: TransactionType;
  status: TransactionStatus;
  paymentMethod: "all" | "cash" | "credit_card" | "debit_card" | "online";
};

