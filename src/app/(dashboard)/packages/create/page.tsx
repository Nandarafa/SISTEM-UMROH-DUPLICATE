import Link from "next/link";
import { getBranchOptions } from "@/features/bank-accounts/services/bankAccountService";
import { getHotelsList } from "@/features/hotels/services/hotelService";
import { getAirlinesList } from "@/features/airlines/services/airlineService";
import { CreatePackageForm } from "@/features/packages/components/CreatePackageForm";

export const dynamic = "force-dynamic";

export default async function CreatePackagePage() {
  const [branches, hotels, airlines] = await Promise.all([
    getBranchOptions(),
    getHotelsList(),
    getAirlinesList(),
  ]);

  const hotelsMekah = hotels.filter((h) => h.city === "Mekah");
  const hotelsMadinah = hotels.filter((h) => h.city === "Madinah");

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb & Header matching Screenshot 1 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/packages" className="hover:text-gray-600">Paket</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Tambah</span>
        </nav>
        <h1 className="text-xl font-bold text-gray-800">Tambah Paket</h1>
      </div>

      <CreatePackageForm
        branches={branches}
        hotelsMekah={hotelsMekah}
        hotelsMadinah={hotelsMadinah}
        airlines={airlines}
      />
    </div>
  );
}
