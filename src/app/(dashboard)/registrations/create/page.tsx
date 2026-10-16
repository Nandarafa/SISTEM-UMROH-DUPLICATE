import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured, currency } from "@/lib/utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/features/auth/services/authActions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CreateRegistrationPage() {
  const user = await getSessionUser();
  const isStaff = user?.role === "super_admin" || user?.role === "admin";
  const isAgent = user?.role === "agent";

  // In Laravel, RegistrationPolicy::create allows only staff or agents.
  if (!isStaff && !isAgent) {
    redirect("/registrations");
  }

  let pilgrims: Array<{ id: string; name: string; code: string }> = [];
  let packages: Array<{ id: string; name: string; price: number; quota: number }> = [];
  let guides: Array<{ id: string; name: string }> = [];
  let agents: Array<{ id: string; name: string; code: string }> = [];
  let currentAgentId: string | null = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        let pilgrimQuery = supabase
          .from("pilgrims")
          .select("id, name, code, agent_id")
          .order("name", { ascending: true });

        // If agent, allow selecting their own referrals OR any pilgrim without an agent assigned
        if (isAgent) {
          const { data: myAgent } = await supabase
            .from("agents")
            .select("id")
            .eq("email", user?.email || "agent@example.com")
            .maybeSingle();

          if (myAgent) {
            currentAgentId = myAgent.id;
            pilgrimQuery = pilgrimQuery.or(`agent_id.eq.${myAgent.id},agent_id.is.null`);
          }
        }

        const { data: dbPilgrims } = await pilgrimQuery;
        if (dbPilgrims) {
          pilgrims = dbPilgrims.map((p: any) => ({
            id: String(p.id),
            name: p.name,
            code: p.code || "JM-0000",
          }));
        }

        const { data: dbPackages } = await supabase
          .from("packages")
          .select("id, name, price, quota")
          .eq("status", "active")
          .order("price", { ascending: false });

        if (dbPackages) {
          packages = dbPackages.map((pkg: any) => ({
            id: String(pkg.id),
            name: pkg.name,
            price: Number(pkg.price || 0),
            quota: Number(pkg.quota || 0),
          }));
        }

        const { data: dbGuides } = await supabase
          .from("guides")
          .select("id, name")
          .eq("is_active", true)
          .order("name", { ascending: true });

        if (dbGuides) {
          guides = dbGuides.map((g: any) => ({
            id: String(g.id),
            name: g.name,
          }));
        }

        const { data: dbAgents } = await supabase
          .from("agents")
          .select("id, name, code")
          .eq("is_active", true)
          .order("name", { ascending: true });

        if (dbAgents) {
          agents = dbAgents.map((a: any) => ({
            id: String(a.id),
            name: a.name,
            code: a.code || "AG-0000",
          }));
        }
      }
    } catch (e) {
      console.error("Error loading create registration form data:", e);
    }
  }

  async function handleCreate(formData: FormData) {
    "use server";
    const pilgrimId = String(formData.get("pilgrim_id") || "");
    const packageId = String(formData.get("package_id") || "");
    const guideId = String(formData.get("guide_id") || "");
    const formAgentId = String(formData.get("agent_id") || "").trim();
    const registeredAt = String(formData.get("registered_at") || "");
    const notes = String(formData.get("notes") || "");

    if (!pilgrimId || !packageId) {
      return;
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabase();
        if (supabase) {
          // get package price
          const { data: pkg } = await supabase
            .from("packages")
            .select("price, branch_id")
            .eq("id", packageId)
            .maybeSingle();
          const totalPrice = Number(pkg?.price || 0);
          const branchId = pkg?.branch_id || null;

          const currentUser = await getSessionUser();
          let agentId: string | null = formAgentId || null;

          if (currentUser?.role === "agent") {
            const { data: myAgent } = await supabase
              .from("agents")
              .select("id")
              .eq("email", currentUser.email)
              .maybeSingle();
            agentId = myAgent?.id || agentId;
          }

          // If pilgrim has an agent assigned, use it if not specified
          if (!agentId && pilgrimId) {
            const { data: pilgrimData } = await supabase
              .from("pilgrims")
              .select("agent_id")
              .eq("id", pilgrimId)
              .maybeSingle();
            if (pilgrimData?.agent_id) {
              agentId = pilgrimData.agent_id;
            }
          }

          // Link pilgrim to this agent if they don't have one
          if (agentId && pilgrimId) {
            await supabase
              .from("pilgrims")
              .update({ agent_id: agentId })
              .eq("id", pilgrimId);
          }

          const { count } = await supabase.from("registrations").select("*", { count: "exact", head: true });
          const code = `REG-${String((count || 0) + 1).padStart(5, "0")}`;

          const regPayload: Record<string, any> = {
            code,
            branch_id: branchId,
            pilgrim_id: pilgrimId,
            package_id: packageId,
            agent_id: agentId,
            guide_id: guideId || null,
            total_price: totalPrice,
            registered_at: registeredAt || new Date().toISOString().split("T")[0],
            status: "confirmed",
          };

          const { data: reg, error: regError } = await supabase
            .from("registrations")
            .insert([regPayload])
            .select()
            .single();

          if (regError) {
            console.error("Supabase insert registration error:", regError);
          }

          // Automatically calculate and create commission for agent
          if (!regError && reg && agentId) {
            const { data: agentRow } = await supabase
              .from("agents")
              .select("commission_rate")
              .eq("id", agentId)
              .maybeSingle();

            const rate = Number(agentRow?.commission_rate || 7.5);
            const commAmount = Math.round((totalPrice * rate) / 100);

            await supabase.from("commissions").insert([
              {
                branch_id: branchId,
                agent_id: agentId,
                registration_id: reg.id,
                amount: commAmount,
                status: "pending",
              },
            ]);
          }

          try {
            const { recordActivityLog } = await import("@/features/activity-logs/services/activityLogService");
            await recordActivityLog(
              "created",
              `Mendaftarkan jamaah ke paket dengan kode pendaftaran ${code}`,
              "Registration",
              reg?.id
            );
          } catch (e) {
            console.error("Failed to record activity log for registration:", e);
          }
        }
      } catch (err) {
        console.error("Error creating registration in Supabase:", err);
      }
    }

    revalidatePath("/registrations");
    revalidatePath("/commissions");
    revalidatePath("/dashboard");
    redirect("/registrations");
  }

  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/registrations" className="hover:text-gray-600">Pendaftaran</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Daftarkan</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Daftarkan Jamaah</h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-2xl">
        <form action={handleCreate} className="space-y-4">
          {/* Hidden agent ID for logged in agent */}
          {isAgent && currentAgentId && (
            <input type="hidden" name="agent_id" value={currentAgentId} />
          )}

          {/* Jamaah */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Jamaah <span className="text-red-500">*</span>
            </label>
            <select
              name="pilgrim_id"
              required
              defaultValue=""
              className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 bg-white text-gray-700 focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488] focus:outline-none"
            >
              <option value="" disabled>
                — Pilih Jamaah —
              </option>
              {pilgrims.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>

          {/* Paket */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Paket <span className="text-red-500">*</span>
            </label>
            <select
              name="package_id"
              required
              defaultValue=""
              className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 bg-white text-gray-700 focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488] focus:outline-none"
            >
              <option value="" disabled>
                — Pilih Paket —
              </option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} — sisa {pkg.quota} — {currency(pkg.price)}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400 mt-1">Hanya paket berstatus terbuka yang ditampilkan.</p>
          </div>

          {/* Agen Referral (Opsional, untuk Admin/Staff) */}
          {!isAgent && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Agen Referral (opsional)
              </label>
              <select
                name="agent_id"
                defaultValue=""
                className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 bg-white text-gray-700 focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488] focus:outline-none"
              >
                <option value="">— Tanpa Agen (Langsung) —</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.code})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-gray-400 mt-1">
                Komisi agen akan dihitung otomatis saat pendaftaran disimpan.
              </p>
            </div>
          )}

          {/* Pembimbing & Tanggal Daftar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Pembimbing (opsional)
              </label>
              <select
                name="guide_id"
                defaultValue=""
                className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 bg-white text-gray-700 focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488] focus:outline-none"
              >
                <option value="">— Tanpa Pembimbing —</option>
                {guides.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Tanggal Daftar <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="registered_at"
                defaultValue={todayDate}
                required
                className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 bg-white text-gray-700 focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488] focus:outline-none"
              />
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Catatan
            </label>
            <textarea
              name="notes"
              rows={4}
              placeholder=""
              className="w-full rounded-lg border border-gray-300 text-sm px-3.5 py-2.5 focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488] focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#0d9488] text-white text-sm font-medium hover:bg-teal-700 transition shadow-sm cursor-pointer"
            >
              Daftarkan
            </button>
            <Link
              href="/registrations"
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
