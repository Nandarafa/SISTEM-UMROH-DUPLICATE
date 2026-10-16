import Link from "next/link";
import { getUsersList } from "@/features/users/services/userService";
import { getSessionUser } from "@/features/auth/services/authActions";
import { UserTable } from "./UserTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ search?: string; role?: string }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const sessionUser = await getSessionUser();
  const params = await searchParams;
  const search = params.search ?? "";
  const role = params.role ?? "";
  const items = await getUsersList(search, role);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header matching Screenshot 3 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Pengguna</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#1e293b]">Pengguna</h1>
            <p className="text-xs text-[#64748b] mt-1">Kelola akun login</p>
          </div>
          <div>
            <Link
              href="/users/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f766e] text-white text-xs font-medium hover:bg-[#0d6d66] shadow-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Tambah Pengguna</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Form Card matching Screenshot 3 */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <form method="GET" className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Cari nama / email..."
            className="text-xs rounded-lg border border-gray-200 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-600 min-w-[220px]"
          />

          <select
            name="role"
            defaultValue={role}
            className="text-xs rounded-lg border border-gray-200 px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 min-w-[130px]"
          >
            <option value="">Semua Role</option>
            <option value="admin">Admin Cabang</option>
            <option value="agent">Agen / Marketing</option>
            <option value="pilgrim">Jamaah</option>
            <option value="guide">Muthawif</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium hover:bg-gray-100 text-gray-700 transition"
          >
            Cari
          </button>
        </form>
      </div>

      {/* User Table Component */}
      <UserTable items={items} currentUserRole={sessionUser?.role} />
    </div>
  );
}
