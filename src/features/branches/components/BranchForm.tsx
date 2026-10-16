"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { BranchItem } from "@/features/branches/services/branchService";
import { createBranchAction, updateBranchAction } from "@/features/branches/services/branchActions";

interface BranchFormProps {
  branch?: BranchItem;
}

export function BranchForm({ branch }: BranchFormProps) {
  const isEdit = !!branch;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);

    startTransition(async () => {
      const res = isEdit
        ? await updateBranchAction(branch.id, formData)
        : await createBranchAction(formData);

      if (res && (res as any).error) {
        setError((res as any).error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Kode <span className="text-red-500">*</span>
            </label>
            <input
              name="code"
              defaultValue={branch?.code || ""}
              required
              placeholder="Contoh: BDG"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Nama Cabang <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              defaultValue={branch?.name || ""}
              required
              placeholder="Contoh: Cabang Bandung"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Telepon</label>
            <input
              name="phone"
              defaultValue={branch?.phone || ""}
              placeholder="Contoh: 022-1234567"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={branch?.email || ""}
              placeholder="cabang@example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Kota</label>
            <input
              name="city"
              defaultValue={branch?.city || ""}
              placeholder="Contoh: Bandung"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-gray-700 mb-1">Alamat</label>
            <textarea
              name="address"
              rows={3}
              defaultValue={branch?.address || ""}
              placeholder="Alamat lengkap cabang..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              value="1"
              defaultChecked={branch ? branch.is_active : true}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700 cursor-pointer">
              Aktif
            </label>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_head_office"
              name="is_head_office"
              value="1"
              defaultChecked={branch ? branch.is_head_office : false}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
            />
            <label htmlFor="is_head_office" className="text-sm text-gray-700 cursor-pointer">
              Kantor Pusat
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 rounded-xl bg-[#0d9488] text-white text-xs font-semibold hover:bg-teal-700 shadow-sm transition disabled:opacity-50"
        >
          {isPending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan"}
        </button>
        <Link
          href="/branches"
          className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-xs font-medium hover:bg-gray-50 transition"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
