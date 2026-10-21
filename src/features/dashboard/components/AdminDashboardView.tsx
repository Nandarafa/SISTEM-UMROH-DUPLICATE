import React from "react";
import { AdminDashboardData } from "../services/adminDashboardService";
import { currency } from "@/lib/utils";
import { MonthlyRegistrationChart } from "./MonthlyRegistrationChart";
import { AdminPaymentStatusChart } from "./AdminPaymentStatusChart";
import { PackagePilgrimChart } from "./PackagePilgrimChart";

interface AdminDashboardViewProps {
  data: AdminDashboardData;
}

export function AdminDashboardView({ data }: AdminDashboardViewProps) {
  const {
    branchName,
    stats,
    monthly,
    paymentStatus,
    packagePilgrims,
    upcomingDepartures,
    announcements,
  } = data;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">Dashboard Operasional</h1>
        <p className="text-xs text-gray-400 mt-0.5">{branchName}</p>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Jamaah */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between card-hover cursor-default group">
          <div>
            <p className="text-xs text-gray-400">Total Jamaah</p>
            <p className="text-2xl font-bold text-gray-800 mt-1 group-hover:text-teal-700 transition-colors">{stats.totalPilgrims}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform duration-200 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a3 3 0 10-2-5.2" />
            </svg>
          </div>
        </div>

        {/* Pendaftaran Aktif */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between card-hover cursor-default group">
          <div>
            <p className="text-xs text-gray-400">Pendaftaran Aktif</p>
            <p className="text-2xl font-bold text-gray-800 mt-1 group-hover:text-blue-700 transition-colors">{stats.activeRegistrations}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-200 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
        </div>

        {/* Omset Diterima */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between card-hover cursor-default group">
          <div>
            <p className="text-xs text-gray-400">Omset Diterima</p>
            <p className="text-xl font-bold text-gray-800 mt-1 group-hover:text-emerald-700 transition-colors">{currency(stats.omsetReceived)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-200 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        {/* Outstanding */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between card-hover cursor-default group">
          <div>
            <p className="text-xs text-gray-400">Outstanding</p>
            <p className="text-xl font-bold text-gray-800 mt-1 group-hover:text-amber-700 transition-colors">{currency(stats.outstanding)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform duration-200 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
      </div>

      {/* Row 1 Charts: Pendaftaran 12 Bulan Terakhir (Line chart) & Status Pembayaran (Doughnut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 card-hover">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Pendaftaran 12 Bulan Terakhir</h3>
          <MonthlyRegistrationChart labels={monthly.labels} data={monthly.data} />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 card-hover">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Status Pembayaran</h3>
          <AdminPaymentStatusChart
            sukses={paymentStatus.sukses}
            sebagian={paymentStatus.sebagian}
            belumBayar={paymentStatus.belumBayar}
          />
        </div>
      </div>

      {/* Row 2: Jamaah per Paket (Candle/Bar chart) & Keberangkatan Terdekat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 card-hover">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Jamaah per Paket</h3>
          <PackagePilgrimChart labels={packagePilgrimLabels(packagePilgrimDataLabels(packagePilgrims.labels))} data={packagePilgrims.data} />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 card-hover">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Keberangkatan Terdekat</h3>
          <div className="divide-y divide-gray-100">
            {upcomingDepartures.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between hover:bg-teal-50/30 px-2 rounded-lg transition-colors">
                <div>
                  <p className="font-medium text-gray-800 text-xs">{item.packageName}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {item.date} &bull; sisa kuota {item.remainingQuota}
                  </p>
                </div>
                <div>
                  {item.badgeLabel === "Umroh" && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700">
                      Umroh
                    </span>
                  )}
                  {item.badgeLabel === "Haji" && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">
                      Haji
                    </span>
                  )}
                  {item.badgeLabel === "Haji Plus" && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700">
                      Haji Plus
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pengumuman Terbaru */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Pengumuman Terbaru</h3>
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="pb-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-100 text-purple-700">
                  {a.badgeLabel}
                </span>
                <span className="text-[11px] text-gray-400">{a.date}</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-snug">{a.title}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function packagePilgrimDataLabels(labels: string[]) {
  return labels;
}

function packagePilgrimLabels(labels: string[]) {
  return labels;
}
