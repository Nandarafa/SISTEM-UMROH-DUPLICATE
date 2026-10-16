"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export async function saveManifestAction(formData: FormData) {
  try {
    const registrationIds = formData.getAll("registration_id") as string[];

    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const supabase = await createServerSupabase();
    if (!supabase) return { success: true };

    for (const regId of registrationIds) {
      const roomNumber = (formData.get(`room_number_${regId}`) as string) || "";
      const roomType = (formData.get(`room_type_${regId}`) as string) || "Quad";
      const busNumber = (formData.get(`bus_number_${regId}`) as string) || "";
      const seatNumber = (formData.get(`seat_number_${regId}`) as string) || "";
      const mahramGroup = (formData.get(`mahram_group_${regId}`) as string) || "";

      // Upsert into manifests
      const { error } = await supabase.from("manifests").upsert(
        {
          registration_id: regId,
          room_number: roomNumber,
          room_type: roomType,
          bus_number: busNumber,
          seat_number: seatNumber,
          mahram_group: mahramGroup,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "registration_id" }
      );

      if (error) {
        console.warn("Manifest upsert notice:", error.message);
      }
    }

    revalidatePath("/manifests");
    return { success: true };
  } catch (err: any) {
    console.error("Error saving manifest:", err);
    return { error: err.message || "Gagal menyimpan manifest." };
  }
}
