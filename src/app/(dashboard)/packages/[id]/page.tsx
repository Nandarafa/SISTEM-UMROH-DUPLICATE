import Link from "next/link";
import { notFound } from "next/navigation";
import { getPackageDetail } from "@/features/packages/services/packageService";
import { currency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PackageDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PackageDetailPage({ params }: PackageDetailPageProps) {
  const { id } = await params;
  const pkg = await getPackageDetail(id);

  if (!pkg) {
    notFound();
  }

  const registeredActive = pkg.registeredCount || 4;
  const remainingQuota = Math.max(0, pkg.quota - registeredActive);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching screenshot 1 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/packages" className="hover:text-gray-600">Paket</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">{pkg.name}</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{pkg.name}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{pkg.code}</p>
          </div>
          <div>
            <Link
              href={`/packages/${pkg.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0d9488] text-white text-xs font-medium hover:bg-teal-700 shadow-sm transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <span>Edit</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Top Cards: Harga, Pendaftar Aktif, Sisa Kuota */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Harga */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2"></rect>
              <circle cx="12" cy="12" r="2"></circle>
              <path d="M6 12h.01M18 12h.01"></path>
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400">Harga</p>
            <p className="text-lg font-bold text-gray-800">{currency(pkg.price)}</p>
            <p className="text-[11px] text-gray-400">DP {currency(pkg.down_payment)}</p>
          </div>
        </div>

        {/* Pendaftar Aktif */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a3 3 0 10-2-5.2" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400">Pendaftar Aktif</p>
            <p className="text-lg font-bold text-gray-800">{registeredActive}</p>
            <p className="text-[11px] text-gray-400">Kuota {pkg.quota}</p>
          </div>
        </div>

        {/* Sisa Kuota */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400">Sisa Kuota</p>
            <p className="text-lg font-bold text-gray-800">{remainingQuota}</p>
            <p className="text-[11px] text-gray-400">Tersedia</p>
          </div>
        </div>
      </div>

      {/* Row 1: Informasi Paket & Akomodasi & Transportasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informasi Paket */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Informasi Paket</h3>
          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Jenis</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700">
                {pkg.type === "haji_plus" ? "Haji Plus" : pkg.type === "haji" ? "Haji" : "Umroh"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Status</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700">
                Dibuka
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Cabang</span>
              <span className="text-gray-800 font-medium">Kantor Pusat Jakarta</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Durasi</span>
              <span className="text-gray-800 font-medium">{pkg.duration_days} hari</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Tanggal Berangkat</span>
              <span className="text-gray-800 font-medium">
                {new Date(pkg.departure_date).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Kota Keberangkatan</span>
              <span className="text-gray-800 font-medium">{pkg.departure_city}</span>
            </div>
          </div>
        </div>

        {/* Akomodasi & Transportasi */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Akomodasi &amp; Transportasi</h3>
          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Hotel Mekah</span>
              <span className="text-gray-800 font-medium">{pkg.hotelMakkah}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Hotel Madinah</span>
              <span className="text-gray-800 font-medium">{pkg.hotelMadinah}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Maskapai</span>
              <span className="text-gray-800 font-medium">{pkg.airline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Fasilitas Termasuk & Fasilitas Tidak Termasuk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fasilitas Termasuk */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Fasilitas Termasuk</h3>
          <ul className="space-y-2.5 text-xs text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-teal-600 font-bold">&#10003;</span>
              <span>Tiket pesawat PP</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-teal-600 font-bold">&#10003;</span>
              <span>Hotel bintang 4/5</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-teal-600 font-bold">&#10003;</span>
              <span>Visa &amp; manasik</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-teal-600 font-bold">&#10003;</span>
              <span>Makan 3x sehari</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-teal-600 font-bold">&#10003;</span>
              <span>Bus AC</span>
            </li>
          </ul>
        </div>

        {/* Fasilitas Tidak Termasuk */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Fasilitas Tidak Termasuk</h3>
          <ul className="space-y-2.5 text-xs text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-red-500 text-sm">&bull;</span>
              <span>Pengeluaran pribadi</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500 text-sm">&bull;</span>
              <span>Kelebihan bagasi</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500 text-sm">&bull;</span>
              <span>Vaksin</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Row 3: Deskripsi */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Deskripsi</h3>
        <p className="text-xs text-gray-600 leading-relaxed">{pkg.description}</p>
      </div>
    </div>
  );
}
