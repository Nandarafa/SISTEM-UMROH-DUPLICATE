"use server";

import { revalidatePath } from "next/cache";
import { saveWhiteLabelSettings, WhiteLabelSettings } from "./settingsService";

export async function updateSettingsAction(formData: FormData) {
  try {
    const app_name = (formData.get("app_name") as string)?.trim();
    const app_subtitle = (formData.get("app_subtitle") as string)?.trim();
    const company_phone = (formData.get("company_phone") as string)?.trim();
    const company_email = (formData.get("company_email") as string)?.trim();
    const company_address = (formData.get("company_address") as string)?.trim();
    const footer_text = (formData.get("footer_text") as string)?.trim();
    const primary_color = (formData.get("primary_color") as string)?.trim() || "#0d9488";
    const secondary_color = (formData.get("secondary_color") as string)?.trim() || "#0f766e";

    const payload: Partial<WhiteLabelSettings> = {
      app_name,
      app_subtitle,
      company_phone,
      company_email,
      company_address,
      footer_text,
      primary_color,
      secondary_color,
    };

    await saveWhiteLabelSettings(payload);

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("updateSettingsAction error:", err);
    return { error: err.message || "Gagal menyimpan pengaturan." };
  }
}
