import Link from "next/link";
import { getBranchOptions } from "@/features/bank-accounts/services/bankAccountService";
import { CreateBankAccountForm } from "@/features/bank-accounts/components/CreateBankAccountForm";

export const dynamic = "force-dynamic";

export default async function CreateBankAccountPage() {
  const branches = await getBranchOptions();

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Breadcrumb & Header matching Screenshot 4 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/bank-accounts" className="hover:text-gray-600">Rekening Bank</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Tambah</span>
        </nav>
        <h1 className="text-xl font-bold text-gray-800">Tambah Rekening Bank</h1>
      </div>

      <CreateBankAccountForm branches={branches} />
    </div>
  );
}
