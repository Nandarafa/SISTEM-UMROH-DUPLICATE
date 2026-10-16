import { ReportItem } from "../types/report.types";

export function exportReportsToCsv(reports: ReportItem[]) {
  const headers = ["ID", "Judul Laporan", "Kategori", "Tanggal", "Nominal", "Status", "Dibuat Oleh"];
  const rows = reports.map((r) => [
    r.id,
    `"${r.title}"`,
    r.category,
    r.date,
    r.amount ? r.amount.toString() : "0",
    r.status,
    `"${r.generatedBy}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `laporan_umroh_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
