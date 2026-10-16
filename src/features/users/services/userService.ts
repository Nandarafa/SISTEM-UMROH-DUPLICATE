import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface UserAccountItem {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "agent" | "pilgrim" | "guide";
  roleLabel: string;
  roleBadgeColor: "blue" | "emerald" | "amber" | "purple";
  branchId?: string;
  branchName: string;
  isActive: boolean;
  statusLabel: string;
  lastLogin: string;
}

export function getRoleMeta(role: string): { label: string; color: "blue" | "emerald" | "amber" | "purple" } {
  switch (role) {
    case "super_admin":
      return { label: "Super Admin", color: "purple" };
    case "admin":
      return { label: "Admin Cabang", color: "blue" };
    case "agent":
      return { label: "Agen / Marketing", color: "amber" };
    case "guide":
      return { label: "Muthawif", color: "purple" };
    case "pilgrim":
    default:
      return { label: "Jamaah", color: "emerald" };
  }
}

export async function getUsersList(search?: string, roleFilter?: string): Promise<UserAccountItem[]> {
  let list: UserAccountItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        let q = supabase
          .from("profiles")
          .select("*, branches(name)")
          .order("created_at", { ascending: false });

        if (roleFilter && roleFilter !== "ALL" && roleFilter !== "") {
          q = q.eq("role", roleFilter);
        }

        const { data: profiles, error } = await q;

        if (!error && profiles) {
          list = profiles.map((p: any) => {
            const meta = getRoleMeta(p.role);
            return {
              id: p.id,
              name: p.name,
              email: p.email || "-",
              role: p.role,
              roleLabel: meta.label,
              roleBadgeColor: meta.color,
              branchId: p.branch_id,
              branchName: p.branches?.name || "Kantor Pusat Jakarta",
              isActive: p.is_active ?? true,
              statusLabel: p.is_active ?? true ? "Aktif" : "Nonaktif",
              lastLogin: p.updated_at
                ? new Date(p.updated_at).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "-",
            };
          });
        }
      }
    } catch (e) {
      console.error("Error in getUsersList:", e);
    }
  }

  if (search && search.trim()) {
    const q = search.toLowerCase();
    list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }

  return list;
}

export async function getUserDetail(id: string): Promise<UserAccountItem | null> {
  const all = await getUsersList();
  return all.find((u) => u.id === id) || null;
}
