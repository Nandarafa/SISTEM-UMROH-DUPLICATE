import Link from "next/link";
import { getPilgrims } from "@/features/pilgrims/services/pilgrimService";
import { EquipmentForm } from "./EquipmentForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AddEquipmentPage() {
  const pilgrims = await getPilgrims();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb & Header matching Screenshot 5 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/equipment" className="hover:text-gray-600">Perlengkapan</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Tambah</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Tambah Perlengkapan</h1>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <EquipmentForm pilgrims={pilgrims} />
      </div>
    </div>
  );
}
