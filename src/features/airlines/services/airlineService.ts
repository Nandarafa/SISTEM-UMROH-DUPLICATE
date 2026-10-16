import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface AirlineItem {
  id: string;
  name: string;
  code: string;
  transit: string;
  is_active: boolean;
}

export async function getAirlinesList(search?: string): Promise<AirlineItem[]> {
  let list: AirlineItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        let q = supabase.from("airlines").select("*").order("name", { ascending: true });
        if (search && search.trim()) {
          q = q.ilike("name", `%${search.trim()}%`);
        }
        const { data, error } = await q;
        if (!error && data) {
          list = data.map((d: any) => ({
            id: String(d.id),
            name: d.name,
            code: d.code || "",
            transit: d.transit || "Langsung",
            is_active: d.is_active ?? true,
          }));
        }
      }
    } catch (e) {
      console.error("Error getAirlinesList:", e);
    }
  }

  return list;
}

export async function getAirlineDetail(id: string): Promise<AirlineItem | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data, error } = await supabase.from("airlines").select("*").eq("id", id).maybeSingle();
        if (!error && data) {
          return {
            id: String(data.id),
            name: data.name,
            code: data.code || "",
            transit: data.transit || "Langsung",
            is_active: data.is_active ?? true,
          };
        }
      }
    } catch (e) {
      console.error("Error getAirlineDetail:", e);
    }
  }

  return null;
}
