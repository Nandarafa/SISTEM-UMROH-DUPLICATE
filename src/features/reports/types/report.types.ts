export interface ReportItem {
  id: string;
  title: string;
  category: "Keuangan" | "Pendaftaran" | "Logistik" | "Operasional";
  date: string;
  amount?: number;
  status: "Selesai" | "Pending" | "Dibatalkan";
  generatedBy: string;
}

export interface ReportFilterState {
  search: string;
  category: string;
  status: string;
}
