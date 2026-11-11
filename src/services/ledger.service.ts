import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../config/api.config";
import type { CategoryItem, CategoryFormData } from "../interface/category.types";
import type {
  IncomeRecord,
  IncomeStats,
  ExpenseRecord,
  ExpenseStats,
  TransactionRecord,
  TransactionStats,
  LedgerSummary,
} from "../interface/ledger.types";

export interface IncomeQueryParams {
  search?: string;
  start_date?: string;
  end_date?: string;
  income_type?: string;
  payment_method?: string;
  page?: number;
  pageSize?: number;
}

export interface ExpenseQueryParams {
  search?: string;
  start_date?: string;
  end_date?: string;
  category?: string;
  payment_method?: string;
  page?: number;
  pageSize?: number;
}

export interface TransactionQueryParams {
  search?: string;
  start_date?: string;
  end_date?: string;
  type?: string;
  payment_method?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const ledgerService = {
  // Overall Ledger Summary
  async getSummary(): Promise<LedgerSummary> {
    const res = await apiClient.get<LedgerSummary>(API_ENDPOINTS.LEDGER.SUMMARY);
    return res.data;
  },

  // 1. Income Ledger
  async getIncome(params?: IncomeQueryParams): Promise<{ items: IncomeRecord[]; total: number }> {
    const res = await apiClient.get(API_ENDPOINTS.LEDGER.INCOME.BASE, { params });
    if (res.data && Array.isArray(res.data.items)) {
      return res.data;
    }
    if (Array.isArray(res.data)) {
      return { items: res.data, total: res.data.length };
    }
    return { items: [], total: 0 };
  },

  async getIncomeStats(): Promise<IncomeStats> {
    const res = await apiClient.get<IncomeStats>(API_ENDPOINTS.LEDGER.INCOME.STATS);
    return res.data;
  },

  async createIncome(payload: Partial<IncomeRecord>): Promise<IncomeRecord> {
    const res = await apiClient.post<IncomeRecord>(API_ENDPOINTS.LEDGER.INCOME.BASE, payload);
    return res.data;
  },

  // 2. Expense Ledger
  async getExpenses(params?: ExpenseQueryParams): Promise<{ items: ExpenseRecord[]; total: number }> {
    const res = await apiClient.get(API_ENDPOINTS.LEDGER.EXPENSES.BASE, { params });
    if (res.data && Array.isArray(res.data.items)) {
      return res.data;
    }
    if (Array.isArray(res.data)) {
      return { items: res.data, total: res.data.length };
    }
    return { items: [], total: 0 };
  },

  async getExpenseStats(): Promise<ExpenseStats> {
    const res = await apiClient.get<ExpenseStats>(API_ENDPOINTS.LEDGER.EXPENSES.STATS);
    return res.data;
  },

  async getExpenseCategories(): Promise<CategoryItem[]> {
    const res = await apiClient.get(API_ENDPOINTS.LEDGER.EXPENSES.CATEGORIES);
    return Array.isArray(res.data) ? res.data : [];
  },

  async createExpenseCategory(payload: CategoryFormData): Promise<CategoryItem> {
    const res = await apiClient.post<CategoryItem>(API_ENDPOINTS.LEDGER.EXPENSES.CATEGORIES, payload);
    return res.data;
  },

  async updateExpenseCategory(id: string, payload: Partial<CategoryFormData>): Promise<CategoryItem> {
    const res = await apiClient.put<CategoryItem>(API_ENDPOINTS.LEDGER.EXPENSES.CATEGORY_BY_ID(id), payload);
    return res.data;
  },

  async deleteExpenseCategory(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.LEDGER.EXPENSES.CATEGORY_BY_ID(id));
  },

  async createExpense(payload: Partial<ExpenseRecord>): Promise<ExpenseRecord> {
    const res = await apiClient.post<ExpenseRecord>(API_ENDPOINTS.LEDGER.EXPENSES.BASE, payload);
    return res.data;
  },

  async updateExpense(id: string, payload: Partial<ExpenseRecord>): Promise<ExpenseRecord> {
    const res = await apiClient.put<ExpenseRecord>(API_ENDPOINTS.LEDGER.EXPENSES.BY_ID(id), payload);
    return res.data;
  },

  async deleteExpense(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.LEDGER.EXPENSES.BY_ID(id));
  },

  // 3. Transactions Ledger
  async getTransactions(params?: TransactionQueryParams): Promise<{ items: TransactionRecord[]; total: number }> {
    const res = await apiClient.get(API_ENDPOINTS.LEDGER.TRANSACTIONS.BASE, { params });
    if (res.data && Array.isArray(res.data.items)) {
      return res.data;
    }
    if (Array.isArray(res.data)) {
      return { items: res.data, total: res.data.length };
    }
    return { items: [], total: 0 };
  },

  async getTransactionStats(): Promise<TransactionStats> {
    const res = await apiClient.get<TransactionStats>(API_ENDPOINTS.LEDGER.TRANSACTIONS.STATS);
    return res.data;
  },

  async createTransaction(payload: Partial<TransactionRecord>): Promise<TransactionRecord> {
    const res = await apiClient.post<TransactionRecord>(API_ENDPOINTS.LEDGER.TRANSACTIONS.BASE, payload);
    return res.data;
  },
};

export default ledgerService;

