import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getManasikDetail,
  saveManasikAttendance,
} from "@/features/dashboard/services/manasikAttendanceService";
import { AttendanceForm } from "@/features/dashboard/components/AttendanceForm";
import { ManasikPilgrimRecap } from "@/features/dashboard/components/ManasikPilgrimRecap";
import { getSessionUser } from "@/features/auth/services/authActions";
import { revalidatePath } from "next/cache";

export default async function ManasikAttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getManasikDetail(id);
  const user = await getSessionUser();

  if (!detail) {
    notFound();
  }

  const isPilgrim = user?.role === "pilgrim";

  // Server action to save attendance to Supabase
  async function handleSaveAttendance(attendances: Record<string, string>) {
    "use server";
    await saveManasikAttendance(id, attendances);
    revalidatePath("/dashboard");
    revalidatePath("/manasik");
    revalidatePath(`/manasik/${id}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:underline">Beranda</Link>
          <span>&rsaquo;</span>
          <Link href="/manasik" className="hover:underline">Manasik</Link>
          <span>&rsaquo;</span>
          <span className="text-gray-600 font-medium">{detail.title}</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800">{detail.title}</h1>
        <p className="text-xs text-gray-400 mt-0.5">{detail.date}</p>
      </div>

      {isPilgrim ? (
        <ManasikPilgrimRecap data={detail} />
      ) : (
        <AttendanceForm
          initialData={detail}
          onSaveAction={handleSaveAttendance}
        />
      )}
    </div>
  );
}
