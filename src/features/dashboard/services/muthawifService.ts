import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface MuthawifDashboardData {
  guided: number;
  todayManasik: number;
  totalPresent: number;
  attendance: {
    hadir: number;
    tidakHadir: number;
    izin: number;
  };
  upcomingManasik: Array<{
    id: string;
    title: string;
    date: string;
    location: string;
  }>;
  announcements: Array<{
    id: string;
    title: string;
    date: string;
    body: string;
    tag: string;
  }>;
}

export async function getMuthawifDashboardData(): Promise<MuthawifDashboardData> {
  let guided = 0;
  let todayManasik = 0;
  let totalPresent = 0;
  let hadir = 0;
  let tidakHadir = 0;
  let izin = 0;
  let upcomingManasik: Array<{ id: string; title: string; date: string; location: string }> = [];
  let announcements: Array<{ id: string; title: string; date: string; body: string; tag: string }> = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        // 1. Hitung total jamaah bimbingan
        const { count: guidedCount } = await supabase
          .from("pilgrims")
          .select("*", { count: "exact", head: true });

        guided = guidedCount || 0;

        // 2. Cek manasik hari ini
        const todayStr = new Date().toISOString().split("T")[0];
        const { count: todayCount } = await supabase
          .from("manasik_schedules")
          .select("*", { count: "exact", head: true })
          .eq("date", todayStr);

        todayManasik = todayCount || 0;

        // 3. Kehadiran dari manasik_attendances
        const { data: attData } = await supabase
          .from("manasik_attendances")
          .select("status");

        if (attData && attData.length > 0) {
          attData.forEach((a: any) => {
            if (a.status === "present" || a.status === "hadir") {
              hadir++;
              totalPresent++;
            } else if (a.status === "excused" || a.status === "izin") {
              izin++;
            } else {
              tidakHadir++;
            }
          });
        }

        // 4. Jadwal manasik mendatang
        const { data: manasikList } = await supabase
          .from("manasik_schedules")
          .select("id, title, date, location")
          .gte("date", todayStr)
          .order("date", { ascending: true })
          .limit(5);

        if (manasikList) {
          upcomingManasik = manasikList.map((m: any) => ({
            id: String(m.id),
            title: m.title,
            date: m.date,
            location: m.location || "Lokasi belum ditentukan",
          }));
        }

        // 5. Pengumuman
        const { data: annData } = await supabase
          .from("announcements")
          .select("*")
          .or("audience.eq.all,audience.eq.guide")
          .order("id", { ascending: false })
          .limit(3);

        if (annData && annData.length > 0) {
          announcements = annData.map((a: any) => ({
            id: String(a.id),
            title: a.title,
            date: a.created_at
              ? new Date(a.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
              : "-",
            body: a.body,
            tag: a.audience === "guide" ? "Muthawif" : "Semua Pengguna",
          }));
        }
      }
    } catch (e) {
      console.error("Error in getMuthawifDashboardData:", e);
    }
  }

  return {
    guided,
    todayManasik,
    totalPresent,
    attendance: {
      hadir,
      tidakHadir,
      izin,
    },
    upcomingManasik,
    announcements,
  };
}
