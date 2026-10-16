import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface CommissionItem {
  id: string;
  agentName: string;
  pilgrimName: string;
  packageName: string;
  basePrice: number;
  ratePercent: number;
  commissionAmount: number;
  status: "pending" | "approved" | "paid" | "cancelled";
}

export interface CommissionStats {
  pendingAmount: number;
  pendingCount: number;
  approvedAmount: number;
  approvedCount: number;
  paidAmount: number;
  paidCount: number;
  cancelledAmount: number;
  cancelledCount: number;
}

export async function getCommissions(
  statusFilter?: string,
  agentFilter?: string
): Promise<{ items: CommissionItem[]; stats: CommissionStats; agentsList: string[] }> {
  let items: CommissionItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data: comms, error } = await supabase
          .from("commissions")
          .select(`
            id,
            amount,
            status,
            agents ( name ),
            registrations (
              id,
              code,
              total_price,
              pilgrims ( name ),
              packages ( name, price )
            )
          `);

        if (!error && comms) {
          items = comms.map((c: any) => {
            const basePrice = Number(c.registrations?.total_price || c.registrations?.packages?.price || 0);
            const amt = Number(c.amount || 0);
            const rate = basePrice > 0 ? (amt / basePrice) * 100 : 0;

            return {
              id: String(c.id),
              agentName: c.agents?.name || "-",
              pilgrimName: c.registrations?.pilgrims?.name || "-",
              packageName: c.registrations?.packages?.name || "-",
              basePrice,
              ratePercent: Number(rate.toFixed(2)),
              commissionAmount: amt,
              status: (c.status || "pending") as any,
            };
          });
        }
      }
    } catch (err) {
      console.error("Error fetching commissions:", err);
    }
  }

  const stats: CommissionStats = {
    pendingAmount: 0,
    pendingCount: 0,
    approvedAmount: 0,
    approvedCount: 0,
    paidAmount: 0,
    paidCount: 0,
    cancelledAmount: 0,
    cancelledCount: 0,
  };

  items.forEach((item) => {
    if (item.status === "pending") {
      stats.pendingAmount += item.commissionAmount;
      stats.pendingCount += 1;
    } else if (item.status === "approved") {
      stats.approvedAmount += item.commissionAmount;
      stats.approvedCount += 1;
    } else if (item.status === "paid") {
      stats.paidAmount += item.commissionAmount;
      stats.paidCount += 1;
    } else if (item.status === "cancelled") {
      stats.cancelledAmount += item.commissionAmount;
      stats.cancelledCount += 1;
    }
  });

  const agentsList = Array.from(new Set(items.map((i) => i.agentName)));

  let filteredItems = items;
  if (statusFilter && statusFilter !== "ALL" && statusFilter !== "") {
    filteredItems = filteredItems.filter((i) => i.status === statusFilter);
  }
  if (agentFilter && agentFilter !== "ALL" && agentFilter !== "") {
    filteredItems = filteredItems.filter((i) => i.agentName.toLowerCase() === agentFilter.toLowerCase());
  }

  return { items: filteredItems, stats, agentsList };
}
