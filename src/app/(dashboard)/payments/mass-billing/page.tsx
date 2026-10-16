import Link from "next/link";
import { getPackagesList } from "@/features/packages/services/packageService";
import { MassBillingForm } from "./MassBillingForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MassBillingPage() {
  const packages = await getPackagesList();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/payments" className="hover:text-gray-600">Pembayaran</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Tagihan Massal</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Buat Tagihan Massal</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Buat skema DP &amp; cicilan untuk seluruh jamaah aktif sebuah paket
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <MassBillingForm packages={packages} />
      </div>
    </div>
  );
}
