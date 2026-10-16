import Link from "next/link";
import { AirlineTable } from "@/features/airlines/components/AirlineTable";
import { getAirlinesList } from "@/features/airlines/services/airlineService";

export const dynamic = "force-dynamic";

interface AirlinesPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function AirlinesPage({ searchParams }: AirlinesPageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || "";

  const airlines = await getAirlinesList(search);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 flex items-center gap-1.5">
        <Link href="/" className="hover:text-emerald-700">
          Beranda
        </Link>
        <span>&gt;</span>
        <span className="text-gray-700 font-medium">Maskapai</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Maskapai</h1>
          <p className="text-xs text-gray-500 mt-1">Daftar maskapai penerbangan</p>
        </div>
        <Link
          href="/airlines/create"
          className="inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <span>+</span>
          <span>Tambah Maskapai</span>
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
              placeholder="Cari maskapai..."
              className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>
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
        <AirlineTable airlines={airlines} />
      </div>
    </div>
  );
}
