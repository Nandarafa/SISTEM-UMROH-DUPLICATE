"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createAirlineAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const code = String(formData.get("code") || "").trim();
  const transit = String(formData.get("transit") || "Langsung").trim();
  const isActiveRaw = formData.get("is_active");
  const isActive = isActiveRaw === "1" || isActiveRaw === "on";

  if (!name) return { success: false, error: "Nama maskapai wajib diisi" };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        await supabase.from("airlines").insert([
          {
            name,
            code: code || null,
            transit: transit || null,
            is_active: isActive,
          },
        ]);
      }
    } catch (e) {
      console.error("Error creating airline:", e);
    }
  }

  revalidatePath("/airlines");
  return { success: true };
}

export async function updateAirlineAction(id: string, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const code = String(formData.get("code") || "").trim();
  const transit = String(formData.get("transit") || "Langsung").trim();
  const isActiveRaw = formData.get("is_active");
  const isActive = isActiveRaw === "1" || isActiveRaw === "on";

  if (!name) return { success: false, error: "Nama maskapai wajib diisi" };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        await supabase
          .from("airlines")
          .update({
            name,
            code: code || null,
            transit: transit || null,
            is_active: isActive,
          })
          .eq("id", id);
      }
    } catch (e) {
      console.error("Error updating airline:", e);
    }
  }

  revalidatePath("/airlines");
  return { success: true };
}

export async function deleteAirlineAction(id: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        await supabase.from("airlines").delete().eq("id", id);
      }
    } catch (e) {
      console.error("Error deleting airline:", e);
    }
  }
  revalidatePath("/airlines");
  return { success: true };
}
