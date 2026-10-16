"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export async function updateCommissionStatusAction(commissionId: string, status: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const supabase = await createServerSupabase();
    if (!supabase) return { success: true };

    const { error } = await supabase
      .from("commissions")
      .update({ status })
      .eq("id", commissionId);

    if (error) {
      console.error("Error updating commission:", error);
      return { error: error.message };
    }

    revalidatePath("/commissions");
    return { success: true };
  } catch (err: any) {
    console.error("Error updateCommissionStatusAction:", err);
    return { error: err.message || "Gagal mengubah status komisi." };
  }
}
