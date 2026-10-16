import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface BranchItem {
  id: string;
  code: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  is_active: boolean;
  is_head_office: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getBranchesList(searchQuery?: string): Promise<BranchItem[]> {
  let list: BranchItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        let query = supabase.from("branches").select("*").order("created_at", { ascending: true });
        const { data, error } = await query;
        if (!error && data) {
          list = data.map((b: any) => ({
            id: b.id,
            code: b.code,
            name: b.name,
            phone: b.phone,
            email: b.email,
            address: b.address,
            city: b.city,
            is_active: b.is_active ?? true,
            is_head_office: b.is_head_office ?? false,
            created_at: b.created_at,
            updated_at: b.updated_at,
          }));
        }
      }
    } catch (e) {
      console.error("Error in getBranchesList:", e);
    }
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    list = list.filter((b) => b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q));
  }

  return list;
}

export async function getBranchDetail(id: string): Promise<BranchItem | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data, error } = await supabase.from("branches").select("*").eq("id", id).maybeSingle();
        if (!error && data) {
          return {
            id: data.id,
            code: data.code,
            name: data.name,
            phone: data.phone,
            email: data.email,
            address: data.address,
            city: data.city,
            is_active: data.is_active ?? true,
            is_head_office: data.is_head_office ?? false,
          };
        }
      }
    } catch (e) {
      console.error("Error in getBranchDetail:", e);
    }
  }

  const all = await getBranchesList();
  return all.find((b) => b.id === id) || null;
}
