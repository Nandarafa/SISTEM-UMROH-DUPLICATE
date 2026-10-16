"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  useReports,
  useReportFilters,
  ReportTable,
  ReportFilters,
  ReportSummary,
  ReportModal,
  exportReportsToCsv,
  ReportItem,
} from "@/features/reports";

export default function ReportsPage() {
  const { reports, loading } = useReports();
  const { filters, updateFilter } = useReportFilters();
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  const filteredReports = reports.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      r.id.toLowerCase().includes(filters.search.toLowerCase());
    const matchCat = filters.category === "ALL" || r.category === filters.category;
    const matchStatus = filters.status === "ALL" || r.status === filters.status;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <PageContainer
      title="Manajemen Laporan"
      description="Rekapitulasi berkas, manifest, keuangan, dan logistik Umroh"
    >
      <ReportSummary reports={filteredReports} />

      <ReportFilters
        filters={filters}
        onFilterChange={updateFilter}
        onExport={() => exportReportsToCsv(filteredReports)}
      />

      {loading ? (
        <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
          Memuat data laporan...
        </div>
      ) : (
        <ReportTable
          reports={filteredReports}
          onSelect={(report) => setSelectedReport(report)}
        />
      )}

      <ReportModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </PageContainer>
  );
}
