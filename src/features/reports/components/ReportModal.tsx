import { ReportItem } from "../types/report.types";
import { formatCurrency, formatDate } from "../utils/reportFormatter";

interface ReportModalProps {
  report: ReportItem | null;
  onClose: () => void;
}

export function ReportModal({ report, onClose }: ReportModalProps) {
  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-teal-600">{report.id}</span>
            <h3 className="text-lg font-bold text-slate-800">{report.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="py-4 space-y-3 text-sm">
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500">Kategori:</span>
            <span className="font-semibold text-slate-800">{report.category}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500">Tanggal Pembuatan:</span>
            <span className="font-semibold text-slate-800">{formatDate(report.date)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500">Nominal Terkait:</span>
            <span className="font-semibold text-slate-800">
              {report.amount ? formatCurrency(report.amount) : "N/A"}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500">Dibuat Oleh:</span>
            <span className="font-semibold text-slate-800">{report.generatedBy}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Status:</span>
            <span className="font-semibold text-teal-600">{report.status}</span>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
