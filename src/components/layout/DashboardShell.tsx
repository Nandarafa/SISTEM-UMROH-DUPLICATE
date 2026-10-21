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
    <div className="min-h-screen lg:flex bg-gray-100 text-gray-800 antialiased selection:bg-emerald-500 selection:text-white">
      <Sidebar
        role={userRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        settings={settings}
      />

      {/* Mobile overlay backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-black/40 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userName={userName}
          userRole={userRole}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 animate-fade-in">{children}</main>

        <footer className="px-4 sm:px-6 py-4 text-center text-xs text-gray-400 border-t border-gray-200/70 bg-white">
          <div className="text-[11px] sm:text-xs">Aplikasi Manajemen Umroh &amp; Haji Multi-Cabang</div>
          <div className="mt-0.5 text-[11px] sm:text-xs">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-medium text-brand">Sistem Manajemen Umroh</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
