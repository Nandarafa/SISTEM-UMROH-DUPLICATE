import type { Role } from "@/types/common.types";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Sistem Umroh Haji";
export const APP_SUBTITLE = "Travel Umroh & Haji";
export const BRAND_COLOR = "#0d9488";

export const SESSION_COOKIE = "umroh_session";

export const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin Cabang",
  agent: "Agen",
  pilgrim: "Jamaah",
  guide: "Muthawif",
};

export const DEMO_ACCOUNTS: Array<{
  email: string;
  password: string;
  name: string;
  role: Role;
  branchId: string | null;
}> = [
  { email: "superadmin@example.com", password: "password", name: "Super Admin", role: "super_admin", branchId: "1" },
  { email: "admin@example.com", password: "password", name: "Admin Cabang", role: "admin", branchId: "1" },
  { email: "agent@example.com", password: "password", name: "Hasan Basri", role: "agent", branchId: "1" },
  { email: "jamaah@example.com", password: "password", name: "Ahmad Fauzi", role: "pilgrim", branchId: "1" },
  { email: "muthawif@example.com", password: "password", name: "Ustadz Abdullah", role: "guide", branchId: "1" },
];

export const STAFF_ROLES: Role[] = ["super_admin", "admin"];
