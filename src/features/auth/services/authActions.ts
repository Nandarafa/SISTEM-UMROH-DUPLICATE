"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_ACCOUNTS, SESSION_COOKIE } from "@/lib/constants";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import type { AuthUser } from "@/types/common.types";

export async function getSessionUser(): Promise<AuthUser | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (raw) {
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  if (!isSupabaseConfigured()) return null;
  const supabase = await createServerSupabase();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role, branch_id, branches(name)")
    .eq("id", user.id)
    .maybeSingle();
  return {
    id: user.id,
    name: profile?.name ?? user.email ?? "Pengguna",
    email: user.email ?? "",
    role: (profile?.role ?? "pilgrim") as AuthUser["role"],
    branchId: profile?.branch_id ?? null,
  };
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) redirect("/dashboard");
    }
  }

  const demo = DEMO_ACCOUNTS.find((a) => a.email === email && a.password === password);
  if (!demo) {
    redirect("/login?error=1");
  }

  const user: AuthUser = {
    id: demo.email,
    name: demo.name,
    email: demo.email,
    role: demo.role,
    branchId: demo.branchId,
    branchName: demo.branchId === "1" ? "Kantor Pusat Jakarta" : undefined,
  };
  const jar = await cookies();
  jar.set(SESSION_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  try {
    const { recordActivityLog } = await import("@/features/activity-logs/services/activityLogService");
    await recordActivityLog("login", `Pengguna ${user.name} (${user.email}) berhasil masuk ke sistem`, "Auth");
  } catch (e) {
    console.error("Failed to log login:", e);
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  try {
    const { recordActivityLog } = await import("@/features/activity-logs/services/activityLogService");
    const user = await getSessionUser();
    if (user) {
      await recordActivityLog("updated", `Pengguna ${user.name} (${user.email}) keluar dari sistem`, "Auth");
    }
  } catch {}

  const supabase = await createServerSupabase();
  if (supabase) await supabase.auth.signOut();
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/login");
}
