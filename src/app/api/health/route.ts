import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/utils";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    supabaseConfigured: isSupabaseConfigured(),
  });
}
