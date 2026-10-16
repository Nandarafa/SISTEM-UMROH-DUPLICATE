import Link from "next/link";
import { notFound } from "next/navigation";
import { getPilgrims } from "@/features/pilgrims/services/pilgrimService";
import { getEquipmentDetail } from "@/features/equipment/services/equipmentService";
import { EquipmentForm } from "@/app/(dashboard)/equipment/create/EquipmentForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEquipmentPage({ params }: PageProps) {
  const { id } = await params;
  const [pilgrims, equipment] = await Promise.all([
    getPilgrims(),
    getEquipmentDetail(id),
  ]);

  if (!equipment) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/equipment" className="hover:text-gray-600">Perlengkapan</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Edit</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Edit Perlengkapan</h1>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <EquipmentForm pilgrims={pilgrims} initialData={equipment} isEdit={true} />
      </div>
    </div>
  );
}
