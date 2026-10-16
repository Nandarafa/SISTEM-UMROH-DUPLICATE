"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createAgentAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const branchId = String(formData.get("branch_id") || "f68b6fde-225a-49de-86ba-60f8e161acdc").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const commissionRate = Number(formData.get("commission_rate") || 5);
  const isActiveRaw = formData.get("is_active");
  const isActive = isActiveRaw === "1" || isActiveRaw === "on";
  const createLogin = formData.get("create_account") === "1" || formData.get("create_account") === "on";

  if (!name) return { success: false, error: "Nama agen wajib diisi" };

  const code = "AG-" + Math.random().toString(36).substring(2, 7).toUpperCase();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        let userId = null;

        // If create account is checked, create/link profile
        if (createLogin && email) {
          const { data: profileData } = await supabase
            .from("profiles")
            .upsert([
              {
                email: email.toLowerCase(),
                name,
                role: "agent",
              },
            ], { onConflict: "email" })
            .select();

          if (profileData && profileData[0]) {
            userId = profileData[0].id;
          }
        }

        const payload: any = {
          branch_id: branchId,
          code,
          name,
          phone: phone || null,
          email: email || null,
          commission_rate: commissionRate,
          is_active: isActive,
          user_id: userId,
        };

        const { error } = await supabase.from("agents").insert([payload]);
        if (error) {
          console.error("Supabase insert agent error:", error);
          return { success: false, error: error.message };
        }
      }
    } catch (e: any) {
      console.error("Error creating agent:", e);
      return { success: false, error: e?.message || "Gagal menyimpan agen" };
    }
  }

  revalidatePath("/agents");
  return { success: true };
}

export async function updateAgentAction(id: string, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const branchId = String(formData.get("branch_id") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const commissionRate = Number(formData.get("commission_rate") || 5);
  const isActiveRaw = formData.get("is_active");
  const isActive = isActiveRaw === "1" || isActiveRaw === "on";

  if (!name) return { success: false, error: "Nama agen wajib diisi" };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const payload: any = {
          name,
          phone: phone || null,
          email: email || null,
          commission_rate: commissionRate,
          is_active: isActive,
        };
        if (branchId) {
          payload.branch_id = branchId;
        }

        const { error } = await supabase.from("agents").update(payload).eq("id", id);
        if (error) {
          console.error("Supabase update agent error:", error);
          return { success: false, error: error.message };
        }
      }
    } catch (e: any) {
      console.error("Error updating agent:", e);
      return { success: false, error: e?.message || "Gagal mengubah agen" };
    }
  }

  revalidatePath("/agents");
  return { success: true };
}

export async function deleteAgentAction(id: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data: agent } = await supabase
          .from("agents")
          .select("name, code")
          .eq("id", id)
          .maybeSingle();

        // 1. Unbind or delete references
        await supabase.from("commissions").delete().eq("agent_id", id);
        await supabase.from("registrations").update({ agent_id: null }).eq("agent_id", id);
        await supabase.from("pilgrims").update({ agent_id: null }).eq("agent_id", id);

        // 2. Delete agent record
        const { error } = await supabase.from("agents").delete().eq("id", id);
        if (error) {
          console.error("Supabase delete agent error:", error);
          return { success: false, error: error.message };
        }

        try {
          const { recordActivityLog } = await import("@/features/activity-logs/services/activityLogService");
          await recordActivityLog(
            "deleted",
            `Menghapus mitra agen ${agent?.name || id} (${agent?.code || "-"})`,
            "Agent",
            id
          );
        } catch (e) {
          console.error("Failed to log agent deletion:", e);
        }
      }
    } catch (e: any) {
      console.error("Error deleting agent:", e);
      return { success: false, error: e?.message || "Gagal menghapus agen" };
    }
  }

  revalidatePath("/agents");
  revalidatePath("/dashboard");
  return { success: true };
}
