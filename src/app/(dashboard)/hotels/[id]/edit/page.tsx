import Link from "next/link";
import { notFound } from "next/navigation";
import { getHotelDetail } from "@/features/hotels/services/hotelService";
import { EditHotelForm } from "@/features/hotels/components/EditHotelForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface EditHotelPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditHotelPage({ params }: EditHotelPageProps) {
  const { id } = await params;
  const hotel = await getHotelDetail(id);

  if (!hotel) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/hotels" className="hover:text-gray-600">Hotel</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Edit</span>
        </nav>
        <h1 className="text-xl font-bold text-gray-800">Edit Hotel</h1>
        <p className="text-xs text-gray-400 mt-0.5">{hotel.name}</p>
      </div>

      <EditHotelForm hotel={hotel} />
    </div>
  );
}
