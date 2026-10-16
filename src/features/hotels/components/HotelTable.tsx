"use client";

import { useState } from "react";
import Link from "next/link";
import { HotelItem } from "@/features/hotels/services/hotelService";
import { deleteHotelAction } from "@/features/hotels/services/hotelActions";
import { useToast } from "@/components/ui/ToastProvider";

interface HotelTableProps {
  hotels: HotelItem[];
}

export function HotelTable({ hotels }: HotelTableProps) {
  const { showToast } = useToast();
  const [items, setItems] = useState<HotelItem[]>(hotels);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelItem | null>(null);
  const [loading, setLoading] = useState(false);

  const confirmDelete = (hotel: HotelItem) => {
    setSelectedHotel(hotel);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedHotel) return;
    setLoading(true);
    const deletedName = selectedHotel.name;
    try {
      const res = await deleteHotelAction(selectedHotel.id);
      if (res.success) {
        setItems((prev) => prev.filter((h) => h.id !== selectedHotel.id));
        setDeleteModalOpen(false);
        setSelectedHotel(null);
        showToast({
          type: "success",
          title: "Hotel Berhasil Dihapus!",
          description: `Hotel "${deletedName}" telah berhasil dihapus dari sistem.`,
        });
      } else {
        showToast({
          type: "error",
          title: "Gagal Menghapus Hotel",
          description: "Terjadi kesalahan saat menghapus data.",
        });
      }
    } catch (e: any) {
      console.error(e);
      showToast({
        type: "error",
        title: "Kesalahan Sistem",
        description: e?.message || "Gagal menghapus hotel.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50/75 text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3.5">HOTEL</th>
              <th className="px-6 py-3.5">KOTA</th>
              <th className="px-6 py-3.5">BINTANG</th>
              <th className="px-6 py-3.5">JARAK KE MASJID</th>
              <th className="px-6 py-3.5">STATUS</th>
              <th className="px-6 py-3.5 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((hotel) => (
              <tr key={hotel.id} className="hover:bg-gray-50/60 transition">
                <td className="px-6 py-4 font-semibold text-gray-800 text-xs">
                  {hotel.name}
                </td>
                <td className="px-6 py-4 text-gray-700">{hotel.city}</td>
                <td className="px-6 py-4 text-amber-400 text-sm tracking-wider">
                  {"★".repeat(hotel.star)}
                </td>
                <td className="px-6 py-4 text-gray-700">{hotel.distance_to_masjid} m</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700">
                    Aktif
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-3 text-xs">
                    <Link
                      href={`/hotels/${hotel.id}/edit`}
                      className="text-teal-600 hover:underline font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => confirmDelete(hotel)}
                      className="text-red-500 hover:underline font-medium flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 12-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      <span>Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 text-center shadow-2xl relative">
            <div className="w-20 h-20 rounded-full border-4 border-amber-300 text-amber-500 flex items-center justify-center mx-auto mb-5 text-4xl font-light">
              !
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Anda yakin?</h3>
            <p className="text-xs text-gray-500 mb-6">
              Data yang dihapus tidak dapat dikembalikan.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={handleDelete}
                className="px-6 py-2.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 shadow-sm transition disabled:opacity-50"
              >
                {loading ? "Menghapus..." : "Ya, lanjutkan"}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => setDeleteModalOpen(false)}
                className="px-6 py-2.5 rounded-lg bg-slate-600 text-white text-xs font-semibold hover:bg-slate-700 transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
