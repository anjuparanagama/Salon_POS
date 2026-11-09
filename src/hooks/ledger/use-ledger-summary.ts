import { useState, useEffect, useCallback } from "react";
import { ledgerService } from "../../services/ledger.service";
import type { LedgerSummary } from "../../interface/ledger.types";

export function useLedgerSummary() {
  const [summary, setSummary] = useState<LedgerSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await ledgerService.getSummary();
      setSummary(res);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load ledger summary");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await ledgerService.getSummary();
        if (!ignore) {
          setSummary(res);
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load ledger summary");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      ignore = true;
    };
  }, []);

  return { summary, isLoading, error, refetch: fetchSummary };
}

export default useLedgerSummary;

