import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export interface PilgrimDocumentItem {
  id: string;
  pilgrim_id: string;
  type: string;
  label: string;
  status: string;
  statusLabel: string;
  statusColor: "gray" | "amber" | "green" | "red";
  file_path?: string | null;
  file_name?: string | null;
  verified_at?: string | null;
}

export interface PilgrimDocumentData {
  pilgrim: {
    id: string;
    name: string;
    code: string;
  };
  documents: PilgrimDocumentItem[];
}

function getDocumentStatusMeta(status: string) {
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

export const STANDARD_CHECKLIST = [
  { type: "ktp", label: "KTP" },
  { type: "kk", label: "Kartu Keluarga" },
  { type: "passport", label: "Paspor" },
  { type: "photo", label: "Pas Foto 4x6 (latar putih)" },
  { type: "marriage_book", label: "Buku Nikah / Akta Lahir" },
  { type: "vaccine", label: "Sertifikat Vaksin Meningitis" },
];

export async function getPilgrimDocuments(pilgrimIdOrEmail?: string): Promise<PilgrimDocumentData> {
  const emptyResult: PilgrimDocumentData = {
    pilgrim: {
      id: "",
      name: "-",
      code: "-",
    },
    documents: [],
  };

  if (!isSupabaseConfigured()) {
    return emptyResult;
  }

  const supabase = await createServerSupabase();
  if (!supabase) return emptyResult;

  try {
    let pilgrimQuery = supabase.from("pilgrims").select("id, name, code, email");

    if (pilgrimIdOrEmail && pilgrimIdOrEmail !== "-") {
      if (pilgrimIdOrEmail.length >= 30) {
        pilgrimQuery = pilgrimQuery.eq("id", pilgrimIdOrEmail);
      } else if (pilgrimIdOrEmail.startsWith("JM-")) {
        pilgrimQuery = pilgrimQuery.eq("code", pilgrimIdOrEmail);
      } else if (pilgrimIdOrEmail.includes("@")) {
        pilgrimQuery = pilgrimQuery.eq("email", pilgrimIdOrEmail);
      } else {
        pilgrimQuery = pilgrimQuery.or(`id.eq.${pilgrimIdOrEmail},code.eq.${pilgrimIdOrEmail}`);
      }
    } else {
      pilgrimQuery = pilgrimQuery.eq("email", "jamaah@example.com");
    }

    const { data: pilgrimList } = await pilgrimQuery.limit(1);
    const pilgrim = pilgrimList?.[0];

    if (!pilgrim) {
      return emptyResult;
    }

    let { data: docs } = await supabase
      .from("documents")
      .select("*")
      .eq("pilgrim_id", pilgrim.id);

    // If no documents exist for this pilgrim yet, auto-seed standard 6 checklist items
    if (!docs || docs.length === 0) {
      const toInsert = STANDARD_CHECKLIST.map((item) => ({
        pilgrim_id: pilgrim.id,
        type: item.type,
        label: item.label,
        status: "pending",
        file_path: null,
      }));
      const { data: insertedDocs } = await supabase.from("documents").insert(toInsert).select();
      if (insertedDocs) {
        docs = insertedDocs;
      }
    }

    // Sort documents in standard checklist order
    const typeOrder = STANDARD_CHECKLIST.map((s) => s.type);
    const sortedDocs = (docs || []).sort((a, b) => {
      const idxA = typeOrder.indexOf(a.type);
      const idxB = typeOrder.indexOf(b.type);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return (a.label || "").localeCompare(b.label || "");
    });

    const documentItems = sortedDocs.map((doc) => {
      const meta = getDocumentStatusMeta(doc.status);
      let fileName = null;
      if (doc.file_path) {
        fileName = doc.file_path.split("/").pop()?.split("\\").pop() || doc.file_path;
      }
      return {
        id: doc.id,
        pilgrim_id: doc.pilgrim_id,
        type: doc.type,
        label: doc.label || doc.type?.toUpperCase() || "Dokumen",
        status: doc.status,
        statusLabel: meta.label,
        statusColor: meta.color,
        file_path: doc.file_path,
        file_name: fileName,
        verified_at: doc.status === "verified" ? "Terverifikasi" : null,
      };
    });

    return {
      pilgrim: {
        id: pilgrim.id,
        name: pilgrim.name,
        code: pilgrim.code || "JM-0001",
      },
      documents: documentItems,
    };
  } catch (err) {
    console.error("Error in getPilgrimDocuments:", err);
    return emptyResult;
  }
}
