import Link from "next/link";
import { getEquipmentList } from "@/features/equipment/services/equipmentService";
import { EquipmentTable } from "./EquipmentTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EquipmentPage() {
  const items = await getEquipmentList();

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching Screenshot 4 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Perlengkapan</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#1e293b]">Perlengkapan</h1>
            <p className="text-xs text-[#64748b] mt-1">Distribusi perlengkapan jamaah</p>
          </div>
          <div>
            <Link
              href="/equipment/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f766e] text-white text-xs font-medium hover:bg-[#0d6d66] shadow-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Tambah Perlengkapan</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Table Component */}
      <EquipmentTable items={items} />
    </div>
  );
}
