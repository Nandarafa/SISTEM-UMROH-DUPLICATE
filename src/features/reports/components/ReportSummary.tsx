import { ReportItem } from "../types/report.types";
import { formatCurrency } from "../utils/reportFormatter";

interface ReportSummaryProps {
  reports: ReportItem[];
}

export function ReportSummary({ reports }: ReportSummaryProps) {
  const totalAmount = reports.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const completedCount = reports.filter((r) => r.status === "Selesai").length;
  const pendingCount = reports.filter((r) => r.status === "Pending").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <span className="text-xs font-semibold text-slate-400 uppercase">Total Nilai Laporan</span>
        <div className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(totalAmount)}</div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <span className="text-xs font-semibold text-emerald-600 uppercase">Laporan Selesai</span>
        <div className="text-2xl font-bold text-slate-800 mt-1">{completedCount} Berkas</div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <span className="text-xs font-semibold text-amber-600 uppercase">Menunggu Review</span>
        <div className="text-2xl font-bold text-slate-800 mt-1">{pendingCount} Berkas</div>
      </div>
    </div>
  );
}
