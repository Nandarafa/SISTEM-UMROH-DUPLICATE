import Link from "next/link";
import { getActivityLogs } from "@/features/activity-logs/services/activityLogService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ action?: string; user?: string }>;
}

export default async function ActivityLogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const actionFilter = params.action ?? "";
  const userFilter = params.user ?? "";
  const { items, usersList } = await getActivityLogs(actionFilter, userFilter);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching Screenshot 5 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Log Aktivitas</span>
        </nav>
        <div>
          <h1 className="text-xl font-bold text-[#1e293b]">Log Aktivitas</h1>
          <p className="text-xs text-[#64748b] mt-1">Riwayat aktivitas pengguna</p>
        </div>
      </div>

      {/* Main Table Card with Filter Bar matching Screenshot 5 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Filter Form */}
        <form method="GET" className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          <select
            name="action"
            defaultValue={actionFilter}
            className="text-xs rounded-lg border border-gray-200 px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 min-w-[130px]"
          >
            <option value="">Semua Aksi</option>
            <option value="created">created</option>
            <option value="updated">updated</option>
            <option value="deleted">deleted</option>
          </select>

          <select
            name="user"
            defaultValue={userFilter}
            className="text-xs rounded-lg border border-gray-200 px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 min-w-[140px]"
          >
            <option value="">Semua Pengguna</option>
            {usersList.map((u) => (
              <option key={u} value={u}>
                {u}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-4 font-semibold">WAKTU</th>
                <th className="px-6 py-4 font-semibold">PENGGUNA</th>
                <th className="px-6 py-4 font-semibold">AKSI</th>
                <th className="px-6 py-4 font-semibold">DESKRIPSI</th>
                <th className="px-6 py-4 font-semibold text-right">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((log) => {
                let badgeClass = "bg-blue-50 text-blue-700";
                if (log.actionBadgeColor === "green") {
                  badgeClass = "bg-emerald-50 text-emerald-700";
                } else if (log.actionBadgeColor === "red") {
                  badgeClass = "bg-red-50 text-red-700";
                }

                return (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* WAKTU */}
                    <td className="px-6 py-4 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                      {log.time}
                    </td>

                    {/* PENGGUNA */}
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                      {log.userName}
                    </td>

                    {/* AKSI */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${badgeClass}`}>
                        {log.action}
                      </span>
                    </td>

                    {/* DESKRIPSI */}
                    <td className="px-6 py-4 text-gray-700">
                      {log.description}
                    </td>

                    {/* IP */}
                    <td className="px-6 py-4 text-right text-gray-400 font-mono text-[11px] whitespace-nowrap">
                      {log.ip}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
