import Link from "next/link";
import { AgentTable } from "@/features/agents/components/AgentTable";
import { getAgentsList } from "@/features/agents/services/agentService";

export const dynamic = "force-dynamic";

interface AgentsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || "";
  const status = resolvedParams?.status || "";

  const agents = await getAgentsList(search, status);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching Screenshot 2 */}
      <div className="text-xs text-gray-500 flex items-center gap-1.5">
        <Link href="/" className="hover:text-emerald-700">
          Beranda
        </Link>
        <span>&gt;</span>
        <span className="text-gray-700 font-medium">Agen</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Agen / Marketing</h1>
          <p className="text-xs text-gray-500 mt-1">Daftar agen &amp; marketing</p>
        </div>
        <Link
          href="/agents/create"
          className="inline-flex items-center justify-center gap-2 bg-[#0d9488] hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
          <span>Tambah Agen</span>
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
              placeholder="Cari nama / kode..."
              className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>
          <select
            name="status"
            defaultValue={status}
            className="text-xs rounded-lg border border-gray-200 px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
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
        <AgentTable agents={agents} />
      </div>
    </div>
  );
}
