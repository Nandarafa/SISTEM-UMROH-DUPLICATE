"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PilgrimItem } from "@/features/pilgrims/services/pilgrimService";
import { EquipmentItem } from "@/features/equipment/services/equipmentService";
import { createEquipmentAction, updateEquipmentAction } from "@/features/equipment/services/equipmentActions";

interface Props {
  pilgrims: PilgrimItem[];
  initialData?: EquipmentItem;
  isEdit?: boolean;
}

export function EquipmentForm({ pilgrims, initialData, isEdit }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = isEdit && initialData
      ? await updateEquipmentAction(initialData.id, formData)
      : await createEquipmentAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/equipment");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Jamaah * */}
      <div>
        <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
          Jamaah <span className="text-red-500">*</span>
        </label>
        <select
          name="pilgrim_id"
          defaultValue={initialData?.pilgrimId || ""}
          required
          className="w-full text-sm rounded-xl border border-gray-200 px-4 py-3 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
        >
          <option value="">&mdash; Pilih &mdash;</option>
          {pilgrims.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} - {p.packageName || "Umroh Reguler 9 Hari"}
            </option>
          ))}
        </select>
      </div>

      {/* Item * & Ukuran */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
            Item <span className="text-red-500">*</span>
          </label>
          <select
            name="item"
            defaultValue={initialData?.item || ""}
            required
            className="w-full text-sm rounded-xl border border-gray-200 px-4 py-3 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          >
            <option value="">&mdash; Pilih &mdash;</option>
            <option value="Koper">Koper</option>
            <option value="Seragam">Seragam</option>
            <option value="Kain Ihram">Kain Ihram</option>
            <option value="Tas Paspor">Tas Paspor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
            Ukuran
          </label>
          <input
            type="text"
            name="size"
            defaultValue={initialData?.size || ""}
            placeholder="misal 24 inch, M, L, XL"
            className="w-full text-sm rounded-xl border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
      </div>

      {/* Jumlah * & Status * */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
            Jumlah <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="quantity"
            defaultValue={initialData?.quantity || 1}
            min={1}
            required
            className="w-full text-sm rounded-xl border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            defaultValue={initialData?.status || "Belum Disiapkan"}
            required
            className="w-full text-sm rounded-xl border border-gray-200 px-4 py-3 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          >
            <option value="Belum Disiapkan">Belum Disiapkan</option>
            <option value="Disiapkan">Disiapkan</option>
            <option value="Sudah Diserahkan">Sudah Diserahkan</option>
          </select>
        </div>
      </div>

      {/* Tanggal Diserahkan */}
      <div>
        <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
          Tanggal Diserahkan
        </label>
        <input
          type="date"
          name="handed_over_at"
          className="w-full text-sm rounded-xl border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
        />
      </div>

      {/* Catatan */}
      <div>
        <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
          Catatan
        </label>
        <textarea
          name="notes"
          defaultValue={initialData?.notes || ""}
          rows={3}
          className="w-full text-sm rounded-xl border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#0f766e] text-white text-sm font-medium rounded-xl hover:bg-[#0d6d66] transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : isEdit ? "Perbarui Perlengkapan" : "Simpan Perlengkapan"}
        </button>
        <Link
          href="/equipment"
          className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
