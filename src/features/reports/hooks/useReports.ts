"use client";

import { useState, useEffect } from "react";
import { ReportItem } from "../types/report.types";
import { getReports } from "../services/reportService";

export function useReports() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports().then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  return { reports, loading };
}
