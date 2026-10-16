import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { getPackagesList } from "@/features/packages/services/packageService";
import { getGuidesList } from "@/features/guides/services/guideService";
import { getManasikDetail } from "@/features/dashboard/services/manasikAttendanceService";
import { ManasikForm } from "@/features/dashboard/components/ManasikForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditManasikPage({ params }: PageProps) {
  const { id } = await params;
  const [packages, guides] = await Promise.all([
    getPackagesList(),
    getGuidesList(),
  ]);

  let scheduleData: any = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("manasik_schedules")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (!error && data) {
          scheduleData = {
            id: data.id,
            title: data.title,
            package_id: data.package_id,
            guide_id: data.guide_id,
            date: data.date,
            location: data.location,
            start_time: data.start_time,
            end_time: data.end_time,
            description: data.description,
          };
        }
      }
    } catch (e) {
      console.error("EditManasikPage fetch error:", e);
    }
  }

  if (!scheduleData) {
    const detail = await getManasikDetail(id);
    if (!detail) {
      notFound();
    }
    scheduleData = {
      id: detail.id,
      title: detail.title,
      package_id: null,
      guide_id: null,
      date: "2026-09-23",
      location: detail.location,
      start_time: detail.startTime,
      end_time: detail.endTime,
      description: "",
    };
  }

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
          <span className="text-gray-600 font-medium">Edit Jadwal</span>
        </nav>
        <h1 className="text-xl font-bold text-gray-800">Edit Jadwal Manasik</h1>
        <p className="text-xs text-gray-400 mt-1">Ubah informasi jadwal manasik</p>
      </div>

      <ManasikForm schedule={scheduleData} packages={packageOptions} guides={guideOptions} />
    </div>
  );
}
