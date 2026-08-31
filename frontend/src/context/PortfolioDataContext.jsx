import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchPortfolio, adminPatchPortfolio } from "../api/api";
import { useAuth } from "./AuthContext";

const PortfolioDataContext = createContext(null);

export function PortfolioDataProvider({ children }) {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchPortfolio();
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const saveSection = useCallback(
    async (sectionData) => {
      const updated = await adminPatchPortfolio(token, sectionData);
      setData(updated);
      return updated;
    },
    [token]
  );

  const value = useMemo(
    () => ({ data, loading, error, refetch, saveSection }),
    [data, loading, error, refetch, saveSection]
  );

  return <PortfolioDataContext.Provider value={value}>{children}</PortfolioDataContext.Provider>;
}

export function usePortfolioData() {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) throw new Error("usePortfolioData must be used within PortfolioDataProvider");
  return ctx;
}
