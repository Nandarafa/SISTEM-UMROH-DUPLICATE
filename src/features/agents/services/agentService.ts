import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface AgentItem {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  commission_rate: number;
  branch_id?: string;
  user_id?: string | null;
  has_account: boolean;
  is_active: boolean;
  address?: string;
}

export async function getAgentsList(search?: string, status?: string): Promise<AgentItem[]> {
  let list: AgentItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        let q = supabase.from("agents").select("*").order("name", { ascending: true });
        if (search && search.trim()) {
          q = q.or(`name.ilike.%${search.trim()}%,code.ilike.%${search.trim()}%`);
        }
        if (status === "active") {
          q = q.eq("is_active", true);
        } else if (status === "inactive") {
          q = q.eq("is_active", false);
        }

        const { data } = await q;
        if (data && data.length > 0) {
          list = data.map((d: any) => ({
            id: String(d.id),
            code: d.code,
            name: d.name,
            phone: d.phone || "-",
            email: d.email || "-",
            commission_rate: Number(d.commission_rate || 0),
            has_account: Boolean(d.user_id),
            is_active: d.is_active ?? true,
          }));
        }
      }
    } catch (e) {
      console.error("Error getAgentsList:", e);
    }
  }

  if (search && search.trim()) {
    const sLower = search.toLowerCase();
    list = list.filter((a) => a.name.toLowerCase().includes(sLower) || a.code.toLowerCase().includes(sLower));
  }

  if (status && status !== "ALL") {
    if (status === "active") list = list.filter((a) => a.is_active);
    else if (status === "inactive") list = list.filter((a) => !a.is_active);
  }

  return list;
}

export async function getAgentDetail(id: string): Promise<AgentItem | null> {
  const all = await getAgentsList();
  return all.find((a) => a.id === id || a.code === id) || null;
}
