"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserAction } from "@/features/users/services/userActions";

export function UserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createUserAction(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/users");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Card Data Pengguna matching Screenshot 4 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-800">Data Pengguna</h2>

        {/* Nama * & Email * */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nama <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>
        </div>

        {/* Role * & Cabang */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              required
              className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            >
              <option value="">&mdash; Pilih &mdash;</option>
              <option value="admin">Admin Cabang</option>
              <option value="agent">Agen / Marketing</option>
              <option value="pilgrim">Jamaah</option>
              <option value="guide">Muthawif</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Cabang
            </label>
            <select
              name="branch_id"
              className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            >
              <option value="">Tanpa Cabang</option>
              <option value="f68b6fde-225a-49de-86ba-60f8e161acdc">Kantor Pusat Jakarta</option>
              <option value="f9ea810a-9d1e-4519-bd48-885a4fe5440e">Cabang Surabaya</option>
            </select>
          </div>
        </div>

        {/* Telepon / WhatsApp & Aktif */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Telepon / WhatsApp
            </label>
            <input
              type="text"
              name="phone"
              className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>

          <div className="pt-5 flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              defaultChecked
              className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
            />
            <label htmlFor="is_active" className="text-xs font-medium text-gray-700 cursor-pointer">
              Aktif
            </label>
          </div>
        </div>

        {/* Kata Sandi * */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Kata Sandi <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            minLength={8}
            required
            className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          />
          <p className="text-[11px] text-gray-400 mt-1.5">Minimal 8 karakter</p>
        </div>
      </div>

      {/* Buttons matching Screenshot 4 */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#0f766e] text-white text-sm font-medium rounded-xl hover:bg-[#0d6d66] transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
        <Link
          href="/users"
          className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
