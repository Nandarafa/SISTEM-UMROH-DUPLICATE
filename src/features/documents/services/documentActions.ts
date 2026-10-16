"use server";

import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { recordActivityLog } from "@/features/activity-logs/services/activityLogService";
import { getSessionUser } from "@/features/auth/services/authActions";
import { STANDARD_CHECKLIST } from "./documentService";

export async function seedStandardChecklistAction(pilgrimId: string) {
  if (!pilgrimId || !isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = await createServerSupabase();
    if (!supabase) return { success: true };

    // Fetch existing doc types for this pilgrim
    const { data: existingDocs } = await supabase
      .from("documents")
      .select("type")
      .eq("pilgrim_id", pilgrimId);

    const existingTypes = new Set((existingDocs || []).map((d: any) => d.type));

    const toInsert = STANDARD_CHECKLIST.filter((item) => !existingTypes.has(item.type)).map(
      (item) => ({
        pilgrim_id: pilgrimId,
        type: item.type,
        label: item.label,
        status: "pending",
        file_path: null,
      })
    );

    if (toInsert.length > 0) {
      await supabase.from("documents").insert(toInsert);
    }

    const user = await getSessionUser();
    await recordActivityLog(
      "created",
      `Membuat checklist standar dokumen untuk jamaah`,
      "Pilgrim",
      pilgrimId,
      user?.id
    );

    revalidatePath(`/documents/${pilgrimId}`);
    revalidatePath("/documents");
    return { success: true };
  } catch (err: any) {
    console.error("seedStandardChecklistAction error:", err);
    return { error: err.message || "Gagal membuat checklist standar." };
  }
}

export async function uploadDocumentAction(formData: FormData) {
  try {
    const documentId = formData.get("document_id") as string;
    const pilgrimId = formData.get("pilgrim_id") as string;
    const file = formData.get("file") as File | null;

    if (!documentId) {
      return { error: "ID dokumen tidak valid." };
    }

    if (!file || file.size === 0) {
      return { error: "Pilih berkas dokumen terlebih dahulu." };
    }

    // Limit to 15MB
    if (file.size > 15 * 1024 * 1024) {
      return { error: "Ukuran berkas maksimal 15MB." };
    }

    // Save file to public/uploads/documents/[pilgrimId]/
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads", "documents", pilgrimId || "common");
    await fs.mkdir(uploadDir, { recursive: true });

    // Clean filename
    const ext = path.extname(file.name) || ".jpg";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const safeFileName = `${Date.now()}_${baseName}${ext}`;
    const filePath = path.join(uploadDir, safeFileName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/documents/${pilgrimId || "common"}/${safeFileName}`;

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { error } = await supabase
          .from("documents")
          .update({
            file_path: publicUrl,
            status: "uploaded",
          })
          .eq("id", documentId);

        if (error) {
          console.error("Error updating document row:", error);
          return { error: error.message };
        }

        const user = await getSessionUser();
        await recordActivityLog(
          "updated",
          `Mengunggah berkas ${file.name} untuk dokumen`,
          "Document",
          documentId,
          user?.id
        );
      }
    }

    if (pilgrimId) {
      revalidatePath(`/documents/${pilgrimId}`);
    }
    revalidatePath("/documents");

    return { success: true, filePath: publicUrl, fileName: file.name };
  } catch (err: any) {
    console.error("uploadDocumentAction error:", err);
    return { error: err.message || "Gagal mengunggah dokumen." };
  }
}

export async function verifyDocumentAction(formData: FormData) {
  try {
    const documentId = formData.get("document_id") as string;
    const pilgrimId = formData.get("pilgrim_id") as string;
    const status = formData.get("status") as string;

    if (!documentId || !status) {
      return { error: "Data verifikasi tidak lengkap." };
    }

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { error } = await supabase
          .from("documents")
          .update({
            status,
          })
          .eq("id", documentId);

        if (error) {
          return { error: error.message };
        }

        const user = await getSessionUser();
        await recordActivityLog(
          "updated",
          `Memperbarui status verifikasi dokumen menjadi "${status}"`,
          "Document",
          documentId,
          user?.id
        );
      }
    }

    if (pilgrimId) {
      revalidatePath(`/documents/${pilgrimId}`);
    }
    revalidatePath("/documents");

    return { success: true };
  } catch (err: any) {
    console.error("verifyDocumentAction error:", err);
    return { error: err.message || "Gagal memverifikasi dokumen." };
  }
}

export async function deleteDocumentFileAction(docId: string, pilgrimId?: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const supabase = await createServerSupabase();
    if (!supabase) return { success: true };

    const { error } = await supabase
      .from("documents")
      .update({
        file_path: null,
        status: "pending",
      })
      .eq("id", docId);

    if (error) {
      console.error("deleteDocumentFileAction error:", error);
      return { error: error.message };
    }

    const user = await getSessionUser();
    await recordActivityLog(
      "deleted",
      `Menghapus berkas dokumen`,
      "Document",
      docId,
      user?.id
    );

    if (pilgrimId) {
      revalidatePath(`/documents/${pilgrimId}`);
    }
    revalidatePath("/documents");
    return { success: true };
  } catch (err: any) {
    console.error("deleteDocumentFileAction exception:", err);
    return { error: err.message || "Gagal menghapus berkas dokumen." };
  }
}
