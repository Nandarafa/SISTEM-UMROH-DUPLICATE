"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPackageAction } from "@/features/packages/services/packageActions";
import { useToast } from "@/components/ui/ToastProvider";

interface CreatePackageFormProps {
  branches: { id: string; name: string }[];
  hotelsMekah: { id: string; name: string }[];
  hotelsMadinah: { id: string; name: string }[];
  airlines: { id: string; name: string }[];
}

export function CreatePackageForm({
  branches,
  hotelsMekah,
  hotelsMadinah,
  airlines,
}: CreatePackageFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const pkgName = String(formData.get("name") || "");

    try {
      const res = await createPackageAction(formData);
      if (res.success) {
        showToast({
          type: "success",
          title: "Paket Berhasil Ditambahkan!",
          description: `Paket "${pkgName}" telah berhasil disimpan ke database.`,
        });
        router.push("/packages");
        router.refresh();
      } else {
        showToast({
          type: "error",
          title: "Gagal Menambahkan Paket",
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Informasi Paket matching Screenshot 1 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Informasi Paket</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nama Paket <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder=""
              className="w-full rounded-lg border border-gray-200 text-xs px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Kode</label>
              <input
                type="text"
                name="code"
                placeholder=""
                className="w-full rounded-lg border border-gray-200 text-xs px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">Kosongkan untuk dibuat otomatis</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Cabang</label>
              <select
                name="branch_id"
                defaultValue={branches[0]?.id || ""}
                className="w-full rounded-lg border border-gray-200 text-xs px-3.5 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
              >
                <option value="">Pilih Cabang</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Jenis <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                required
                defaultValue="umroh"
                className="w-full rounded-lg border border-gray-200 text-xs px-3.5 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
              >
                <option value="umroh">Umroh</option>
                <option value="haji">Haji</option>
                <option value="haji_plus">Haji Plus</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                required
                defaultValue="draft"
                className="w-full rounded-lg border border-gray-200 text-xs px-3.5 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
              >
                <option value="draft">Draft</option>
                <option value="active">Dibuka</option>
                <option value="closed">Ditutup</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Harga <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                required
                placeholder=""
                className="w-full rounded-lg border border-gray-200 text-xs px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Uang Muka (DP)</label>
              <input
                type="number"
                name="down_payment"
                placeholder=""
                className="w-full rounded-lg border border-gray-200 text-xs px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Kuota <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quota"
                required
                placeholder=""
                className="w-full rounded-lg border border-gray-200 text-xs px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Durasi (hari) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="duration_days"
                required
                defaultValue="9"
                className="w-full rounded-lg border border-gray-200 text-xs px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Keberangkatan & Akomodasi matching Screenshot 1 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Keberangkatan &amp; Akomodasi</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tanggal Berangkat</label>
              <input
                type="date"
                name="departure_date"
                className="w-full rounded-lg border border-gray-200 text-xs px-3.5 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Kota Keberangkatan</label>
              <input
                type="text"
                name="departure_city"
                placeholder=""
                className="w-full rounded-lg border border-gray-200 text-xs px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Hotel Mekah</label>
              <select
                name="hotel_makkah"
                defaultValue=""
                className="w-full rounded-lg border border-gray-200 text-xs px-3.5 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
              >
                <option value="">Pilih Hotel Mekah</option>
                {hotelsMekah.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Hotel Madinah</label>
              <select
                name="hotel_madinah"
                defaultValue=""
                className="w-full rounded-lg border border-gray-200 text-xs px-3.5 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
              >
                <option value="">Pilih Hotel Madinah</option>
                {hotelsMadinah.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Maskapai</label>
            <select
              name="airline"
              defaultValue=""
              className="w-full rounded-lg border border-gray-200 text-xs px-3.5 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
            >
              <option value="">Pilih Maskapai</option>
              {airlines.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Fasilitas & Deskripsi matching Screenshot 1 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Fasilitas &amp; Deskripsi</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Fasilitas Termasuk</label>
            <textarea
              name="facilities_included"
              rows={3}
              placeholder="Satu fasilitas per baris"
              className="w-full rounded-lg border border-gray-200 text-xs px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
            />
            <p className="text-[11px] text-gray-400 mt-1">Satu fasilitas per baris</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Fasilitas Tidak Termasuk</label>
            <textarea
              name="facilities_excluded"
              rows={3}
              placeholder="Satu fasilitas per baris"
              className="w-full rounded-lg border border-gray-200 text-xs px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
            />
            <p className="text-[11px] text-gray-400 mt-1">Satu fasilitas per baris</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Deskripsi</label>
            <textarea
              name="description"
              rows={4}
              placeholder=""
              className="w-full rounded-lg border border-gray-200 text-xs px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-[#0d9488] hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
        <Link
          href="/packages"
          className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
