import { ReportFilterState } from "../types/report.types";

interface ReportFiltersProps {
  filters: ReportFilterState;
  onFilterChange: (key: keyof ReportFilterState, value: string) => void;
  onExport: () => void;
}

export function ReportFilters({
  filters,
  onFilterChange,
  onExport,
}: ReportFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full">
        <input
          type="text"
          placeholder="Cari laporan..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-64"
        />

        <select
          value={filters.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
        >
          <option value="ALL">Semua Kategori</option>
          <option value="Keuangan">Keuangan</option>
          <option value="Pendaftaran">Pendaftaran</option>
          <option value="Logistik">Logistik</option>
          <option value="Operasional">Operasional</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
        >
          <option value="ALL">Semua Status</option>
          <option value="Selesai">Selesai</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <button
        onClick={onExport}
        className="w-full sm:w-auto px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition flex items-center justify-center gap-2"
      >
        <span>📥</span>
        <span>Export CSV</span>
      </button>
    </div>
  );
}
