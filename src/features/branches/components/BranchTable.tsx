"use client";

import { useTransition } from "react";
import Link from "next/link";
import { BranchItem } from "@/features/branches/services/branchService";
import { deleteBranchAction } from "@/features/branches/services/branchActions";

interface BranchTableProps {
  branches: BranchItem[];
}

export function BranchTable({ branches }: BranchTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus cabang "${name}"?`)) {
      startTransition(async () => {
        await deleteBranchAction(id);
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-700">
        <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <tr>
            <th className="px-6 py-3.5">KODE</th>
            <th className="px-6 py-3.5">NAMA</th>
            <th className="px-6 py-3.5">KOTA</th>
            <th className="px-6 py-3.5">TELEPON</th>
            <th className="px-6 py-3.5">STATUS</th>
            <th className="px-6 py-3.5 text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {branches.map((b) => (
            <tr key={b.id} className="hover:bg-gray-50/50 transition">
              <td className="px-6 py-4 font-medium text-gray-800">{b.code}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{b.name}</span>
                  {b.is_head_office && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      Pusat
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600">{b.city || "-"}</td>
              <td className="px-6 py-4 text-gray-600">{b.phone || "-"}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    b.is_active
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {b.is_active ? "Aktif" : "Nonaktif"}
                </span>
              </td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <div className="inline-flex items-center gap-3">
                  <Link
                    href={`/branches/${b.id}/edit`}
                    className="text-teal-600 font-medium hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id, b.name)}
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
