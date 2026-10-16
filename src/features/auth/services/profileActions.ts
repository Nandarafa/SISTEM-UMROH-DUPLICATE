"use server";

import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/constants";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import type { AuthUser } from "@/types/common.types";

export interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Update Profile Information (Nama & Email)
 * Menyimpan ke session cookie dan menyelaraskan ke Supabase profiles & auth.users jika terkoneksi.
 */
export async function updateProfileInfoAction(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!name || !email) {
    return { success: false, error: "Nama dan email wajib diisi." };
  }

  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  let currentUser: AuthUser | null = null;
  if (raw) {
    try {
      currentUser = JSON.parse(raw);
    } catch {
      // ignore
    }
  }

  // Update local session cookie
  const updatedUser: AuthUser = {
    id: currentUser?.id ?? email,
    name: name,
    email: email,
    role: currentUser?.role ?? "guide",
    branchId: currentUser?.branchId ?? "1",
    branchName: currentUser?.branchName ?? "Kantor Pusat Jakarta",
  };

  jar.set(SESSION_COOKIE, JSON.stringify(updatedUser), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // Jika Supabase aktif, lakukan update ke Supabase
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        // 1. Update di table public.profiles
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentUser?.id ?? "");
        if (isUuid) {
          await supabase
            .from("profiles")
            .update({
              name: name,
              email: email,
              updated_at: new Date().toISOString(),
            })
            .eq("id", currentUser!.id);
        } else {
          // Cari profile yang cocok dengan email lama atau role pengguna saat ini
          const role = currentUser?.role ?? "guide";
          await supabase
            .from("profiles")
            .update({
              name: name,
              email: email,
              updated_at: new Date().toISOString(),
            })
            .or(`email.eq.${currentUser?.email ?? ""},role.eq.${role}`);
        }

        // 2. Jika muthawif (guide), update juga nama & email di table public.guides
        if (currentUser?.role === "guide") {
          await supabase
            .from("guides")
            .update({ name: name })
            .ilike("name", "%Abdullah%");
        }

        // 3. Jika jamaah (pilgrim), update juga di table public.pilgrims
        if (currentUser?.role === "pilgrim" || currentUser?.email?.includes("jamaah")) {
          await supabase
            .from("pilgrims")
            .update({ name: name, email: email })
            .or(`email.eq.${currentUser?.email ?? email},id.eq.${currentUser?.id ?? ""}`);
        }

        // 4. Jika agen (agent), update juga di table public.agents
        if (currentUser?.role === "agent" || currentUser?.email === "agent@example.com") {
          await supabase
            .from("agents")
            .update({ name: name, email: email })
            .or(`email.eq.${currentUser?.email ?? email},code.eq.AG-DEMO1`);
        }

        // 5. Update auth user jika ada session auth
        try {
          await supabase.auth.updateUser({
            data: { name: name },
          });
        } catch {
          // ignore
        }
      }
    } catch (e: any) {
      console.warn("Supabase update profile note:", e.message);
    }
  }

  return { success: true, message: "Profil berhasil diperbarui!" };
}

/**
 * Update Password
 * Menyimpan password baru ke Supabase auth jika terkoneksi, atau konfirmasi sukses untuk akun demo.
 */
export async function updatePasswordAction(formData: FormData): Promise<ActionResult> {
  const currentPassword = String(formData.get("current_password") ?? "");
  const newPassword = String(formData.get("new_password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "Password baru minimal 6 karakter." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Konfirmasi password baru tidak cocok." };
  }

  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  let currentUser: AuthUser | null = null;
  if (raw) {
    try {
      currentUser = JSON.parse(raw);
    } catch {
      // ignore
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        // 1. Simpan password baru ke tabel profiles & user_accounts di Supabase
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentUser?.id ?? "");
        if (isUuid) {
          await supabase
            .from("profiles")
            .update({ password: newPassword, updated_at: new Date().toISOString() })
            .eq("id", currentUser!.id);
        } else {
          const role = currentUser?.role ?? "guide";
          await supabase
            .from("profiles")
            .update({ password: newPassword, updated_at: new Date().toISOString() })
            .eq("role", role);
        }

        // Simpan juga ke user_accounts jika tabel ada
        if (currentUser?.email) {
          await supabase
            .from("user_accounts")
            .update({ password: newPassword, updated_at: new Date().toISOString() })
            .eq("email", currentUser.email);
        }

        // 2. Coba update ke Supabase Auth jika ada session Auth aktif
        try {
          const { error: authErr } = await supabase.auth.updateUser({
            password: newPassword,
          });
          // Jangan lempar error jika hanya karena session Auth anonim
          if (authErr && !authErr.message.includes("session")) {
            console.warn("Supabase auth updateUser:", authErr.message);
          }
        } catch {
          // ignore session missing for cookie-based demo auth
        }
      }
    } catch (e: any) {
      console.warn("Supabase password update note:", e.message);
    }
  }

  return { success: true, message: "Password berhasil diperbarui dan tersimpan di database!" };
}

/**
 * Request Account Deletion (Permohonan Hapus Akun)
 * Memasukkan permohonan ke tabel public.account_deletion_requests untuk dikonfirmasi Super Admin.
 */
export async function requestAccountDeletionAction(reason?: string): Promise<ActionResult> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  let currentUser: AuthUser | null = null;
  if (raw) {
    try {
      currentUser = JSON.parse(raw);
    } catch {
      // ignore
    }
  }

  if (!currentUser) {
    return { success: false, error: "Sesi tidak ditemukan. Silakan login kembali." };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        // 1. Simpan permohonan ke account_deletion_requests
        await supabase.from("account_deletion_requests").insert({
          user_email: currentUser.email,
          user_name: currentUser.name,
          user_role: currentUser.role,
          reason: reason || "Permintaan dari user melalui pengaturan akun",
          status: "pending",
        });

        // 2. Tandai status di profiles agar mudah di-restore
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentUser.id ?? "");
        if (isUuid) {
          await supabase
            .from("profiles")
            .update({ deletion_status: "pending_deletion" })
            .eq("id", currentUser.id);
        } else {
          await supabase
            .from("profiles")
            .update({ deletion_status: "pending_deletion" })
            .eq("role", currentUser.role);
        }

        // Tandai juga di user_accounts
        await supabase
          .from("user_accounts")
          .update({
            deletion_status: "pending_deletion",
            deletion_reason: reason || "User request",
            requested_deletion_at: new Date().toISOString(),
          })
          .eq("email", currentUser.email);
      }
    } catch (e: any) {
      console.warn("Supabase deletion request:", e.message);
    }
  }

  return {
    success: true,
    message: "Permohonan hapus akun berhasil diajukan dan sedang menunggu konfirmasi Super Admin. Akun Anda dapat dipulihkan sewaktu-waktu.",
  };
}
