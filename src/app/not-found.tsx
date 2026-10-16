import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-6 text-center">
      <div className="text-6xl font-black text-teal-600 mb-2">404</div>
      <h1 className="text-2xl font-bold mb-2">Halaman Tidak Ditemukan</h1>
      <p className="text-slate-500 mb-6 max-w-md">
        Halaman yang Anda tuju mungkin sudah dipindahkan, dihapus, atau belum tersedia.
      </p>
      <Link
        href="/dashboard"
        className="px-5 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
