import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/utils";

export function createClient() {
  if (!isSupabaseConfigured()) return null;
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  return createBrowserClient(
    cleanUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
