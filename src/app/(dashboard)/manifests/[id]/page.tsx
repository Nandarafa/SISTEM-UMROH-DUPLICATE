import Link from "next/link";
import { getPackageManifestDetail } from "@/features/manifests/services/manifestService";
import { ManifestManageForm } from "./ManifestManageForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PackageManifestManagePage({ params }: PageProps) {
  const { id } = await params;
  const manifestData = await getPackageManifestDetail(id);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching Screenshot 3 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/manifests" className="hover:text-gray-600">Manifest</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">{manifestData.packageName}</span>
        </nav>
        <div>
          <h1 className="text-xl font-bold text-[#1e293b]">
            Manifest: {manifestData.packageName}
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1">{manifestData.packageCode}</p>
        </div>
      </div>

      {/* Form Component */}
      <ManifestManageForm items={manifestData.items} />
    </div>
  );
}
