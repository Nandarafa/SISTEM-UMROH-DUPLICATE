import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface AgentDashboardData {
  hasProfile: boolean;
  agent: {
    id: string;
    name: string;
    code: string;
    email: string;
  };
  stats: {
    referrals: number;
    commission_total: number;
    commission_paid: number;
    commission_pending: number;
  };
  monthly: {
    labels: string[];
    data: number[];
  };
  paymentStatus: {
    labels: string[];
    data: number[];
  };
  announcements: Array<{
    id: string;
    title: string;
    date: string;
    body: string;
    badgeColor: "gray" | "green" | "amber" | "blue" | "teal" | "purple";
    badgeLabel: string;
  }>;
}

function getLast12Months() {
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
  const labels: string[] = [];
  const keys: string[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yr = String(d.getFullYear()).slice(-2);
    labels.push(`${months[d.getMonth()]} ${yr}`);
    const monthStr = String(d.getMonth() + 1).padStart(2, "0");
    keys.push(`${d.getFullYear()}-${monthStr}`);
  }

  return { labels, keys };
}

export async function getAgentDashboardData(): Promise<AgentDashboardData> {
  const { labels: monthlyLabels, keys: monthlyKeys } = getLast12Months();
  const monthlyData = new Array(12).fill(0);

  let hasProfile = false;
  let agentInfo = {
    id: "",
    name: "Agen Travel",
    code: "AG-0000",
    email: "agent@example.com",
  };

  let referrals = 0;
  let commission_total = 0;
  let commission_paid = 0;
  let commission_pending = 0;
  let paidCount = 0;
  let partialCount = 0;
  let unpaidCount = 0;

  let announcements: Array<{
    id: string;
    title: string;
    date: string;
    body: string;
    badgeColor: "gray" | "green" | "amber" | "blue" | "teal" | "purple";
    badgeLabel: string;
  }> = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        // Fetch agent
        const { data: agentData } = await supabase
          .from("agents")
          .select("*")
          .eq("email", "agent@example.com")
          .limit(1)
          .maybeSingle();

        if (agentData) {
          hasProfile = true;
          agentInfo = {
            id: String(agentData.id),
            name: agentData.name,
            code: agentData.code,
            email: agentData.email,
          };

          // Referrals count
          const { count: refCount } = await supabase
            .from("registrations")
            .select("*", { count: "exact", head: true })
            .eq("agent_id", agentData.id)
            .neq("status", "cancelled");

          referrals = refCount || 0;

          // Commissions
          const { data: comms } = await supabase
            .from("commissions")
            .select("amount, status, registrations ( registered_at )")
            .eq("agent_id", agentData.id);

          if (comms && comms.length > 0) {
            commission_total = comms.reduce((acc, c) => acc + Number(c.amount || 0), 0);
            commission_paid = comms.filter((c) => c.status === "paid").reduce((acc, c) => acc + Number(c.amount || 0), 0);
            commission_pending = Math.max(0, commission_total - commission_paid);

            comms.forEach((c: any) => {
              const regDate = (c.registrations as any)?.registered_at;
              const ym = regDate ? regDate.slice(0, 7) : monthlyKeys[monthlyKeys.length - 1];
              const idx = monthlyKeys.indexOf(ym);
              if (idx !== -1) {
                monthlyData[idx] += Number(c.amount || 0);
              }
            });
          }

          // Registration payment status
          const { data: regs } = await supabase
            .from("registrations")
            .select("id, total_price, payments ( amount, paid_amount, status )")
            .eq("agent_id", agentData.id)
            .neq("status", "cancelled");

          if (regs) {
            regs.forEach((r: any) => {
              const payments = r.payments || [];
              const totalBilled = Number(r.total_price || 0);
              const totalPaid = payments.reduce(
                (acc: number, p: any) => acc + Number(p.paid_amount || 0),
                0
              );
              if (totalPaid >= totalBilled && totalBilled > 0) {
                paidCount++;
              } else if (totalPaid > 0) {
                partialCount++;
              } else {
                unpaidCount++;
              }
            });
          }
        }

        // Announcements
        const { data: annData } = await supabase
          .from("announcements")
          .select("*")
          .or("audience.eq.all,audience.eq.agent")
          .order("id", { ascending: false })
          .limit(3);

        if (annData && annData.length > 0) {
          announcements = annData.map((a: any) => ({
            id: String(a.id),
            title: a.title,
            date: a.created_at
              ? new Date(a.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
              : "-",
            body: a.body,
            badgeColor: "teal",
            badgeLabel: a.audience === "agent" ? "Agen" : "Semua Pengguna",
          }));
        }
      }
    } catch (e) {
      console.error("Error in getAgentDashboardData:", e);
    }
  }

  return {
    hasProfile,
    agent: agentInfo,
    stats: {
      referrals,
      commission_total,
      commission_paid,
      commission_pending,
    },
    monthly: {
      labels: monthlyLabels,
      data: monthlyData,
    },
    paymentStatus: {
      labels: ["Lunas", "Sebagian", "Belum Bayar"],
      data: [paidCount, partialCount, unpaidCount],
    },
    announcements,
  };
}
