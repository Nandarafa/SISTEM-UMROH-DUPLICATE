"use client";

import { useState } from "react";
import Link from "next/link";
import { PilgrimItem } from "@/features/pilgrims/services/pilgrimService";
import { useToast } from "@/components/ui/ToastProvider";

interface PilgrimTableProps {
  pilgrims: PilgrimItem[];
  onDeleteAction: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function PilgrimTable({ pilgrims, onDeleteAction }: PilgrimTableProps) {
  const { showToast } = useToast();
  const [items, setItems] = useState<PilgrimItem[]>(pilgrims);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPilgrim, setSelectedPilgrim] = useState<PilgrimItem | null>(null);
  const [loading, setLoading] = useState(false);

  const confirmDelete = (pilgrim: PilgrimItem) => {
    setSelectedPilgrim(pilgrim);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPilgrim) return;
    setLoading(true);
    const deletedName = selectedPilgrim.name;
    try {
      const res = await onDeleteAction(selectedPilgrim.id);
      if (res.success) {
        setItems((prev) => prev.filter((p) => p.id !== selectedPilgrim.id));
        setDeleteModalOpen(false);
        setSelectedPilgrim(null);
        showToast({
          type: "success",
          title: "Jamaah Berhasil Dihapus!",
          description: `Data jamaah "${deletedName}" telah berhasil dihapus dari sistem.`,
        });
      } else {
        showToast({
          type: "error",
          title: "Gagal Menghapus Jamaah",
          description: res.error || "Terjadi kesalahan saat menghapus data.",
        });
      }
    } catch (e: any) {
      console.error(e);
      showToast({
        type: "error",
        title: "Kesalahan Sistem",
        description: e?.message || "Gagal menghapus jamaah.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mobile Card List (shown on screens < md) */}
      <div className="md:hidden divide-y divide-gray-100">
        {items.map((p, idx) => (
          <div
            key={p.id}
            className="p-4 space-y-3 hover:bg-gray-50/80 transition-colors animate-fade-in-up"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-semibold text-gray-900 text-sm block">{p.name}</span>
                <span className="text-[11px] text-gray-400 font-mono">{p.code}</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${
                  p.gender === "Perempuan"
                    ? "bg-pink-50 text-pink-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {p.gender}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 bg-gray-50/70 rounded-lg p-2.5">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">NIK</span>
                <span className="font-mono text-gray-700 font-medium truncate block">{p.nik || "-"}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Paspor</span>
                <span className="font-mono text-gray-700 font-medium truncate block">{p.passportNumber || "-"}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Kontak</span>
                <a
                  href={`https://wa.me/${p.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 font-medium truncate block hover:underline"
                >
                  {p.phone}
                </a>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Agen</span>
                <span className="text-gray-700 truncate block">{p.agentName || "-"}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100/60">
              <Link
                href={`/pilgrims/${p.id}`}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-100 transition active:scale-95"
              >
                Lihat Detail
              </Link>
              <Link
                href={`/pilgrims/${p.id}/edit`}
                className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-medium hover:bg-teal-100 transition active:scale-95"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => confirmDelete(p)}
                className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-medium transition active:scale-95 flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 12-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table (hidden on mobile, shown on md+) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50/75 text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3.5">KODE / NAMA</th>
              <th className="px-6 py-3.5">GENDER</th>
              <th className="px-6 py-3.5">NIK</th>
              <th className="px-6 py-3.5">KONTAK</th>
              <th className="px-6 py-3.5">PASPOR</th>
              <th className="px-6 py-3.5">AGEN</th>
              <th className="px-6 py-3.5 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((p, idx) => (
              <tr
                key={p.id}
                className="hover:bg-gray-50/60 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-800 text-xs block">{p.name}</span>
                  <span className="text-[11px] text-gray-400 font-mono mt-0.5">{p.code}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                      p.gender === "Perempuan"
                        ? "bg-pink-50 text-pink-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {p.gender}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-gray-600">{p.nik}</td>
                <td className="px-6 py-4">
                  <a
                    href={`https://wa.me/${p.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:underline block font-medium"
                  >
                    {p.phone}
                  </a>
                  <span className="text-[11px] text-gray-400">{p.email}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-gray-700 font-medium block">{p.passportNumber}</span>
                  <span className="text-[11px] text-gray-400">Exp {p.passportExpiry.replace(/^10\s+/, "")}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{p.agentName || "-"}</td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-3 text-xs">
                    <Link
                      href={`/pilgrims/${p.id}`}
                      className="border border-gray-800 text-gray-900 px-2 py-0.5 rounded text-[11px] font-medium hover:bg-gray-100 transition"
                    >
                      Lihat
                    </Link>
                    <Link
                      href={`/pilgrims/${p.id}/edit`}
                      className="text-teal-600 hover:underline font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => confirmDelete(p)}
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
