import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface AdminDashboardData {
  branchName: string;
  stats: {
    totalPilgrims: number;
    activeRegistrations: number;
    omsetReceived: number;
    outstanding: number;
  };
  monthly: {
    labels: string[];
    data: number[];
  };
  paymentStatus: {
    sukses: number;
    sebagian: number;
    belumBayar: number;
  };
  packagePilgrims: {
    labels: string[];
    data: number[];
  };
  upcomingDepartures: Array<{
    id: string;
    packageName: string;
    date: string;
    remainingQuota: number;
    badgeLabel: string;
    badgeColor: "green" | "teal" | "blue" | "purple";
  }>;
  announcements: Array<{
    id: string;
    title: string;
    date: string;
    body: string;
    badgeLabel: string;
    badgeColor: string;
  }>;
}

// Generate last 12 months buckets dynamically
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

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const { labels: monthlyLabels, keys: monthlyKeys } = getLast12Months();
  const monthlyData = new Array(12).fill(0);

  let totalPilgrims = 0;
  let activeRegistrations = 0;
  let omsetReceived = 0;
  let outstanding = 0;

  let suksesPayment = 0;
  let sebagianPayment = 0;
  let belumBayarPayment = 0;

  let packageLabels: string[] = [];
  let packageData: number[] = [];
  let upcomingDepartures: Array<{
    id: string;
    packageName: string;
    date: string;
    remainingQuota: number;
    badgeLabel: string;
    badgeColor: "green" | "teal" | "blue" | "purple";
  }> = [];

  let announcements: Array<{
    id: string;
    title: string;
    date: string;
    body: string;
    badgeLabel: string;
    badgeColor: string;
  }> = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        // 1. Total Pilgrims & Pilgrims monthly registration
        const { data: allPilgrims } = await supabase
          .from("pilgrims")
          .select("id, created_at");
        totalPilgrims = allPilgrims ? allPilgrims.length : 0;

        // 2. Active Registrations & Monthly counts
        const { data: regsData } = await supabase
          .from("registrations")
          .select("id, status, total_price, registered_at, package_id")
          .neq("status", "cancelled");

        activeRegistrations = regsData && regsData.length > 0 ? regsData.length : totalPilgrims;

        // Fill monthly data from registrations, and fallback/supplement with pilgrims registrations
        if (regsData && regsData.length > 0) {
          regsData.forEach((r: any) => {
            if (r.registered_at) {
              const ym = r.registered_at.slice(0, 7);
              const idx = monthlyKeys.indexOf(ym);
              if (idx !== -1) {
                monthlyData[idx]++;
              }
            }
          });
        } else if (allPilgrims && allPilgrims.length > 0) {
          allPilgrims.forEach((p: any) => {
            if (p.created_at) {
              const ym = p.created_at.slice(0, 7);
              const idx = monthlyKeys.indexOf(ym);
              if (idx !== -1) {
                monthlyData[idx]++;
              }
            }
          });
        }

        if (regsData && regsData.length > 0) {

          // Total tagihan
          const totalBilled = regsData.reduce((acc, curr) => acc + Number(curr.total_price || 0), 0);

          // 3. Payments
          const { data: paymentsData } = await supabase
            .from("payments")
            .select("amount, paid_amount, status");

          if (paymentsData && paymentsData.length > 0) {
            omsetReceived = paymentsData.reduce((acc, curr) => acc + Number(curr.paid_amount || 0), 0);
            outstanding = Math.max(0, totalBilled - omsetReceived);

            suksesPayment = paymentsData.filter((p) => p.status === "paid").length;
            sebagianPayment = paymentsData.filter((p) => p.status === "partial").length;
            belumBayarPayment = paymentsData.filter((p) => p.status === "unpaid" || p.status === "pending").length;
          } else {
            outstanding = totalBilled;
          }
        }

        // 4. Packages for charts & upcoming departures
        const todayStr = new Date().toISOString().split("T")[0];
        const { data: pkgs } = await supabase
          .from("packages")
          .select("id, name, quota, price, type, departure_date")
          .order("departure_date", { ascending: true });

        if (pkgs && pkgs.length > 0) {
          packageLabels = pkgs.map((p) => p.name);
          packageData = pkgs.map((p) => {
            return (regsData || []).filter((r) => r.package_id === p.id).length;
          });

          upcomingDepartures = pkgs
            .filter((p) => p.departure_date && p.departure_date >= todayStr)
            .slice(0, 5)
            .map((p) => {
              const badgeLabel = p.type === "haji" ? (p.name.includes("Plus") ? "Haji Plus" : "Haji") : "Umroh";
              let badgeColor: "green" | "teal" | "blue" | "purple" = "green";
              if (badgeLabel === "Haji Plus") badgeColor = "purple";
              else if (badgeLabel === "Haji") badgeColor = "blue";
              else if (p.name.includes("Turki")) badgeColor = "teal";

              const registered = (regsData || []).filter((r) => r.package_id === p.id).length;
              const remaining = Math.max(0, (p.quota || 0) - registered);

              return {
                id: String(p.id),
                packageName: p.name,
                date: new Date(p.departure_date).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }),
                remainingQuota: remaining,
                badgeLabel,
                badgeColor,
              };
            });
        }

        // 5. Announcements
        const { data: annData } = await supabase
          .from("announcements")
          .select("*")
          .limit(3);

        if (annData && annData.length > 0) {
          announcements = annData.map((a: any) => ({
            id: String(a.id),
            title: a.title,
            date: a.created_at
              ? new Date(a.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
              : "-",
            body: a.body,
            badgeLabel: a.audience === "all" ? "Semua Pengguna" : a.audience,
            badgeColor: "purple",
          }));
        }
      }
    } catch (e) {
      console.error("Error fetching admin dashboard data:", e);
    }
  }

  return {
    branchName: "Ringkasan Kantor Pusat Jakarta",
    stats: {
      totalPilgrims,
      activeRegistrations,
      omsetReceived,
      outstanding,
    },
    monthly: {
      labels: monthlyLabels,
      data: monthlyData,
    },
    paymentStatus: {
      sukses: suksesPayment,
      sebagian: sebagianPayment,
      belumBayar: belumBayarPayment,
    },
    packagePilgrims: {
      labels: packageLabels,
      data: packageData,
    },
    upcomingDepartures,
    announcements,
  };
}
