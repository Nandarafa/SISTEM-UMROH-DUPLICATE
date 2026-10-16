"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { createManasikAction, updateManasikAction } from "@/features/dashboard/services/manasikActions";

interface OptionItem {
  id: string;
  name: string;
}

interface ManasikFormProps {
  schedule?: {
    id: string;
    title: string;
    package_id?: string | null;
    guide_id?: string | null;
    date: string;
    location?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    description?: string | null;
  };
  packages: OptionItem[];
  guides: OptionItem[];
}

export function ManasikForm({ schedule, packages, guides }: ManasikFormProps) {
  const isEdit = !!schedule;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);

    startTransition(async () => {
      const res = isEdit
        ? await updateManasikAction(schedule.id, formData)
        : await createManasikAction(formData);

      if (res && (res as any).error) {
        setError((res as any).error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-medium text-gray-700 mb-1">
              Judul <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              defaultValue={schedule?.title || ""}
              required
              placeholder="Contoh: Manasik Akbar Keberangkatan Oktober"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Paket</label>
            <select
              name="package_id"
              defaultValue={schedule?.package_id || ""}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="">— Umum (semua jamaah) —</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400 mt-1">Kosongkan untuk manasik umum cabang.</p>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Pembimbing</label>
            <select
              name="guide_id"
              defaultValue={schedule?.guide_id || ""}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="">— Tanpa pembimbing —</option>
              {guides.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              defaultValue={schedule?.date || ""}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Lokasi</label>
            <input
              name="location"
              defaultValue={schedule?.location || ""}
              placeholder="Contoh: Aula Masjid Raya"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Jam Mulai</label>
            <input
              type="time"
              name="start_time"
              defaultValue={schedule?.start_time ? schedule.start_time.slice(0, 5) : ""}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Jam Selesai</label>
            <input
              type="time"
              name="end_time"
              defaultValue={schedule?.end_time ? schedule.end_time.slice(0, 5) : ""}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={schedule?.description || ""}
              placeholder="Catatan atau materi pembekalan manasik..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 rounded-xl bg-[#0d9488] text-white text-xs font-semibold hover:bg-teal-700 shadow-sm transition disabled:opacity-50"
        >
          {isPending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan"}
        </button>
        <Link
          href="/manasik"
          className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-xs font-medium hover:bg-gray-50 transition"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
