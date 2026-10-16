import Link from "next/link";
import { notFound } from "next/navigation";
import { getAirlineDetail } from "@/features/airlines/services/airlineService";
import { EditAirlineForm } from "@/features/airlines/components/EditAirlineForm";

export const dynamic = "force-dynamic";

interface EditAirlinePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAirlinePage({ params }: EditAirlinePageProps) {
  const { id } = await params;
  const airline = await getAirlineDetail(id);

  if (!airline) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 flex items-center gap-1.5">
        <Link href="/" className="hover:text-emerald-700">
          Beranda
        </Link>
        <span>&gt;</span>
        <Link href="/airlines" className="hover:text-emerald-700">
          Maskapai
        </Link>
        <span>&gt;</span>
        <span className="text-gray-700 font-medium">Edit Maskapai</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Edit Maskapai</h1>
        <p className="text-xs text-gray-500 mt-1">Ubah data maskapai penerbangan</p>
      </div>

      <EditAirlineForm airline={airline} />
    </div>
  );
}
