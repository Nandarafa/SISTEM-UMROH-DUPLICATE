import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface PaymentListItem {
  id: string;
  code: string;
  pilgrimName: string;
  packageName: string;
  type: string;
  typeLabel: string;
  typeColor: "blue" | "amber" | "green" | "gray";
  amount: number;
  paid_amount: number;
  outstanding: number;
  status: string;
  statusLabel: string;
  statusColor: "green" | "amber" | "red" | "gray";
  due_date: string;
  registration_id: string;
}

export function getPaymentTypeMeta(type: string) {
  switch (type) {
    case "dp":
      return { label: "Uang Muka (DP)", color: "blue" as const };
    case "installment":
      return { label: "Cicilan", color: "amber" as const };
    case "settlement":
      return { label: "Pelunasan", color: "green" as const };
    default:
      return { label: type || "-", color: "gray" as const };
  }
}

export function getPaymentStatusMeta(status: string) {
  switch (status) {
    case "paid":
      return { label: "Lunas", color: "green" as const };
    case "partial":
      return { label: "Sebagian", color: "amber" as const };
    case "unpaid":
      return { label: "Belum Bayar", color: "red" as const };
    default:
      return { label: status || "-", color: "gray" as const };
  }
}

export interface PaymentDetailData {
  registrationId: string;
  registrationCode: string;
  pilgrimName: string;
  totalBilled: number;
  totalPaid: number;
  outstanding: number;
  paymentStatusLabel: string;
  items: Array<{
    id: string;
    code: string;
    typeLabel: string;
    typeColor: "blue" | "amber" | "green" | "gray";
    statusLabel: string;
    statusColor: "green" | "amber" | "red" | "gray";
    amount: number;
    paid_amount: number;
    outstanding: number;
    due_date: string;
  }>;
}

export async function getPaymentsList(
  statusFilter?: string,
  typeFilter?: string,
  currentUser?: { id?: string; email?: string; name?: string; role?: string } | null
): Promise<PaymentListItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabase();
  if (!supabase) return [];

  try {
    let query = supabase
      .from("payments")
      .select("*, registrations(*, pilgrims(*), packages(*))")
      .order("due_date", { ascending: true });

    if (statusFilter && statusFilter !== "") {
      query = query.eq("status", statusFilter);
    }
    if (typeFilter && typeFilter !== "") {
      query = query.eq("type", typeFilter);
    }

    const { data: rawPayments, error } = await query;
    if (error || !rawPayments) {
      return [];
    }

    let payments = rawPayments;

    // Scope for pilgrim (Jamaah only sees their own bills)
    if (currentUser?.role === "pilgrim") {
      payments = payments.filter((p: any) => {
        const pilgrim = p.registrations?.pilgrims;
        if (!pilgrim) return false;
        if (currentUser.email && pilgrim.email?.toLowerCase() === currentUser.email?.toLowerCase()) return true;
        if (currentUser.name && pilgrim.name?.toLowerCase() === currentUser.name?.toLowerCase()) return true;
        if (currentUser.id && pilgrim.user_id === currentUser.id) return true;
        return false;
      });
    }

    return payments.map((p) => {
      const typeMeta = getPaymentTypeMeta(p.type);
      const statusMeta = getPaymentStatusMeta(p.status);
      const amt = Number(p.amount || 0);
      const paid = Number(p.paid_amount || 0);
      const outstanding = Math.max(0, amt - paid);

      return {
        id: p.id,
        code: p.code,
        pilgrimName: p.registrations?.pilgrims?.name || "-",
        packageName: p.registrations?.packages?.name || "-",
        type: p.type,
        typeLabel: typeMeta.label,
        typeColor: typeMeta.color,
        amount: amt,
        paid_amount: paid,
        outstanding,
        status: p.status,
        statusLabel: statusMeta.label,
        statusColor: statusMeta.color,
        due_date: p.due_date || "",
        registration_id: p.registration_id || p.registrations?.id || "",
      };
    });
  } catch (e) {
    console.error("Error in getPaymentsList:", e);
    return [];
  }
}

export async function getRegistrationPaymentsDetail(
  registrationIdOrCode: string
): Promise<PaymentDetailData | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabase();
  if (!supabase) return null;

  try {
    let regQuery = supabase
      .from("registrations")
      .select("*, pilgrims(*), packages(*), payments(*)");

    if (registrationIdOrCode.startsWith("REG-")) {
      regQuery = regQuery.eq("code", registrationIdOrCode);
    } else {
      regQuery = regQuery.or(`id.eq.${registrationIdOrCode},code.eq.${registrationIdOrCode}`);
    }

    const { data: reg, error } = await regQuery.maybeSingle();
    if (error || !reg) {
      return null;
    }

    const payments = reg.payments || [];
    payments.sort((a: any, b: any) => (a.code || "").localeCompare(b.code || ""));

    const totalBilled = Number(reg.total_price || 0);
    const totalPaid = payments.reduce((acc: number, p: any) => acc + Number(p.paid_amount || 0), 0);
    const outstanding = Math.max(0, totalBilled - totalPaid);

    let payStatusLabel = "Belum Bayar";
    if (totalPaid >= totalBilled && totalBilled > 0) {
      payStatusLabel = "Lunas";
    } else if (totalPaid > 0) {
      payStatusLabel = "Sebagian";
    }

    const items = payments.map((p: any) => {
      const typeMeta = getPaymentTypeMeta(p.type);
      const statusMeta = getPaymentStatusMeta(p.status);
      const amt = Number(p.amount || 0);
      const paid = Number(p.paid_amount || 0);
      const itemOutstanding = Math.max(0, amt - paid);

      return {
        id: p.id,
        code: p.code,
        typeLabel: typeMeta.label,
        typeColor: typeMeta.color,
        statusLabel: statusMeta.label,
        statusColor: statusMeta.color,
        amount: amt,
        paid_amount: paid,
        outstanding: itemOutstanding,
        due_date: p.due_date || "",
      };
    });

    return {
      registrationId: reg.id,
      registrationCode: reg.code,
      pilgrimName: reg.pilgrims?.name || "-",
      totalBilled,
      totalPaid,
      outstanding,
      paymentStatusLabel: payStatusLabel,
      items,
    };
  } catch (err) {
    console.error("Error in getRegistrationPaymentsDetail:", err);
    return null;
  }
}
