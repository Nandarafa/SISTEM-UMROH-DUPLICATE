import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface PilgrimItem {
  id: string;
  name: string;
  code: string;
  gender: string;
  nik: string;
  phone: string;
  email: string;
  birthPlace?: string;
  birthDate?: string;
  age?: number;
  bloodType?: string;
  address?: string;
  city?: string;
  passportNumber: string;
  passportIssuedPlace?: string;
  passportIssuedAt?: string;
  passportExpiry: string;
  mahramName?: string;
  mahramRelation?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  healthNotes?: string;
  branchName?: string;
  branchId?: string;
  agentName?: string;
  agentId?: string;
  guideName?: string;
  guideId?: string;
  packageName?: string;
  hasUserAccount?: boolean;
  documentsCount?: number;
  status: string;
  registrations?: Array<{
    id: string;
    code: string;
    packageName: string;
    registeredAt: string;
    status: string;
  }>;
}

export async function getPilgrims(search?: string, status?: string): Promise<PilgrimItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabase();
  if (!supabase) return [];

  try {
    let query = supabase.from("pilgrims").select(`
      id,
      name,
      code,
      gender,
      nik,
      phone,
      email,
      passport_number,
      is_active,
      created_at,
      agents ( name ),
      registrations (
        packages ( name )
      )
    `).order("created_at", { ascending: false });

    if (status && status !== "ALL") {
      const isActive = status === "active";
      query = query.eq("is_active", isActive);
    }

    if (search && search.trim()) {
      query = query.or(`name.ilike.%${search}%,nik.ilike.%${search}%,passport_number.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error || !data) {
      return [];
    }

    return data.map((d: any) => {
      const regPkgName = d.registrations?.[0]?.packages?.name;
      return {
        id: String(d.id),
        name: d.name,
        code: d.code ?? "JM-000" + d.id,
        packageName: regPkgName || "-",
        gender: d.gender === "female" ? "Perempuan" : "Laki-laki",
        nik: d.nik ?? "-",
        phone: d.phone ?? "-",
        email: d.email ?? "",
        passportNumber: d.passport_number ?? "-",
        passportExpiry: "-",
        agentName: d.agents?.name ?? "-",
        guideName: "-",
        status: d.is_active ? "active" : "inactive",
      };
    });
  } catch {
    return [];
  }
}

export async function getPilgrimDetail(id: string): Promise<PilgrimItem | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("pilgrims")
      .select(`
        *,
        branches ( name ),
        agents ( name ),
        registrations (
          id,
          code,
          registered_at,
          status,
          packages ( name )
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: String(data.id),
      name: data.name,
      code: data.code ?? "JM-000" + data.id,
      gender: data.gender === "female" ? "Perempuan" : "Laki-laki",
      nik: data.nik ?? "-",
      phone: data.phone ?? "-",
      email: data.email ?? "-",
      birthPlace: data.birth_place ?? "-",
      birthDate: data.birth_date ?? "-",
      age: data.birth_date ? Math.floor((new Date().getTime() - new Date(data.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : undefined,
      bloodType: data.blood_type ?? "-",
      address: data.address ?? "-",
      city: data.city ?? "-",
      passportNumber: data.passport_number ?? "-",
      passportIssuedPlace: data.passport_issued_place ?? "-",
      passportIssuedAt: data.passport_issued_at ?? "-",
      passportExpiry: data.passport_expired_at ?? "-",
      mahramName: data.mahram_name ?? "-",
      mahramRelation: data.mahram_relation ?? "-",
      emergencyContactName: data.emergency_contact_name ?? "-",
      emergencyContactPhone: data.emergency_contact_phone ?? "-",
      healthNotes: data.health_notes ?? "-",
      branchName: data.branches?.name ?? "-",
      agentName: data.agents?.name ?? "-",
      status: data.is_active ? "active" : "inactive",
      registrations: (data.registrations || []).map((r: any) => ({
        id: String(r.id),
        code: r.code,
        packageName: r.packages?.name || "-",
        registeredAt: r.registered_at,
        status: r.status,
      })),
      branchId: data.branch_id,
      agentId: data.agent_id,
      guideId: data.guide_id,
      guideName: data.muthawif_name || undefined,
    };
  } catch {
    return null;
  }
}

export async function getPilgrimsByGuide(guideId: string): Promise<PilgrimItem[]> {
  const all = await getPilgrims();
  return all.filter((p) => p.guideId === guideId);
}
