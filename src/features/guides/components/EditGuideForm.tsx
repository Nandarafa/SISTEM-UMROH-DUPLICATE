"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GuideItem } from "@/features/guides/services/guideService";
import { updateGuideAction } from "@/features/guides/services/guideActions";
import { useToast } from "@/components/ui/ToastProvider";

interface EditGuideFormProps {
  guide: GuideItem;
  branches: { id: string; name: string }[];
}

export function EditGuideForm({ guide, branches }: EditGuideFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const guideName = String(formData.get("name") || "");

    try {
      const res = await updateGuideAction(guide.id, formData);
      if (res.success) {
        showToast({
          type: "success",
          title: "Muthawif Berhasil Diubah!",
          description: `Perubahan data muthawif "${guideName}" telah berhasil disimpan.`,
        });
        router.push("/guides");
        router.refresh();
      } else {
        showToast({
          type: "error",
          title: "Gagal Mengubah Muthawif",
          description: res.error || "Terjadi kesalahan saat menyimpan perubahan.",
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
      {/* Data Muthawif / Pembimbing matching Screenshot 1 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Data Muthawif / Pembimbing</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Cabang</label>
            <select
              name="branch_id"
              defaultValue={branches[0]?.id || ""}
              className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
            >
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
              defaultValue={guide.name}
              placeholder=""
              className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                defaultValue={guide.gender}
                className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Telepon / WhatsApp</label>
              <input
                type="text"
                name="phone"
                defaultValue={guide.phone}
                placeholder=""
                className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={guide.email}
                placeholder=""
                className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Spesialisasi</label>
              <input
                type="text"
                name="specialization"
                defaultValue={guide.specialization}
                placeholder=""
                className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">Mis. Pembimbing Manasik, Penerjemah</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              value="1"
              defaultChecked={guide.is_active}
              className="rounded border-gray-300 text-[#0d9488] focus:ring-[#0d9488] h-4 w-4"
            />
            <label htmlFor="is_active" className="text-xs font-medium text-gray-700 cursor-pointer">
              Aktif
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bio</label>
            <textarea
              name="bio"
              rows={4}
              placeholder=""
              className="w-full rounded-lg border border-gray-300 text-xs px-3.5 py-2.5 focus:border-[#0d9488] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-[#0d9488] hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
        <Link
          href="/guides"
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
