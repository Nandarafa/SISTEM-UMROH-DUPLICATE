import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { getRegistrationDetail } from "@/features/registrations/services/registrationService";
import { getSessionUser } from "@/features/auth/services/authActions";
import { recordActivityLog } from "@/features/activity-logs/services/activityLogService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRegistrationPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getSessionUser();
  const isStaff = user?.role === "super_admin" || user?.role === "admin";
  const isAgent = user?.role === "agent";

  if (!isStaff && !isAgent) {
    redirect("/registrations");
  }

  const registration = await getRegistrationDetail(id);
  if (!registration) {
    notFound();
  }

  // Fetch guides
  let guides: Array<{ id: string; name: string }> = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data: dbGuides } = await supabase
          .from("guides")
          .select("id, name")
          .eq("is_active", true)
          .order("name", { ascending: true });

        if (dbGuides) {
          guides = dbGuides.map((g: any) => ({
            id: String(g.id),
            name: g.name,
          }));
        }
      }
    } catch (e) {
      console.error("Error loading guides for edit registration:", e);
    }
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    const guideId = String(formData.get("guide_id") || "").trim() || null;
    const registeredAt = String(formData.get("registered_at") || "").trim();
    const notes = String(formData.get("notes") || "").trim();

    if (!registeredAt) {
      return;
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabase();
        if (supabase) {
          const updateData: Record<string, any> = {
            guide_id: guideId,
            registered_at: registeredAt,
          };

          // If notes exists or column is present, try updating with notes first
          let { error: updateError } = await supabase
            .from("registrations")
            .update({ ...updateData, notes })
            .eq("id", registration?.id);

          // If error is about column notes not existing, retry without notes
          if (updateError && updateError.message?.toLowerCase().includes("notes")) {
            const { error: retryError } = await supabase
              .from("registrations")
              .update(updateData)
              .eq("id", registration?.id);
            updateError = retryError;
          }

          if (updateError) {
            console.error("Failed to update registration:", updateError);
          } else {
            const user = await getSessionUser();
            await recordActivityLog(
              "updated",
              `Memperbarui pendaftaran ${registration?.code}`,
              "Registration",
              registration?.id,
              user?.id
            );
          }
        }
      } catch (err) {
        console.error("Error in handleUpdate registration:", err);
      }
    }

    revalidatePath("/registrations");
    revalidatePath(`/registrations/${registration?.id}`);
    redirect(`/registrations/${registration?.id}`);
  }

  // Format registered_at to YYYY-MM-DD
  let defaultRegisteredAt = "";
  if (registration.registered_at && registration.registered_at !== "-") {
    try {
      defaultRegisteredAt = new Date(registration.registered_at).toISOString().split("T")[0];
    } catch {
      defaultRegisteredAt = registration.registered_at;
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center text-xs text-gray-400">
        <Link href="/registrations" className="hover:text-gray-600">
          Pendaftaran
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <Link href={`/registrations/${registration.id}`} className="hover:text-gray-600">
          {registration.code}
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <span className="text-gray-600 font-medium">Edit</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">Edit Pendaftaran</h1>
        <p className="text-xs text-gray-400 mt-0.5">{registration.code}</p>
      </div>

      {/* Form Card */}
      <form action={handleUpdate} className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 text-sm text-gray-500 pb-2 border-b border-gray-100">
              Jamaah: <span className="font-semibold text-gray-800">{registration.pilgrim.name}</span> &middot;{" "}
              Paket: <span className="font-semibold text-gray-800">{registration.package.name}</span>
            </div>

            {/* Pembimbing */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Pembimbing (opsional)
              </label>
              <select
                name="guide_id"
                defaultValue={registration.guideName || ""}
                className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#0d9488] focus:border-[#0d9488]"
              >
                <option value="">&mdash; Tanpa Pembimbing &mdash;</option>
                {guides.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tanggal Daftar */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Tanggal Daftar <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="registered_at"
                defaultValue={defaultRegisteredAt}
                required
                className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0d9488] focus:border-[#0d9488]"
              />
            </div>

            {/* Catatan */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Catatan
              </label>
              <textarea
                name="notes"
                rows={3}
                defaultValue={registration.notes || ""}
                placeholder="Catatan tambahan pendaftaran..."
                className="w-full text-sm rounded-lg border border-gray-300 px-3.5 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0d9488] focus:border-[#0d9488]"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#0d9488] text-white text-sm font-medium hover:bg-teal-700 shadow-sm transition-colors"
          >
            Simpan Perubahan
          </button>
          <Link
            href={`/registrations/${registration.id}`}
            className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
