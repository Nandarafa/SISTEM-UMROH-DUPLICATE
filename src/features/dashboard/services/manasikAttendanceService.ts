import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface AttendanceRecord {
  pilgrimId: string;
  name: string;
  code?: string;
  status: "present" | "absent" | "excused";
}

export interface AvailablePilgrim {
  id: string;
  name: string;
  code: string;
}

export interface ManasikDetailData {
  id: string;
  title: string;
  date: string;
  packageName: string;
  guideName: string;
  startTime: string;
  endTime: string;
  location: string;
  rekap: {
    hadir: number;
    izin: number;
    tidakHadir: number;
  };
  pilgrims: AttendanceRecord[];
  allAvailablePilgrims: AvailablePilgrim[];
}

export async function getManasikDetail(id: string): Promise<ManasikDetailData | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabase();
  if (!supabase) return null;

  try {
    const { data: schedule, error } = await supabase
      .from("manasik_schedules")
      .select(`
        id,
        branch_id,
        package_id,
        guide_id,
        title,
        date,
        start_time,
        end_time,
        location,
        packages ( id, name ),
        guides ( name )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error || !schedule) return null;

    // 1. Fetch existing attendances for this schedule
    const { data: existingAttendances } = await supabase
      .from("manasik_attendances")
      .select("pilgrim_id, status, pilgrims ( id, name, code )")
      .eq("schedule_id", id);

    const attendanceMap = new Map<string, string>();
    const pilgrimInfoMap = new Map<string, { id: string; name: string; code: string }>();

    (existingAttendances || []).forEach((a: any) => {
      attendanceMap.set(String(a.pilgrim_id), a.status);
      if (a.pilgrims) {
        pilgrimInfoMap.set(String(a.pilgrim_id), {
          id: String(a.pilgrim_id),
          name: a.pilgrims.name,
          code: a.pilgrims.code || "JM-0000",
        });
      }
    });

    // 2. Fetch eligible registered pilgrims
    if (schedule.package_id) {
      const { data: regList } = await supabase
        .from("registrations")
        .select("pilgrim_id, pilgrims ( id, name, code )")
        .eq("package_id", schedule.package_id)
        .neq("status", "cancelled");

      (regList || []).forEach((r: any) => {
        if (r.pilgrims) {
          pilgrimInfoMap.set(String(r.pilgrim_id), {
            id: String(r.pilgrim_id),
            name: r.pilgrims.name,
            code: r.pilgrims.code || "JM-0000",
          });
        }
      });
    }

    // If package is "Umum" (null) or no registered pilgrims found yet:
    if (!schedule.package_id || pilgrimInfoMap.size === 0) {
      const { data: allActive } = await supabase
        .from("pilgrims")
        .select("id, name, code")
        .eq("is_active", true)
        .order("name", { ascending: true });

      (allActive || []).forEach((p: any) => {
        pilgrimInfoMap.set(String(p.id), {
          id: String(p.id),
          name: p.name,
          code: p.code || "JM-0000",
        });
      });
    }

    // 3. Fetch all pilgrims for the manual add dropdown
    const { data: allPilgrimsList } = await supabase
      .from("pilgrims")
      .select("id, name, code")
      .order("name", { ascending: true });

    const allAvailablePilgrims: AvailablePilgrim[] = (allPilgrimsList || []).map((p: any) => ({
      id: String(p.id),
      name: p.name,
      code: p.code || "JM-0000",
    }));

    // 4. Build pilgrimsList and calculate stats
    let hadir = 0;
    let izin = 0;
    let tidakHadir = 0;

    const pilgrimsList: AttendanceRecord[] = Array.from(pilgrimInfoMap.values()).map((p) => {
      const rawStatus = attendanceMap.get(p.id) || "absent";
      let st: "present" | "absent" | "excused" = "absent";
      if (rawStatus === "present" || rawStatus === "hadir") {
        st = "present";
        hadir++;
      } else if (rawStatus === "excused" || rawStatus === "izin" || rawStatus === "sick") {
        st = "excused";
        izin++;
      } else {
        tidakHadir++;
      }

      return {
        pilgrimId: p.id,
        name: p.name,
        code: p.code,
        status: st,
      };
    });

    return {
      id: String(schedule.id),
      title: schedule.title,
      date: schedule.date
        ? new Date(schedule.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
        : "-",
      packageName: (schedule.packages as any)?.name ?? "Umum",
      guideName: (schedule.guides as any)?.name ?? "-",
      startTime: schedule.start_time ?? "-",
      endTime: schedule.end_time ?? "-",
      location: schedule.location ?? "Lokasi belum ditentukan",
      rekap: { hadir, izin, tidakHadir },
      pilgrims: pilgrimsList,
      allAvailablePilgrims,
    };
  } catch (err) {
    console.error("Error in getManasikDetail:", err);
    return null;
  }
}

export async function saveManasikAttendance(scheduleId: string, attendances: Record<string, string>) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Database tidak terhubung" };
  }

  const supabase = await createServerSupabase();
  if (!supabase) return { success: false, error: "Database tidak terhubung" };

  try {
    for (const [pilgrimId, status] of Object.entries(attendances)) {
      // Check if attendance row exists
      const { data: existing } = await supabase
        .from("manasik_attendances")
        .select("id")
        .eq("schedule_id", scheduleId)
        .eq("pilgrim_id", pilgrimId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("manasik_attendances")
          .update({ status })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("manasik_attendances")
          .insert({
            schedule_id: scheduleId,
            pilgrim_id: pilgrimId,
            status,
          });
      }
    }

    try {
      const { recordActivityLog } = await import("@/features/activity-logs/services/activityLogService");
      const { getSessionUser } = await import("@/features/auth/services/authActions");
      const user = await getSessionUser();
      await recordActivityLog(
        "updated",
        `Menyimpan absensi manasik untuk ${Object.keys(attendances).length} jamaah`,
        "ManasikSchedule",
        scheduleId,
        user?.id
      );
    } catch (e) {
      console.error("Error recording activity log for manasik:", e);
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error in saveManasikAttendance:", err);
    return { success: false, error: err.message || "Gagal menyimpan absensi" };
  }
}
