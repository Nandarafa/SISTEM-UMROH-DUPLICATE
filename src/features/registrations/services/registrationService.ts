import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface RegistrationListItem {
  id: string;
  code: string;
  pilgrimName: string;
  packageName: string;
  status: string;
  statusLabel: string;
  statusColor: "amber" | "blue" | "teal" | "green" | "purple" | "red" | "gray";
  totalPrice: number;
  totalPaid: number;
  registeredAt: string;
  registeredAtFormatted?: string;
  paymentStatus: string;
  paymentStatusLabel: string;
  paymentStatusColor: "green" | "amber" | "red" | "gray";
}

export interface RegistrationDetailData {
  id: string;
  code: string;
  status: string;
  statusLabel: string;
  statusColor: "amber" | "blue" | "teal" | "green" | "purple" | "red" | "gray";
  totalPrice: number;
  totalBilled: number;
  total_price: number;
  totalPaid: number;
  outstanding: number;
  registeredAt: string;
  registered_at?: string;
  notes?: string;
  paymentStatus?: string;
  paymentStatusLabel?: string;
  pilgrim: {
    id: string;
    code: string;
    name: string;
    nik?: string;
    phone?: string;
    email?: string;
    passportNumber?: string;
    passport_number?: string;
  };
  package: {
    id: string;
    name: string;
    typeLabel: string;
    typeColor?: "teal" | "purple" | "blue" | "gray";
    price: number;
    departureDate: string;
    departure_date?: string;
    durationDays: number;
  };
  branchName: string;
  guideName?: string;
  agentName?: string;
  payments: Array<{
    id: string;
    code: string;
    typeLabel: string;
    typeColor: "blue" | "amber" | "green" | "gray";
    amount: number;
    paid_amount: number;
    statusLabel: string;
    statusColor: "green" | "amber" | "red" | "gray";
    due_date: string;
  }>;
}

