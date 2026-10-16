import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  audience: string;
  audienceLabel: string;
  audienceBadgeColor: "blue" | "emerald" | "amber" | "purple";
  branchName: string;
  isPublished: boolean;
  publishedAt: string;
  startAt?: string;
  expiresAt?: string;
  branchId?: string;
  packageId?: string;
}

export async function getAnnouncementsList(): Promise<AnnouncementItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*, branches(name)");

    if (error || !data) {
      console.error("Error fetching announcements:", error);
      return [];
    }

    return data.map((d: any) => {
      const aud = (d.audience || "all").toLowerCase();
      let audLabel = "Semua (Publik)";
      let badgeColor: "blue" | "emerald" | "amber" | "purple" = "blue";

      if (aud === "pilgrim" || aud === "jamaah") {
        audLabel = "Jamaah";
        badgeColor = "emerald";
      } else if (aud === "agent" || aud === "agen") {
        audLabel = "Agen";
        badgeColor = "amber";
      } else if (aud === "guide" || aud === "muthawif") {
        audLabel = "Muthawif";
        badgeColor = "purple";
      }

      const publishedDate = d.created_at
        ? new Date(d.created_at).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "-";

      return {
        id: String(d.id),
        title: d.title,
        body: d.body,
        audience: d.audience,
        audienceLabel: audLabel,
        audienceBadgeColor: badgeColor,
        branchName: d.branches?.name || "Kantor Pusat Jakarta",
        isPublished: d.is_published ?? true,
        publishedAt: publishedDate,
      };
    });
  } catch (err) {
    console.error("Error in getAnnouncementsList:", err);
    return [];
  }
}

export async function getAnnouncementDetail(id: string): Promise<AnnouncementItem | null> {
  const all = await getAnnouncementsList();
  return all.find((a) => a.id === id) || null;
}
