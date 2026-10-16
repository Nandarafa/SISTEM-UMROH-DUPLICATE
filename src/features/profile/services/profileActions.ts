"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { getSessionUser } from "@/features/auth/services/authActions";
import { SESSION_COOKIE } from "@/lib/constants";

export async function updateProfileInfoAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!name || !email) {
    return { error: "Nama dan email wajib diisi." };
  }

  const currentUser = await getSessionUser();
  if (!currentUser) {
    return { error: "Sesi tidak ditemukan." };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        // Update profiles table
        const { error: profileErr } = await supabase
          .from("profiles")
          .update({ name, email })
          .eq("id", currentUser.id);

        if (profileErr) {
          console.error("Error updating profile in Supabase:", profileErr);
        }

        // Try updating auth user email if available
        try {
          await supabase.auth.updateUser({ email, data: { name } });
        } catch {}
      }
    } catch (e: any) {
      console.error("updateProfileInfoAction error:", e);
    }
  }

  // Update session cookie for instant update across UI
  try {
    const jar = await cookies();
    const updatedSession = {
      ...currentUser,
      name,
      email,
    };
    jar.set(SESSION_COOKIE, JSON.stringify(updatedSession), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });
  } catch {}

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updatePasswordAction(formData: FormData) {
  const currentPassword = String(formData.get("current_password") || "");
  const newPassword = String(formData.get("new_password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");

  if (!newPassword || newPassword.length < 6) {
    return { error: "Password baru minimal 6 karakter." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Konfirmasi password tidak cocok." };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          return { error: error.message };
        }
      }
    } catch (e: any) {
      return { error: e.message || "Gagal memperbarui password." };
    }
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function deleteAccountAction() {
  const currentUser = await getSessionUser();
  if (!currentUser) {
    return { error: "Sesi tidak ditemukan." };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        // Record deletion request or delete user profile
        await supabase.from("account_deletion_requests").insert([
          {
            user_id: currentUser.id,
            reason: "User requested deletion from profile page",
            status: "pending",
          },
        ]);
      }
    } catch {}
  }

  return { success: true };
}
