import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuideDetail } from "@/features/guides/services/guideService";
import { getBranchOptions } from "@/features/bank-accounts/services/bankAccountService";
import { EditGuideForm } from "@/features/guides/components/EditGuideForm";

export const dynamic = "force-dynamic";

interface EditGuidePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditGuidePage({ params }: EditGuidePageProps) {
  const { id } = await params;
  const [guide, branches] = await Promise.all([
    getGuideDetail(id),
    getBranchOptions(),
  ]);

  if (!guide) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Edit Muthawif</h1>
        <p className="text-xs text-gray-400 mt-0.5">{guide.name}</p>
      </div>

      <EditGuideForm guide={guide} branches={branches} />
    </div>
  );
}
