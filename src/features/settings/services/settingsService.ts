import fs from "fs";
import path from "path";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface WhiteLabelSettings {
  app_name: string;
  app_subtitle: string;
  company_phone: string;
  company_email: string;
  company_address: string;
  footer_text: string;
  primary_color: string;
  secondary_color: string;
  logo_path?: string | null;
  favicon_path?: string | null;
}

export const DEFAULT_SETTINGS: WhiteLabelSettings = {
  app_name: "Travel Umroh & Haji",
  app_subtitle: "Sistem Manajemen Umroh & Haji",
  company_phone: "+62 21 1234 5678",
  company_email: "info@example.com",
  company_address: "Jl. Melati No. 1, Jakarta",
  footer_text: "© Travel Umroh & Haji. Seluruh hak cipta dilindungi.",
  primary_color: "#0d9488",
  secondary_color: "#0f766e",
  logo_path: null,
  favicon_path: null,
};

const SETTINGS_FILE = path.join(process.cwd(), "settings_data.json");

function getStoredFileSettings(): Partial<WhiteLabelSettings> {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to read settings_data.json", e);
  }
  return {};
}

function saveStoredFileSettings(data: WhiteLabelSettings) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write settings_data.json", e);
  }
}

export async function getWhiteLabelSettings(): Promise<WhiteLabelSettings> {
  let settings: WhiteLabelSettings = {
    ...DEFAULT_SETTINGS,
    ...getStoredFileSettings(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data, error } = await supabase.from("settings").select("key, value");
        if (!error && data && data.length > 0) {
          const dbObj: Record<string, any> = {};
          data.forEach((row: any) => {
            if (row.key && row.value !== null && row.value !== undefined) {
              dbObj[row.key] = row.value;
            }
          });
          settings = { ...settings, ...dbObj };
        }
      }
    } catch (e) {
      // Supabase settings table might not be present, graceful fallback
    }
  }

  return settings;
}

export async function saveWhiteLabelSettings(newSettings: Partial<WhiteLabelSettings>): Promise<void> {
  const current = await getWhiteLabelSettings();
  const merged: WhiteLabelSettings = {
    ...current,
    ...newSettings,
  };

  // 1. Simpan ke JSON file (persistent on server filesystem)
  saveStoredFileSettings(merged);

  // 2. Simpan ke Supabase jika tabel 'settings' tersedia
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        for (const [k, v] of Object.entries(newSettings)) {
          if (v !== undefined) {
            await supabase.from("settings").upsert({
              key: k,
              value: String(v ?? ""),
              group: "branding",
            }, { onConflict: "key" });
          }
        }
      }
    } catch (e) {
      console.warn("Could not upsert to Supabase settings table:", e);
    }
  }
}
