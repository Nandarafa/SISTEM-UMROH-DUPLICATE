"use client";

import { useState } from "react";
import Link from "next/link";
import { PackageItem } from "@/features/packages/services/packageService";
import { deletePackageAction } from "@/features/packages/services/packageActions";
import { currency } from "@/lib/utils";

interface PackageTableProps {
  packages: PackageItem[];
}

export function PackageTable({ packages }: PackageTableProps) {
  const [items, setItems] = useState<PackageItem[]>(packages);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [loading, setLoading] = useState(false);

  const confirmDelete = (pkg: PackageItem) => {
    setSelectedPackage(pkg);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPackage) return;
    setLoading(true);
    try {
      await deletePackageAction(selectedPackage.id);
      setItems((prev) => prev.filter((p) => p.id !== selectedPackage.id));
      setDeleteModalOpen(false);
      setSelectedPackage(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mobile Card List (shown on screens < md) */}
      <div className="md:hidden divide-y divide-gray-100">
        {items.map((pkg, idx) => {
          const remaining = Math.max(0, pkg.quota - pkg.registeredCount);
          const kuotaText = `${remaining}/${pkg.quota}`;
          const badgeLabel = pkg.type === "haji_plus" ? "Haji Plus" : pkg.type === "haji" ? "Haji" : "Umroh";

          return (
            <div
              key={pkg.id}
              className="p-4 space-y-3 hover:bg-gray-50/80 transition-colors animate-fade-in-up"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-semibold text-gray-900 text-sm block">{pkg.name}</span>
                  <span className="text-[11px] text-gray-400 font-mono">{pkg.code}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      badgeLabel === "Umroh"
                        ? "bg-emerald-50 text-emerald-700"
                        : badgeLabel === "Haji"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-purple-50 text-purple-700"
                    }`}
                  >
                    {badgeLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700">
                    Dibuka
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50/70 rounded-lg p-2.5">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Harga</span>
                  <span className="font-bold text-gray-800 text-xs block">{currency(pkg.price)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Sisa Kuota</span>
                  <span className="font-medium text-gray-700 block">{kuotaText}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Keberangkatan</span>
                  <span className="font-medium text-gray-700 block">
                    {new Date(pkg.departure_date).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100/60">
                <Link
                  href={`/packages/${pkg.id}`}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-100 transition active:scale-95"
                >
                  Detail
                </Link>
                <Link
                  href={`/packages/${pkg.id}/edit`}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-medium hover:bg-teal-100 transition active:scale-95"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => confirmDelete(pkg)}
                  className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-medium transition active:scale-95 flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table (hidden on mobile, shown on md+) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50/75 text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3.5">KODE / NAMA</th>
              <th className="px-6 py-3.5">JENIS</th>
              <th className="px-6 py-3.5">HARGA</th>
              <th className="px-6 py-3.5">KUOTA</th>
              <th className="px-6 py-3.5">BERANGKAT</th>
              <th className="px-6 py-3.5">STATUS</th>
              <th className="px-6 py-3.5 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((pkg, idx) => {
              const remaining = Math.max(0, pkg.quota - pkg.registeredCount);
              const kuotaText = `${remaining}/${pkg.quota}`;
              const badgeLabel = pkg.type === "haji_plus" ? "Haji Plus" : pkg.type === "haji" ? "Haji" : "Umroh";

              return (
                <tr
                  key={pkg.id}
                  className="hover:bg-gray-50/60 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-800 text-xs block">{pkg.name}</span>
                    <span className="text-[11px] text-gray-400">{pkg.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    {badgeLabel === "Umroh" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700">
                        Umroh
                      </span>
                    )}
                    {badgeLabel === "Haji" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">
                        Haji
                      </span>
                    )}
                    {badgeLabel === "Haji Plus" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700">
                        Haji Plus
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{currency(pkg.price)}</td>
                  <td className="px-6 py-4 text-gray-700">{kuotaText}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(pkg.departure_date).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700">
                      Dibuka
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3 text-xs">
                      <Link
                        href={`/packages/${pkg.id}`}
                        className="text-teal-600 hover:underline font-medium"
                      >
                        Detail
                      </Link>
                      <Link
                        href={`/packages/${pkg.id}/edit`}
                        className="text-teal-600 hover:underline font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => confirmDelete(pkg)}
                        className="text-red-500 hover:underline font-medium flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                        <span>Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal matching screenshot 4 100% */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 text-center shadow-2xl relative">
            {/* Warning Circle Icon */}
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
