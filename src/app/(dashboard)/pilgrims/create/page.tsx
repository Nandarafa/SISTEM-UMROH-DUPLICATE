import Link from "next/link";
import { PilgrimForm } from "@/features/pilgrims/components/PilgrimForm";
import { createPilgrimAction } from "@/features/pilgrims/services/pilgrimMutations";
import { getSessionUser } from "@/features/auth/services/authActions";
import { getBranchOptions } from "@/features/bank-accounts/services/bankAccountService";
import { getAgentsList } from "@/features/agents/services/agentService";
import { getGuideOptions } from "@/features/guides/services/guideService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CreatePilgrimPage() {
  const user = await getSessionUser();
  const [branches, agentsList, guides] = await Promise.all([
    getBranchOptions(),
    getAgentsList(),
    getGuideOptions(),
  ]);

  const agents = agentsList.map((a) => ({ id: a.id, name: a.name }));

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:underline">Beranda</Link>
          <span>&rsaquo;</span>
          <Link href="/pilgrims" className="hover:underline">Jamaah</Link>
          <span>&rsaquo;</span>
          <span className="text-gray-600 font-medium">Tambah</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800">Tambah Jamaah</h1>
      </div>

      <PilgrimForm
        isEdit={false}
        branches={branches}
        agents={agents}
        guides={guides}
        userRole={user?.role}
        onSaveAction={createPilgrimAction}
      />
    </div>
  );
}
