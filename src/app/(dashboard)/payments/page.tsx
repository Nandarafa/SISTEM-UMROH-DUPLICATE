import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { currency, formatDate } from "@/lib/utils";
import { getPaymentsList } from "@/features/payments/services/paymentService";
import { getSessionUser } from "@/features/auth/services/authActions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    status?: string;
    type?: string;
  }>;
}

export default async function PaymentsPage({ searchParams }: PageProps) {
  const { status = "", type = "" } = await searchParams;
  const user = await getSessionUser();
  const isStaff = user?.role === "super_admin" || user?.role === "admin";
  const items = await getPaymentsList(status, type, user);

  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "unpaid", label: "Belum Bayar" },
    { value: "partial", label: "Sebagian" },
    { value: "paid", label: "Lunas" },
  ];

  const typeOptions = [
    { value: "", label: "Semua Jenis" },
    { value: "dp", label: "Uang Muka (DP)" },
    { value: "installment", label: "Cicilan" },
    { value: "settlement", label: "Pelunasan" },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Pembayaran</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Pembayaran &amp; Cicilan</h1>
            <p className="text-xs text-gray-400 mt-0.5">Daftar tagihan jamaah</p>
          </div>
          {isStaff && (
            <div>
              <Link
                href="/payments/mass-billing"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0d9488] text-white text-xs font-medium hover:bg-teal-700 shadow-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Buat Tagihan Massal</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Filter Card & Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filter Form */}
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
            name="type"
            defaultValue={type}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-[#0d9488] focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
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
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-medium uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Kode</th>
                  <th className="px-4 py-3 font-semibold">Jamaah</th>
                  <th className="px-4 py-3 font-semibold">Paket</th>
                  <th className="px-4 py-3 font-semibold">Jenis</th>
                  <th className="px-4 py-3 font-semibold">Tagihan</th>
                  <th className="px-4 py-3 font-semibold">Dibayar</th>
                  <th className="px-4 py-3 font-semibold">Belum Dibayar</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Jatuh Tempo</th>
                  <th className="px-4 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{b.code}</td>
                    <td className="px-4 py-3 text-gray-700">{b.pilgrimName}</td>
                    <td className="px-4 py-3 text-gray-700">{b.packageName}</td>
                    <td className="px-4 py-3">
                      <Badge color={b.typeColor}>{b.typeLabel}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{currency(b.amount)}</td>
                    <td className="px-4 py-3 text-emerald-600 font-medium">{currency(b.paid_amount)}</td>
                    <td className="px-4 py-3 font-medium">
                      {b.outstanding > 0 ? (
                        <span className="text-red-600">{currency(b.outstanding)}</span>
                      ) : (
                        <span className="text-gray-400">Rp 0</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={b.statusColor}>{b.statusLabel}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{formatDate(b.due_date)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link
                        href={`/payments/${b.registration_id}`}
                        className={`text-sm font-medium hover:underline ${
                          b.outstanding > 0 ? "text-[#0d9488] font-semibold" : "text-gray-500"
                        }`}
                      >
                        {b.outstanding > 0 ? "Bayar / Detail" : "Detail"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
            <div>
              Showing <span className="font-medium text-gray-700">1</span> to{" "}
              <span className="font-medium text-gray-700">{items.length}</span> of{" "}
              <span className="font-medium text-gray-700">{items.length}</span> results
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled
                className="px-2.5 py-1 rounded border border-gray-200 text-gray-400 disabled:opacity-50 text-xs"
              >
                &lsaquo;
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded bg-[#0d9488] text-white font-medium text-xs"
              >
                1
              </button>
              <button
                type="button"
                disabled
                className="px-2.5 py-1 rounded border border-gray-200 text-gray-400 disabled:opacity-50 text-xs"
              >
                &rsaquo;
              </button>
            </div>
          </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <div className="h-12 w-12 rounded-xl bg-gray-50 grid place-items-center text-gray-300 mx-auto mb-3">
              <Icon name="cash" className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Belum ada tagihan</p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Buat tagihan dari halaman pendaftaran atau lewat tagihan massal per paket.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
