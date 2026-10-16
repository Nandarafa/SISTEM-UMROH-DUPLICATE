"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AirlineItem } from "@/features/airlines/services/airlineService";
import { updateAirlineAction } from "@/features/airlines/services/airlineActions";
import { useToast } from "@/components/ui/ToastProvider";

interface EditAirlineFormProps {
  airline: AirlineItem;
}

export function EditAirlineForm({ airline }: EditAirlineFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const airlineName = String(formData.get("name") || "");

    try {
      const res = await updateAirlineAction(airline.id, formData);
      if (res.success) {
        showToast({
          type: "success",
          title: "Maskapai Berhasil Diubah!",
          description: `Perubahan data maskapai "${airlineName}" telah berhasil disimpan.`,
        });
        router.push("/airlines");
        router.refresh();
      } else {
        showToast({
          type: "error",
          title: "Gagal Mengubah Maskapai",
          description: res.error || "Terjadi kesalahan saat menyimpan perubahan.",
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
    <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Nama Maskapai *
          </label>
          <input
            type="text"
            name="name"
            defaultValue={airline.name}
            required
            placeholder="Contoh: Saudi Arabian Airlines"
            className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Kode
            </label>
            <input
              type="text"
              name="code"
              defaultValue={airline.code}
              placeholder="Contoh: SV, GA, EK"
              className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Transit
            </label>
            <input
              type="text"
              name="transit"
              defaultValue={airline.transit}
              placeholder="Contoh: Langsung / Transit Dubai"
              className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            value="1"
            defaultChecked={airline.is_active}
            className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700 border-gray-300"
          />
          <label htmlFor="is_active" className="text-xs font-medium text-gray-700 cursor-pointer">
            Aktif
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <Link
            href="/airlines"
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
