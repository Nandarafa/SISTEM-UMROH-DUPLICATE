"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Role } from "@/types/common.types";
import { WhiteLabelSettings } from "@/features/settings/services/settingsService";

interface DashboardShellProps {
  userName?: string;
  userRole?: Role;
  settings?: WhiteLabelSettings;
  children: React.ReactNode;
}

export function DashboardShell({
  userName = "Super Admin",
  userRole = "super_admin",
  settings,
  children,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex bg-gray-100 text-gray-800">
      <Sidebar
        role={userRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        settings={settings}
      />

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
        ></div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userName={userName}
          userRole={userRole}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

        <footer className="px-6 py-4 text-center text-xs text-gray-400 border-t border-gray-100 bg-white">
          <div>Aplikasi Manajemen Umroh &amp; Haji Multi-Cabang</div>
          <div className="mt-1">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-medium text-brand">Sistem Manajemen Umroh</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
