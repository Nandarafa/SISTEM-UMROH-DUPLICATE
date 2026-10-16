"use client";

import { useState } from "react";
import { ReportFilterState } from "../types/report.types";

export function useReportFilters() {
  const [filters, setFilters] = useState<ReportFilterState>({
    search: "",
    category: "ALL",
    status: "ALL",
  });

  const updateFilter = (key: keyof ReportFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return { filters, updateFilter };
}
