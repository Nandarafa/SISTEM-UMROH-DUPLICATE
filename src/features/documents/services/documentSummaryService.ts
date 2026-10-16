import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface PilgrimDocumentSummary {
  id: string;
  name: string;
  code: string;
  branchName: string;
  uploadedCount: number;
  totalCount: number;
  status: string;
}

export async function getAllPilgrimsDocumentSummaries(search?: string): Promise<PilgrimDocumentSummary[]> {
  let list: PilgrimDocumentSummary[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        let q = supabase
          .from("pilgrims")
          .select(`
            id,
            name,
            code,
            branches ( name ),
            documents ( id, status )
          `)
          .order("code", { ascending: true });

        if (search && search.trim()) {
          q = q.ilike("name", `%${search.trim()}%`);
        }

        const { data: pilgrims, error } = await q;
        if (!error && pilgrims) {
          list = pilgrims.map((p: any) => {
            const docs = p.documents || [];
            const uploaded = docs.filter((d: any) => d.status === "uploaded" || d.status === "verified").length;
            const total = docs.length;

            return {
              id: String(p.id),
              name: p.name,
              code: p.code || "JM-0001",
              branchName: p.branches?.name || "Kantor Pusat Jakarta",
              uploadedCount: uploaded,
              totalCount: total,
              status: total > 0 && uploaded === total ? "Lengkap" : "Proses",
            };
          });
        }
      }
    } catch (e) {
      console.error("Error getAllPilgrimsDocumentSummaries:", e);
    }
  }

  return list;
}
