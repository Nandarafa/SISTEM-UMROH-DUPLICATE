"use client";

import { useTransition } from "react";
import Link from "next/link";
import { AnnouncementItem } from "@/features/announcements/services/announcementService";
import { deleteAnnouncementAction } from "@/features/announcements/services/announcementActions";

interface Props {
  items: AnnouncementItem[];
}

export function AnnouncementTable({ items }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus pengumuman "${title}"?`)) {
      startTransition(async () => {
        await deleteAnnouncementAction(id);
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            <tr>
              <th className="px-6 py-4 font-semibold">JUDUL</th>
              <th className="px-6 py-4 font-semibold">AUDIENS</th>
              <th className="px-6 py-4 font-semibold">CABANG</th>
              <th className="px-6 py-4 font-semibold">STATUS</th>
              <th className="px-6 py-4 font-semibold">PUBLISH</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((ann) => {
              let audBadgeClass = "bg-blue-50 text-blue-700";
              if (ann.audienceBadgeColor === "emerald") {
                audBadgeClass = "bg-emerald-50 text-emerald-700";
              } else if (ann.audienceBadgeColor === "amber") {
                audBadgeClass = "bg-amber-50 text-amber-700";
              }

              return (
                <tr key={ann.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* JUDUL */}
                  <td className="px-6 py-4 font-medium text-gray-800 text-sm">
                    {ann.title}
                  </td>

                  {/* AUDIENS */}
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${audBadgeClass}`}>
                      {ann.audienceLabel}
                    </span>
                  </td>

                  {/* CABANG */}
                  <td className="px-6 py-4 text-gray-700">{ann.branchName}</td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700">
                      <span>Published</span>
                      <span className="text-[10px] text-emerald-500 font-normal">&bull; Live</span>
                    </span>
                  </td>

                  {/* PUBLISH */}
                  <td className="px-6 py-4 text-gray-700 font-mono text-[11px]">
                    {ann.publishedAt}
                  </td>

                  {/* AKSI */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-3">
                      <Link
                        href={`/announcements/${ann.id}/edit`}
                        className="px-2.5 py-1 bg-emerald-700 text-white rounded-md text-xs font-medium hover:bg-emerald-800 transition shadow-2xs"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(ann.id, ann.title)}
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
