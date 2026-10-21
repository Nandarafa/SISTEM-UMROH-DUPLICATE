"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME, APP_SUBTITLE } from "@/lib/constants";
import { Icon, IconName } from "@/components/ui/Icon";
import { logoutAction } from "@/features/auth/services/authActions";
import { Role } from "@/types/common.types";

interface SidebarProps {
  role: Role;
  isOpen: boolean;
  onClose: () => void;
  settings?: {
    app_name?: string;
    app_subtitle?: string;
    primary_color?: string;
  };
}

interface NavLinkItem {
  name: string;
  href: string;
  icon: IconName;
}

export function Sidebar({ role, isOpen, onClose, settings }: SidebarProps) {
  const pathname = usePathname();
  const isStaff = role === "super_admin" || role === "admin";
  const isSuper = role === "super_admin";
  const isAgent = role === "agent";
  const isPilgrim = role === "pilgrim";
  const isGuide = role === "guide";

  const appName = settings?.app_name || "Travel Umroh & Haji";
  const appSubtitle = settings?.app_subtitle || "Sistem Manajemen Umroh & Haji";
  const initials = appName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "TU";

  const renderLink = (item: NavLinkItem) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? "nav-active font-medium"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <Icon name={item.icon} className="w-5 h-5 shrink-0" />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 sm:w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-[#0d9488] text-white grid place-items-center font-bold text-sm shrink-0 shadow-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">{appName}</p>
            <p className="text-[11px] text-gray-400 truncate">{appSubtitle}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          type="button"
          aria-label="Tutup menu"
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {renderLink({ name: "Dashboard", href: "/dashboard", icon: "dashboard" })}

        {/* ============ STAFF: MASTER DATA ============ */}
        {isStaff && (
          <>
            <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Master Data
            </p>
            {isSuper && renderLink({ name: "Cabang", href: "/branches", icon: "building" })}
            {renderLink({ name: "Paket", href: "/packages", icon: "package" })}
            {renderLink({ name: "Hotel", href: "/hotels", icon: "hotel" })}
            {renderLink({ name: "Maskapai", href: "/airlines", icon: "plane" })}
            {renderLink({ name: "Rekening Bank", href: "/bank-accounts", icon: "bank" })}
            {renderLink({ name: "Agen", href: "/agents", icon: "user" })}
            {renderLink({ name: "Muthawif", href: "/guides", icon: "guide" })}
            {renderLink({ name: "Jamaah", href: "/pilgrims", icon: "users" })}
          </>
        )}

        {/* ============ STAFF: OPERASIONAL ============ */}
        {isStaff && (
          <>
            <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Operasional
            </p>
            {renderLink({ name: "Pendaftaran", href: "/registrations", icon: "list" })}
            {renderLink({ name: "Dokumen", href: "/documents", icon: "doc" })}
            {renderLink({ name: "Pembayaran", href: "/payments", icon: "cash" })}
            {renderLink({ name: "Manasik", href: "/manasik", icon: "calendar" })}
            {renderLink({ name: "Manifest & Rooming", href: "/manifests", icon: "bus" })}
            {renderLink({ name: "Perlengkapan", href: "/equipment", icon: "box" })}
            {renderLink({ name: "Komisi Agen", href: "/commissions", icon: "percent" })}
            {renderLink({ name: "Pengumuman", href: "/announcements", icon: "megaphone" })}
          </>
        )}

        {/* ============ AGENT ============ */}
        {isAgent && (
          <>
            <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Marketing
            </p>
            {renderLink({ name: "Jamaah Referral", href: "/pilgrims", icon: "users" })}
            {renderLink({ name: "Pendaftaran", href: "/registrations", icon: "list" })}
            {renderLink({ name: "Komisi Saya", href: "/commissions", icon: "percent" })}
          </>
        )}

        {/* ============ PILGRIM ============ */}
        {isPilgrim && (
          <>
            <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Perjalanan Saya
            </p>
            {renderLink({ name: "Pendaftaran Saya", href: "/registrations", icon: "list" })}
            {renderLink({ name: "Dokumen Saya", href: "/documents", icon: "doc" })}
            {renderLink({ name: "Pembayaran", href: "/payments", icon: "cash" })}
            {renderLink({ name: "Jadwal Manasik", href: "/manasik", icon: "calendar" })}
          </>
        )}

        {/* ============ GUIDE ============ */}
        {isGuide && (
          <>
            <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Bimbingan
            </p>
            {renderLink({ name: "Jamaah Bimbingan", href: "/pilgrims", icon: "users" })}
            {renderLink({ name: "Manasik & Absensi", href: "/manasik", icon: "calendar" })}
          </>
        )}

        {/* ============ SYSTEM ============ */}
        {isStaff && (
          <>
            <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Sistem
            </p>
            {renderLink({ name: "Pengguna", href: "/users", icon: "user" })}
            {isSuper && renderLink({ name: "White-label", href: "/settings", icon: "cog" })}
            {renderLink({ name: "Log Aktivitas", href: "/activity-logs", icon: "history" })}
          </>
        )}
      </nav>

      <div className="border-t border-gray-100 p-3">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
          >
            <Icon name="logout" className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
