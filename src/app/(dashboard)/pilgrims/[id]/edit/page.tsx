import Link from "next/link";
import { notFound } from "next/navigation";
import { PilgrimForm } from "@/features/pilgrims/components/PilgrimForm";
import { getPilgrimDetail } from "@/features/pilgrims/services/pilgrimService";
import { updatePilgrimAction } from "@/features/pilgrims/services/pilgrimMutations";
import { getSessionUser } from "@/features/auth/services/authActions";
import { getBranchOptions } from "@/features/bank-accounts/services/bankAccountService";
import { getAgentsList } from "@/features/agents/services/agentService";
import { getGuideOptions } from "@/features/guides/services/guideService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface EditPilgrimPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPilgrimPage({
  params,
}: EditPilgrimPageProps) {
  const { id } = await params;
  const [pilgrim, user, branches, agentsList, guides] = await Promise.all([
    getPilgrimDetail(id),
    getSessionUser(),
    getBranchOptions(),
    getAgentsList(),
    getGuideOptions(),
  ]);

  if (!pilgrim) {
    notFound();
  }

  const agents = agentsList.map((a) => ({ id: a.id, name: a.name }));

  // Initial data purely from pilgrim database record
  const initialData = {
    id: pilgrim.id,
    branch_id: pilgrim.branchId || branches[0]?.id || "",
    agent_id: pilgrim.agentId || "",
    guide_id: pilgrim.guideId || "",
    name: pilgrim.name,
    gender: pilgrim.gender === "Perempuan" ? "female" : "male",
    nik: pilgrim.nik !== "-" ? pilgrim.nik : "",
    birth_place: pilgrim.birthPlace && pilgrim.birthPlace !== "-" ? pilgrim.birthPlace : "",
    birth_date: pilgrim.birthDate && pilgrim.birthDate !== "-" ? pilgrim.birthDate : "",
    blood_type: pilgrim.bloodType && pilgrim.bloodType !== "-" ? pilgrim.bloodType : "",
    phone: pilgrim.phone !== "-" ? pilgrim.phone : "",
    email: pilgrim.email !== "-" ? pilgrim.email : "",
    city: pilgrim.city && pilgrim.city !== "-" ? pilgrim.city : "",
    address: pilgrim.address && pilgrim.address !== "-" ? pilgrim.address : "",
    passport_number: pilgrim.passportNumber !== "-" ? pilgrim.passportNumber : "",
    passport_issued_place: pilgrim.passportIssuedPlace && pilgrim.passportIssuedPlace !== "-" ? pilgrim.passportIssuedPlace : "",
    passport_issued_at: pilgrim.passportIssuedAt && pilgrim.passportIssuedAt !== "-" ? pilgrim.passportIssuedAt : "",
    passport_expired_at: pilgrim.passportExpiry && pilgrim.passportExpiry !== "-" ? pilgrim.passportExpiry : "",
    mahram_name: pilgrim.mahramName && pilgrim.mahramName !== "-" ? pilgrim.mahramName : "",
    mahram_relation: pilgrim.mahramRelation && pilgrim.mahramRelation !== "-" ? pilgrim.mahramRelation : "",
    emergency_contact_name: pilgrim.emergencyContactName && pilgrim.emergencyContactName !== "-" ? pilgrim.emergencyContactName : "",
    emergency_contact_phone: pilgrim.emergencyContactPhone && pilgrim.emergencyContactPhone !== "-" ? pilgrim.emergencyContactPhone : "",
    health_notes: pilgrim.healthNotes && !pilgrim.healthNotes.includes("Tidak ada") && pilgrim.healthNotes !== "-" ? pilgrim.healthNotes : "",
    is_active: pilgrim.status === "active",
  };

  const handleUpdate = async (formData: FormData) => {
    "use server";
    return updatePilgrimAction(id, formData);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching Screenshot 5 */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:underline">Beranda</Link>
          <span>&rsaquo;</span>
          <Link href="/pilgrims" className="hover:underline">Jamaah</Link>
          <span>&rsaquo;</span>
          <span className="text-gray-600 font-medium">Edit</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800">Edit Jamaah</h1>
        <p className="text-xs text-gray-400 mt-0.5">{pilgrim.name}</p>
      </div>

      <PilgrimForm
        isEdit={true}
        initialData={initialData}
        branches={branches}
        agents={agents}
        guides={guides}
        userRole={user?.role}
        onSaveAction={handleUpdate}
      />
    </div>
  );
}
