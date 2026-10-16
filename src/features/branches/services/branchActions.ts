"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export async function createBranchAction(formData: FormData) {
  const code = (formData.get("code") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const city = (formData.get("city") as string)?.trim() || null;
  const address = (formData.get("address") as string)?.trim() || null;
  const isActive = formData.get("is_active") === "1";
  const isHeadOffice = formData.get("is_head_office") === "1";

  if (!code || !name) {
    return { error: "Kode dan Nama Cabang wajib diisi." };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { error } = await supabase.from("branches").insert({
          code,
          name,
          phone,
          email,
          city,
          address,
          is_active: isActive,
          is_head_office: isHeadOffice,
        });

        if (error) {
          console.error("createBranchAction error:", error);
          return { error: error.message };
        }
      }
    } catch (err: any) {
      console.error("createBranchAction error:", err);
      return { error: err.message || "Gagal menyimpan cabang." };
    }
  }

  revalidatePath("/branches");
  redirect("/branches");
}

export async function updateBranchAction(id: string, formData: FormData) {
  const code = (formData.get("code") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const city = (formData.get("city") as string)?.trim() || null;
  const address = (formData.get("address") as string)?.trim() || null;
  const isActive = formData.get("is_active") === "1";
  const isHeadOffice = formData.get("is_head_office") === "1";

  if (!code || !name) {
    return { error: "Kode dan Nama Cabang wajib diisi." };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { error } = await supabase
          .from("branches")
          .update({
            code,
            name,
            phone,
            email,
            city,
            address,
            is_active: isActive,
            is_head_office: isHeadOffice,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) {
          console.error("updateBranchAction error:", error);
          return { error: error.message };
        }
      }
    } catch (err: any) {
      console.error("updateBranchAction error:", err);
      return { error: err.message || "Gagal mengupdate cabang." };
    }
  }

  revalidatePath("/branches");
  redirect("/branches");
}

export async function deleteBranchAction(id: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { error } = await supabase.from("branches").delete().eq("id", id);
        if (error) {
          console.error("deleteBranchAction error:", error);
          return { error: error.message };
        }
      }
    } catch (err: any) {
      console.error("deleteBranchAction error:", err);
      return { error: err.message || "Gagal menghapus cabang." };
    }
  }

  revalidatePath("/branches");
  return { success: true };
}
