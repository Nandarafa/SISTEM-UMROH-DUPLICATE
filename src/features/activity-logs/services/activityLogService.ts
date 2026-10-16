import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { getSessionUser } from "@/features/auth/services/authActions";

export interface ActivityLogItem {
  id: string;
  time: string;
  userName: string;
  action: string;
  actionBadgeColor: "blue" | "green" | "red";
  description: string;
  ip: string;
}

export async function getActivityLogs(
  actionFilter?: string,
  userFilter?: string
): Promise<{ items: ActivityLogItem[]; usersList: string[] }> {
  let list: ActivityLogItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data: logs, error } = await supabase
          .from("activity_logs")
          .select("*, profiles(name)")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching activity logs from Supabase:", error);
        } else if (logs) {
          list = logs.map((l: any) => {
            let badgeColor: "blue" | "green" | "red" = "blue";
            const act = (l.action || "").toLowerCase();
            if (act === "created" || act === "login") badgeColor = "green";
            if (act === "deleted") badgeColor = "red";

            let timeStr = "-";
            if (l.created_at) {
              try {
                const dt = new Date(l.created_at);
                const months = [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "Mei",
                  "Jun",
                  "Jul",
                  "Agu",
                  "Sep",
                  "Okt",
                  "Nov",
                  "Des",
                ];
                const dStr = `${dt.getDate().toString().padStart(2, "0")} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
                const tStr = `${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}`;
                timeStr = `${dStr} ${tStr}`;
              } catch {}
            }

            let userName = l.profiles?.name || "-";
            let desc = l.description || "";

            // If description starts with [User Name] ..., extract user name if not present
            if (desc.startsWith("[") && desc.includes("] ")) {
              const closeIdx = desc.indexOf("] ");
              const extractedName = desc.substring(1, closeIdx);
              if (userName === "-" || !userName) {
                userName = extractedName;
              }
              desc = desc.substring(closeIdx + 2);
            }

            return {
              id: l.id,
              time: timeStr,
              userName,
              action: l.action || "created",
              actionBadgeColor: badgeColor,
              description: desc,
              ip: "127.0.0.1",
            };
          });
        }
      }
    } catch (e) {
      console.error("Error in getActivityLogs:", e);
    }
  }

  const usersList = Array.from(
    new Set(list.map((l) => l.userName).filter((u) => u !== "-"))
  );

  if (actionFilter && actionFilter !== "ALL" && actionFilter !== "") {
    list = list.filter(
      (l) => l.action.toLowerCase() === actionFilter.toLowerCase()
    );
  }

  if (userFilter && userFilter !== "ALL" && userFilter !== "") {
    list = list.filter(
      (l) => l.userName.toLowerCase() === userFilter.toLowerCase()
    );
  }

  return { items: list, usersList };
}

export async function recordActivityLog(
  action: "created" | "updated" | "deleted" | "login",
  description: string,
  subjectType?: string,
  subjectId?: string | number,
  userId?: string | null,
  _branchId?: string | null
) {
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await createServerSupabase();
    if (!supabase) return;

    let targetUserId: string | null = null;
    let actorName = "";

    try {
      const currentUser = await getSessionUser();
      if (currentUser) {
        actorName = currentUser.name;
        // Check if currentUser.id is a UUID
        const isUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            currentUser.id || ""
          );
        if (isUUID) {
          targetUserId = currentUser.id;
        } else if (currentUser.email) {
          // Look up matching profile by email
          const { data: prof } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", currentUser.email)
            .maybeSingle();
          if (prof?.id) {
            targetUserId = prof.id;
          }
        }
      }
    } catch {}

    // If userId passed explicitly and is UUID
    if (
      userId &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        userId
      )
    ) {
      targetUserId = userId;
    }

    let finalDesc = description;
    // Prefix with [Actor Name] if actorName is available and not already prefixed
    if (actorName && !finalDesc.startsWith("[")) {
      finalDesc = `[${actorName}] ${finalDesc}`;
    }

    const payload: {
      action: string;
      description: string;
      user_id?: string | null;
    } = {
      action,
      description: finalDesc,
    };

    if (targetUserId) {
      payload.user_id = targetUserId;
    }

    const { error } = await supabase.from("activity_logs").insert([payload]);
    if (error) {
      console.error("Failed to insert activity_log:", error.message);
    }
  } catch (err) {
    console.error("Failed to record activity log:", err);
  }
}
