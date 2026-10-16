"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ManifestPilgrimItem } from "@/features/manifests/services/manifestService";
import { saveManifestAction } from "@/features/manifests/services/manifestActions";

interface Props {
  items: ManifestPilgrimItem[];
}

export function ManifestManageForm({ items: initialItems }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const res = await saveManifestAction(formData);

    setLoading(false);
    if (!res?.error) {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="p-3 text-xs text-teal-700 bg-teal-50 border border-teal-200 rounded-lg">
          Manifest berhasil disimpan ke database.
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-4 font-semibold">JAMAAH</th>
                <th className="px-6 py-4 font-semibold">NO. KAMAR</th>
                <th className="px-6 py-4 font-semibold">TIPE KAMAR</th>
                <th className="px-6 py-4 font-semibold">NO. BUS</th>
                <th className="px-6 py-4 font-semibold">NO. KURSI</th>
                <th className="px-6 py-4 font-semibold">GRUP MAHRAM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialItems.map((item) => (
                <tr key={item.registrationId} className="hover:bg-gray-50/50">
                  {/* JAMAAH */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="hidden" name="registration_id" value={item.registrationId} />
                    <p className="font-medium text-gray-800 text-sm">{item.pilgrimName}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.registrationCode}</p>
                  </td>

                  {/* NO. KAMAR */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      name={`room_number_${item.registrationId}`}
                      defaultValue={item.roomNumber}
                      className="w-24 text-sm rounded-lg border border-gray-200 px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                    />
                  </td>

                  {/* TIPE KAMAR */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      name={`room_type_${item.registrationId}`}
                      defaultValue={item.roomType || "Quad"}
                      className="w-28 text-sm rounded-lg border border-gray-200 px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                    >
                      <option value="Quad">Quad</option>
                      <option value="Triple">Triple</option>
                      <option value="Double">Double</option>
                      <option value="Single">Single</option>
                    </select>
                  </td>

                  {/* NO. BUS */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      name={`bus_number_${item.registrationId}`}
                      defaultValue={item.busNumber}
                      className="w-24 text-sm rounded-lg border border-gray-200 px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                    />
                  </td>

                  {/* NO. KURSI */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      name={`seat_number_${item.registrationId}`}
                      defaultValue={item.seatNumber}
                      className="w-20 text-sm rounded-lg border border-gray-200 px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                    />
                  </td>

                  {/* GRUP MAHRAM */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      name={`mahram_group_${item.registrationId}`}
                      defaultValue={item.mahramGroup}
                      className="w-28 text-sm rounded-lg border border-gray-200 px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buttons matching Screenshot 3 */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#0f766e] text-white text-sm font-medium rounded-xl hover:bg-[#0d6d66] transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Manifest"}
        </button>
        <Link
          href="/manifests"
          className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
        >
          Kembali
        </Link>
      </div>
    </form>
  );
}
