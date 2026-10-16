import Link from "next/link";
import { notFound } from "next/navigation";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { currency, formatDate } from "@/lib/utils";
import { getRegistrationPaymentsDetail } from "@/features/payments/services/paymentService";
import { getSessionUser } from "@/features/auth/services/authActions";
import { PaymentItemsList } from "./PaymentItemsList";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PaymentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getSessionUser();
  const isStaff = user?.role === "super_admin" || user?.role === "admin";
  const data = await getRegistrationPaymentsDetail(id);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center text-xs text-gray-400">
        <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
        <span className="mx-2">&rsaquo;</span>
        <Link href="/payments" className="hover:text-gray-600">Pembayaran</Link>
        <span className="mx-2">&rsaquo;</span>
        <span className="text-gray-600 font-medium">{data.registrationCode}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Tagihan: {data.pilgrimName}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{data.registrationCode}</p>
        </div>
        <div>
          <Link
            href={`/registrations/${data.registrationId}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 shadow-sm transition-colors"
          >
            <Icon name="list" className="w-4 h-4 text-gray-500" />
            <span>Detail Pendaftaran</span>
          </Link>
        </div>
      </div>

      {/* 3 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          label="Total Tagihan"
          value={currency(data.totalBilled)}
          icon="cash"
          color="blue"
        />
        <StatsCard
          label="Sudah Dibayar"
          value={currency(data.totalPaid)}
          icon="bank"
          color="green"
        />
        <StatsCard
          label="Sisa"
          value={currency(data.outstanding)}
          icon="list"
          color="amber"
          sub={data.paymentStatusLabel}
        />
      </div>

      {/* Daftar Tagihan */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Daftar Tagihan</h3>

        {data.items.length > 0 ? (
          <PaymentItemsList
            items={data.items}
            registrationId={data.registrationId}
            isStaff={isStaff}
            pilgrimName={data.pilgrimName}
          />
        ) : (
          <div className="py-8 text-center">
            <div className="h-10 w-10 rounded-lg bg-gray-50 grid place-items-center text-gray-300 mx-auto mb-2">
              <Icon name="cash" className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-gray-700">Belum ada tagihan</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Tagihan untuk pendaftaran ini belum dibuat.</p>
          </div>
        )}
      </div>
    </div>
  );
}
