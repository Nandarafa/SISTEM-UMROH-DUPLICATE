import React from "react";
import { getSessionUser } from "@/features/auth/services/authActions";
import { getWhiteLabelSettings } from "@/features/settings/services/settingsService";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, settings] = await Promise.all([
    getSessionUser(),
    getWhiteLabelSettings(),
  ]);

  return (
    <DashboardShell
      userName={user?.name}
      userRole={user?.role}
      settings={settings}
    >
      {children}
    </DashboardShell>
  );
}
