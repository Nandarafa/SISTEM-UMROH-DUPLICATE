"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { PilgrimDocumentItem } from "@/features/documents/services/documentService";
import {
  deleteDocumentFileAction,
  uploadDocumentAction,
  verifyDocumentAction,
} from "@/features/documents/services/documentActions";

interface DocumentUploadRowProps {
  doc: PilgrimDocumentItem;
  canDeletePhoto?: boolean;
}

export function DocumentUploadRow({ doc, canDeletePhoto = false }: DocumentUploadRowProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(doc.file_path || null);
  const [showNotification, setShowNotification] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3500);
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.set("document_id", doc.id);
    formData.set("pilgrim_id", doc.pilgrim_id);
    formData.set("file", selectedFile);

    const res = await uploadDocumentAction(formData);
    setIsUploading(false);

    if (res?.error) {
      alert("Gagal mengunggah berkas: " + res.error);
    } else {
      setPreviewUrl(res?.filePath || URL.createObjectURL(selectedFile));
      setUploadedFileName(selectedFile.name);
      setIsUploaded(true);
      setIsDeleted(false);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 4000);
      router.refresh();
    }
  };

  const handleVerifyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    const formData = new FormData();
    formData.set("document_id", doc.id);
    formData.set("pilgrim_id", doc.pilgrim_id);
    formData.set("status", newStatus);

    await verifyDocumentAction(formData);
    router.refresh();
  };

  const handleDeleteFile = () => {
    if (confirm(`Yakin ingin menghapus berkas dokumen untuk "${doc.label}"?`)) {
      startTransition(async () => {
        await deleteDocumentFileAction(doc.id, doc.pilgrim_id);
        setIsUploaded(false);
        setIsDeleted(true);
        setSelectedFile(null);
        setUploadedFileName(null);
        setPreviewUrl(null);
        router.refresh();
      });
    }
  };

  const hasFile = !isDeleted && (isUploaded || !!doc.file_name || !!doc.file_path);

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 font-medium text-gray-800">
          <p>{doc.label}</p>
        </td>
        <td className="px-6 py-4">
          <Badge color={isDeleted ? "gray" : isUploaded ? "amber" : doc.statusColor}>
            {isDeleted ? "Belum Diunggah" : isUploaded ? "Sudah Diunggah" : doc.statusLabel}
          </Badge>
          {doc.verified_at && !isDeleted && (
            <p className="text-[11px] text-emerald-600 mt-1 font-medium">{doc.verified_at}</p>
          )}
        </td>
        <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">
          {isDeleted
            ? "Belum diunggah"
            : uploadedFileName
            ? uploadedFileName
            : selectedFile
            ? selectedFile.name
            : doc.file_name
            ? doc.file_name
            : "Belum diunggah"}
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-wrap items-center gap-2">
            {hasFile ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (!previewUrl) {
                      setPreviewUrl(doc.file_path || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80");
                    }
                    setShowPreviewModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-[#0d9488] text-xs font-semibold hover:bg-teal-100 transition shadow-sm cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>Lihat Berkas</span>
                </button>

                {/* Staff verification dropdown */}
                {canDeletePhoto && (
                  <select
                    defaultValue={doc.status}
                    onChange={handleVerifyChange}
                    className="text-xs rounded-lg border border-gray-300 py-1.5 px-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
                  >
                    <option value="pending">Belum Diunggah</option>
                    <option value="uploaded">Sudah Diunggah</option>
                    <option value="verified">Terverifikasi</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                )}

                {canDeletePhoto && (
                  <button
                    type="button"
                    onClick={handleDeleteFile}
                    disabled={isPending}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium hover:bg-red-100 transition shadow-sm cursor-pointer disabled:opacity-50"
                    title="Hapus berkas dokumen"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span>Hapus</span>
                  </button>
                )}
              </>
            ) : (
              <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                        setShowTooltip(false);
                      } else {
                        setSelectedFile(null);
                      }
                    }}
                    className="text-xs text-gray-700 border border-gray-300 rounded-lg px-2.5 py-1 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                  />

                  {showTooltip && (
                    <div className="absolute left-4 top-full mt-1.5 z-30 flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 shadow-lg rounded text-xs text-gray-800 animate-in fade-in zoom-in-95">
                      <div className="h-4 w-4 bg-[#f97316] text-white rounded-sm grid place-items-center font-bold text-[10px] shrink-0">
                        !
                      </div>
                      <span className="font-medium whitespace-nowrap">Silakan pilih berkas terlebih dahulu.</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0d9488] text-white text-xs font-semibold hover:bg-teal-700 transition-colors shadow-sm cursor-pointer shrink-0 disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isUploading ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Mengunggah...</span>
                    </>
                  ) : (
                    <span>Unggah</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </td>
      </tr>

      {/* Toast notification */}
      {showNotification && (
        <tr>
          <td colSpan={4} className="p-0 border-0">
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-gray-900 text-white text-xs rounded-xl shadow-2xl border border-gray-800 animate-in fade-in slide-in-from-bottom-4">
              <div className="h-6 w-6 rounded-full bg-emerald-500 text-white grid place-items-center font-bold text-xs shrink-0">
                ✓
              </div>
              <div>
                <p className="font-semibold text-gray-100">Berkas Berhasil Diunggah</p>
                <p className="text-gray-400 text-[11px] mt-0.5">
                  Berkas <span className="text-white font-medium">{uploadedFileName}</span> telah tersimpan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNotification(false)}
                className="ml-2 text-gray-400 hover:text-white text-sm"
              >
                &times;
              </button>
            </div>
          </td>
        </tr>
      )}

      {/* Modal Preview Berkas */}
      {showPreviewModal && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">Preview Dokumen: {doc.label}</h4>
                <p className="text-xs text-gray-400 truncate max-w-xs">{uploadedFileName || doc.file_name || doc.label}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="h-8 w-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 grid place-items-center text-sm font-bold transition"
              >
                &times;
              </button>
            </div>

            <div className="p-4 bg-gray-50 flex items-center justify-center max-h-[70vh] overflow-auto">
              {previewUrl.toLowerCase().endsWith(".pdf") ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700">Berkas Dokumen PDF</p>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-3 px-4 py-2 bg-[#0d9488] text-white rounded-lg text-xs font-semibold hover:bg-teal-700"
                  >
                    Buka / Unduh PDF
                  </a>
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewUrl}
                  alt={doc.label}
                  className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-sm border border-gray-200"
                />
              )}
            </div>

            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">Status: <strong className="text-gray-700">{doc.statusLabel}</strong></span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
