export type LedgerTab = "income" | "expenses" | "transactions";

// ========================
// 1. Income Types
// ========================
export type IncomeType = "service" | "product";
export type IncomeFilterType = "all" | "service" | "product";
export type IncomePaymentMethod = "cash" | "card" | "bank";

export type IncomeRecord = {
  id: string;
  saleId: string; // e.g., "SAL-001"
  customerName: string;
  incomeType: IncomeType;
  amount: number;
  paymentMethod: IncomePaymentMethod;
  date: string; // "YYYY-MM-DD"
  description?: string;
};

export type IncomeStats = {
  totalIncome: number;
  serviceIncome: number;
  productIncome: number;
};

export type IncomeFilterState = {
  search: string;
  startDate: string;
  endDate: string;
  incomeType: IncomeFilterType;
  paymentMethod?: "all" | IncomePaymentMethod;
};

// ========================
// 2. Expense Types
// ========================
export type ExpenseCategory =
  | "all"
  | "rent"
  | "electricity"
  | "water"
  | "salaries"
  | "product_purchases"
  | "equipment_maintenance"
  | "internet_telephone"
  | "refreshments"
  | "utilities"
  | "inventory"
  | "marketing"
  | "other"
  | (string & {});

export type ExpenseItemCategory = Exclude<ExpenseCategory, "all">;

export type ExpensePaymentMethod = "cash" | "card" | "bank";

export type ExpenseRecord = {
  id: string;
  title: string;
  category: ExpenseItemCategory;
  amount: number;
  paymentMethod: ExpensePaymentMethod;
  date: string;
  description?: string;
  receiptImage?: string;
};

export type ExpenseStats = {
  totalExpenses: number;
  thisMonth: number;
  expenseCategoriesCount: number;
};

export type ExpenseFilterState = {
  search: string;
  startDate: string;
  endDate: string;
  category: ExpenseCategory;
  paymentMethod?: "all" | ExpensePaymentMethod;
};

export type ExpenseFormData = {
  title: string;
  category: ExpenseItemCategory;
  amount: number;
  paymentMethod: ExpensePaymentMethod;
  date: string;
  description?: string;
  receiptImage?: string;
};

// ========================
// 3. Transaction Types
// ========================
export type TransactionType = "all" | "payment" | "refund";
export type TransactionPaymentMethod = "all" | "cash" | "card" | "bank";
export type TransactionStatus = "all" | "successful" | "failed";

export type TransactionRecord = {
  id: string;
  transactionId: string; // e.g., "TXN-001"
  customerName: string;
  type: "payment" | "refund";
  paymentMethod: "cash" | "card" | "bank";
  amount: number;
  date: string;
  status: "successful" | "failed";
  notes?: string;
};

export type TransactionStats = {
  totalTransactions: number;
  totalReceived: number;
  totalRefunded: number;
};

export type TransactionFilterState = {
  search: string;
  startDate: string;
  endDate: string;
  type: TransactionType;
  paymentMethod: TransactionPaymentMethod;
  status?: TransactionStatus;
};

export type LedgerSummary = {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  totalTransactions: number;
};
