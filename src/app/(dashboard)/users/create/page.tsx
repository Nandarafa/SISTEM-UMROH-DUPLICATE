import Link from "next/link";
import { UserForm } from "./UserForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CreateUserPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb & Header matching Screenshot 4 */}
      <div>
        <nav className="flex items-center text-xs text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-600">Beranda</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/users" className="hover:text-gray-600">Pengguna</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-600 font-medium">Tambah</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Tambah Pengguna</h1>
        </div>
      </div>

      {/* Form Component */}
      <UserForm />
    </div>
  );
}
