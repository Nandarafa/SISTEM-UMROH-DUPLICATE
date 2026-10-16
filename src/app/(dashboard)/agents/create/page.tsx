import Link from "next/link";
import { getBranchOptions } from "@/features/bank-accounts/services/bankAccountService";
import { CreateAgentForm } from "@/features/agents/components/CreateAgentForm";

export const dynamic = "force-dynamic";

export default async function CreateAgentPage() {
  const branches = await getBranchOptions();

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Breadcrumb & Header matching Screenshot 3 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/agents" className="hover:text-gray-600">Agen</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Tambah</span>
        </nav>
        <h1 className="text-xl font-bold text-gray-800">Tambah Agen</h1>
      </div>

      <CreateAgentForm branches={branches} />
    </div>
  );
}
