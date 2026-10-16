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

        {/* Table Content */}
        {items.length > 0 ? (
          <div className="overflow-x-auto">
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
                {items.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
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
                      <Link
                        href={`/registrations/${r.id}/edit`}
                        className="text-gray-500 text-sm font-medium hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
