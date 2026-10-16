import Link from "next/link";
import { getAnnouncementsList } from "@/features/announcements/services/announcementService";
import { AnnouncementTable } from "./AnnouncementTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AnnouncementsPage() {
  const items = await getAnnouncementsList();

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching Screenshot 4 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Pengumuman</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#1e293b]">Pengumuman</h1>
            <p className="text-xs text-[#64748b] mt-1">Kelola pengumuman untuk pengguna</p>
          </div>
          <div>
            <Link
              href="/announcements/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f766e] text-white text-xs font-medium hover:bg-[#0d6d66] shadow-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span>Tambah Pengumuman</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Table Component */}
      <AnnouncementTable items={items} />
    </div>
  );
}
