import React from "react";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge } from "@/components/ui/Badge";
import { currency } from "@/lib/utils";
import { AgentDashboardData } from "@/features/dashboard/services/agentDashboardService";
import { MonthlyCommissionChart } from "./MonthlyCommissionChart";
import { AgentPaymentStatusChart } from "./AgentPaymentStatusChart";

interface AgentDashboardViewProps {
  data: AgentDashboardData;
}

export function AgentDashboardView({ data }: AgentDashboardViewProps) {
  const { stats, monthly, paymentStatus, announcements } = data;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">Dashboard Agen</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Ringkasan referral &amp; komisi Anda
        </p>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
        <StatsCard
          label="Jamaah Referral"
          value={stats.referrals.toString()}
          icon="users"
          color="teal"
        />
        <StatsCard
          label="Total Komisi"
          value={currency(stats.commission_total)}
          icon="percent"
          color="green"
        />
        <StatsCard
          label="Komisi Dibayar"
          value={currency(stats.commission_paid)}
          icon="cash"
          color="blue"
        />
        <StatsCard
          label="Komisi Pending"
          value={currency(stats.commission_pending)}
          icon="history"
          color="amber"
        />
      </div>

      {/* Charts Row: Komisi per Bulan (2 cols) & Status Bayar Jamaah (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Komisi per Bulan */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 card-hover">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Komisi per Bulan</h3>
          <MonthlyCommissionChart labels={monthly.labels} data={monthly.data} />
        </div>

        {/* Status Bayar Jamaah */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 card-hover">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Status Bayar Jamaah</h3>
          <AgentPaymentStatusChart labels={paymentStatus.labels} data={paymentStatus.data} />
        </div>
      </div>

      {/* Pengumuman Terbaru */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 card-hover">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Pengumuman Terbaru</h3>

        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="pb-3 border-b border-gray-50 last:border-0 hover:bg-teal-50/20 p-2 rounded-lg transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Badge color={a.badgeColor}>{a.badgeLabel}</Badge>
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
