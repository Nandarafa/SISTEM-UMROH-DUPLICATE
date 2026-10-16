"use client";

import { useTransition } from "react";
import Link from "next/link";
import { EquipmentItem } from "@/features/equipment/services/equipmentService";
import { deleteEquipmentAction } from "@/features/equipment/services/equipmentActions";

interface Props {
  items: EquipmentItem[];
}

export function EquipmentTable({ items }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, itemName: string, pilgrimName: string) => {
    if (confirm(`Yakin ingin menghapus perlengkapan ${itemName} untuk ${pilgrimName}?`)) {
      startTransition(async () => {
        await deleteEquipmentAction(id);
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            <tr>
              <th className="px-6 py-4 font-semibold">JAMAAH</th>
              <th className="px-6 py-4 font-semibold">ITEM</th>
              <th className="px-6 py-4 font-semibold">UKURAN</th>
              <th className="px-6 py-4 font-semibold">QTY</th>
              <th className="px-6 py-4 font-semibold">STATUS</th>
              <th className="px-6 py-4 font-semibold">DISERAHKAN</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((eq) => {
              let badgeBg = "bg-gray-100 text-gray-600";
              if (eq.statusColor === "green") {
                badgeBg = "bg-emerald-50 text-emerald-700";
              } else if (eq.statusColor === "amber") {
                badgeBg = "bg-amber-100 text-amber-800";
              }

              return (
                <tr key={eq.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* JAMAAH */}
                  <td className="px-6 py-4 font-medium text-gray-800">{eq.pilgrimName}</td>

                  {/* ITEM */}
                  <td className="px-6 py-4 text-gray-700">{eq.item}</td>

                  {/* UKURAN */}
                  <td className="px-6 py-4 text-gray-700">{eq.size}</td>

                  {/* QTY */}
                  <td className="px-6 py-4 text-gray-700">{eq.quantity}</td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${badgeBg}`}>
                      {eq.status}
                    </span>
                  </td>

                  {/* DISERAHKAN */}
                  <td className="px-6 py-4 text-gray-700">{eq.handedOverAt || "-"}</td>

                  {/* AKSI: Edit & Hapus */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-3">
                      <Link
                        href={`/equipment/${eq.id}/edit`}
                        className="text-[#0d9488] text-xs font-medium hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(eq.id, eq.item, eq.pilgrimName)}
                        disabled={isPending}
                        className="text-red-500 text-xs font-medium hover:underline inline-flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
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
    </div>
  );
}
