import Link from "next/link";
import { getCommissions } from "@/features/commissions/services/commissionService";
import { CommissionTable } from "./CommissionTable";
import { currency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ status?: string; agent?: string }>;
}

export default async function CommissionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const statusFilter = params.status ?? "";
  const agentFilter = params.agent ?? "";
  const { items, stats, agentsList } = await getCommissions(statusFilter, agentFilter);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching Screenshot 3 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Komisi Agen</span>
        </nav>
        <div>
          <h1 className="text-xl font-bold text-[#1e293b]">Komisi Agen</h1>
          <p className="text-xs text-[#64748b] mt-1">
            Rekap &amp; pembayaran komisi agen
          </p>
        </div>
      </div>

      {/* 4 Stats Cards matching Screenshot 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Menunggu */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400">Menunggu</p>
            <p className="text-lg font-bold text-gray-800">{currency(stats.pendingAmount)}</p>
            <p className="text-[11px] text-gray-400">{stats.pendingCount} komisi</p>
          </div>
        </div>

        {/* Disetujui */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400">Disetujui</p>
            <p className="text-lg font-bold text-gray-800">{currency(stats.approvedAmount)}</p>
            <p className="text-[11px] text-gray-400">{stats.approvedCount} komisi</p>
          </div>
        </div>

        {/* Dibayar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2"></rect>
              <circle cx="12" cy="12" r="2"></circle>
              <path d="M6 12h.01M18 12h.01"></path>
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400">Dibayar</p>
            <p className="text-lg font-bold text-gray-800">{currency(stats.paidAmount)}</p>
            <p className="text-[11px] text-gray-400">{stats.paidCount} komisi</p>
          </div>
        </div>

        {/* Dibatalkan */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400">Dibatalkan</p>
            <p className="text-lg font-bold text-gray-800">{currency(stats.cancelledAmount)}</p>
            <p className="text-[11px] text-gray-400">{stats.cancelledCount} komisi</p>
          </div>
        </div>
      </div>

      {/* Main Table Card with Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Filter Form */}
        <form method="GET" className="flex flex-wrap gap-3 p-4 border-b border-gray-100 items-center">
          <select
            name="status"
            defaultValue={statusFilter}
            className="rounded-lg border border-gray-200 text-xs px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white text-gray-700 min-w-[130px]"
          >
            <option value="">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="approved">Disetujui</option>
            <option value="paid">Dibayar</option>
            <option value="cancelled">Dibatalkan</option>
          </select>

          <select
            name="agent"
            defaultValue={agentFilter}
            className="rounded-lg border border-gray-200 text-xs px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white text-gray-700 min-w-[130px]"
          >
            <option value="">Semua Agen</option>
            {agentsList.map((ag) => (
              <option key={ag} value={ag}>
                {ag}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium hover:bg-gray-100 text-gray-700 transition"
          >
            Filter
          </button>
        </form>

        {/* Table Component */}
        <CommissionTable items={items} />
      </div>
    </div>
  );
}
