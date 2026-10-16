import Link from "next/link";
import { getSessionUser } from "@/features/auth/services/authActions";
import { getAllPilgrimsDocumentSummaries } from "@/features/documents/services/documentSummaryService";
import { getPilgrimDocuments } from "@/features/documents/services/documentService";
import { DocumentUploadRow } from "@/features/documents/components/DocumentUploadRow";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface DocumentsPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const user = await getSessionUser();
  const isPilgrim = user?.role === "pilgrim";

  // If pilgrim account, show their own document checklist (Screenshot 3)
  if (isPilgrim) {
    const data = await getPilgrimDocuments(user?.email);
    return (
      <div className="space-y-6">
        <div>
          <nav className="flex items-center text-xs text-gray-400 mb-2">
            <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-gray-600 font-medium">Dokumen</span>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-gray-600 font-medium">{data.pilgrim.name}</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Dokumen &mdash; {data.pilgrim.name}</h1>
              <p className="text-xs text-gray-400 mt-0.5">Kode: {data.pilgrim.code}</p>
            </div>
            <div>
              <form
                action={async () => {
                  "use server";
                  if (data.pilgrim.id) {
                    const { seedStandardChecklistAction } = await import(
                      "@/features/documents/services/documentActions"
                    );
                    await seedStandardChecklistAction(data.pilgrim.id);
                  }
                }}
              >
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
                    <DocumentUploadRow key={doc.id} doc={doc} />
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
                Klik tombol &ldquo;Buat Checklist Standar&rdquo; di atas untuk membuat daftar dokumen wajib jamaah.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Admin / Staff / Agent view: Document management per jamaah matching Screenshot 2
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || "";
  const summaries = await getAllPilgrimsDocumentSummaries(search);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching Screenshot 2 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Dokumen</span>
        </nav>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Dokumen Jamaah</h1>
          <p className="text-xs text-gray-500 mt-1">Kelengkapan &amp; verifikasi dokumen per jamaah</p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <form method="GET" className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Cari nama jamaah..."
              className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Table Card matching Screenshot 2 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/75 text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">JAMAAH</th>
                <th className="px-6 py-3.5">CABANG</th>
                <th className="px-6 py-3.5">KELENGKAPAN</th>
                <th className="px-6 py-3.5">STATUS</th>
                <th className="px-6 py-3.5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {summaries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center text-xs text-gray-400">
                    Belum ada data jamaah. Silakan daftarkan jamaah terlebih dahulu di menu Pendaftaran atau Jamaah.
                  </td>
                </tr>
              ) : (
                summaries.map((s) => {
                  const percent = s.totalCount > 0 ? Math.round((s.uploadedCount / s.totalCount) * 100) : 0;
                  return (
                    <tr key={s.id} className="hover:bg-gray-50/60 transition">
                      <td className="px-6 py-4 font-semibold text-gray-800 text-xs">
                        {s.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{s.branchName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-28 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-[#0f766e] h-1.5 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-gray-400 text-[11px] font-mono">
                            {s.uploadedCount}/{s.totalCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                            s.status === "Lengkap"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link
                          href={`/documents/${s.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 transition text-xs font-semibold"
                        >
                          <span>Kelola &amp; Upload</span>
                          <span>&rarr;</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
