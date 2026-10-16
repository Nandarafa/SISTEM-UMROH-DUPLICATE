import React from "react";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { currency, formatDate } from "@/lib/utils";
import { PilgrimDashboardData } from "@/features/dashboard/services/pilgrimDashboardService";

interface PilgrimDashboardViewProps {
  data: PilgrimDashboardData;
  userName?: string;
}

export function PilgrimDashboardView({ data, userName = "Ahmad Fauzi" }: PilgrimDashboardViewProps) {
  if (!data.hasProfile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Dashboard Jamaah</h1>
          <p className="text-xs text-gray-400 mt-0.5">Selamat datang, {userName}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="h-12 w-12 rounded-xl bg-gray-50 grid place-items-center text-gray-400 mx-auto mb-3">
            <Icon name="user" className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">Profil jamaah belum tertaut</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Akun Anda belum terhubung ke data jamaah. Hubungi admin travel Anda.
          </p>
        </div>
      </div>
    );
  }

  const reg = data.registration;
  const pkg = data.package;
  const pay = data.payment;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">Dashboard Jamaah</h1>
        <p className="text-xs text-gray-400 mt-0.5">Selamat datang, {userName}</p>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          label="Status Pendaftaran"
          value={reg?.statusLabel || "Belum Mendaftar"}
          icon="list"
          color="blue"
        />
        <StatsCard
          label="Progress Pembayaran"
          value={`${pay.percent}%`}
          icon="cash"
          color="green"
          sub={`${currency(pay.paid)} / ${currency(pay.total)}`}
        />
        <StatsCard
          label="Dokumen Terverifikasi"
          value={`${data.documents.verified} / ${data.documents.total}`}
          icon="doc"
          color="teal"
        />
        <StatsCard
          label="Hitung Mundur"
          value={data.countdown !== null ? `${data.countdown} hari` : "—"}
          icon="calendar"
          color="purple"
          sub={pkg?.departure_date ? formatDate(pkg.departure_date) : "Belum dijadwalkan"}
        />
      </div>

      {/* Row 1: Progress Pembayaran (2 cols) & Checklist Dokumen (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Pembayaran */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 card-hover">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Progress Pembayaran</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Terbayar</span>
              <span className="font-semibold text-gray-800">{currency(pay.paid)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-teal-600 to-emerald-500 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.min(100, pay.percent)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Sisa Tagihan</span>
              <span className="font-semibold text-red-600">{currency(pay.outstanding)}</span>
            </div>
          </div>

          {pkg && (
            <div className="mt-5 pt-4 border-t border-gray-100 text-sm">
              <p className="font-semibold text-gray-800">{pkg.name}</p>
              <p className="text-gray-400 text-xs mt-0.5">
                {pkg.typeLabel} &bull; {pkg.duration_days} hari &bull; Berangkat {formatDate(pkg.departure_date)}
              </p>
            </div>
          )}
        </div>

        {/* Checklist Dokumen */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 card-hover">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Checklist Dokumen</h3>
          {data.documents.items.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {data.documents.items.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-gray-700">{doc.label}</span>
                  <Badge color={doc.statusColor}>{doc.statusLabel}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="h-10 w-10 rounded-lg bg-gray-50 grid place-items-center text-gray-400 mx-auto mb-2">
                <Icon name="doc" className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-gray-700">Belum ada dokumen</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Daftar dokumen muncul setelah pendaftaran.</p>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Jadwal Manasik (2 cols) & Pengumuman Terbaru (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jadwal Manasik */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between min-h-[220px]">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm mb-4">Jadwal Manasik</h3>
            {data.manasik.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {data.manasik.map((m) => {
                  const mDate = new Date(m.date);
                  const day = isNaN(mDate.getDate()) ? "" : mDate.getDate().toString();
                  const month = isNaN(mDate.getDate()) ? "" : mDate.toLocaleDateString("id-ID", { month: "short" });
                  return (
                    <div key={m.id} className="flex items-center gap-3 py-2.5">
                      <div className="h-10 w-10 rounded-lg bg-teal-50 text-[#0d9488] grid place-items-center text-xs font-semibold text-center leading-none">
                        <span>
                          {day}
                          <br />
                          {month}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{m.title}</p>
                        <p className="text-xs text-gray-400">{m.location}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-xl bg-gray-50 grid place-items-center text-gray-300 mb-3">
                  <Icon name="calendar" className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Belum ada jadwal manasik</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Jadwal manasik akan tampil di sini.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pengumuman Terbaru */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Pengumuman Terbaru</h3>
          {data.announcements.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {data.announcements.map((a) => (
                <div key={a.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <Badge color={a.audienceColor}>{a.audienceLabel}</Badge>
                    <span className="text-xs text-gray-400">{a.date}</span>
                  </div>
                  <p className="font-medium text-gray-800 mt-1 text-sm">{a.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
                    {a.body}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="h-10 w-10 rounded-lg bg-gray-50 grid place-items-center text-gray-400 mx-auto mb-2">
                <Icon name="megaphone" className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-gray-700">Belum ada pengumuman</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Pengumuman dari travel akan muncul di sini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
