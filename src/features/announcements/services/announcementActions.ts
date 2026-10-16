"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export async function createAnnouncementAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const audience = (formData.get("audience") as string) || "all";
    const branchId = formData.get("branch_id") as string;
    const isPublished = formData.get("is_published") === "on";

    if (!title) {
      return { error: "Judul pengumuman wajib diisi." };
    }
    if (!body) {
      return { error: "Isi pengumuman wajib diisi." };
    }

    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const supabase = await createServerSupabase();
    if (!supabase) return { success: true };

    const { error } = await supabase.from("announcements").insert({
      title,
      body,
      audience,
      branch_id: branchId && branchId !== "" ? branchId : null,
      is_published: isPublished,
    });

    if (error) {
      console.error("Error creating announcement:", error);
      return { error: error.message };
    }

    revalidatePath("/announcements");
    return { success: true };
  } catch (err: any) {
    console.error("Error in createAnnouncementAction:", err);
    return { error: err.message || "Gagal membuat pengumuman." };
  }
}

export async function updateAnnouncementAction(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const audience = (formData.get("audience") as string) || "all";
    const branchId = formData.get("branch_id") as string;
    const isPublished = formData.get("is_published") === "on";

    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const supabase = await createServerSupabase();
    if (!supabase) return { success: true };

    const { error } = await supabase
      .from("announcements")
      .update({
        title,
        body,
        audience,
        branch_id: branchId && branchId !== "" ? branchId : null,
        is_published: isPublished,
      })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/announcements");
    return { success: true };
  } catch (err: any) {
    console.error("Error updating announcement:", err);
    return { error: err.message || "Gagal memperbarui pengumuman." };
  }
}

export async function deleteAnnouncementAction(id: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const supabase = await createServerSupabase();
    if (!supabase) return { success: true };

    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) {
      return { error: error.message };
    }

    revalidatePath("/announcements");
    return { success: true };
  } catch (err: any) {
    console.error("Error in deleteAnnouncementAction:", err);
    return { error: err.message || "Gagal menghapus pengumuman." };
  }
}
