import Link from "next/link";
import { getBranchOptions } from "@/features/bank-accounts/services/bankAccountService";
import { CreateGuideForm } from "@/features/guides/components/CreateGuideForm";

export const dynamic = "force-dynamic";

export default async function CreateGuidePage() {
  const branches = await getBranchOptions();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/guides" className="hover:text-gray-600">Muthawif</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Tambah</span>
        </nav>
        <h1 className="text-xl font-bold text-gray-800">Tambah Muthawif</h1>
      </div>

      <CreateGuideForm branches={branches} />
    </div>
  );
}
