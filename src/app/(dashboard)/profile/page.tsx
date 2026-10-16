import { redirect } from "next/navigation";
import { getSessionUser } from "@/features/auth/services/authActions";
import { ProfileView } from "@/features/profile/components/ProfileView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <ProfileView
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }}
      />
    </div>
  );
}
