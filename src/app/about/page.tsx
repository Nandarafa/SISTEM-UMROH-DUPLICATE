import Link from "next/link";
import { getSessionUser } from "@/features/auth/services/authActions";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { APP_NAME, APP_SUBTITLE } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AboutPage() {
  const user = await getSessionUser();

  // Load registered branches from Supabase
  let branches: Array<{ id: string; name: string; city?: string; address?: string; phone?: string }> = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data: dbBranches } = await supabase
          .from("branches")
          .select("id, name, city, address, phone")
          .order("name", { ascending: true });

        if (dbBranches) {
          branches = dbBranches.map((b: any) => ({
            id: b.id,
            name: b.name,
            city: b.city,
            address: b.address,
            phone: b.phone,
          }));
        }
      }
    } catch {
      // Graceful fallback
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 py-1">
            <div className="w-10 h-10 rounded-xl bg-[#0f766e] flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
              UM
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-base font-bold text-gray-900 leading-tight">
                {APP_NAME}
              </span>
              <span className="text-xs text-gray-500 font-normal mt-0.5">
                {APP_SUBTITLE}
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-[#0f766e] transition-colors">
              Beranda
            </Link>
            <Link href="/#fitur" className="hover:text-[#0f766e] transition-colors">
              Fitur
            </Link>
            <Link href="/#paket" className="hover:text-[#0f766e] transition-colors">
              Paket
            </Link>
            <Link href="/#alur" className="hover:text-[#0f766e] transition-colors">
              Alur Jamaah
            </Link>
            <Link href="/about" className="text-[#0f766e] font-semibold">
              Tentang Kami
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f766e] text-white font-medium text-xs hover:bg-[#115e59] transition shadow-sm"
              >
                <span>Ke Dashboard</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f766e] text-white font-medium text-xs hover:bg-[#115e59] transition shadow-sm"
              >
                <span>Masuk Sistem</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Tentang Kami */}
      <section className="pt-14 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#0f766e] text-xs font-semibold mb-5">
            <span className="w-2 h-2 rounded-full bg-[#0f766e]" />
            Mengenal Lebih Dekat
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Tentang <span className="text-[#0f766e]">{APP_NAME}</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Dedikasi kami adalah menghadirkan sistem pelayanan ibadah Umroh dan Haji yang transparan,
            terstandar, serta memudahkan koordinasi antar cabang, agen, muthawif, dan jamaah di seluruh Indonesia.
          </p>
        </div>
      </section>

      {/* Nilai & Visi Misi */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 rounded-2xl border border-gray-200 bg-gray-50/50">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0f766e] flex items-center justify-center font-bold mb-5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Visi Kami</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Menjadi platform manajemen penyelenggaraan ibadah Umroh dan Haji terpercaya yang mengedepankan
                kemurnian niat, keterbukaan data, serta kepuasan jamaah dalam menjalankan rukun ibadah di Tanah Suci.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-gray-200 bg-gray-50/50">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0f766e] flex items-center justify-center font-bold mb-5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Misi Kami</h3>
              <ul className="text-sm text-gray-600 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#0f766e] font-bold">&bull;</span>
                  Menyediakan sistem operasional yang transparan, cepat, dan bebas manipulasi.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0f766e] font-bold">&bull;</span>
                  Menjamin ketepatan manifes, katering, akomodasi hotel, dan bimbingan manasik.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0f766e] font-bold">&bull;</span>
                  Membangun kemitraan yang saling menguntungkan dan adil dengan agen serta pembimbing ibadah.
                </li>
              </ul>
            </div>
          </div>

          {/* 3 Pilar Keunggulan */}
          <div className="mb-16">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h3 className="text-2xl font-bold text-gray-900">Pilar Pelayanan Kami</h3>
              <p className="text-xs text-gray-500 mt-1">Standar layanan yang kami terapkan di setiap proses</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                <p className="text-base font-bold text-gray-900 mb-2">1. Amanah &amp; Akurat</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Setiap rupiah pembayaran dan status berkas jamaah tercatat langsung ke sistem database secara real-time.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                <p className="text-base font-bold text-gray-900 mb-2">2. Pendampingan Penuh</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Muthawif berlisensi mendampingi jamaah mulai dari manasik pra-keberangkatan hingga kepulangan ke tanah air.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                <p className="text-base font-bold text-gray-900 mb-2">3. Jaringan Multi-Cabang</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Layanan koordinasi terpusat yang memudahkan konsultasi dan penyerahan perlengkapan di berbagai kota.
                </p>
              </div>
            </div>
          </div>

          {/* Kantor Cabang Resmi (Live Supabase) */}
          <div className="border-t border-gray-100 pt-12">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h3 className="text-2xl font-bold text-gray-900">Jaringan Kantor Cabang</h3>
              <p className="text-xs text-gray-500 mt-1">Kantor operasional resmi yang siap melayani kebutuhan Anda</p>
            </div>

            {branches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map((b) => (
                  <div key={b.id} className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <h4 className="text-sm font-bold text-gray-900 mb-1">{b.name}</h4>
                    <p className="text-xs text-gray-500 mb-3">{b.city || "Indonesia"}</p>
                    {b.address && (
                      <p className="text-xs text-gray-600 mb-2">{b.address}</p>
                    )}
                    {b.phone && (
                      <p className="text-xs text-[#0f766e] font-medium">Telp: {b.phone}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-gray-200 bg-gray-50 text-center max-w-md mx-auto">
                <p className="text-sm font-semibold text-gray-800">Kantor Pusat Jakarta</p>
                <p className="text-xs text-gray-500 mt-1">Gedung Pusat Operasional Umroh &amp; Haji Indonesia</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0f766e]" />
            <span className="font-semibold text-gray-700">{APP_NAME}</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#0f766e]">Beranda</Link>
            <Link href="/about" className="hover:text-[#0f766e] font-semibold text-[#0f766e]">Tentang Kami</Link>
            <Link href="/login" className="hover:text-[#0f766e]">Masuk Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
