"use client";

import { useTransition } from "react";
import Link from "next/link";
import { ManasikItem } from "@/features/dashboard/services/manasikService";
import { deleteManasikAction } from "@/features/dashboard/services/manasikActions";

interface ManasikTableProps {
  schedules: ManasikItem[];
  isPilgrim: boolean;
  canManage: boolean;
}

export function ManasikTable({ schedules, isPilgrim, canManage }: ManasikTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus jadwal manasik "${title}"?`)) {
      startTransition(async () => {
        await deleteManasikAction(id);
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50/75 text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
          <tr>
            <th className="px-6 py-3.5">Tanggal</th>
            <th className="px-6 py-3.5">Judul</th>
            <th className="px-6 py-3.5">Paket</th>
            <th className="px-6 py-3.5">Pembimbing</th>
            <th className="px-6 py-3.5">Kehadiran</th>
            <th className="px-6 py-3.5 text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {schedules.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50/60 transition">
              <td className="px-6 py-4 text-gray-700">{s.date}</td>
              <td className="px-6 py-4 font-semibold text-gray-800 text-sm">{s.title}</td>
              <td className="px-6 py-4 text-gray-600">{s.packageName}</td>
              <td className="px-6 py-4 text-gray-600">{s.guideName}</td>
              <td className="px-6 py-4 font-medium text-gray-700">
                {s.presentCount} / {s.totalCount}
              </td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <div className="inline-flex items-center gap-3">
                  <Link
                    href={`/manasik/${s.id}`}
                    className="text-teal-600 font-medium hover:underline"
                  >
                    {isPilgrim ? "Detail" : "Absensi"}
                  </Link>
                  {canManage && (
                    <>
                      <Link
                        href={`/manasik/${s.id}/edit`}
                        className="text-teal-600 font-medium hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id, s.title)}
                        disabled={isPending}
                        className="text-red-500 font-medium hover:underline inline-flex items-center gap-1 disabled:opacity-50"
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
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
