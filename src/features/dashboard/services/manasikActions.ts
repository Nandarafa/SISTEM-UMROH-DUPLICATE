"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export async function createManasikAction(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const packageId = (formData.get("package_id") as string)?.trim() || null;
  const guideId = (formData.get("guide_id") as string)?.trim() || null;
  const date = (formData.get("date") as string)?.trim();
  const location = (formData.get("location") as string)?.trim() || null;
  const startTime = (formData.get("start_time") as string)?.trim() || null;
  const endTime = (formData.get("end_time") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;

  if (!title || !date) {
    return { error: "Judul dan Tanggal manasik wajib diisi." };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        // Ambil default branch_id dari Kantor Pusat Jakarta
        const { data: branch } = await supabase
          .from("branches")
          .select("id")
          .eq("is_head_office", true)
          .limit(1)
          .maybeSingle();

        const branchId = branch?.id || "f68b6fde-225a-49de-86ba-60f8e161acdc";

        const payload: Record<string, any> = {
          title,
          package_id: packageId && packageId !== "" ? packageId : null,
          guide_id: guideId && guideId !== "" ? guideId : null,
          branch_id: branchId,
          date,
          location,
          start_time: startTime ? `${startTime}:00` : null,
          end_time: endTime ? `${endTime}:00` : null,
        };

        let { error } = await supabase.from("manasik_schedules").insert(payload);
        if (error) {
          console.error("createManasikAction error:", error);
          return { error: error.message };
        }
      }
    } catch (err: any) {
      console.error("createManasikAction error:", err);
      return { error: err.message || "Gagal membuat jadwal manasik." };
    }
  }

  revalidatePath("/manasik");
  redirect("/manasik");
}

export async function updateManasikAction(id: string, formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const packageId = (formData.get("package_id") as string)?.trim() || null;
  const guideId = (formData.get("guide_id") as string)?.trim() || null;
  const date = (formData.get("date") as string)?.trim();
  const location = (formData.get("location") as string)?.trim() || null;
  const startTime = (formData.get("start_time") as string)?.trim() || null;
  const endTime = (formData.get("end_time") as string)?.trim() || null;

  if (!title || !date) {
    return { error: "Judul dan Tanggal manasik wajib diisi." };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const updatePayload: Record<string, any> = {
          title,
          package_id: packageId && packageId !== "" ? packageId : null,
          guide_id: guideId && guideId !== "" ? guideId : null,
          date,
          location,
          start_time: startTime ? (startTime.length === 5 ? `${startTime}:00` : startTime) : null,
          end_time: endTime ? (endTime.length === 5 ? `${endTime}:00` : endTime) : null,
        };

        const { error } = await supabase
          .from("manasik_schedules")
          .update(updatePayload)
          .eq("id", id);

        if (error) {
          console.error("updateManasikAction error:", error);
          return { error: error.message };
        }
      }
    } catch (err: any) {
      console.error("updateManasikAction error:", err);
      return { error: err.message || "Gagal mengupdate jadwal manasik." };
    }
  }

  revalidatePath("/manasik");
  revalidatePath(`/manasik/${id}`);
  redirect("/manasik");
}

export async function deleteManasikAction(id: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        // Hapus attendances terlebih dahulu jika ada foreign key constraint
        await supabase.from("manasik_attendances").delete().eq("manasik_schedule_id", id);

        const { error } = await supabase.from("manasik_schedules").delete().eq("id", id);
        if (error) {
          console.error("deleteManasikAction error:", error);
          return { error: error.message };
        }
      }
    } catch (err: any) {
      console.error("deleteManasikAction error:", err);
      return { error: err.message || "Gagal menghapus jadwal manasik." };
    }
  }

  revalidatePath("/manasik");
  return { success: true };
}
