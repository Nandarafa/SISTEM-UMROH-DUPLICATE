import Link from "next/link";
import { GuideTable } from "@/features/guides/components/GuideTable";
import { getGuidesList } from "@/features/guides/services/guideService";

export const dynamic = "force-dynamic";

interface GuidesPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || "";
  const status = resolvedParams?.status || "";

  const guides = await getGuidesList(search, status);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching Screenshot 5 */}
      <div className="text-xs text-gray-500 flex items-center gap-1.5">
        <Link href="/" className="hover:text-emerald-700">
          Beranda
        </Link>
        <span>&gt;</span>
        <span className="text-gray-700 font-medium">Muthawif</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Muthawif / Pembimbing</h1>
          <p className="text-xs text-gray-500 mt-1">Daftar muthawif &amp; pembimbing ibadah</p>
        </div>
        <Link
          href="/guides/create"
          className="inline-flex items-center justify-center gap-2 bg-[#0d9488] hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l6.16-3.42A12 12 0 0112 21a12 12 0 01-6.16-10.42L12 14z" />
          </svg>
          <span>Tambah Muthawif</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <form method="GET" className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Cari nama / kode..."
              className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>
          <select
            name="status"
            defaultValue={status}
            className="text-xs rounded-lg border border-gray-200 px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <GuideTable guides={guides} />
      </div>
    </div>
  );
}
