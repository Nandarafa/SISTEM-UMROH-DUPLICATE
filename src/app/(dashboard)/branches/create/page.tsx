import Link from "next/link";
import { BranchForm } from "@/features/branches/components/BranchForm";

export default function CreateBranchPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/branches" className="hover:text-gray-600">Cabang</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Tambah</span>
        </nav>
        <h1 className="text-xl font-bold text-gray-800">Tambah Cabang</h1>
        <p className="text-xs text-gray-400 mt-1">Tambahkan cabang travel baru</p>
      </div>

      <BranchForm />
    </div>
  );
}
