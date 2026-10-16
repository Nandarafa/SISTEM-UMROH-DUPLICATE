"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export async function createUserAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const branchId = formData.get("branch_id") as string;
    const phone = (formData.get("phone") as string) || "";
    const password = (formData.get("password") as string) || "password";
    const isActive = formData.get("is_active") === "on";

    if (!name || !email || !role) {
      return { error: "Nama, email, dan role wajib diisi." };
    }

    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const supabase = await createServerSupabase();
    if (!supabase) return { success: true };

    const { error } = await supabase.from("profiles").insert({
      name,
      email,
      role,
      branch_id: branchId && branchId !== "" ? branchId : null,
      phone,
      password,
      is_active: isActive,
    });

    if (error) {
      console.error("Create user error:", error);
      return { error: error.message };
    }

    revalidatePath("/users");
    return { success: true };
  } catch (err: any) {
    console.error("Error in createUserAction:", err);
    return { error: err.message || "Gagal membuat pengguna." };
  }
}

export async function deleteUserAction(id: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const supabase = await createServerSupabase();
    if (!supabase) return { success: true };

    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) {
      return { error: error.message };
    }

    revalidatePath("/users");
    return { success: true };
  } catch (err: any) {
    console.error("Error in deleteUserAction:", err);
    return { error: err.message || "Gagal menghapus pengguna." };
  }
}

export async function resetPasswordAction(id: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const supabase = await createServerSupabase();
    if (!supabase) return { success: true };

    await supabase.from("profiles").update({ password: "password" }).eq("id", id);
    revalidatePath("/users");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Gagal reset kata sandi." };
  }
}
