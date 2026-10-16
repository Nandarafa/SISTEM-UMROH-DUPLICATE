import Link from "next/link";
import { getManasikSchedules } from "@/features/dashboard/services/manasikService";
import { getSessionUser } from "@/features/auth/services/authActions";
import { ManasikTable } from "@/features/dashboard/components/ManasikTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ManasikPage() {
  const user = await getSessionUser();
  const isPilgrim = user?.role === "pilgrim";
  const canManage = user?.role === "admin" || user?.role === "super_admin";
  const schedules = await getManasikSchedules();

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching Screenshot 2 */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:underline">Beranda</Link>
          <span>&rsaquo;</span>
          <span className="text-gray-600 font-medium">Manasik</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Manasik</h1>
            <p className="text-xs text-gray-400 mt-0.5">Jadwal bimbingan manasik &amp; absensi jamaah</p>
          </div>
          {canManage && (
            <div>
              <Link
                href="/manasik/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f766e] text-white text-xs font-medium hover:bg-[#0d6d66] shadow-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Tambah Jadwal</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <ManasikTable schedules={schedules} isPilgrim={isPilgrim} canManage={canManage} />
      </div>
    </div>
  );
}
