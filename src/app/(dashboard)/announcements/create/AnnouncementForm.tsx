"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnnouncementItem } from "@/features/announcements/services/announcementService";
import { createAnnouncementAction, updateAnnouncementAction } from "@/features/announcements/services/announcementActions";
import { PackageItem } from "@/features/packages/services/packageService";

interface Props {
  packages: PackageItem[];
  initialData?: AnnouncementItem;
  isEdit?: boolean;
}

export function AnnouncementForm({ packages, initialData, isEdit }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = isEdit && initialData
      ? await updateAnnouncementAction(initialData.id, formData)
      : await createAnnouncementAction(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/announcements");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Card Detail Pengumuman matching Screenshot 5 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-800">Detail Pengumuman</h2>

        {/* Judul * */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            defaultValue={initialData?.title || ""}
            required
            className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>

        {/* Isi Pengumuman * */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Isi Pengumuman <span className="text-red-500">*</span>
          </label>
          <textarea
            name="body"
            defaultValue={initialData?.body || ""}
            rows={4}
            required
            className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>

        {/* Audiens * & Cabang */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Audiens <span className="text-red-500">*</span>
            </label>
            <select
              name="audience"
              defaultValue={initialData?.audience || ""}
              required
              className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            >
              <option value="">&mdash; Pilih &mdash;</option>
              <option value="all">Semua Pengguna</option>
              <option value="staff">Staff &amp; Admin</option>
              <option value="agen">Agen</option>
              <option value="jamaah">Jamaah</option>
              <option value="guide">Muthawif</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Cabang
            </label>
            <select
              name="branch_id"
              defaultValue={initialData?.branchId || ""}
              className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            >
              <option value="">Semua Cabang</option>
              <option value="f68b6fde-225a-49de-86ba-60f8e161acdc">Kantor Pusat Jakarta</option>
              <option value="f9ea810a-9d1e-4519-bd48-885a4fe5440e">Cabang Surabaya</option>
            </select>
          </div>
        </div>

        {/* Paket (opsional) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Paket (opsional)
          </label>
          <select
            name="package_id"
            defaultValue={initialData?.packageId || ""}
            className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          >
            <option value="">Semua Paket</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} ({pkg.code})
              </option>
            ))}
          </select>
        </div>

        {/* Tayang Mulai & Kedaluwarsa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Tayang Mulai
            </label>
            <input
              type="datetime-local"
              name="start_at"
              className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Kedaluwarsa
            </label>
            <input
              type="datetime-local"
              name="expires_at"
              className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>
        </div>

        {/* Terbitkan Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="is_published"
            name="is_published"
            defaultChecked={initialData?.isPublished ?? true}
            className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
          />
          <label htmlFor="is_published" className="text-xs font-medium text-gray-700 cursor-pointer">
            Terbitkan
          </label>
        </div>
      </div>

      {/* Buttons matching Screenshot 5 */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#0f766e] text-white text-sm font-medium rounded-xl hover:bg-[#0d6d66] transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
        <Link
          href="/announcements"
          className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
