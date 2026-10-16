import Link from "next/link";
import { notFound } from "next/navigation";
import { getPackagesList } from "@/features/packages/services/packageService";
import { getAnnouncementDetail } from "@/features/announcements/services/announcementService";
import { AnnouncementForm } from "@/app/(dashboard)/announcements/create/AnnouncementForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAnnouncementPage({ params }: PageProps) {
  const { id } = await params;
  const [packages, announcement] = await Promise.all([
    getPackagesList(),
    getAnnouncementDetail(id),
  ]);

  if (!announcement) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/announcements" className="hover:text-gray-600">Pengumuman</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Edit</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Edit Pengumuman</h1>
        </div>
      </div>

      {/* Form Component */}
      <AnnouncementForm packages={packages} initialData={announcement} isEdit={true} />
    </div>
  );
}
