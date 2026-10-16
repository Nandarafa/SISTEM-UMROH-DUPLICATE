import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface PilgrimDashboardData {
  hasProfile: boolean;
  pilgrim: {
    id: string;
    name: string;
    nik?: string;
    email?: string;
    phone?: string;
    passport_number?: string;
  } | null;
  registration: {
    id: string;
    code: string;
    status: string;
    statusLabel: string;
    statusColor: "amber" | "blue" | "teal" | "green" | "purple" | "red" | "gray";
    total_price: number;
    registered_at: string;
  } | null;
  package: {
    id: string;
    name: string;
    typeLabel: string;
    duration_days: number;
    departure_date: string;
  } | null;
  payment: {
    total: number;
    paid: number;
    outstanding: number;
    percent: number;
  };
  documents: {
    total: number;
    verified: number;
    percent: number;
    items: Array<{
      id: string;
      label: string;
      type: string;
      status: string;
      statusLabel: string;
      statusColor: "gray" | "amber" | "green" | "red";
    }>;
  };
  countdown: number | null;
  manasik: Array<{
    id: string;
    title: string;
    date: string;
    location: string;
  }>;
  announcements: Array<{
    id: string;
    title: string;
    date: string;
    body: string;
    audience: string;
    audienceLabel: string;
    audienceColor: "gray" | "green" | "blue" | "teal" | "purple" | "amber" | "red";
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

export function getDocumentStatusMeta(status: string) {
  switch (status) {
    case "verified":
      return { label: "Terverifikasi", color: "green" as const };
    case "uploaded":
      return { label: "Sudah Diunggah", color: "amber" as const };
    case "pending":
      return { label: "Belum Diunggah", color: "gray" as const };
    case "rejected":
      return { label: "Ditolak", color: "red" as const };
    default:
      return { label: status || "-", color: "gray" as const };
  }
}

export function getPackageTypeMeta(type: string) {
  switch (type) {
    case "umroh":
      return { label: "Umroh", color: "green" as const };
    case "haji":
      return { label: "Haji", color: "blue" as const };
    case "haji_plus":
      return { label: "Haji Plus", color: "purple" as const };
    default:
      return { label: type || "Umroh", color: "gray" as const };
  }
}

const emptyDashboard: PilgrimDashboardData = {
  hasProfile: false,
  pilgrim: null,
  registration: null,
  package: null,
  payment: {
    total: 0,
    paid: 0,
    outstanding: 0,
    percent: 0,
  },
  documents: {
    total: 0,
    verified: 0,
    percent: 0,
    items: [],
  },
  countdown: null,
  manasik: [],
  announcements: [],
};

export async function getPilgrimDashboardData(userEmail?: string): Promise<PilgrimDashboardData> {
  if (!isSupabaseConfigured()) {
    return emptyDashboard;
  }

  const supabase = await createServerSupabase();
  if (!supabase) return emptyDashboard;

  try {
    const targetEmail = userEmail || "jamaah@example.com";

    // 1. Fetch pilgrim by email directly from Supabase
    const { data: pilgrim, error: pilgrimError } = await supabase
      .from("pilgrims")
      .select("*")
      .eq("email", targetEmail)
      .limit(1)
      .maybeSingle();

    // Jika tidak ada di tabel pilgrims, cek apakah ada profilnya
    if (pilgrimError || !pilgrim) {
      // Periksa apakah user memiliki pengumuman umum
      const { data: annData } = await supabase
        .from("announcements")
        .select("*")
        .or("audience.eq.all,audience.eq.pilgrim")
        .order("id", { ascending: false })
        .limit(5);

      const anns = (annData || []).map((a: any) => ({
        id: a.id,
        title: a.title,
        date: a.created_at
          ? new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(a.created_at))
          : "-",
        body: a.body,
        audience: a.audience,
        audienceLabel: a.audience === "pilgrim" ? "Jamaah" : "Semua Pengguna",
        audienceColor: (a.audience === "pilgrim" ? "teal" : "gray") as "teal" | "gray",
      }));

      return {
        ...emptyDashboard,
        announcements: anns,
      };
    }

    // 2. Fetch registration for this pilgrim from Supabase
    const { data: registration } = await supabase
      .from("registrations")
      .select("*, packages(*)")
      .eq("pilgrim_id", pilgrim.id)
      .neq("status", "cancelled")
      .order("registered_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 3. Fetch payments from Supabase
    let totalBilled = Number(registration?.total_price || 0);
    let totalPaid = 0;
    if (registration?.id) {
      const { data: payments } = await supabase
        .from("payments")
        .select("amount, paid_amount")
        .eq("registration_id", registration.id);

      if (payments && payments.length > 0) {
        totalPaid = payments.reduce((acc, curr) => acc + Number(curr.paid_amount || 0), 0);
      }
    }

    const outstanding = Math.max(0, totalBilled - totalPaid);
    const percent = totalBilled > 0 ? Math.min(100, Math.round((totalPaid / totalBilled) * 100)) : 0;

    // 4. Fetch documents from Supabase
    const { data: documentsData } = await supabase
      .from("documents")
      .select("*")
      .eq("pilgrim_id", pilgrim.id);

    const docItems = (documentsData || []).map((doc) => {
      const meta = getDocumentStatusMeta(doc.status);
      return {
        id: doc.id,
        label: doc.label || doc.type?.toUpperCase() || "Dokumen",
        type: doc.type,
        status: doc.status,
        statusLabel: meta.label,
        statusColor: meta.color,
      };
    });

    const docTotal = docItems.length;
    const docVerified = docItems.filter((d) => d.status === "verified").length;
    const docPercent = docTotal > 0 ? Math.round((docVerified / docTotal) * 100) : 0;

    // 5. Countdown calculation
    const pkg = registration?.packages;
    let countdown: number | null = null;
    if (pkg?.departure_date) {
      const depDate = new Date(pkg.departure_date);
      const now = new Date();
      const diffTime = depDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      countdown = diffDays >= 0 ? diffDays : 0;
    }

    // 6. Manasik from Supabase
    let upcomingManasik: Array<{ id: string; title: string; date: string; location: string }> = [];
    if (pkg?.id) {
      const { data: manasikList } = await supabase
        .from("manasik_schedules")
        .select("*")
        .eq("package_id", pkg.id)
        .gte("date", new Date().toISOString().split("T")[0])
        .order("date", { ascending: true })
        .limit(5);

      if (manasikList) {
        upcomingManasik = manasikList.map((m) => ({
          id: m.id,
          title: m.title,
          date: m.date,
          location: m.location || "Lokasi belum ditentukan",
        }));
      }
    }

    // 7. Announcements from Supabase
    const { data: announcementsData } = await supabase
      .from("announcements")
      .select("*")
      .or("audience.eq.all,audience.eq.pilgrim")
      .order("id", { ascending: false })
      .limit(5);

    const announcements = (announcementsData || []).map((a: any) => {
      const aud = a.audience === "pilgrim" ? "Jamaah" : "Semua Pengguna";
      const color: "teal" | "gray" = a.audience === "pilgrim" ? "teal" : "gray";
      return {
        id: a.id,
        title: a.title,
        date: a.created_at
          ? new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(a.created_at))
          : "-",
        body: a.body,
        audience: a.audience,
        audienceLabel: aud,
        audienceColor: color,
      };
    });

    const regMeta = registration ? getRegistrationStatusMeta(registration.status) : null;
    const pkgTypeMeta = pkg ? getPackageTypeMeta(pkg.type) : null;

    return {
      hasProfile: true,
      pilgrim: {
        id: pilgrim.id,
        name: pilgrim.name,
        nik: pilgrim.nik,
        email: pilgrim.email,
        phone: pilgrim.phone,
        passport_number: pilgrim.passport_number,
      },
      registration: registration
        ? {
            id: registration.id,
            code: registration.code,
            status: registration.status,
            statusLabel: regMeta?.label || registration.status,
            statusColor: regMeta?.color || "blue",
            total_price: Number(registration.total_price),
            registered_at: registration.registered_at,
          }
        : null,
      package: pkg
        ? {
            id: pkg.id,
            name: pkg.name,
            typeLabel: pkgTypeMeta?.label || "Umroh",
            duration_days: pkg.duration_days,
            departure_date: pkg.departure_date,
          }
        : null,
      payment: {
        total: totalBilled,
        paid: totalPaid,
        outstanding,
        percent,
      },
      documents: {
        total: docTotal,
        verified: docVerified,
        percent: docPercent,
        items: docItems,
      },
      countdown,
      manasik: upcomingManasik,
      announcements,
    };
  } catch (err) {
    console.error("Error in getPilgrimDashboardData:", err);
    return emptyDashboard;
  }
}
