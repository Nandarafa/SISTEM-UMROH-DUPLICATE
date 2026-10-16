import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface ManifestPackageSummary {
  packageId: string;
  packageName: string;
  packageType: string;
  typeLabel: string;
  typeBadgeColor: "purple" | "blue" | "teal";
  pilgrimCount: number;
  departureDate: string;
}

export interface ManifestPilgrimItem {
  registrationId: string;
  pilgrimId: string;
  pilgrimName: string;
  registrationCode: string;
  roomNumber: string;
  roomType: string;
  busNumber: string;
  seatNumber: string;
  mahramGroup: string;
}

export async function getManifestPackagesList(): Promise<ManifestPackageSummary[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabase();
  if (!supabase) return [];

  try {
    const { data: pkgs, error } = await supabase
      .from("packages")
      .select("id, name, code, type, departure_date")
      .order("price", { ascending: false });

    if (error || !pkgs || pkgs.length === 0) {
      return [];
    }

    const { data: regs } = await supabase
      .from("registrations")
      .select("id, package_id")
      .neq("status", "cancelled");

    return pkgs.map((pkg) => {
      const regCount = regs ? regs.filter((r) => r.package_id === pkg.id).length : 0;
      const typeLower = (pkg.type || "").toLowerCase();
      const isHajiPlus = typeLower.includes("plus") || (pkg.name || "").includes("Plus");
      const isHaji = typeLower.includes("haji") || (pkg.name || "").includes("Haji");

      let typeLabel = "Umroh";
      let typeBadgeColor: "purple" | "blue" | "teal" = "teal";

      if (isHajiPlus) {
        typeLabel = "Haji Plus";
        typeBadgeColor = "purple";
      } else if (isHaji) {
        typeLabel = "Haji";
        typeBadgeColor = "blue";
      }

      let depDateStr = pkg.departure_date || "-";
      try {
        if (pkg.departure_date) {
          const d = new Date(pkg.departure_date);
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          depDateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }
      } catch {}

      return {
        packageId: pkg.id,
        packageName: pkg.name,
        packageType: pkg.type,
        typeLabel,
        typeBadgeColor,
        pilgrimCount: regCount,
        departureDate: depDateStr,
      };
    });
  } catch (e) {
    console.error("Error in getManifestPackagesList:", e);
    return [];
  }
}

export async function getPackageManifestDetail(packageId: string) {
  if (!isSupabaseConfigured()) {
    return {
      packageName: "-",
      packageCode: "-",
      items: [],
    };
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return {
      packageName: "-",
      packageCode: "-",
      items: [],
    };
  }

  try {
    const { data: pkg } = await supabase
      .from("packages")
      .select("id, name, code")
      .eq("id", packageId)
      .maybeSingle();

    const { data: regs } = await supabase
      .from("registrations")
      .select("id, code, pilgrim_id, pilgrims(id, name, code)")
      .eq("package_id", packageId)
      .neq("status", "cancelled");

    const { data: manifests } = await supabase.from("manifests").select("*");

    if (!regs || regs.length === 0) {
      return {
        packageName: pkg?.name || "-",
        packageCode: pkg?.code || "-",
        items: [],
      };
    }

    const items: ManifestPilgrimItem[] = regs.map((r: any, idx: number) => {
      const existing = (manifests || []).find((m: any) => m.registration_id === r.id);
      return {
        registrationId: r.id,
        pilgrimId: r.pilgrims?.id || r.pilgrim_id,
        pilgrimName: r.pilgrims?.name || `Jamaah ${idx + 1}`,
        registrationCode: r.code || "-",
        roomNumber: existing?.room_number ?? "-",
        roomType: existing?.room_type ?? "Quad",
        busNumber: existing?.bus_number ?? "-",
        seatNumber: existing?.seat_number ?? "-",
        mahramGroup: existing?.mahram_group ?? "-",
      };
    });

    return {
      packageName: pkg?.name || "-",
      packageCode: pkg?.code || "-",
      items,
    };
  } catch (err) {
    console.error("Error in getPackageManifestDetail:", err);
    return {
      packageName: "-",
      packageCode: "-",
      items: [],
    };
  }
}
