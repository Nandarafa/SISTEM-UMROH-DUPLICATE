"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { getSessionUser } from "@/features/auth/services/authActions";
import { revalidatePath } from "next/cache";
import { recordActivityLog } from "@/features/activity-logs/services/activityLogService";

export async function createPilgrimAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const gender = String(formData.get("gender") || "male");
  const nik = String(formData.get("nik") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const birthPlace = String(formData.get("birth_place") || "").trim();
  const birthDate = String(formData.get("birth_date") || "").trim();
  const bloodType = String(formData.get("blood_type") || "").trim();
  const address = String(formData.get("address") || "").trim();

  // Passport
  const passportNumber = String(formData.get("passport_number") || "").trim();
  const passportIssuedPlace = String(formData.get("passport_issued_place") || "").trim();
  const passportIssuedAt = String(formData.get("passport_issued_at") || "").trim();
  const passportExpiredAt = String(formData.get("passport_expired_at") || "").trim();

  // Mahram & Emergency
  const mahramName = String(formData.get("mahram_name") || "").trim();
  const mahramRelation = String(formData.get("mahram_relation") || "").trim();
  const emergencyContactName = String(formData.get("emergency_contact_name") || "").trim();
  const emergencyContactPhone = String(formData.get("emergency_contact_phone") || "").trim();

  // Health & Active
  const healthNotes = String(formData.get("health_notes") || "").trim();
  const isActive = formData.get("is_active") === "1" || formData.get("is_active") === "on";

  const branchId = String(formData.get("branch_id") || "f68b6fde-225a-49de-86ba-60f8e161acdc");
  const guideId = String(formData.get("guide_id") || "").trim() || null;

  if (!name) {
    return { success: false, error: "Nama lengkap wajib diisi." };
  }

  const user = await getSessionUser();
  const formAgentId = String(formData.get("agent_id") || "").trim();
  const agentId = formAgentId || (user?.role === "agent" ? "45347483-a347-4e31-860a-90b56c1b53cf" : null);
  const createAccount = formData.get("create_account") === "1" || formData.get("create_account") === "on";

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        let userId = null;
        if (createAccount && email) {
          const { data: profileData } = await supabase
            .from("profiles")
            .upsert([
              {
                email: email.toLowerCase(),
                name,
                role: "pilgrim",
              },
            ], { onConflict: "email" })
            .select();

          if (profileData && profileData[0]) {
            userId = profileData[0].id;
          }
        }

        // Verify guide_id exists in profiles table (constraint: pilgrims_guide_id_fkey -> profiles.id)
        let validGuideId: string | null = null;
        let muthawifName: string | null = null;
        if (guideId) {
          // First check if guideId is a profile id
          const { data: pData } = await supabase.from("profiles").select("id, name").eq("id", guideId).maybeSingle();
          if (pData?.id) {
            validGuideId = pData.id;
            muthawifName = pData.name;
          } else {
            // Check if guideId is in guides table and map to its profile user_id or profile by name
            const { data: gData } = await supabase.from("guides").select("id, name, user_id").eq("id", guideId).maybeSingle();
            if (gData?.user_id) {
              validGuideId = gData.user_id;
              muthawifName = gData.name;
            } else if (gData?.name) {
              const { data: matchedP } = await supabase.from("profiles").select("id, name").eq("name", gData.name).maybeSingle();
              if (matchedP?.id) {
                validGuideId = matchedP.id;
                muthawifName = matchedP.name;
              }
            }
          }
        }

        // Verify agent_id exists in agents table
        let validAgentId = null;
        if (agentId) {
          const { data: aData } = await supabase.from("agents").select("id").eq("id", agentId).maybeSingle();
          if (aData?.id) {
            validAgentId = aData.id;
          }
        }

        // Verify branch_id exists in branches table
        let validBranchId = branchId;
        if (branchId) {
          const { data: bData } = await supabase.from("branches").select("id").eq("id", branchId).maybeSingle();
          if (!bData?.id) {
            const { data: firstBranch } = await supabase.from("branches").select("id").limit(1).maybeSingle();
            validBranchId = firstBranch?.id || null;
          }
        }

        // Generate code JM-XXXX
        const { count } = await supabase.from("pilgrims").select("*", { count: "exact", head: true });
        const nextNum = (count || 10) + 1;
        const code = `JM-${String(nextNum).padStart(4, "0")}`;

        const insertPayload: Record<string, any> = {
          branch_id: validBranchId,
          agent_id: validAgentId,
          guide_id: validGuideId,
          muthawif_name: muthawifName,
          user_id: userId,
          code,
          name,
          gender,
          nik: nik || null,
          birth_place: birthPlace || null,
          birth_date: birthDate || null,
          blood_type: bloodType || null,
          phone: phone || null,
          email: email || null,
          city: city || null,
          address: address || null,
          passport_number: passportNumber || null,
          passport_issued_place: passportIssuedPlace || null,
          passport_issued_at: passportIssuedAt || null,
          passport_expired_at: passportExpiredAt || null,
          mahram_name: mahramName || null,
          mahram_relation: mahramRelation || null,
          emergency_contact_name: emergencyContactName || null,
          emergency_contact_phone: emergencyContactPhone || null,
          health_notes: healthNotes || null,
          is_active: isActive ?? true,
        };

        let { data: inserted, error } = await supabase
          .from("pilgrims")
          .insert([insertPayload])
          .select()
          .single();

        // If foreign key constraint on guide_id fails, fallback with guide_id = null
        if (error && (error.message?.includes("pilgrims_guide_id_fkey") || error.code === "23503")) {
          const safePayload = { ...insertPayload, guide_id: null };
          const retryRes = await supabase.from("pilgrims").insert([safePayload]).select().single();
          inserted = retryRes.data;
          error = retryRes.error;
        }

        // If Supabase table doesn't have the new columns yet, fallback to inserting core columns
        if (error && error.message?.includes("column of 'pilgrims' in the schema cache")) {
          const corePayload = {
            branch_id: validBranchId || branchId,
            agent_id: validAgentId || null,
            user_id: userId,
            code,
            name,
            gender,
            nik: nik || null,
            phone: phone || null,
            email: email || null,
            city: city || null,
            passport_number: passportNumber || null,
            is_active: isActive ?? true,
          };
          const fallbackRes = await supabase.from("pilgrims").insert([corePayload]).select().single();
          inserted = fallbackRes.data;
          error = fallbackRes.error;
        }

        if (error) {
          console.error("Error creating pilgrim in Supabase:", error);
          return { success: false, error: error.message };
        }

        // Record activity log
        await recordActivityLog(
          "created",
          `Mendaftarkan jamaah ${name}`,
          "Pilgrim",
          inserted?.id || code,
          user?.id,
          branchId
        );
      }
    } catch (e: any) {
      console.error("createPilgrimAction exception:", e);
      return { success: false, error: e.message };
    }
  }

  revalidatePath("/pilgrims");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updatePilgrimAction(id: string, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const gender = String(formData.get("gender") || "male");
  const nik = String(formData.get("nik") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const birthPlace = String(formData.get("birth_place") || "").trim();
  const birthDate = String(formData.get("birth_date") || "").trim();
  const bloodType = String(formData.get("blood_type") || "").trim();
  const address = String(formData.get("address") || "").trim();

  // Passport
  const passportNumber = String(formData.get("passport_number") || "").trim();
  const passportIssuedPlace = String(formData.get("passport_issued_place") || "").trim();
  const passportIssuedAt = String(formData.get("passport_issued_at") || "").trim();
  const passportExpiredAt = String(formData.get("passport_expired_at") || "").trim();

  // Mahram & Emergency
  const mahramName = String(formData.get("mahram_name") || "").trim();
  const mahramRelation = String(formData.get("mahram_relation") || "").trim();
  const emergencyContactName = String(formData.get("emergency_contact_name") || "").trim();
  const emergencyContactPhone = String(formData.get("emergency_contact_phone") || "").trim();

  // Health & Active
  const healthNotes = String(formData.get("health_notes") || "").trim();
  const isActive = formData.get("is_active") === "1" || formData.get("is_active") === "on";

  const branchId = String(formData.get("branch_id") || "");
  const agentId = String(formData.get("agent_id") || "");
  const guideId = formData.has("guide_id") ? (String(formData.get("guide_id") || "").trim() || null) : undefined;

  if (!name) {
    return { success: false, error: "Nama lengkap wajib diisi." };
  }

  const user = await getSessionUser();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        let muthawifName = null;
        let validGuideId: string | null = null;
        if (guideId) {
          const { data: pData } = await supabase.from("profiles").select("id, name").eq("id", guideId).maybeSingle();
          if (pData?.id) {
            validGuideId = pData.id;
            muthawifName = pData.name;
          } else {
            const { data: gData } = await supabase.from("guides").select("id, name, user_id").eq("id", guideId).maybeSingle();
            if (gData?.user_id) {
              validGuideId = gData.user_id;
              muthawifName = gData.name;
            } else if (gData?.name) {
              const { data: matchedP } = await supabase.from("profiles").select("id, name").eq("name", gData.name).maybeSingle();
              if (matchedP?.id) {
                validGuideId = matchedP.id;
                muthawifName = matchedP.name;
              }
            }
          }
        }

        let validAgentId: string | null = agentId;
        if (agentId) {
          const { data: aData } = await supabase.from("agents").select("id").eq("id", agentId).maybeSingle();
          if (!aData?.id) {
            validAgentId = null;
          }
        }

        let validBranchId: string | null = branchId;
        if (branchId) {
          const { data: bData } = await supabase.from("branches").select("id").eq("id", branchId).maybeSingle();
          if (!bData?.id) {
            validBranchId = null;
          }
        }

        const updatePayload: Record<string, any> = {
          name,
          gender,
          nik: nik || null,
          birth_place: birthPlace || null,
          birth_date: birthDate || null,
          blood_type: bloodType || null,
          phone: phone || null,
          email: email || null,
          city: city || null,
          address: address || null,
          passport_number: passportNumber || null,
          passport_issued_place: passportIssuedPlace || null,
          passport_issued_at: passportIssuedAt || null,
          passport_expired_at: passportExpiredAt || null,
          mahram_name: mahramName || null,
          mahram_relation: mahramRelation || null,
          emergency_contact_name: emergencyContactName || null,
          emergency_contact_phone: emergencyContactPhone || null,
          health_notes: healthNotes || null,
          is_active: isActive,
        };

        if (branchId) {
          updatePayload.branch_id = validBranchId;
        }
        if (agentId !== undefined) {
          updatePayload.agent_id = validAgentId ? validAgentId : null;
        }
        if (guideId !== undefined) {
          updatePayload.guide_id = validGuideId;
          updatePayload.muthawif_name = muthawifName;
        }

        let { error } = await supabase
          .from("pilgrims")
          .update(updatePayload)
          .eq("id", id);

        // If foreign key constraint on guide_id fails, fallback with guide_id = null
        if (error && (error.message?.includes("pilgrims_guide_id_fkey") || error.code === "23503")) {
          const safeUpdatePayload = { ...updatePayload, guide_id: null };
          const retryRes = await supabase.from("pilgrims").update(safeUpdatePayload).eq("id", id);
          error = retryRes.error;
        }

        // If Supabase table doesn't have the new columns yet, fallback to updating core columns
        if (error && error.message?.includes("column of 'pilgrims' in the schema cache")) {
          const coreUpdatePayload: Record<string, any> = {
            name,
            gender,
            nik: nik || null,
            phone: phone || null,
            email: email || null,
            city: city || null,
            passport_number: passportNumber || null,
            is_active: isActive,
          };
          if (branchId) coreUpdatePayload.branch_id = branchId;
          if (agentId !== undefined) coreUpdatePayload.agent_id = agentId ? agentId : null;

          const fallbackRes = await supabase.from("pilgrims").update(coreUpdatePayload).eq("id", id);
          error = fallbackRes.error;
        }

        if (error) {
          console.error("Error updating pilgrim in Supabase:", error);
          return { success: false, error: error.message };
        }

        // Record activity log
        await recordActivityLog(
          "updated",
          `Memperbarui data jamaah ${name}`,
          "Pilgrim",
          id,
          user?.id,
          branchId || user?.branchId
        );
      }
    } catch (e: any) {
      console.error("updatePilgrimAction exception:", e);
      return { success: false, error: e.message };
    }
  }

  revalidatePath("/pilgrims");
  revalidatePath(`/pilgrims/${id}`);
  revalidatePath(`/pilgrims/${id}/edit`);
  revalidatePath("/dashboard");
  revalidatePath("/activity-logs");
  return { success: true };
}

export async function deletePilgrimAction(id: string) {
  const user = await getSessionUser();
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { error } = await supabase.from("pilgrims").delete().eq("id", id);
        if (error) {
          console.error("Error deleting pilgrim in Supabase:", error);
          return { success: false, error: error.message };
        }

        await recordActivityLog(
          "deleted",
          `Menghapus data jamaah ID #${id}`,
          "Pilgrim",
          id,
          user?.id,
          user?.branchId
        );
      }
    } catch (e: any) {
      console.error("deletePilgrimAction exception:", e);
      return { success: false, error: e.message };
    }
  }

  revalidatePath("/pilgrims");
  revalidatePath("/dashboard");
  revalidatePath("/activity-logs");
  return { success: true };
}
