import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { getRegistrationsList } from "@/features/registrations/services/registrationService";
import { getSessionUser } from "@/features/auth/services/authActions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    status?: string;
    package?: string;
  }>;
}

export default async function RegistrationsPage({ searchParams }: PageProps) {
  const user = await getSessionUser();
  const isStaff = user?.role === "super_admin" || user?.role === "admin";
  const isAgent = user?.role === "agent";
  const canCreate = isStaff || isAgent;
  const { status = "", package: pkg = "" } = await searchParams;
  const { items, packages } = await getRegistrationsList(status, pkg, user ? { role: user.role, email: user.email, id: user.id } : null);

  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "pending", label: "Menunggu" },
    { value: "confirmed", label: "Dikonfirmasi" },
    { value: "document_complete", label: "Dokumen Lengkap" },
    { value: "paid", label: "Lunas" },
    { value: "departed", label: "Berangkat" },
    { value: "cancelled", label: "Dibatalkan" },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">
            {user?.role === "pilgrim" ? "Pendaftaran Saya" : "Pendaftaran"}
          </span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {user?.role === "pilgrim" ? "Pendaftaran Saya" : "Pendaftaran"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {user?.role === "pilgrim"
                ? "Riwayat dan status pendaftaran paket Anda"
                : "Booking jamaah ke paket Umroh & Haji"}
            </p>
          </div>
          {canCreate && (
            <div>
              <Link
                href="/registrations/create"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0d9488] text-white text-xs font-medium hover:bg-teal-700 shadow-sm transition-colors"
              >
                <Icon name="list" className="w-4 h-4" />
                <span>Daftarkan Jamaah</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Filter Card & Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <form method="GET" className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-[#0d9488] focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            name="package"
            defaultValue={pkg}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-[#0d9488] focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
          >
            <option value="">Semua Paket</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Filter
          </button>
        </form>

        {/* Content */}
        {items.length > 0 ? (
          <>
            {/* Mobile Card List (hidden on md+) */}
            <div className="md:hidden divide-y divide-gray-100">
              {items.map((r, idx) => (
                <div
                  key={r.id}
                  className="p-4 space-y-3 hover:bg-gray-50/80 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-semibold text-gray-900 text-sm block">{r.pilgrimName}</span>
                      <span className="text-[11px] text-gray-400 font-mono">{r.code}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge color={r.statusColor}>{r.statusLabel}</Badge>
                      <Badge color={r.paymentStatusColor}>{r.paymentStatusLabel}</Badge>
                    </div>
                  </div>

                  <div className="text-xs bg-gray-50/70 rounded-lg p-2.5 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Paket</span>
                      <span className="font-medium text-gray-800 text-right">{r.packageName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tgl Daftar</span>
                      <span className="text-gray-600">{r.registeredAtFormatted}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100/60">
                    <Link
                      href={`/registrations/${r.id}`}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-100 transition active:scale-95"
                    >
                      Detail
                    </Link>
                    {user?.role !== "pilgrim" && (
                      <Link
                        href={`/registrations/${r.id}/edit`}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-medium hover:bg-teal-100 transition active:scale-95"
                      >
                        Edit
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (hidden on mobile, shown on md+) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-medium uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Kode</th>
                    <th className="px-4 py-3 font-semibold">Jamaah</th>
                    <th className="px-4 py-3 font-semibold">Paket</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Bayar</th>
                    <th className="px-4 py-3 font-semibold">Tgl Daftar</th>
                    <th className="px-4 py-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((r, idx) => (
                    <tr
                      key={r.id}
                      className="hover:bg-gray-50 transition-colors animate-fade-in-up"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">{r.code}</td>
                      <td className="px-4 py-3 text-gray-700">{r.pilgrimName}</td>
                      <td className="px-4 py-3 text-gray-700">{r.packageName}</td>
                      <td className="px-4 py-3">
                        <Badge color={r.statusColor}>{r.statusLabel}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={r.paymentStatusColor}>{r.paymentStatusLabel}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{r.registeredAtFormatted}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                        <Link
                          href={`/registrations/${r.id}`}
                          className="text-[#0d9488] text-sm font-medium hover:underline"
                        >
                          Detail
                        </Link>
                        {user?.role !== "pilgrim" && (
                          <Link
                            href={`/registrations/${r.id}/edit`}
                            className="text-gray-500 text-sm font-medium hover:underline"
                          >
                            Edit
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <div className="h-12 w-12 rounded-xl bg-gray-50 grid place-items-center text-gray-300 mx-auto mb-3">
              <Icon name="list" className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Belum ada pendaftaran</p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Daftarkan jamaah ke paket yang berstatus terbuka untuk memulai.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
