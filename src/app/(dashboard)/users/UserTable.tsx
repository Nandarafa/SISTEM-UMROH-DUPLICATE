"use client";

import { useTransition } from "react";
import Link from "next/link";
import { UserAccountItem } from "@/features/users/services/userService";
import { deleteUserAction, resetPasswordAction } from "@/features/users/services/userActions";

import { Role } from "@/types/common.types";

interface Props {
  items: UserAccountItem[];
  currentUserRole?: Role;
}

export function UserTable({ items, currentUserRole }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus pengguna "${name}"?`)) {
      startTransition(async () => {
        await deleteUserAction(id);
      });
    }
  };

  const handleReset = (id: string, name: string) => {
    if (confirm(`Reset kata sandi pengguna "${name}" menjadi "password"?`)) {
      startTransition(async () => {
        await resetPasswordAction(id);
        alert("Kata sandi berhasil direset ke: password");
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            <tr>
              <th className="px-6 py-4 font-semibold">NAMA</th>
              <th className="px-6 py-4 font-semibold">EMAIL</th>
              <th className="px-6 py-4 font-semibold">ROLE</th>
              <th className="px-6 py-4 font-semibold">CABANG</th>
              <th className="px-6 py-4 font-semibold">STATUS</th>
              <th className="px-6 py-4 font-semibold">LOGIN TERAKHIR</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((u) => {
              let roleBadgeClass = "bg-blue-50 text-blue-700";
              if (u.roleBadgeColor === "emerald") {
                roleBadgeClass = "bg-emerald-50 text-emerald-700";
              } else if (u.roleBadgeColor === "amber") {
                roleBadgeClass = "bg-amber-100 text-amber-800";
              } else if (u.roleBadgeColor === "purple") {
                roleBadgeClass = "bg-purple-50 text-purple-700";
              }

              // User super_admin bisa menghapus admin cabang. Hanya super_admin itu sendiri / akun sendiri yang dilindungi dari penghapusan.
              const isSuperAdminUser = currentUserRole === "super_admin";
              const isProtectedAccount = isSuperAdminUser
                ? u.role === "super_admin" || u.email === "superadmin@example.com"
                : (u.role === "admin" && u.email === "admin@example.com") || u.role === "super_admin";

              return (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* NAMA */}
                  <td className="px-6 py-4 font-medium text-gray-800">{u.name}</td>

                  {/* EMAIL */}
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>

                  {/* ROLE */}
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${roleBadgeClass}`}>
                      {u.roleLabel}
                    </span>
                  </td>

                  {/* CABANG */}
                  <td className="px-6 py-4 text-gray-700">{u.branchName}</td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700">
                      {u.statusLabel}
                    </span>
                  </td>

                  {/* LOGIN TERAKHIR */}
                  <td className="px-6 py-4 text-gray-500 font-mono text-[11px]">
                    {u.lastLogin}
                  </td>

                  {/* AKSI */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-3">
                      <Link
                        href={`/users/${u.id}/edit`}
                        className="text-[#0d9488] text-xs font-medium hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleReset(u.id, u.name)}
                        disabled={isPending}
                        className="text-amber-600 text-xs font-medium hover:underline"
                      >
                        Reset Sandi
                      </button>

                      {!isProtectedAccount && (
                        <button
                          type="button"
                          onClick={() => handleDelete(u.id, u.name)}
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
                      )}
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
