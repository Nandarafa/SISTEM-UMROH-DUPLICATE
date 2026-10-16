import Link from "next/link";
import { notFound } from "next/navigation";
import { getBankAccountDetail, getBranchOptions } from "@/features/bank-accounts/services/bankAccountService";
import { EditBankAccountForm } from "@/features/bank-accounts/components/EditBankAccountForm";

export const dynamic = "force-dynamic";

interface EditBankAccountPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBankAccountPage({ params }: EditBankAccountPageProps) {
  const { id } = await params;
  const [account, branches] = await Promise.all([
    getBankAccountDetail(id),
    getBranchOptions(),
  ]);

  if (!account) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Breadcrumb & Header matching Screenshot 5 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/bank-accounts" className="hover:text-gray-600">Rekening Bank</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Edit</span>
        </nav>
        <h1 className="text-xl font-bold text-gray-800">Edit Rekening Bank</h1>
        <p className="text-xs text-gray-400 mt-0.5">{account.bank_name}</p>
      </div>

      <EditBankAccountForm account={account} branches={branches} />
    </div>
  );
}
