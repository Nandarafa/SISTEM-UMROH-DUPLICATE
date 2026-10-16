"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { getLocalEquipment, saveLocalEquipment } from "./equipmentService";

export async function createEquipmentAction(formData: FormData) {
  try {
    const pilgrimId = formData.get("pilgrim_id") as string;
    const item = formData.get("item") as string;
    const size = (formData.get("size") as string) || "-";
    const quantityInput = formData.get("quantity") as string;
    const status = (formData.get("status") as string) || "Belum Disiapkan";
    const handedOverAtInput = formData.get("handed_over_at") as string;
    const notes = (formData.get("notes") as string) || "";

    if (!pilgrimId) {
      return { error: "Pilih jamaah terlebih dahulu." };
    }
    if (!item) {
      return { error: "Pilih item perlengkapan terlebih dahulu." };
    }

    const quantity = parseInt(quantityInput || "1", 10) || 1;
    const handedOverAt = handedOverAtInput ? handedOverAtInput : null;

    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const supabase = await createServerSupabase();
    if (!supabase) return { success: true };

    const { error } = await supabase.from("equipment").insert({
      pilgrim_id: pilgrimId,
      item,
      size,
      quantity,
      status,
      handed_over_at: handedOverAt,
      notes,
    });

    if (error) {
      // If table is missing in Supabase, save to local persistent store so user is not blocked
      if (error.message?.includes("table 'public.equipment'")) {
        const local = getLocalEquipment();
        const newRecord = {
          id: "eq-" + Date.now().toString(36),
          pilgrim_id: pilgrimId,
          item,
          size,
          quantity,
          status,
          handed_over_at: handedOverAt,
          notes,
          created_at: new Date().toISOString(),
        };
        local.push(newRecord);
        saveLocalEquipment(local);
        revalidatePath("/equipment");
        return { success: true };
      }

      console.error("Supabase insert equipment error:", error);
      return { error: error.message };
    }

    revalidatePath("/equipment");
    return { success: true };
  } catch (err: any) {
    console.error("Error creating equipment:", err);
    return { error: err.message || "Gagal menambahkan perlengkapan." };
  }
}

export async function updateEquipmentAction(id: string, formData: FormData) {
  try {
    const pilgrimId = formData.get("pilgrim_id") as string;
    const item = formData.get("item") as string;
    const size = (formData.get("size") as string) || "-";
    const quantityInput = formData.get("quantity") as string;
    const status = (formData.get("status") as string) || "Belum Disiapkan";
    const handedOverAtInput = formData.get("handed_over_at") as string;
    const notes = (formData.get("notes") as string) || "";

    const quantity = parseInt(quantityInput || "1", 10) || 1;
    const handedOverAt = handedOverAtInput ? handedOverAtInput : null;

    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const supabase = await createServerSupabase();
    if (!supabase) return { success: true };

    const { error } = await supabase
      .from("equipment")
      .update({
        pilgrim_id: pilgrimId,
        item,
        size,
        quantity,
        status,
        handed_over_at: handedOverAt,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/equipment");
    return { success: true };
  } catch (err: any) {
    console.error("Error updating equipment:", err);
    return { error: err.message || "Gagal memperbarui perlengkapan." };
  }
}

export async function deleteEquipmentAction(id: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const supabase = await createServerSupabase();
    if (!supabase) return { success: true };

    const { error } = await supabase.from("equipment").delete().eq("id", id);
    if (error) {
      return { error: error.message };
    }

    revalidatePath("/equipment");
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting equipment:", err);
    return { error: err.message || "Gagal menghapus perlengkapan." };
  }
}
