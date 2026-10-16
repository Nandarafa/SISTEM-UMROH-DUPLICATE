import Link from "next/link";
import { getBranchesList } from "@/features/branches/services/branchService";
import { BranchTable } from "@/features/branches/components/BranchTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function BranchesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q ?? "";
  const branches = await getBranchesList(q);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching Screenshot 4 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Cabang</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Cabang</h1>
            <p className="text-xs text-gray-400 mt-1">Daftar cabang travel</p>
          </div>
          <div>
            <Link
              href="/branches/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f766e] text-white text-xs font-medium hover:bg-[#0d6d66] shadow-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>Tambah Cabang</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter / Search Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <form method="GET" className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari nama atau kode cabang..."
            className="text-xs rounded-lg border border-gray-200 px-3.5 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-600 min-w-[260px]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Cari
          </button>
        </form>

        {/* Table */}
        {branches.length > 0 ? (
          <BranchTable branches={branches} />
        ) : (
          <div className="p-12 text-center text-gray-400 text-sm">
            Belum ada cabang ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
