"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createPackageAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  let code = String(formData.get("code") || "").trim();
  const branchId = String(formData.get("branch_id") || "f68b6fde-225a-49de-86ba-60f8e161acdc").trim();
  const type = String(formData.get("type") || "umroh");
  const status = String(formData.get("status") || "draft");
  const price = Number(formData.get("price") || 0);
  const downPayment = Number(formData.get("down_payment") || 0);
  const quota = Number(formData.get("quota") || 30);
  const durationDays = Number(formData.get("duration_days") || 9);
  const departureDate = String(formData.get("departure_date") || "");
  const departureCity = String(formData.get("departure_city") || "Jakarta");

  if (!name) return { success: false, error: "Nama paket wajib diisi" };

  if (!code) {
    code = "PKG-" + Math.random().toString(36).substring(2, 7).toUpperCase();
  }

  const hotelMakkahId = String(formData.get("hotel_makkah_id") || "").trim() || null;
  const hotelMadinahId = String(formData.get("hotel_madinah_id") || "").trim() || null;
  const airlineId = String(formData.get("airline_id") || "").trim() || null;
  const description = String(formData.get("description") || "").trim() || null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const payload: any = {
          name,
          code,
          type,
          price,
          down_payment: downPayment,
          quota,
          duration_days: durationDays,
          departure_date: departureDate || null,
          departure_city: departureCity,
          status,
          hotel_makkah_id: hotelMakkahId,
          hotel_madinah_id: hotelMadinahId,
          airline_id: airlineId,
          description,
        };
        if (branchId) {
          payload.branch_id = branchId;
        }

        let { error } = await supabase.from("packages").insert([payload]);
        if (error && error.message?.includes("column of 'packages' in the schema cache")) {
          delete payload.description;
          const retry = await supabase.from("packages").insert([payload]);
          error = retry.error;
        }

        if (error) {
          console.error("Supabase insert package error:", error);
          return { success: false, error: error.message };
        }

        try {
          const { recordActivityLog } = await import("@/features/activity-logs/services/activityLogService");
          await recordActivityLog("created", `Membuat paket baru ${name} (${code})`, "Package");
        } catch {}
      }
    } catch (e: any) {
      console.error("Error creating package:", e);
      return { success: false, error: e?.message || "Gagal menyimpan paket" };
    }
  }

  revalidatePath("/packages");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deletePackageAction(id: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        await supabase.from("packages").delete().eq("id", id);
        try {
          const { recordActivityLog } = await import("@/features/activity-logs/services/activityLogService");
          await recordActivityLog("deleted", `Menghapus paket dengan ID ${id}`, "Package");
        } catch {}
      }
    } catch (e) {
      console.error("Error deleting package:", e);
    }
  }
  revalidatePath("/packages");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updatePackageAction(id: string, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const code = String(formData.get("code") || "").trim();
  const type = String(formData.get("type") || "umroh");
  const price = Number(formData.get("price") || 0);
  const downPayment = Number(formData.get("down_payment") || 0);
  const quota = Number(formData.get("quota") || 30);
  const durationDays = Number(formData.get("duration_days") || 9);
  const departureDate = String(formData.get("departure_date") || "");
  const departureCity = String(formData.get("departure_city") || "Jakarta");
  const status = String(formData.get("status") || "active");

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        await supabase
          .from("packages")
          .update({
            name,
            code,
            type,
            price,
            down_payment: downPayment,
            quota,
            duration_days: durationDays,
            departure_date: departureDate || null,
            departure_city: departureCity,
            status,
          })
          .eq("id", id);
      }
    } catch (e) {
      console.error("Error updating package:", e);
    }
  }

  revalidatePath("/packages");
  revalidatePath(`/packages/${id}`);
  revalidatePath("/dashboard");
  return { success: true };
}
