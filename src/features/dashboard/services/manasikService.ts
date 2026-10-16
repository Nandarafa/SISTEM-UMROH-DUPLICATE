import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface ManasikItem {
  id: string;
  date: string;
  title: string;
  packageName: string;
  guideName: string;
  presentCount: number;
  totalCount: number;
}

export async function getManasikSchedules(): Promise<ManasikItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase.from("manasik_schedules").select(`
      id,
      date,
      title,
      packages ( name ),
      guides ( name ),
      manasik_attendances ( status )
    `).order("date", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((d: any) => {
      const attendances = d.manasik_attendances || [];
      const present = attendances.filter((a: any) => a.status === "present" || a.status === "hadir").length;
      const excused = attendances.filter((a: any) => a.status === "excused" || a.status === "izin" || a.status === "sick").length;
      const attended = present > 0 ? present : (excused > 0 ? excused : 0);

      return {
        id: d.id,
        date: d.date
          ? new Date(d.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
          : "-",
        title: d.title,
        packageName: d.packages?.name ?? "Umum",
        guideName: d.guides?.name ?? "-",
        presentCount: attended,
        totalCount: attendances.length,
      };
    });
  } catch {
    return [];
  }
}