export function getRegistrationStatusMeta(status: string) {
  switch (status) {
    case "confirmed":
      return { label: "Dikonfirmasi", color: "blue" as const };
    case "pending":
      return { label: "Menunggu", color: "amber" as const };
    case "document_complete":
      return { label: "Dokumen Lengkap", color: "teal" as const };
    case "paid":
      return { label: "Lunas", color: "green" as const };
    case "departed":
      return { label: "Berangkat", color: "purple" as const };
    case "cancelled":
      return { label: "Dibatalkan", color: "red" as const };
    default:
      return { label: status || "-", color: "gray" as const };
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

export async function getRegistrationsList(
  statusFilter?: string,
  packageFilter?: string,
  currentUser?: { role: string; email: string; id: string } | null
): Promise<{ items: RegistrationListItem[]; packages: Array<{ id: string; name: string }> }> {
  if (!isSupabaseConfigured()) {
    return { items: [], packages: [] };
  }

  const supabase = await createServerSupabase();
  if (!supabase) return { items: [], packages: [] };

  try {
    const { data: pkgData } = await supabase
      .from("packages")
      .select("id, name")
      .order("name", { ascending: true });

    const packages = pkgData || [];

    let query = supabase
      .from("registrations")
      .select("*, pilgrims(*), packages(*), payments(*)")
      .order("registered_at", { ascending: false });

    // Scope based on user role matching Laravel AccessContext
    if (currentUser?.role === "pilgrim") {
      // Find linked pilgrim id
      const { data: myPilgrim } = await supabase
        .from("pilgrims")
        .select("id")
        .eq("email", currentUser.email)
        .maybeSingle();

      if (!myPilgrim) {
        return { items: [], packages };
      }
      query = query.eq("pilgrim_id", myPilgrim.id);
    } else if (currentUser?.role === "agent") {
      const { data: myAgent } = await supabase
        .from("agents")
        .select("id")
        .eq("email", currentUser.email)
        .maybeSingle();

      if (!myAgent) {
        return { items: [], packages };
      }
      query = query.eq("agent_id", myAgent.id);
    } else if (currentUser?.role === "guide") {
      const { data: myGuide } = await supabase
        .from("guides")
        .select("id")
        .eq("email", currentUser.email)
        .maybeSingle();

      if (!myGuide) {
        return { items: [], packages };
      }
      query = query.eq("guide_id", myGuide.id);
    }

    if (statusFilter && statusFilter !== "") {
      query = query.eq("status", statusFilter);
    }
    if (packageFilter && packageFilter !== "") {
      query = query.eq("package_id", packageFilter);
    }

    const { data: regs, error } = await query;
    if (error || !regs) {
      return { items: [], packages };
    }

    const items: RegistrationListItem[] = regs.map((r) => {
      const payments = r.payments || [];
      const totalBilled = Number(r.total_price || 0);
      const totalPaid = payments.reduce((acc: number, p: any) => acc + Number(p.paid_amount || 0), 0);

      let payStatus = "unpaid";
      if (totalPaid >= totalBilled && totalBilled > 0) {
        payStatus = "paid";
      } else if (totalPaid > 0) {
        payStatus = "partial";
      }

      const regMeta = getRegistrationStatusMeta(r.status);
      const payMeta = getPaymentStatusMeta(payStatus);

      return {
        id: r.id,
        code: r.code,
        pilgrimName: r.pilgrims?.name || "-",
        packageName: r.packages?.name || "-",
        status: r.status,
        statusLabel: regMeta.label,
        statusColor: regMeta.color,
        totalPrice: totalBilled,
        totalPaid,
        registeredAt: r.registered_at || "-",
        registeredAtFormatted: r.registered_at ? new Date(r.registered_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-",
        paymentStatus: payStatus,
        paymentStatusLabel: payMeta.label,
        paymentStatusColor: payMeta.color,
      };
    });

    return { items, packages };
  } catch (e) {
    console.error("Error in getRegistrationsList:", e);
    return { items: [], packages: [] };
  }
}

export async function getRegistrationDetail(idOrCode: string): Promise<RegistrationDetailData | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabase();
  if (!supabase) return null;

  try {
    let query = supabase
      .from("registrations")
      .select("*, pilgrims(*), packages(*), branches(*), guides(*), agents(*), payments(*)");

    if (idOrCode.startsWith("REG-")) {
      query = query.eq("code", idOrCode);
    } else {
      query = query.or(`id.eq.${idOrCode},code.eq.${idOrCode}`);
    }

    const { data: reg, error } = await query.maybeSingle();
    if (error || !reg) {
      return null;
    }

    const payments = reg.payments || [];
    const totalBilled = Number(reg.total_price || 0);
    const totalPaid = payments.reduce((acc: number, p: any) => acc + Number(p.paid_amount || 0), 0);
    const outstanding = Math.max(0, totalBilled - totalPaid);

    let payStatus = "unpaid";
    if (totalPaid >= totalBilled && totalBilled > 0) {
      payStatus = "paid";
    } else if (totalPaid > 0) {
      payStatus = "partial";
    }

    const regMeta = getRegistrationStatusMeta(reg.status);
    const payMeta = getPaymentStatusMeta(payStatus);
    const pkg = reg.packages;

    const formattedPayments = payments.map((p: any) => {
      const typeMeta = getPaymentTypeMeta(p.type);
      const statusMeta = getPaymentStatusMeta(p.status);
      return {
        id: p.id,
        code: p.code,
        typeLabel: typeMeta.label,
        typeColor: typeMeta.color,
        amount: Number(p.amount || 0),
        paid_amount: Number(p.paid_amount || 0),
        statusLabel: statusMeta.label,
        statusColor: statusMeta.color,
        due_date: p.due_date || "-",
      };
    });

    return {
      id: reg.id,
      code: reg.code,
      status: reg.status,
      statusLabel: regMeta.label,
      statusColor: regMeta.color,
      totalPrice: totalBilled,
      totalBilled: totalBilled,
      total_price: totalBilled,
      totalPaid,
      outstanding,
      registeredAt: reg.registered_at || "-",
      registered_at: reg.registered_at || "-",
      notes: reg.notes || "",
      paymentStatus: payStatus,
      paymentStatusLabel: payMeta.label,
      pilgrim: {
        id: reg.pilgrims?.id || "",
        code: reg.pilgrims?.code || "-",
        name: reg.pilgrims?.name || "-",
        nik: reg.pilgrims?.nik,
        phone: reg.pilgrims?.phone,
        email: reg.pilgrims?.email,
        passportNumber: reg.pilgrims?.passport_number,
        passport_number: reg.pilgrims?.passport_number,
      },
      package: {
        id: pkg?.id || "",
        name: pkg?.name || "-",
        typeLabel: pkg?.type || "Umroh",
        typeColor: "teal",
        price: Number(pkg?.price || 0),
        departureDate: pkg?.departure_date || "-",
        departure_date: pkg?.departure_date || "-",
        durationDays: pkg?.duration_days || 9,
      },
      branchName: reg.branches?.name || "Kantor Pusat Jakarta",
      guideName: reg.guides?.name,
      agentName: reg.agents?.name,
      payments: formattedPayments,
    };
  } catch (err) {
    console.error("Error in getRegistrationDetail:", err);
    return null;
  }
}
