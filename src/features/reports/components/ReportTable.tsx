import { ReportItem } from "../types/report.types";
import { formatCurrency, formatDate } from "../utils/reportFormatter";

interface ReportTableProps {
  reports: ReportItem[];
  onSelect: (report: ReportItem) => void;
}

export function ReportTable({ reports, onSelect }: ReportTableProps) {
  if (reports.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
        Tidak ada data laporan ditemukan.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Judul Laporan</th>
            <th className="px-6 py-4">Kategori</th>
            <th className="px-6 py-4">Tanggal</th>
            <th className="px-6 py-4">Nominal</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {reports.map((report) => (
            <tr key={report.id} className="hover:bg-slate-50/50 transition">
              <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-800">
                {report.id}
              </td>
              <td className="px-6 py-4 font-medium text-slate-900">{report.title}</td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                  {report.category}
                </span>
              </td>
              <td className="px-6 py-4">{formatDate(report.date)}</td>
              <td className="px-6 py-4 font-semibold text-slate-800">
                {report.amount ? formatCurrency(report.amount) : "-"}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    report.status === "Selesai"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {report.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onSelect(report)}
                  className="text-teal-600 hover:text-teal-800 font-medium text-xs underline"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
