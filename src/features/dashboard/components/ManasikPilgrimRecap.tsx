import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ManasikDetailData } from "@/features/dashboard/services/manasikAttendanceService";

interface ManasikPilgrimRecapProps {
  data: ManasikDetailData;
}

export function ManasikPilgrimRecap({ data }: ManasikPilgrimRecapProps) {
  // Compute rekap stats
  const hadirCount = data.pilgrims.filter((p) => p.status === "present").length;
  const izinCount = data.pilgrims.filter((p) => p.status === "excused").length;
  const tidakHadirCount = data.pilgrims.filter((p) => p.status === "absent").length;

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
            <dd className="text-gray-800 font-medium">{data.packageName}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-gray-400">Pembimbing</dt>
            <dd className="text-gray-800 font-medium">{data.guideName}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-gray-400">Waktu</dt>
            <dd className="text-gray-800 font-medium">
              {data.startTime} &ndash; {data.endTime}
            </dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-gray-400">Lokasi</dt>
            <dd className="text-gray-800 font-medium">{data.location}</dd>
          </div>
        </dl>
      </div>

      {/* Absensi Jamaah (Read-only Recap matching screenshot 3) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 pb-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 text-sm">Absensi Jamaah</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/75 text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">JAMAAH</th>
                <th className="px-6 py-3.5">KEHADIRAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {data.pilgrims.map((pilgrim) => {
                let badgeColor: "green" | "amber" | "red" = "red";
                let badgeLabel = "Tidak Hadir";
                if (pilgrim.status === "present") {
                  badgeColor = "green";
                  badgeLabel = "Hadir";
                } else if (pilgrim.status === "excused") {
                  badgeColor = "amber";
                  badgeLabel = "Izin";
                }

                return (
                  <tr key={pilgrim.pilgrimId} className="hover:bg-gray-50/60 transition">
                    <td className="px-6 py-4 font-medium text-gray-800 text-sm">
                      {pilgrim.name}
                    </td>
                    <td className="px-6 py-4">
                      <Badge color={badgeColor}>{badgeLabel}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-100">
          <Link
            href="/manasik"
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-medium transition inline-block"
          >
            Kembali
          </Link>
        </div>
      </div>
    </div>
  );
}
