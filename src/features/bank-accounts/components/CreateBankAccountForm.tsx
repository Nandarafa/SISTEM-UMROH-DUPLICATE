"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BranchOption } from "@/features/bank-accounts/services/bankAccountService";
import { createBankAccountAction } from "@/features/bank-accounts/services/bankAccountActions";
import { useToast } from "@/components/ui/ToastProvider";

interface CreateBankAccountFormProps {
  branches: BranchOption[];
}

export function CreateBankAccountForm({ branches }: CreateBankAccountFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const bankName = String(formData.get("bank_name") || "");
    const accNum = String(formData.get("account_number") || "");

    try {
      const res = await createBankAccountAction(formData);
      if (res.success) {
        showToast({
          type: "success",
          title: "Rekening Berhasil Ditambahkan!",
          description: `Rekening "${bankName} - ${accNum}" telah berhasil disimpan ke database.`,
        });
        router.push("/bank-accounts");
        router.refresh();
      } else {
        showToast({
          type: "error",
          title: "Gagal Menambahkan Rekening",
          description: res.error || "Terjadi kesalahan saat menyimpan data.",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Kesalahan Sistem",
        description: err?.message || "Gagal menghubungi server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cabang */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Cabang
          </label>
          <select
            name="branch_id"
            defaultValue=""
            className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 bg-white text-gray-700 focus:border-[#0d9488] focus:outline-none"
          >
            <option value="">Semua Cabang</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Grid: Nama Bank & No. Rekening */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nama Bank <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bank_name"
              required
              placeholder=""
              className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              No. Rekening <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="account_number"
              required
              placeholder=""
              className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
            />
          </div>
        </div>

        {/* Grid: Atas Nama & Kantor Cabang Bank */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Atas Nama <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="account_holder"
              required
              placeholder=""
              className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Kantor Cabang Bank
            </label>
            <input
              type="text"
              name="branch_office"
              placeholder=""
              className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
            />
          </div>
        </div>

        {/* Checkbox Aktif */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            value="1"
            defaultChecked={true}
            className="rounded border-gray-300 text-[#0d9488] focus:ring-[#0d9488] h-4 w-4"
          />
          <label htmlFor="is_active" className="text-xs font-medium text-gray-700 cursor-pointer">
            Aktif
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-[#0d9488] hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
          <Link
            href="/bank-accounts"
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
