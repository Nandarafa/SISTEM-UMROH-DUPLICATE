import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getPackageDetail } from "@/features/packages/services/packageService";
import { updatePackageAction } from "@/features/packages/services/packageActions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface EditPackagePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPackagePage({ params }: EditPackagePageProps) {
  const { id } = await params;
  const pkg = await getPackageDetail(id);

  if (!pkg) {
    notFound();
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    await updatePackageAction(id, formData);
    redirect("/packages");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb & Header matching screenshot 5 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/packages" className="hover:text-gray-600">Paket</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Edit</span>
        </nav>
        <h1 className="text-xl font-bold text-gray-800">Edit Paket</h1>
        <p className="text-xs text-gray-400 mt-0.5">{pkg.name}</p>
      </div>

      <form action={handleUpdate} className="space-y-6">
        {/* 1. Informasi Paket */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Informasi Paket</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nama Paket <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={pkg.name}
                className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Kode</label>
                <input
                  type="text"
                  name="code"
                  defaultValue={pkg.code}
                  className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">Kosongkan untuk dibuat otomatis</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cabang</label>
                <select
                  name="branch_id"
                  defaultValue="1"
                  className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 bg-white text-gray-700 focus:border-[#0d9488] focus:outline-none"
                >
                  <option value="1">Kantor Pusat Jakarta</option>
                  <option value="2">Cabang Surabaya</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Jenis <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  required
                  defaultValue={pkg.type}
                  className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 bg-white text-gray-700 focus:border-[#0d9488] focus:outline-none"
                >
                  <option value="umroh">Umroh</option>
                  <option value="haji">Haji</option>
                  <option value="haji_plus">Haji Plus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  required
                  defaultValue={pkg.status}
                  className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 bg-white text-gray-700 focus:border-[#0d9488] focus:outline-none"
                >
                  <option value="active">Dibuka</option>
                  <option value="closed">Ditutup</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Harga <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  defaultValue={pkg.price}
                  className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Uang Muka (DP)</label>
                <input
                  type="number"
                  name="down_payment"
                  defaultValue={pkg.down_payment}
                  className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Kuota <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quota"
                  required
                  defaultValue={pkg.quota}
                  className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Durasi (hari) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="duration_days"
                  required
                  defaultValue={pkg.duration_days}
                  className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Keberangkatan & Akomodasi */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Keberangkatan &amp; Akomodasi</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Berangkat</label>
                <input
                  type="date"
                  name="departure_date"
                  defaultValue={pkg.departure_date ? pkg.departure_date.split("T")[0] : "2026-10-11"}
                  className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none text-gray-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Kota Keberangkatan</label>
                <input
                  type="text"
                  name="departure_city"
                  defaultValue={pkg.departure_city || "Jakarta"}
                  className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Hotel Mekah</label>
                <select
                  name="hotel_makkah"
                  defaultValue="1"
                  className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 bg-white text-gray-700 focus:border-[#0d9488] focus:outline-none"
                >
                  <option value="1">Swissôtel Al Maqam Makkah</option>
                  <option value="2">Pullman ZamZam Makkah</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Hotel Madinah</label>
                <select
                  name="hotel_madinah"
                  defaultValue="1"
                  className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 bg-white text-gray-700 focus:border-[#0d9488] focus:outline-none"
                >
                  <option value="1">Anwar Al Madinah Mövenpick</option>
                  <option value="2">Dar Al Taqwa Madinah</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Maskapai</label>
              <select
                name="airline"
                defaultValue="1"
                className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 bg-white text-gray-700 focus:border-[#0d9488] focus:outline-none"
              >
                <option value="1">Saudi Arabian Airlines</option>
                <option value="2">Garuda Indonesia</option>
                <option value="3">Turkish Airlines</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Fasilitas & Deskripsi */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Fasilitas &amp; Deskripsi</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                name="description"
                rows={4}
                defaultValue={pkg.description || "Paket perjalanan ibadah dengan bimbingan muthawif berpengalaman."}
                className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#0d9488] text-white text-xs font-medium hover:bg-teal-700 transition"
          >
            Simpan Perubahan
          </button>
          <Link
            href="/packages"
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-medium transition"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
