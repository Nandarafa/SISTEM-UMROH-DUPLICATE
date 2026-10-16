import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface BankAccountItem {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  branch_office?: string;
  branch_id?: string;
  branch_name?: string;
  is_active: boolean;
}

export interface BranchOption {
  id: string;
  name: string;
}

export async function getBankAccountsList(search?: string): Promise<BankAccountItem[]> {
  let list: BankAccountItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        let q = supabase
          .from("bank_accounts")
          .select("*, branches(id, name, code)")
          .order("bank_name", { ascending: true });

        if (search && search.trim()) {
          q = q.ilike("bank_name", `%${search.trim()}%`);
        }

        const { data, error } = await q;
        if (!error && data) {
          list = data.map((d: any) => ({
            id: String(d.id),
            bank_name: d.bank_name,
            account_number: d.account_number,
            account_holder: d.account_holder,
            branch_office: d.branch_office || "-",
            branch_id: d.branch_id,
            branch_name: d.branches?.name || "Kantor Pusat Jakarta",
            is_active: d.is_active ?? true,
          }));
        }
      }
    } catch (e) {
      console.error("Error in getBankAccountsList:", e);
    }
  }

  if (search && search.trim()) {
    const sLower = search.toLowerCase();
    list = list.filter((b) => b.bank_name.toLowerCase().includes(sLower) || b.account_number.includes(sLower));
  }

  return list;
}

export async function getBankAccountDetail(id: string): Promise<BankAccountItem | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("bank_accounts")
          .select("*, branches(id, name, code)")
          .eq("id", id)
          .maybeSingle();

        if (!error && data) {
          return {
            id: String(data.id),
            bank_name: data.bank_name,
            account_number: data.account_number,
            account_holder: data.account_holder,
            branch_office: data.branch_office || "-",
            branch_id: data.branch_id,
            branch_name: data.branches?.name || "Kantor Pusat Jakarta",
            is_active: data.is_active ?? true,
          };
        }
      }
    } catch (e) {
      console.error("Error in getBankAccountDetail:", e);
    }
  }

  return null;
}

export async function getBranchesOptions(): Promise<BranchOption[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }
  const supabase = await createServerSupabase();
  if (!supabase) return [];

  try {
    const { data } = await supabase.from("branches").select("id, name").order("name", { ascending: true });
    return (data || []).map((b: any) => ({ id: b.id, name: b.name }));
  } catch {
    return [];
  }
}

export const getBranchOptions = getBranchesOptions;

