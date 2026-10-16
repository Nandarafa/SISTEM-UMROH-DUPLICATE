import Link from "next/link";
import { getHotelsList } from "@/features/hotels/services/hotelService";
import { HotelTable } from "@/features/hotels/components/HotelTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    q?: string;
    city?: string;
  }>;
}

export default async function HotelsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const hotels = await getHotelsList(params.q, params.city);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching screenshot 2 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Hotel</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Hotel</h1>
            <p className="text-xs text-gray-400 mt-0.5">Daftar hotel Mekah &amp; Madinah</p>
          </div>
          <div>
            <Link
              href="/hotels/create"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0d9488] text-white text-xs font-medium hover:bg-teal-700 shadow-sm transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3m4-14h2m-2 4h2m6-4h2m-2 4h2M9 21v-4a1 1 0 011-1h4a1 1 0 011 1v4" />
              </svg>
              <span>Tambah Hotel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Card with Filter Form & Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <form method="GET" className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          <input
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Cari nama hotel…"
            className="rounded-lg border border-gray-300 text-xs px-3 py-2 focus:border-[#0d9488] focus:outline-none w-56"
          />
          <select
            name="city"
            defaultValue={params.city ?? ""}
            className="rounded-lg border border-gray-300 text-xs px-3 py-2 bg-white text-gray-700 focus:border-[#0d9488] focus:outline-none min-w-[130px]"
          >
            <option value="">Semua Kota</option>
            <option value="Mekah">Mekah</option>
            <option value="Madinah">Madinah</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gray-100 text-xs font-medium hover:bg-gray-200 text-gray-700 transition"
          >
            Cari
          </button>
        </form>

        <HotelTable hotels={hotels} />
      </div>
    </div>
  );
}
