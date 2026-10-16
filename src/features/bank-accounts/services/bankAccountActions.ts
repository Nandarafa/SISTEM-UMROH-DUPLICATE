"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createBankAccountAction(formData: FormData) {
  const bankName = String(formData.get("bank_name") || "").trim();
  const accountNumber = String(formData.get("account_number") || "").trim();
  const accountHolder = String(formData.get("account_holder") || "").trim();
  const branchId = String(formData.get("branch_id") || "").trim();
  const isActiveRaw = formData.get("is_active");
  const isActive = isActiveRaw === "1" || isActiveRaw === "on";

  if (!bankName || !accountNumber || !accountHolder) {
    return { success: false, error: "Nama bank, no rekening, dan atas nama wajib diisi" };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const payload: any = {
          bank_name: bankName,
          account_number: accountNumber,
          account_holder: accountHolder,
          is_active: isActive,
        };
        if (branchId) {
          payload.branch_id = branchId;
        }

        const { error } = await supabase.from("bank_accounts").insert([payload]);
        if (error) {
          console.error("Supabase insert bank_accounts error:", error);
          return { success: false, error: error.message };
        }
      }
    } catch (e: any) {
      console.error("Error creating bank account:", e);
      return { success: false, error: e?.message || "Gagal menyimpan rekening bank" };
    }
  }

  revalidatePath("/bank-accounts");
  return { success: true };
}

export async function updateBankAccountAction(id: string, formData: FormData) {
  const bankName = String(formData.get("bank_name") || "").trim();
  const accountNumber = String(formData.get("account_number") || "").trim();
  const accountHolder = String(formData.get("account_holder") || "").trim();
  const branchId = String(formData.get("branch_id") || "").trim();
  const isActiveRaw = formData.get("is_active");
  const isActive = isActiveRaw === "1" || isActiveRaw === "on";

  if (!bankName || !accountNumber || !accountHolder) {
    return { success: false, error: "Nama bank, no rekening, dan atas nama wajib diisi" };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const payload: any = {
          bank_name: bankName,
          account_number: accountNumber,
          account_holder: accountHolder,
          is_active: isActive,
        };
        if (branchId) {
          payload.branch_id = branchId;
        }

        const { error } = await supabase
          .from("bank_accounts")
          .update(payload)
          .eq("id", id);

        if (error) {
          console.error("Supabase update bank_accounts error:", error);
          return { success: false, error: error.message };
        }
      }
    } catch (e: any) {
      console.error("Error updating bank account:", e);
      return { success: false, error: e?.message || "Gagal memperbarui rekening bank" };
    }
  }

  revalidatePath("/bank-accounts");
  return { success: true };
}

export async function deleteBankAccountAction(id: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { error } = await supabase.from("bank_accounts").delete().eq("id", id);
        if (error) {
          console.error("Supabase delete bank_accounts error:", error);
          return { success: false, error: error.message };
        }
      }
    } catch (e: any) {
      console.error("Error deleting bank account:", e);
      return { success: false, error: e?.message || "Gagal menghapus rekening bank" };
    }
  }

  revalidatePath("/bank-accounts");
  return { success: true };
}
