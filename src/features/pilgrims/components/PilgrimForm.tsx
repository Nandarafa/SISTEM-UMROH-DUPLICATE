"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PilgrimFormProps {
  initialData?: {
    id?: string;
    branch_id?: string;
    agent_id?: string;
    name?: string;
    gender?: string;
    nik?: string;
    birth_place?: string;
    birth_date?: string;
    blood_type?: string;
    phone?: string;
    email?: string;
    city?: string;
    address?: string;
    passport_number?: string;
    passport_issued_place?: string;
    passport_issued_at?: string;
    passport_expired_at?: string;
    mahram_name?: string;
    mahram_relation?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    health_notes?: string;
    is_active?: boolean;
    user_id?: string | null;
    guide_id?: string;
  };
  isEdit?: boolean;
  branches: Array<{ id: string; name: string }>;
  agents: Array<{ id: string; name: string }>;
  guides?: Array<{ id: string; name: string }>;
  userRole?: string;
  onSaveAction: (data: FormData) => Promise<{ success: boolean; error?: string }>;
}

export function PilgrimForm({
  initialData = {},
  isEdit = false,
  branches = [],
  agents = [],
  guides = [],
  userRole = "agent",
  onSaveAction,
}: PilgrimFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await onSaveAction(formData);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/pilgrims");
          router.refresh();
        }, 1000);
      } else {
        setError(res.error || "Gagal menyimpan data jamaah.");
      }
    } catch {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg">
          ✓ Data jamaah berhasil disimpan ke Supabase!
        </div>
      )}

      {/* 1. Penempatan */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Penempatan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Cabang</label>
            <select
              name="branch_id"
              defaultValue={initialData.branch_id || branches[0]?.id || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 bg-white text-gray-700 focus:border-[#0d9488] focus:outline-none"
            >
              <option value="">Pilih Cabang</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {userRole !== "agent" && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Agen / Referral</label>
              <select
                name="agent_id"
                defaultValue={initialData.agent_id || ""}
                className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 bg-white text-gray-700 focus:border-[#0d9488] focus:outline-none"
              >
                <option value="">Tanpa Agen</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={userRole === "agent" ? "sm:col-span-1" : "sm:col-span-2"}>
            <label className="block text-xs font-medium text-gray-700 mb-1">Muthawif / Pembimbing (Guide)</label>
            <select
              name="guide_id"
              defaultValue={initialData.guide_id || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 bg-white text-gray-700 focus:border-[#0d9488] focus:outline-none"
            >
              <option value="">Tanpa Muthawif</option>
              {guides.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Data Pribadi */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Data Pribadi</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={initialData.name || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Jenis Kelamin <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              required
              defaultValue={initialData.gender || "male"}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 bg-white text-gray-700 focus:border-[#0d9488] focus:outline-none"
            >
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">NIK</label>
            <input
              type="text"
              name="nik"
              defaultValue={initialData.nik || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tempat Lahir</label>
            <input
              type="text"
              name="birth_place"
              placeholder="Jakarta"
              defaultValue={initialData.birth_place || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Lahir</label>
            <input
              type="date"
              name="birth_date"
              defaultValue={initialData.birth_date || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none text-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Golongan Darah</label>
            <input
              type="text"
              name="blood_type"
              placeholder="O"
              defaultValue={initialData.blood_type || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none"
            />
            <span className="text-[11px] text-gray-400 mt-0.5 block">A / B / AB / O</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Telepon / WhatsApp</label>
            <input
              type="text"
              name="phone"
              placeholder="0812xxxxxxxx"
              defaultValue={initialData.phone || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="jamaah@example.com"
              defaultValue={initialData.email || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Kota</label>
            <input
              type="text"
              name="city"
              placeholder="Jakarta"
              defaultValue={initialData.city || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Alamat</label>
            <textarea
              name="address"
              rows={3}
              placeholder="Jl. Contoh No. 4, Jakarta"
              defaultValue={initialData.address || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Paspor */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Paspor</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nomor Paspor</label>
            <input
              type="text"
              name="passport_number"
              placeholder="A1000000"
              defaultValue={initialData.passport_number || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tempat Penerbitan</label>
            <input
              type="text"
              name="passport_issued_place"
              placeholder="Jakarta"
              defaultValue={initialData.passport_issued_place || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Terbit</label>
            <input
              type="date"
              name="passport_issued_at"
              defaultValue={initialData.passport_issued_at || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none text-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Kadaluarsa</label>
            <input
              type="date"
              name="passport_expired_at"
              defaultValue={initialData.passport_expired_at || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* 4. Mahram & Kontak Darurat */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Mahram &amp; Kontak Darurat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nama Mahram</label>
            <input
              type="text"
              name="mahram_name"
              placeholder="Nama Mahram"
              defaultValue={initialData.mahram_name || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Hubungan Mahram</label>
            <input
              type="text"
              name="mahram_relation"
              placeholder="Mis. Suami, Ayah, Anak"
              defaultValue={initialData.mahram_relation || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none"
            />
            <span className="text-[11px] text-gray-400 mt-0.5 block">Mis. Suami, Ayah, Anak</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nama Kontak Darurat</label>
            <input
              type="text"
              name="emergency_contact_name"
              placeholder="Keluarga..."
              defaultValue={initialData.emergency_contact_name || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Telepon Kontak Darurat</label>
            <input
              type="text"
              name="emergency_contact_phone"
              placeholder="0813xxxxxxxx"
              defaultValue={initialData.emergency_contact_phone || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 5. Kesehatan */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Kesehatan</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Catatan Kesehatan</label>
            <textarea
              name="health_notes"
              rows={3}
              defaultValue={initialData.health_notes || ""}
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none"
            />
            <span className="text-[11px] text-gray-400 mt-0.5 block">
              Riwayat penyakit, alergi, kebutuhan khusus
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              value="1"
              defaultChecked={initialData.is_active ?? true}
              className="rounded border-gray-300 text-[#0d9488] focus:ring-[#0d9488] h-4 w-4"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700 cursor-pointer">
              Aktif
            </label>
          </div>
        </div>
      </div>

      {/* 6. Akun Login (Hanya saat Tambah Jamaah atau belum ada user account) */}
      {!isEdit && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Akun Login</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="create_account"
                name="create_account"
                value="1"
                checked={createAccount}
                onChange={(e) => setCreateAccount(e.target.checked)}
                className="rounded border-gray-300 text-[#0d9488] focus:ring-[#0d9488] h-4 w-4"
              />
              <label htmlFor="create_account" className="text-sm text-gray-700 cursor-pointer">
                Buatkan akun login
              </label>
            </div>

            {createAccount && (
              <div className="max-w-sm pt-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Akun</label>
                <input
                  type="email"
                  name="account_email"
                  placeholder="Kosongkan untuk memakai email jamaah di atas"
                  className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:border-[#0d9488] focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-lg bg-[#0d9488] text-white font-medium text-xs hover:bg-teal-700 transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading && (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4z"></path>
            </svg>
          )}
          <span>{isEdit ? "Simpan Perubahan" : "Simpan"}</span>
        </button>
        <Link
          href="/pilgrims"
          className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-medium transition"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
