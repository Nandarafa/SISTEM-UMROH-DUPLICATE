import Link from "next/link";
import { notFound } from "next/navigation";
import { getBranchDetail } from "@/features/branches/services/branchService";
import { BranchForm } from "@/features/branches/components/BranchForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBranchPage({ params }: PageProps) {
  const { id } = await params;
  const branch = await getBranchDetail(id);

  if (!branch) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/branches" className="hover:text-gray-600">Cabang</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Edit {branch.name}</span>
        </nav>
        <h1 className="text-xl font-bold text-gray-800">Edit Cabang</h1>
        <p className="text-xs text-gray-400 mt-1">Ubah data cabang travel</p>
      </div>

      <BranchForm branch={branch} />
    </div>
  );
}
