import Link from "next/link";
import { getWhiteLabelSettings } from "@/features/settings/services/settingsService";
import { WhiteLabelForm } from "@/features/settings/components/WhiteLabelForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SettingsPage() {
  const settings = await getWhiteLabelSettings();

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching Screenshot 1 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">White-label</span>
        </nav>
        <h1 className="text-xl font-bold text-gray-800">Pengaturan White-label</h1>
        <p className="text-xs text-gray-400 mt-1">
          Branding tampil di seluruh aplikasi (cache otomatis diperbarui).
        </p>
      </div>

      <WhiteLabelForm initialSettings={settings} />
    </div>
  );
}
