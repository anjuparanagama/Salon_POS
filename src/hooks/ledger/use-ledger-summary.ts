import { useQuery } from "@tanstack/react-query";
import { ledgerService } from "../../services/ledger.service";
import type { LedgerSummary } from "../../interface/ledger.types";

export function useLedgerSummary() {
  const { data, isLoading, error, refetch } = useQuery<LedgerSummary>({
    queryKey: ["ledger", "summary"],
    queryFn: () => ledgerService.getSummary(),
  });

  return {
    summary: data ?? null,
    isLoading,
    error: error ? (error instanceof Error ? error.message : "Failed to load ledger summary") : null,
    refetch,
  };
}

export default useLedgerSummary;
