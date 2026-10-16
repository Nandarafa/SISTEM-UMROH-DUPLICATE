import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface HotelItem {
  id: string;
  name: string;
  city: "Mekah" | "Madinah";
  star: number;
  distance_to_masjid: number;
  description?: string;
  is_active: boolean;
}

export async function getHotelsList(search?: string, city?: string): Promise<HotelItem[]> {
  let list: HotelItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        let q = supabase.from("hotels").select("*").order("name", { ascending: true });
        if (city && city !== "ALL") {
          q = q.eq("city", city);
        }
        if (search && search.trim()) {
          q = q.ilike("name", `%${search.trim()}%`);
        }
        const { data, error } = await q;
        if (!error && data) {
          list = data.map((d: any) => ({
            id: String(d.id),
            name: d.name,
            city: d.city,
            star: Number(d.star || 4),
            distance_to_masjid: Number(d.distance_to_masjid || 100),
            description: d.description || "",
            is_active: d.is_active ?? true,
          }));
        }
      }
    } catch (e) {
      console.error("Error getHotelsList:", e);
    }
  }

  return list;
}

export async function getHotelDetail(id: string): Promise<HotelItem | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data, error } = await supabase.from("hotels").select("*").eq("id", id).maybeSingle();
        if (!error && data) {
          return {
            id: String(data.id),
            name: data.name,
            city: data.city,
            star: Number(data.star || 4),
            distance_to_masjid: Number(data.distance_to_masjid || 100),
            description: data.description || "",
            is_active: data.is_active ?? true,
          };
        }
      }
    } catch (e) {
      console.error("Error getHotelDetail:", e);
    }
  }

  return null;
}
