import Link from "next/link";
import { StatsCard } from "@/components/ui/StatsCard";
import { AttendanceChart } from "@/components/ui/AttendanceChart";
import { getMuthawifDashboardData } from "@/features/dashboard/services/muthawifService";
import { getPilgrimDashboardData } from "@/features/dashboard/services/pilgrimDashboardService";
import { PilgrimDashboardView } from "@/features/dashboard/components/PilgrimDashboardView";
import { getAgentDashboardData } from "@/features/dashboard/services/agentDashboardService";
import { AgentDashboardView } from "@/features/dashboard/components/AgentDashboardView";
import { getSessionUser } from "@/features/auth/services/authActions";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (user?.role === "pilgrim") {
    const pilgrimData = await getPilgrimDashboardData(user.email);
    return <PilgrimDashboardView data={pilgrimData} userName={user.name} />;
  }

  if (user?.role === "agent") {
    const agentData = await getAgentDashboardData();
    return <AgentDashboardView data={agentData} />;
  }

  const isStaff = user?.role === "super_admin" || user?.role === "admin";
  if (isStaff) {
    const { getAdminDashboardData } = await import("@/features/dashboard/services/adminDashboardService");
    const { AdminDashboardView } = await import("@/features/dashboard/components/AdminDashboardView");
    const adminData = await getAdminDashboardData();
    return <AdminDashboardView data={adminData} />;
  }

  const isMuthawif = user?.role === "guide";
  const data = await getMuthawifDashboardData();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">Dashboard Muthawif</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Jamaah bimbingan &amp; jadwal manasik Anda
        </p>
      </div>

      {/* 3 Stats Cards: Jamaah Bimbingan, Manasik Hari Ini, Total Kehadiran */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          label="Jamaah Bimbingan"
          value={data.guided.toString()}
          icon="users"
          color="teal"
        />
        <StatsCard
          label="Manasik Hari Ini"
          value={data.todayManasik.toString()}
          icon="calendar"
          color="blue"
        />
        <StatsCard
          label="Total Kehadiran"
          value={data.totalPresent.toString()}
          icon="check"
          color="green"
        />
      </div>

      {/* Grid 2 Column Content: Manasik Mendatang & Rekap Kehadiran */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manasik Mendatang */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm mb-4">Manasik Mendatang</h3>

            {data.upcomingManasik.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {data.upcomingManasik.map((m) => (
                  <div key={m.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{m.title}</p>
                      <p className="text-xs text-gray-400">{m.date} &bull; {m.location}</p>
                    </div>
                    <Link
                      href={`/manasik/${m.id}`}
                      className="text-xs text-brand hover:underline cursor-pointer font-medium"
                    >
                      Absensi
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-xl bg-gray-50 grid place-items-center text-gray-300 mb-3">
                  <Icon name="calendar" className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Belum ada manasik</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Jadwal yang Anda pimpin akan tampil di sini.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Rekap Kehadiran (Donut Chart) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Rekap Kehadiran</h3>
          <AttendanceChart
            hadir={data.attendance.hadir}
            tidakHadir={data.attendance.tidakHadir}
            izin={data.attendance.izin}
          />
        </div>
      </div>

      {/* Pengumuman Terbaru */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Pengumuman Terbaru</h3>

        <div className="space-y-4">
          {data.announcements.map((a) => (
            <div key={a.id} className="pb-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-100 text-purple-700">
                  {a.tag}
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
