import Link from "next/link";
import { notFound } from "next/navigation";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { currency, formatDate } from "@/lib/utils";
import { getRegistrationDetail } from "@/features/registrations/services/registrationService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RegistrationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const registration = await getRegistrationDetail(id);

  if (!registration) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center text-xs text-gray-400">
        <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
        <span className="mx-2">&rsaquo;</span>
        <Link href="/registrations" className="hover:text-gray-600">Pendaftaran</Link>
        <span className="mx-2">&rsaquo;</span>
        <span className="text-gray-600 font-medium">{registration.code}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{registration.pilgrim.name}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{registration.code}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/registrations/${registration.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50 shadow-sm transition-colors"
          >
            <Icon name="pencil" className="w-3.5 h-3.5 text-gray-500" />
            <span>Edit Pendaftaran</span>
          </Link>
          <Link
            href={`/payments/${registration.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d9488] text-white text-xs font-medium hover:bg-teal-700 shadow-sm transition-colors"
          >
            <Icon name="cash" className="w-3.5 h-3.5 text-white" />
            <span>Kelola Tagihan</span>
          </Link>
        </div>
      </div>

      {/* 3 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          label="Total Tagihan"
          value={currency(registration.totalBilled)}
          icon="cash"
          color="blue"
        />
        <StatsCard
          label="Sudah Dibayar"
          value={currency(registration.totalPaid)}
          icon="bank"
          color="green"
        />
        <StatsCard
          label="Sisa"
          value={currency(registration.outstanding)}
          icon="list"
          color="amber"
          sub={registration.paymentStatusLabel}
        />
      </div>

      {/* 2 Detail Cards: Informasi Pendaftaran & Jamaah & Paket */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informasi Pendaftaran */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Informasi Pendaftaran</h3>
          <dl className="divide-y divide-gray-100 text-sm">
            <div className="flex justify-between py-2.5">
              <dt className="text-gray-500">Status</dt>
              <dd>
                <Badge color={registration.statusColor}>{registration.statusLabel}</Badge>
              </dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-gray-500">Tanggal Daftar</dt>
              <dd className="text-gray-800">{formatDate(registration.registered_at)}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-gray-500">Harga Paket</dt>
              <dd className="text-gray-800">{currency(registration.total_price)}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-gray-500">Agen</dt>
              <dd className="text-gray-800">{registration.agentName}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-gray-500">Pembimbing</dt>
              <dd className="text-gray-800">{registration.guideName}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-gray-500">Cabang</dt>
              <dd className="text-gray-800">{registration.branchName}</dd>
            </div>
          </dl>
          {registration.notes && (
            <p className="mt-3 text-sm text-gray-600 whitespace-pre-line">{registration.notes}</p>
          )}
        </div>

        {/* Jamaah & Paket */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Jamaah &amp; Paket</h3>
          <dl className="divide-y divide-gray-100 text-sm">
            <div className="flex justify-between py-2.5">
              <dt className="text-gray-500">Jamaah</dt>
              <dd className="text-gray-800">{registration.pilgrim.name}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-gray-500">No. Paspor</dt>
              <dd className="text-gray-800">{registration.pilgrim.passport_number}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-gray-500">Telepon</dt>
              <dd className="text-gray-800">{registration.pilgrim.phone}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-gray-500">Paket</dt>
              <dd className="text-gray-800">{registration.package.name}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-gray-500">Jenis Paket</dt>
              <dd>
                <Badge color={registration.package.typeColor}>{registration.package.typeLabel}</Badge>
              </dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-gray-500">Tanggal Berangkat</dt>
              <dd className="text-gray-800">{formatDate(registration.package.departure_date)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Tagihan & Pembayaran Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-sm">Tagihan &amp; Pembayaran</h3>
          <Link
            href={`/payments/${registration.id}`}
            className="text-sm text-[#0d9488] hover:underline font-medium"
          >
            Kelola Tagihan
          </Link>
        </div>

        {registration.payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-medium uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-6 py-3 font-semibold">Kode</th>
                  <th className="px-6 py-3 font-semibold">Jenis</th>
                  <th className="px-6 py-3 font-semibold">Tagihan</th>
                  <th className="px-6 py-3 font-semibold">Dibayar</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Jatuh Tempo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registration.payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-gray-800">{p.code}</td>
                    <td className="px-6 py-3.5">
                      <Badge color={p.typeColor}>{p.typeLabel}</Badge>
                    </td>
                    <td className="px-6 py-3.5 text-gray-700">{currency(p.amount)}</td>
                    <td className="px-6 py-3.5 text-gray-700">{currency(p.paid_amount)}</td>
                    <td className="px-6 py-3.5">
                      <Badge color={p.statusColor}>{p.statusLabel}</Badge>
                    </td>
                    <td className="px-6 py-3.5 text-gray-700">{formatDate(p.due_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center">
            <div className="h-10 w-10 rounded-lg bg-gray-50 grid place-items-center text-gray-400 mx-auto mb-2">
              <Icon name="cash" className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-gray-700">Belum ada tagihan</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Buat tagihan DP &amp; cicilan dari halaman kelola tagihan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
