"use client";

import { useState } from "react";
import Link from "next/link";
import { ManasikDetailData, AttendanceRecord } from "@/features/dashboard/services/manasikAttendanceService";

interface AttendanceFormProps {
  initialData: ManasikDetailData;
  onSaveAction: (attendances: Record<string, string>) => Promise<void>;
}

export function AttendanceForm({ initialData, onSaveAction }: AttendanceFormProps) {
  const [pilgrims, setPilgrims] = useState<AttendanceRecord[]>(initialData.pilgrims || []);
  const [attendances, setAttendances] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    (initialData.pilgrims || []).forEach((p) => {
      init[p.pilgrimId] = p.status;
    });
    return init;
  });

  const [selectedPilgrimToAdd, setSelectedPilgrimToAdd] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Available pilgrims that are not yet in the attendance list
  const currentPilgrimIds = new Set(pilgrims.map((p) => p.pilgrimId));
  const availableToAdd = (initialData.allAvailablePilgrims || []).filter(
    (ap) => !currentPilgrimIds.has(ap.id)
  );

  const handleAddPilgrim = () => {
    if (!selectedPilgrimToAdd) return;
    const target = initialData.allAvailablePilgrims.find((ap) => ap.id === selectedPilgrimToAdd);
    if (!target) return;

    const newRecord: AttendanceRecord = {
      pilgrimId: target.id,
      name: target.name,
      code: target.code,
      status: "present",
    };

    setPilgrims([...pilgrims, newRecord]);
    setAttendances({ ...attendances, [target.id]: "present" });
    setSelectedPilgrimToAdd("");
  };

  const handleLoadAllActive = () => {
    const newRecords: AttendanceRecord[] = (initialData.allAvailablePilgrims || []).map((ap) => ({
      pilgrimId: ap.id,
      name: ap.name,
      code: ap.code,
      status: attendances[ap.id] ? (attendances[ap.id] as any) : "absent",
    }));

    const newAttendances = { ...attendances };
    newRecords.forEach((r) => {
      if (!newAttendances[r.pilgrimId]) {
        newAttendances[r.pilgrimId] = "absent";
      }
    });

    setPilgrims(newRecords);
    setAttendances(newAttendances);
  };

  const handleRemovePilgrim = (pilgrimId: string) => {
    setPilgrims(pilgrims.filter((p) => p.pilgrimId !== pilgrimId));
    const next = { ...attendances };
    delete next[pilgrimId];
    setAttendances(next);
  };

  // Recalculate stats dynamically
  const hadirCount = pilgrims.filter((p) => (attendances[p.pilgrimId] ?? p.status) === "present").length;
  const izinCount = pilgrims.filter((p) => (attendances[p.pilgrimId] ?? p.status) === "excused").length;
  const tidakHadirCount = pilgrims.filter((p) => (attendances[p.pilgrimId] ?? p.status) === "absent").length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await onSaveAction(attendances);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 3 Stats Cards: Hadir, Izin, Tidak Hadir */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Hadir */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg grid place-items-center shrink-0 bg-green-50 text-green-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 truncate">Hadir</p>
            <p className="text-xl font-bold text-gray-800 truncate">{hadirCount}</p>
          </div>
        </div>

        {/* Izin */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg grid place-items-center shrink-0 bg-amber-50 text-amber-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 truncate">Izin</p>
            <p className="text-xl font-bold text-gray-800 truncate">{izinCount}</p>
          </div>
        </div>

        {/* Tidak Hadir */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg grid place-items-center shrink-0 bg-red-50 text-red-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a3 3 0 10-2-5.2" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 truncate">Tidak Hadir</p>
            <p className="text-xl font-bold text-gray-800 truncate">{tidakHadirCount}</p>
          </div>
        </div>
      </div>

      {/* Informasi Jadwal Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Informasi Jadwal</h3>
        <dl className="divide-y divide-gray-100 text-xs">
          <div className="flex justify-between py-2.5">
            <dt className="text-gray-400">Paket</dt>
            <dd className="text-gray-800 font-medium">{initialData.packageName}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-gray-400">Pembimbing</dt>
            <dd className="text-gray-800 font-medium">{initialData.guideName}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-gray-400">Waktu</dt>
            <dd className="text-gray-800 font-medium">
              {initialData.startTime} &ndash; {initialData.endTime}
            </dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-gray-400">Lokasi</dt>
            <dd className="text-gray-800 font-medium">{initialData.location}</dd>
          </div>
        </dl>
      </div>

      {/* Absensi Jamaah Card & Form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Absensi Jamaah</h3>
            <p className="text-xs text-gray-400 mt-0.5">Total: {pilgrims.length} jamaah terdaftar</p>
          </div>
          {success && (
            <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              ✓ Absensi berhasil disimpan ke Supabase!
            </span>
          )}
        </div>

        {/* Toolbar: Tambah Jamaah Manual */}
        <div className="p-4 bg-gray-50/70 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px]">
            <select
              value={selectedPilgrimToAdd}
              onChange={(e) => setSelectedPilgrimToAdd(e.target.value)}
              className="w-full rounded-lg border border-gray-300 text-xs px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
            >
              <option value="">&mdash; Pilih Jamaah untuk Ditambahkan &mdash;</option>
              {availableToAdd.map((ap) => (
                <option key={ap.id} value={ap.id}>
                  {ap.name} ({ap.code})
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleAddPilgrim}
            disabled={!selectedPilgrimToAdd}
            className="px-4 py-2 bg-[#0d9488] text-white rounded-lg text-xs font-semibold hover:bg-teal-700 transition disabled:opacity-50 cursor-pointer shadow-sm"
          >
            + Tambah ke Absensi
          </button>
          {availableToAdd.length > 0 && pilgrims.length === 0 && (
            <button
              type="button"
              onClick={handleLoadAllActive}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition cursor-pointer"
            >
              Muat Semua Jamaah Aktif
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {pilgrims.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50/75 text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3.5">Jamaah</th>
                    <th className="px-6 py-3.5">Kehadiran</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {pilgrims.map((pilgrim) => (
                    <tr key={pilgrim.pilgrimId} className="hover:bg-gray-50/60 transition">
                      <td className="px-6 py-4 font-semibold text-gray-800 text-sm">
                        <div>
                          <span>{pilgrim.name}</span>
                          {pilgrim.code && (
                            <span className="text-xs text-gray-400 font-normal ml-2">
                              ({pilgrim.code})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={attendances[pilgrim.pilgrimId] ?? "absent"}
                          onChange={(e) =>
                            setAttendances({
                              ...attendances,
                              [pilgrim.pilgrimId]: e.target.value,
                            })
                          }
                          className="rounded-lg border border-gray-300 text-xs px-3 py-1.5 focus:border-[#0d9488] focus:outline-none bg-white text-gray-700"
                        >
                          <option value="present">Hadir</option>
                          <option value="excused">Izin</option>
                          <option value="absent">Tidak Hadir</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemovePilgrim(pilgrim.pilgrimId)}
                          className="text-gray-400 hover:text-red-600 text-xs font-medium transition"
                          title="Keluarkan dari daftar absensi"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 px-6 text-center">
              <div className="h-12 w-12 rounded-xl bg-gray-50 grid place-items-center text-gray-400 mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-gray-800">Belum ada jamaah di daftar absensi</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto mb-4">
                Pilih jamaah dari menu di atas lalu klik &ldquo;+ Tambah ke Absensi&rdquo;, atau klik tombol di bawah untuk memuat semua jamaah aktif.
              </p>
              <button
                type="button"
                onClick={handleLoadAllActive}
                className="px-4 py-2 bg-[#0d9488] text-white rounded-lg text-xs font-semibold hover:bg-teal-700 transition"
              >
                Muat Semua Jamaah Aktif
              </button>
            </div>
          )}

          <div className="p-6 border-t border-gray-100 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading || pilgrims.length === 0}
              className="px-5 py-2.5 rounded-lg bg-[#0d9488] text-white font-medium text-xs hover:bg-teal-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4z"></path>
                </svg>
              )}
              <span>{loading ? "Menyimpan…" : "Simpan Absensi"}</span>
            </button>
            <Link
              href="/manasik"
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-medium transition"
            >
              Kembali
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
