import Link from "next/link";
import { getPackagesList } from "@/features/packages/services/packageService";
import { PackageTable } from "@/features/packages/components/PackageTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    status?: string;
  }>;
}

export default async function PackagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const packages = await getPackagesList(params.q, params.type, params.status);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching screenshot 3 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Paket</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Paket</h1>
            <p className="text-xs text-gray-400 mt-0.5">Daftar paket Umroh &amp; Haji</p>
          </div>
          <div>
            <Link
              href="/packages/create"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0d9488] text-white text-xs font-medium hover:bg-teal-700 shadow-sm transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Tambah Paket</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Card with Filter and Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <form method="GET" className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          <input
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Cari nama / kode…"
            className="rounded-lg border border-gray-300 text-xs px-3 py-2 focus:border-[#0d9488] focus:outline-none w-56"
          />
          <select
            name="type"
            defaultValue={params.type ?? ""}
            className="rounded-lg border border-gray-300 text-xs px-3 py-2 bg-white text-gray-700 focus:border-[#0d9488] focus:outline-none min-w-[130px]"
          >
            <option value="">Semua Jenis</option>
            <option value="umroh">Umroh</option>
            <option value="haji">Haji</option>
            <option value="haji_plus">Haji Plus</option>
          </select>
          <select
            name="status"
            defaultValue={params.status ?? ""}
            className="rounded-lg border border-gray-300 text-xs px-3 py-2 bg-white text-gray-700 focus:border-[#0d9488] focus:outline-none min-w-[130px]"
          >
            <option value="">Semua Status</option>
            <option value="active">Dibuka</option>
            <option value="closed">Ditutup</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gray-100 text-xs font-medium hover:bg-gray-200 text-gray-700 transition"
          >
            Cari
          </button>
        </form>

        <PackageTable packages={packages} />
      </div>
    </div>
  );
}
