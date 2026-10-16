import Link from "next/link";
import { BankAccountTable } from "@/features/bank-accounts/components/BankAccountTable";
import { getBankAccountsList } from "@/features/bank-accounts/services/bankAccountService";

export const dynamic = "force-dynamic";

interface BankAccountsPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function BankAccountsPage({ searchParams }: BankAccountsPageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || "";

  const bankAccounts = await getBankAccountsList(search);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching Screenshot 3 */}
      <div className="text-xs text-gray-500 flex items-center gap-1.5">
        <Link href="/" className="hover:text-emerald-700">
          Beranda
        </Link>
        <span>&gt;</span>
        <span className="text-gray-700 font-medium">Rekening Bank</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Rekening Bank</h1>
          <p className="text-xs text-gray-500 mt-1">Daftar rekening bank penerimaan pembayaran</p>
        </div>
        <Link
          href="/bank-accounts/create"
          className="inline-flex items-center justify-center gap-2 bg-[#0d9488] hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m4-11v11m4-11v11m4-11v11" />
          </svg>
          <span>Tambah Rekening</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <form method="GET" className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Cari nama bank..."
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

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <BankAccountTable bankAccounts={bankAccounts} />
      </div>
    </div>
  );
}
