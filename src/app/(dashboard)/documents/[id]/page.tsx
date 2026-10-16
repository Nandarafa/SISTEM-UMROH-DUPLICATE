import Link from "next/link";
import { notFound } from "next/navigation";
import { getPilgrimDetail } from "@/features/pilgrims/services/pilgrimService";
import { getPilgrimDocuments } from "@/features/documents/services/documentService";
import { DocumentUploadRow } from "@/features/documents/components/DocumentUploadRow";
import { seedStandardChecklistAction } from "@/features/documents/services/documentActions";
import { getSessionUser } from "@/features/auth/services/authActions";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface DocumentManagePageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentManagePage({ params }: DocumentManagePageProps) {
  const user = await getSessionUser();
  const canDeletePhoto = user?.role === "admin" || user?.role === "super_admin";
  const { id } = await params;
  const pilgrim = await getPilgrimDetail(id);

  if (!pilgrim) {
    notFound();
  }

  const data = await getPilgrimDocuments(pilgrim.id);

  async function handleSeed() {
    "use server";
    if (pilgrim) {
      await seedStandardChecklistAction(pilgrim.id);
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching Screenshot */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/documents" className="hover:text-gray-600">Dokumen</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">{pilgrim.name}</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Dokumen &mdash; {pilgrim.name}</h1>
            <p className="text-xs text-gray-400 mt-0.5">Kode: {pilgrim.code}</p>
          </div>
          <div>
            <form action={handleSeed}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 shadow-sm transition-colors cursor-pointer"
              >
                <Icon name="check" className="w-4 h-4 text-gray-500" />
                <span>Buat Checklist Standar</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {data.documents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-medium uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-6 py-3 font-semibold">DOKUMEN</th>
                  <th className="px-6 py-3 font-semibold">STATUS</th>
                  <th className="px-6 py-3 font-semibold">BERKAS</th>
                  <th className="px-6 py-3 font-semibold">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.documents.map((doc) => (
                  <DocumentUploadRow key={doc.id} doc={doc} canDeletePhoto={canDeletePhoto} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 px-6 text-center">
            <div className="h-12 w-12 rounded-xl bg-gray-50 grid place-items-center text-gray-400 mx-auto mb-3">
              <Icon name="doc" className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800">Checklist dokumen masih kosong</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto mb-4">
              Klik tombol &ldquo;Buat Checklist Standar&rdquo; di bawah untuk membuat daftar dokumen wajib jamaah (KTP, Kartu Keluarga, Paspor, Pas Foto, Buku Nikah, dan Sertifikat Vaksin).
            </p>
            <form action={handleSeed}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0d9488] text-white text-xs font-semibold hover:bg-teal-700 shadow-sm transition-colors cursor-pointer"
              >
                <Icon name="check" className="w-4 h-4" />
                <span>Buat Checklist Standar Sekarang</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
