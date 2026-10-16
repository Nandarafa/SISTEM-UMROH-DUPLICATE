import { ReportItem } from "../types/report.types";

const mockReports: ReportItem[] = [
  {
    id: "REP-001",
    title: "Laporan Pembayaran Umroh Ramadhan 1447H",
    category: "Keuangan",
    date: "2026-03-25",
    amount: 1250000000,
    status: "Selesai",
    generatedBy: "Admin Keuangan",
  },
  {
    id: "REP-002",
    title: "Data Pendaftaran Jamaah Batch Syawal",
    category: "Pendaftaran",
    date: "2026-04-02",
    amount: 850000000,
    status: "Selesai",
    generatedBy: "Admin Cabang",
  },
  {
    id: "REP-003",
    title: "Pengadaan Perlengkapan Koper & Ihram",
    category: "Logistik",
    date: "2026-04-10",
    amount: 145000000,
    status: "Pending",
    generatedBy: "Logistik Pusat",
  },
  {
    id: "REP-004",
    title: "Manifest Tiket Saudia Airlines SV817",
    category: "Operasional",
    date: "2026-04-12",
    status: "Selesai",
    generatedBy: "Ticketing Dept",
  },
];

export async function getReports(): Promise<ReportItem[]> {
  return Promise.resolve(mockReports);
}
