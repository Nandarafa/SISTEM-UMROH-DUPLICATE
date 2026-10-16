"use client";

import { useState, useTransition } from "react";
import { WhiteLabelSettings } from "@/features/settings/services/settingsService";
import { updateSettingsAction } from "@/features/settings/services/settingsActions";

interface WhiteLabelFormProps {
  initialSettings: WhiteLabelSettings;
}

export function WhiteLabelForm({ initialSettings }: WhiteLabelFormProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live preview state
  const [appName, setAppName] = useState(initialSettings.app_name);
  const [appSubtitle, setAppSubtitle] = useState(initialSettings.app_subtitle);
  const [primaryColor, setPrimaryColor] = useState(initialSettings.primary_color || "#0d9488");
  const [secondaryColor, setSecondaryColor] = useState(initialSettings.secondary_color || "#0f766e");

  const getInitials = (text: string) => {
    if (!text) return "TU";
    const parts = text.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return text.slice(0, 2).toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const res = await updateSettingsAction(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Kolom Kiri: Identitas + Warna & Logo (lg:col-span-2) */}
      <div className="lg:col-span-2 space-y-6">
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Pengaturan white-label berhasil disimpan dan diperbarui.</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs">
            {error}
          </div>
        )}

        {/* Card Identitas */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Identitas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Nama Aplikasi <span className="text-red-500">*</span>
              </label>
              <input
                name="app_name"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Subjudul</label>
              <input
                name="app_subtitle"
                value={appSubtitle}
                onChange={(e) => setAppSubtitle(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Telepon</label>
              <input
                name="company_phone"
                defaultValue={initialSettings.company_phone}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="company_email"
                defaultValue={initialSettings.company_email}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-gray-700 mb-1">Alamat</label>
              <textarea
                name="company_address"
                rows={3}
                defaultValue={initialSettings.company_address}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-gray-700 mb-1">Teks Footer</label>
              <input
                name="footer_text"
                defaultValue={initialSettings.footer_text}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>
          </div>
        </div>

        {/* Card Warna & Logo */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Warna &amp; Logo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Warna Utama (hex) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="primary_color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-9 w-12 rounded cursor-pointer border border-gray-200 p-0.5"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Warna Sekunder (hex) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="secondary_color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-9 w-12 rounded cursor-pointer border border-gray-200 p-0.5"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Logo (PNG/JPG, maks 2MB)
              </label>
              <input
                type="file"
                name="logo"
                accept="image/*"
                className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
              />
              <p className="text-[11px] text-gray-400 mt-1">Kosongkan jika tidak ingin mengubah.</p>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Favicon</label>
              <input
                type="file"
                name="favicon"
                accept="image/*"
                className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
              />
              <p className="text-[11px] text-gray-400 mt-1">Kosongkan jika tidak ingin mengubah.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Pratinjau Card matching Screenshot 1 */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Pratinjau</h3>
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-lg grid place-items-center text-white font-bold text-base shadow-sm shrink-0 transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              {getInitials(appName)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">
                {appName || "Travel Umroh & Haji"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {appSubtitle || "Sistem Manajemen Umroh & Haji"}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-6 w-full px-4 py-2.5 rounded-xl text-white font-medium text-xs hover:opacity-90 shadow-sm transition disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
            {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </div>
    </form>
  );
}
