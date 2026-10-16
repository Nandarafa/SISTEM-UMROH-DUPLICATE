import Link from "next/link";
import { getPackagesList } from "@/features/packages/services/packageService";
import { AnnouncementForm } from "./AnnouncementForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CreateAnnouncementPage() {
  const packages = await getPackagesList();

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb & Header matching Screenshot 5 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/announcements" className="hover:text-gray-600">Pengumuman</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Tambah</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Tambah Pengumuman</h1>
        </div>
      </div>

      {/* Form Component */}
      <AnnouncementForm packages={packages} />
    </div>
  );
}
