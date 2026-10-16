import Link from "next/link";
import { getManifestPackagesList } from "@/features/manifests/services/manifestService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ManifestPage() {
  const packages = await getManifestPackagesList();

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching Screenshot 2 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Manifest</span>
        </nav>
        <div>
          <h1 className="text-xl font-bold text-[#1e293b]">Manifest &amp; Rooming</h1>
          <p className="text-xs text-[#64748b] mt-1">
            Pengaturan kamar, bus, dan kursi jamaah per paket
          </p>
        </div>
      </div>

      {/* Table Card matching Screenshot 2 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-4 font-semibold">PAKET</th>
                <th className="px-6 py-4 font-semibold">JENIS</th>
                <th className="px-6 py-4 font-semibold">JUMLAH JAMAAH</th>
                <th className="px-6 py-4 font-semibold">BERANGKAT</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {packages.map((pkg) => {
                let badgeClass = "bg-teal-50 text-teal-700";
                if (pkg.typeBadgeColor === "purple") {
                  badgeClass = "bg-purple-50 text-purple-700";
                } else if (pkg.typeBadgeColor === "blue") {
                  badgeClass = "bg-blue-50 text-blue-700";
                }

                return (
                  <tr key={pkg.packageId} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{pkg.packageName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${badgeClass}`}>
                        {pkg.typeLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{pkg.pilgrimCount}</td>
                    <td className="px-6 py-4 text-gray-700">{pkg.departureDate}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link
                        href={`/manifests/${pkg.packageId}`}
                        className="text-[#0d9488] text-xs font-medium hover:underline"
                      >
                        Kelola Manifest
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
