import Link from "next/link";
import { getPackagesList } from "@/features/packages/services/packageService";
import { getGuidesList } from "@/features/guides/services/guideService";
import { ManasikForm } from "@/features/dashboard/components/ManasikForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CreateManasikPage() {
  const [packages, guides] = await Promise.all([
    getPackagesList(),
    getGuidesList(),
  ]);

  const packageOptions = packages.map((p) => ({ id: p.id, name: p.name }));
  const guideOptions = guides.map((g) => ({ id: g.id, name: g.name }));

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/manasik" className="hover:text-gray-600">Manasik</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Tambah Jadwal</span>
        </nav>
        <h1 className="text-xl font-bold text-gray-800">Tambah Jadwal Manasik</h1>
        <p className="text-xs text-gray-400 mt-1">Buat jadwal bimbingan manasik baru</p>
      </div>

      <ManasikForm packages={packageOptions} guides={guideOptions} />
    </div>
  );
}
