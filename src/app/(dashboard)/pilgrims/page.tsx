import Link from "next/link";
import { getPilgrims } from "@/features/pilgrims/services/pilgrimService";
import { PilgrimTable } from "@/features/pilgrims/components/PilgrimTable";
import { deletePilgrimAction } from "@/features/pilgrims/services/pilgrimMutations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PilgrimsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const pilgrims = await getPilgrims(params.q, params.status);

  const handleDelete = async (id: string) => {
    "use server";
    return deletePilgrimAction(id);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Breadcrumb & Header matching Screenshot 2 */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:underline">Beranda</Link>
          <span>&rsaquo;</span>
          <span className="text-gray-600 font-medium">Jamaah</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">Jamaah</h1>
            <p className="text-xs text-gray-400 mt-0.5">Daftar jamaah umroh &amp; haji</p>
          </div>
          <div>
            <Link
              href="/pilgrims/create"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-lg bg-[#0d9488] text-white text-xs font-semibold hover:bg-teal-700 shadow-sm transition active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Tambah Jamaah</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Card with Filter Form & Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filter Form */}
        <form method="GET" className="p-3.5 sm:p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-2.5 sm:items-center">
          <input
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Cari nama / NIK / paspor…"
            className="rounded-lg border border-gray-300 text-xs px-3.5 py-2 focus:border-[#0d9488] focus:outline-none w-full sm:w-64"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              name="status"
              defaultValue={params.status ?? ""}
              className="flex-1 sm:flex-none rounded-lg border border-gray-300 text-xs px-3 py-2 focus:border-[#0d9488] focus:outline-none bg-white text-gray-700"
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gray-100 text-xs font-medium hover:bg-gray-200 text-gray-700 transition active:scale-95 shrink-0"
            >
              Cari
            </button>
          </div>
        </form>

        <PilgrimTable pilgrims={pilgrims} onDeleteAction={handleDelete} />
      </div>
    </div>
  );
}
