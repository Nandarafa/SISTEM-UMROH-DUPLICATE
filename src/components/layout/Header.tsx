"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { logoutAction } from "@/features/auth/services/authActions";
import { ROLE_LABEL } from "@/lib/constants";
import { Role } from "@/types/common.types";

interface TopbarProps {
  userName?: string;
  userRole?: Role;
  onToggleSidebar: () => void;
}

export function Header({
  userName = "Super Admin",
  userRole = "super_admin",
  onToggleSidebar,
}: TopbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  // Tanggal format persis 'Wednesday, 14 October 2026' seperti di screenshot
  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
        >
          <Icon name="list" className="w-6 h-6" />
        </button>
        <div>
          <p className="text-sm font-semibold text-gray-700">Selamat datang</p>
          <p className="text-[11px] text-gray-400 capitalize">{todayFormatted}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Branch focus selector (super_admin) */}
        {userRole === "super_admin" && (
          <div className="hidden sm:block">
            <select
              defaultValue=""
              className="text-xs border border-gray-200 rounded-lg py-1.5 px-3 focus:border-brand focus:ring-0 bg-white text-gray-700"
            >
              <option value="">Semua Cabang</option>
              <option value="1">Kantor Pusat Jakarta</option>
              <option value="2">Cabang Surabaya</option>
              <option value="3">Cabang Bandung</option>
            </select>
          </div>
        )}

        {/* User profile popup */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 text-sm focus:outline-none"
          >
            <div className="h-8 w-8 rounded-full bg-brand text-white grid place-items-center text-xs font-semibold">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-gray-700 font-medium leading-tight">{userName}</p>
              <p className="text-[11px] text-gray-400 leading-tight">
                {ROLE_LABEL[userRole] ?? userRole}
              </p>
            </div>
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setProfileOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 text-sm z-30">
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  Profil Saya
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Keluar
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
