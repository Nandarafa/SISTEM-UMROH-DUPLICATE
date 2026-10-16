"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createHotelAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const city = String(formData.get("city") || "Mekah").trim();
  const star = Number(formData.get("star") || 4);
  const distanceToMasjid = Number(formData.get("distance_to_masjid") || 100);
  const description = String(formData.get("description") || "").trim();
  const isActiveRaw = formData.get("is_active");
  const isActive = isActiveRaw === "1" || isActiveRaw === "on";

  if (!name) return { success: false, error: "Nama hotel wajib diisi" };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { error } = await supabase.from("hotels").insert([
          {
            name,
            city,
            star,
            distance_to_masjid: distanceToMasjid,
            is_active: isActive,
          },
        ]);
        if (error) {
          console.error("Supabase insert error:", error);
          return { success: false, error: error.message };
        }
      }
    } catch (e: any) {
      console.error("Error creating hotel:", e);
      return { success: false, error: e?.message || "Gagal menyimpan ke Supabase" };
    }
  }

  revalidatePath("/hotels");
  return { success: true };
}

export async function updateHotelAction(id: string, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const city = String(formData.get("city") || "Mekah").trim();
  const star = Number(formData.get("star") || 4);
  const distanceToMasjid = Number(formData.get("distance_to_masjid") || 100);
  const isActiveRaw = formData.get("is_active");
  const isActive = isActiveRaw === "1" || isActiveRaw === "on";

  if (!name) return { success: false, error: "Nama hotel wajib diisi" };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { error } = await supabase
          .from("hotels")
          .update({
            name,
            city,
            star,
            distance_to_masjid: distanceToMasjid,
            is_active: isActive,
          })
          .eq("id", id);
        if (error) {
          console.error("Supabase update error:", error);
          return { success: false, error: error.message };
        }
      }
    } catch (e: any) {
      console.error("Error updating hotel:", e);
      return { success: false, error: e?.message || "Gagal mengubah ke Supabase" };
    }
  }

  revalidatePath("/hotels");
  return { success: true };
}

export async function deleteHotelAction(id: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        await supabase.from("hotels").delete().eq("id", id);
      }
    } catch (e) {
      console.error("Error deleting hotel:", e);
    }
  }
  revalidatePath("/hotels");
  return { success: true };
}
