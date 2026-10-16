"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createGuideAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const branchId = String(formData.get("branch_id") || "f68b6fde-225a-49de-86ba-60f8e161acdc").trim();
  const specialization = String(formData.get("specialization") || "Fiqih Manasik").trim();
  const email = String(formData.get("email") || "").trim();
  const isActiveRaw = formData.get("is_active");
  const isActive = isActiveRaw === "1" || isActiveRaw === "on";
  const createLogin = formData.get("create_account") === "1" || formData.get("create_account") === "on";

  if (!name) return { success: false, error: "Nama muthawif wajib diisi" };

  const code = "GD-" + Math.random().toString(36).substring(2, 7).toUpperCase();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        let userId = null;

        if (createLogin && email) {
          const { data: profileData } = await supabase
            .from("profiles")
            .upsert(
              [
                {
                  email: email.toLowerCase(),
                  name,
                  role: "guide",
                },
              ],
              { onConflict: "email" }
            )
            .select();

          if (profileData && profileData[0]) {
            userId = profileData[0].id;
          }
        }

        const payload: any = {
          branch_id: branchId,
          code,
          name,
          specialization,
          is_active: isActive,
          user_id: userId,
        };

        const { error } = await supabase.from("guides").insert([payload]);
        if (error) {
          console.error("Supabase insert guide error:", error);
          return { success: false, error: error.message };
        }

        try {
          const { recordActivityLog } = await import("@/features/activity-logs/services/activityLogService");
          await recordActivityLog(
            "created",
            `Menambahkan muthawif baru ${name} (${code})`,
            "Guide"
          );
        } catch (e) {
          console.error("Failed to log guide creation:", e);
        }
      }
    } catch (e: any) {
      console.error("Error creating guide:", e);
      return { success: false, error: e?.message || "Gagal menyimpan muthawif" };
    }
  }

  revalidatePath("/guides");
  return { success: true };
}

export async function updateGuideAction(id: string, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const specialization = String(formData.get("specialization") || "Fiqih Manasik").trim();
  const isActiveRaw = formData.get("is_active");
  const isActive = isActiveRaw === "1" || isActiveRaw === "on";

  if (!name) return { success: false, error: "Nama muthawif wajib diisi" };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const payload: any = {
          name,
          specialization,
          is_active: isActive,
        };

        const { error } = await supabase.from("guides").update(payload).eq("id", id);
        if (error) {
          console.error("Supabase update guide error:", error);
          return { success: false, error: error.message };
        }

        try {
          const { recordActivityLog } = await import("@/features/activity-logs/services/activityLogService");
          await recordActivityLog(
            "updated",
            `Memperbarui data muthawif ${name}`,
            "Guide",
            id
          );
        } catch (e) {
          console.error("Failed to log guide update:", e);
        }
      }
    } catch (e: any) {
      console.error("Error updating guide:", e);
      return { success: false, error: e?.message || "Gagal mengubah muthawif" };
    }
  }

  revalidatePath("/guides");
  return { success: true };
}

export async function deleteGuideAction(id: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        // Fetch guide info for activity log
        const { data: guide } = await supabase
          .from("guides")
          .select("name, code")
          .eq("id", id)
          .maybeSingle();

        // 1. Unbind foreign key references before deleting
        await supabase
          .from("manasik_schedules")
          .update({ guide_id: null })
          .eq("guide_id", id);

        await supabase
          .from("registrations")
          .update({ guide_id: null })
          .eq("guide_id", id);

        await supabase
          .from("pilgrims")
          .update({ guide_id: null })
          .eq("guide_id", id);

        // 2. Delete guide record
        const { error } = await supabase.from("guides").delete().eq("id", id);
        if (error) {
          console.error("Supabase delete guide error:", error);
          return { success: false, error: error.message };
        }

        // 3. Record activity log
        try {
          const { recordActivityLog } = await import("@/features/activity-logs/services/activityLogService");
          await recordActivityLog(
            "deleted",
            `Menghapus muthawif/pembimbing ${guide?.name || id} (${guide?.code || "-"})`,
            "Guide",
            id
          );
        } catch (e) {
          console.error("Failed to log guide deletion:", e);
        }
      }
    } catch (e: any) {
      console.error("Error deleting guide:", e);
      return { success: false, error: e?.message || "Gagal menghapus muthawif" };
    }
  }

  revalidatePath("/guides");
  revalidatePath("/manasik");
  revalidatePath("/dashboard");
  return { success: true };
}
