import fs from "fs";
import path from "path";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface EquipmentItem {
  id: string;
  pilgrimId: string;
  pilgrimName: string;
  item: string;
  size: string;
  quantity: number;
  status: "Belum Disiapkan" | "Sudah Disiapkan" | "Sudah Diserahkan";
  statusColor: "gray" | "amber" | "green";
  handedOverAt: string;
  notes?: string;
}

const EQUIPMENT_FILE = path.join(process.cwd(), "equipment_data.json");

export function getLocalEquipment(): any[] {
  try {
    if (fs.existsSync(EQUIPMENT_FILE)) {
      const raw = fs.readFileSync(EQUIPMENT_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading equipment_data.json", e);
  }
  return [];
}

export function saveLocalEquipment(items: any[]) {
  try {
    fs.writeFileSync(EQUIPMENT_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing equipment_data.json", e);
  }
}

export function getStatusMeta(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "sudah diserahkan" || s === "delivered" || s === "diserahkan") {
    return {
      statusNormalized: "Sudah Diserahkan" as const,
      statusColor: "green" as const,
    };
  }
  if (s === "sudah disiapkan" || s === "prepared" || s === "disiapkan") {
    return {
      statusNormalized: "Sudah Disiapkan" as const,
      statusColor: "amber" as const,
    };
  }
  return {
    statusNormalized: "Belum Disiapkan" as const,
    statusColor: "gray" as const,
  };
}

export async function getEquipmentList(): Promise<EquipmentItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("equipment")
      .select("*, pilgrims(name)")
      .order("created_at", { ascending: true });

    if (!error && data) {
      return data.map((d: any) => {
        const meta = getStatusMeta(d.status);
        let handedAt = "-";
        if (d.handed_over_at) {
          try {
            const dt = new Date(d.handed_over_at);
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            handedAt = `${dt.getDate().toString().padStart(2, "0")} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
          } catch {}
        }

        return {
          id: d.id,
          pilgrimId: d.pilgrim_id,
          pilgrimName: d.pilgrims?.name || "Jamaah",
          item: d.item,
          size: d.size || "-",
          quantity: d.quantity || 1,
          status: meta.statusNormalized,
          statusColor: meta.statusColor,
          handedOverAt: handedAt,
          notes: d.notes || "",
        };
      });
    }

    // Fallback if table doesn't exist
    const local = getLocalEquipment();
    const { data: pilgrims } = await supabase.from("pilgrims").select("id, name");
    return local.map((d: any) => {
      const meta = getStatusMeta(d.status);
      const matched = (pilgrims || []).find((p) => p.id === d.pilgrim_id);
      return {
        id: d.id,
        pilgrimId: d.pilgrim_id,
        pilgrimName: matched?.name || d.pilgrim_name || "Jamaah",
        item: d.item,
        size: d.size || "-",
        quantity: d.quantity || 1,
        status: meta.statusNormalized,
        statusColor: meta.statusColor,
        handedOverAt: d.handed_over_at || "-",
        notes: d.notes || "",
      };
    });
  } catch (err) {
    console.error("Error in getEquipmentList:", err);
    return [];
  }
}

export async function getEquipmentDetail(id: string): Promise<EquipmentItem | null> {
  const all = await getEquipmentList();
  return all.find((e) => e.id === id) || null;
}
