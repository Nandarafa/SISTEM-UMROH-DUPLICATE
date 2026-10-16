import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface PackageItem {
  id: string;
  code: string;
  name: string;
  type: string;
  price: number;
  down_payment: number;
  quota: number;
  registeredCount: number;
  duration_days: number;
  departure_date: string;
  departure_city: string;
  status: string;
  hotelMakkah?: string;
  hotelMadinah?: string;
  airline?: string;
  description?: string;
}

export async function getPackagesList(query?: string, type?: string, status?: string): Promise<PackageItem[]> {
  let list: PackageItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        let q = supabase
          .from("packages")
          .select(`
            id,
            code,
            name,
            type,
            price,
            down_payment,
            quota,
            duration_days,
            departure_date,
            departure_city,
            status,
            hotel_makkah:hotels!packages_hotel_makkah_id_fkey ( name ),
            hotel_madinah:hotels!packages_hotel_madinah_id_fkey ( name ),
            airline:airlines ( name )
          `)
          .order("price", { ascending: true });

        if (status && status !== "ALL") {
          q = q.eq("status", status);
        }

        let { data: dbData, error } = await q;

        // Fallback to select * if foreign key alias fails
        if (error) {
          console.error("Packages query error, falling back to select *:", error.message);
          const fb = await supabase.from("packages").select("*").order("price", { ascending: true });
          dbData = fb.data;
          error = fb.error;
        }

        if (!error && dbData && dbData.length > 0) {
          const { data: regs } = await supabase.from("registrations").select("package_id");

          list = dbData.map((d: any) => {
            const registered = regs ? regs.filter((r) => r.package_id === d.id).length : 0;
            return {
              id: String(d.id),
              code: d.code || "PKG-UMR",
              name: d.name,
              type: d.type || "umroh",
              price: Number(d.price || 0),
              down_payment: Number(d.down_payment || 0),
              quota: Number(d.quota || 30),
              registeredCount: registered,
              duration_days: d.duration_days || 9,
              departure_date: d.departure_date || "-",
              departure_city: d.departure_city || "Jakarta",
              status: d.status || "active",
              hotelMakkah: d.hotel_makkah?.name || "-",
              hotelMadinah: d.hotel_madinah?.name || "-",
              airline: d.airline?.name || "-",
              description: d.description || "",
            };
          });
        }
      }
    } catch (e) {
      console.error("Error getPackagesList:", e);
    }
  }

  if (query && query.trim()) {
    const qLower = query.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(qLower) || p.code.toLowerCase().includes(qLower));
  }

  if (type && type !== "ALL" && type !== "") {
    list = list.filter((p) => p.type === type);
  }

  return list;
}

export async function getPackageDetail(id: string): Promise<PackageItem | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("packages")
          .select(`
            *,
            hotel_makkah:hotels!packages_hotel_makkah_id_fkey ( name ),
            hotel_madinah:hotels!packages_hotel_madinah_id_fkey ( name ),
            airline:airlines ( name )
          `)
          .eq("id", id)
          .maybeSingle();

        if (!error && data) {
          const { count } = await supabase
            .from("registrations")
            .select("*", { count: "exact", head: true })
            .eq("package_id", data.id);

          return {
            id: String(data.id),
            code: data.code,
            name: data.name,
            type: data.type,
            price: Number(data.price),
            down_payment: Number(data.down_payment),
            quota: Number(data.quota),
            registeredCount: count || 0,
            duration_days: Number(data.duration_days),
            departure_date: data.departure_date,
            departure_city: data.departure_city,
            status: data.status,
            hotelMakkah: data.hotel_makkah?.name || "-",
            hotelMadinah: data.hotel_madinah?.name || "-",
            airline: data.airline?.name || "-",
            description: data.description,
          };
        }
      }
    } catch (e) {
      console.error("Error getPackageDetail:", e);
    }
  }

  return null;
}
