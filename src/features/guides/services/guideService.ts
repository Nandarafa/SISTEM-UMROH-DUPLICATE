import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface GuideItem {
  id: string;
  code: string;
  name: string;
  gender: "Laki-laki" | "Perempuan";
  phone: string;
  email: string;
  specialization: string;
  has_account: boolean;
  is_active: boolean;
}

export async function getGuidesList(search?: string, status?: string): Promise<GuideItem[]> {
  let list: GuideItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        let q = supabase.from("guides").select("*").order("name", { ascending: true });
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
          const { data: profiles } = await supabase.from("profiles").select("id, email, name, role");

          list = data.map((d: any) => {
            const isFemale = d.name?.toLowerCase().includes("ustadzah") || d.name?.toLowerCase().includes("khadijah");
            const matchedProfile = profiles?.find((p) => (d.user_id && p.id === d.user_id) || p.name?.toLowerCase() === d.name?.toLowerCase());

            let email = matchedProfile?.email || d.email || `${d.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`;
            let phone = d.phone || "-";

            return {
              id: String(d.id),
              code: d.code || "GD-DEMO",
              name: d.name,
              gender: isFemale ? "Perempuan" : "Laki-laki",
              phone,
              email,
              specialization: d.specialization || "Fiqih Manasik",
              has_account: Boolean(d.user_id || matchedProfile),
              is_active: d.is_active ?? true,
            };
          });
        }
      }
    } catch (e) {
      console.error("Error getGuidesList:", e);
    }
  }

  if (search && search.trim()) {
    const sLower = search.toLowerCase();
    list = list.filter((g) => g.name.toLowerCase().includes(sLower) || g.code.toLowerCase().includes(sLower));
  }

  if (status && status !== "ALL") {
    if (status === "active") list = list.filter((g) => g.is_active);
    else if (status === "inactive") list = list.filter((g) => !g.is_active);
  }

  return list;
}

export async function getGuideDetail(id: string): Promise<GuideItem | null> {
  const all = await getGuidesList();
  return all.find((g) => g.id === id || g.code === id) || null;
}

export async function getGuideOptions(): Promise<{ id: string; name: string }[]> {
  const guides = await getGuidesList();
  return guides.map((g) => ({ id: g.id, name: `${g.name} (${g.specialization || "Muthawif"})` }));
}
