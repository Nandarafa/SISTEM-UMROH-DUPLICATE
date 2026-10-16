import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgentDetail } from "@/features/agents/services/agentService";
import { getBranchOptions } from "@/features/bank-accounts/services/bankAccountService";
import { EditAgentForm } from "@/features/agents/components/EditAgentForm";

export const dynamic = "force-dynamic";

interface EditAgentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAgentPage({ params }: EditAgentPageProps) {
  const { id } = await params;
  const [agent, branches] = await Promise.all([
    getAgentDetail(id),
    getBranchOptions(),
  ]);

  if (!agent) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Breadcrumb & Header matching Screenshot 4 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/agents" className="hover:text-gray-600">Agen</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Edit</span>
        </nav>
        <h1 className="text-xl font-bold text-gray-800">Edit Agen</h1>
        <p className="text-xs text-gray-400 mt-0.5">{agent.name}</p>
      </div>

      <EditAgentForm agent={agent} branches={branches} />
    </div>
  );
}
