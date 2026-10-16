"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createHotelAction } from "@/features/hotels/services/hotelActions";
import { useToast } from "@/components/ui/ToastProvider";

export default function CreateHotelPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const hotelName = String(formData.get("name") || "");

    try {
      const res = await createHotelAction(formData);
      if (res.success) {
        showToast({
          type: "success",
          title: "Hotel Berhasil Ditambahkan!",
          description: `Hotel "${hotelName}" telah berhasil disimpan ke database.`,
        });
        router.push("/hotels");
        router.refresh();
      } else {
        showToast({
          type: "error",
          title: "Gagal Menambahkan Hotel",
          description: res.error || "Terjadi kesalahan saat menyimpan data.",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Kesalahan Sistem",
        description: err?.message || "Gagal menghubungi server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Breadcrumb & Header matching screenshot 3 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/hotels" className="hover:text-gray-600">Hotel</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Tambah</span>
        </nav>
        <h1 className="text-xl font-bold text-gray-800">Tambah Hotel</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Nama Hotel <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Contoh: Hilton Makkah"
              className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Kota <span className="text-red-500">*</span>
              </label>
              <select
                name="city"
                required
                defaultValue=""
                className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 bg-white text-gray-700 focus:border-[#0d9488] focus:outline-none"
              >
                <option value="" disabled>— Pilih —</option>
                <option value="Mekah">Mekah</option>
                <option value="Madinah">Madinah</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Bintang <span className="text-red-500">*</span>
              </label>
              <select
                name="star"
                required
                defaultValue="4"
                className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 bg-white text-gray-700 focus:border-[#0d9488] focus:outline-none"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Jarak ke Masjid (meter)
            </label>
            <input
              type="number"
              name="distance_to_masjid"
              placeholder="100"
              className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              value="1"
              defaultChecked={true}
              className="rounded border-gray-300 text-[#0d9488] focus:ring-[#0d9488] h-4 w-4"
            />
            <label htmlFor="is_active" className="text-xs font-medium text-gray-700 cursor-pointer">
              Aktif
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              name="description"
              rows={4}
              className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-[#0d9488] text-white text-xs font-medium hover:bg-teal-700 transition disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
            <Link
              href="/hotels"
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-medium transition"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
