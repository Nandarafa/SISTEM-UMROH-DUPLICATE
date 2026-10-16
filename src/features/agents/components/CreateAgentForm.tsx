"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createAgentAction } from "@/features/agents/services/agentActions";
import { useToast } from "@/components/ui/ToastProvider";

interface CreateAgentFormProps {
  branches: { id: string; name: string }[];
}

export function CreateAgentForm({ branches }: CreateAgentFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const agentName = String(formData.get("name") || "");

    try {
      const res = await createAgentAction(formData);
      if (res.success) {
        showToast({
          type: "success",
          title: "Agen Berhasil Ditambahkan!",
          description: `Data agen "${agentName}" telah berhasil disimpan ke database.`,
        });
        router.push("/agents");
        router.refresh();
      } else {
        showToast({
          type: "error",
          title: "Gagal Menambahkan Agen",
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Data Agen matching Screenshot 3 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Data Agen</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Cabang</label>
            <select
              name="branch_id"
              defaultValue={branches[0]?.id || ""}
              className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
            >
              <option value="">Pilih Cabang</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nama <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder=""
              className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Telepon / WhatsApp</label>
              <input
                type="text"
                name="phone"
                placeholder=""
                className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                placeholder=""
                className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Komisi (%)</label>
              <input
                type="number"
                step="0.01"
                name="commission_rate"
                defaultValue="0.00"
                className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Alamat</label>
            <textarea
              name="address"
              rows={4}
              placeholder=""
              className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Akun Login matching Screenshot 3 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Akun Login</h3>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="create_account"
            name="create_account"
            value="1"
            className="rounded border-gray-300 text-[#0d9488] focus:ring-[#0d9488] h-4 w-4"
          />
          <label htmlFor="create_account" className="text-xs font-medium text-gray-700 cursor-pointer">
            Buatkan akun login
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-[#0d9488] hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
        <Link
          href="/agents"
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
