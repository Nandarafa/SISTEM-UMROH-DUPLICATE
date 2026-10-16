import Link from "next/link";
import { getSessionUser } from "@/features/auth/services/authActions";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured, currency, formatDate } from "@/lib/utils";
import { APP_NAME, APP_SUBTITLE } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LandingPage() {
  const user = await getSessionUser();

  let activePackages: Array<{
    id: string;
    name: string;
    type: string;
    price: number;
    quota: number;
    departureDate: string;
    durationDays: number;
    hotelMakkah?: string;
    hotelMadinah?: string;
    airline?: string;
  }> = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data: pkgs } = await supabase
          .from("packages")
          .select(
            "id, name, type, price, quota, departure_date, duration_days, hotel_makkah:hotels!packages_hotel_makkah_id_fkey(name), hotel_madinah:hotels!packages_hotel_madinah_id_fkey(name), airline:airlines!packages_airline_id_fkey(name)"
          )
          .eq("status", "active")
          .order("departure_date", { ascending: true })
          .limit(6);

        if (pkgs) {
          activePackages = pkgs.map((p: any) => ({
            id: p.id,
            name: p.name,
            type: p.type || "Umroh",
            price: Number(p.price || 0),
            quota: Number(p.quota || 0),
            departureDate: p.departure_date || "-",
            durationDays: Number(p.duration_days || 9),
            hotelMakkah: p.hotel_makkah?.name,
            hotelMadinah: p.hotel_madinah?.name,
            airline: p.airline?.name,
          }));
        }
      }
    } catch {
      // Fallback
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Hairline Top Emerald Bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-emerald-100/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-semibold text-xs shadow-xs transition-transform group-hover:scale-95">
              UM
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-semibold text-gray-900 tracking-tight leading-none group-hover:text-emerald-800 transition-colors">
                {APP_NAME}
              </span>
              <span className="text-[10px] text-emerald-700/80 font-mono tracking-wide mt-1 leading-none">
                {APP_SUBTITLE}
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-gray-600">
            <a href="#fitur" className="hover:text-emerald-700 transition-colors py-1">
              Fitur
            </a>
            <a href="#paket" className="hover:text-emerald-700 transition-colors py-1">
              Paket
            </a>
            <a href="#alur" className="hover:text-emerald-700 transition-colors py-1">
              Alur Jamaah
            </a>
            <Link href="/about" className="hover:text-emerald-700 transition-colors py-1">
              Tentang
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-medium hover:bg-emerald-800 transition-all btn-subtle shadow-xs"
              >
                Ke Dashboard &rarr;
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-medium hover:bg-emerald-800 transition-all btn-subtle shadow-xs"
              >
                Masuk Sistem
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Architectural Emerald Dot Grid */}
      <section className="relative pt-20 pb-20 md:pt-28 md:pb-28 border-b border-emerald-100/70 overflow-hidden bg-gradient-to-b from-emerald-50/30 via-white to-white">
        {/* Subtle Emerald Dot Pattern */}
        <div className="absolute inset-0 bg-subtle-grid mask-radial pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          
          {/* Subtle Emerald Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-200/90 bg-emerald-50/80 text-emerald-800 text-xs font-mono mb-8 animate-fade-in shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse-subtle" />
            <span>Sistem Resmi Manajemen Umroh &amp; Haji Multi-Cabang</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.14] animate-fade-in-up stagger-1">
            Sistem Operasional Travel <br className="hidden sm:inline" />
            <span className="text-emerald-700">Umroh &amp; Haji Terpadu</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up stagger-2">
            Kelola pendaftaran jamaah, verifikasi berkas paspor, alokasi manifes maskapai, rooming hotel, dan transparansi komisi agen dalam satu alur kerja yang rapi dan terpusat.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up stagger-3">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-700 text-white text-xs sm:text-sm font-medium hover:bg-emerald-800 transition-all btn-subtle shadow-sm flex items-center justify-center gap-2"
            >
              <span>Akses Portal Sekarang</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <a
              href="#paket"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-emerald-300/80 text-emerald-800 text-xs sm:text-sm font-medium hover:bg-emerald-50/60 transition-all btn-subtle bg-white"
            >
              Lihat Jadwal Paket
            </a>
          </div>

          {/* Minimalist Stats Grid (White & Emerald) */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3.5 text-left animate-fade-in-up stagger-4">
            <div className="p-4 rounded-xl border border-emerald-100/90 bg-white card-subtle shadow-2xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700/70 font-semibold">Arsitektur</span>
              <p className="text-base font-bold text-gray-900 mt-1">Multi-Role</p>
              <p className="text-xs text-gray-500 mt-0.5">Admin, Agen, Jamaah</p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-100/90 bg-white card-subtle shadow-2xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-semibold">Sinkronisasi</span>
              <p className="text-base font-bold text-emerald-700 mt-1">Cloud Real-Time</p>
              <p className="text-xs text-gray-500 mt-0.5">Supabase PostgreSQL</p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-100/90 bg-white card-subtle shadow-2xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700/70 font-semibold">Logistik</span>
              <p className="text-base font-bold text-gray-900 mt-1">Manifes &amp; Hotel</p>
              <p className="text-xs text-gray-500 mt-0.5">Rooming List Lengkap</p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-100/90 bg-white card-subtle shadow-2xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-semibold">Kemitraan</span>
              <p className="text-base font-bold text-emerald-700 mt-1">Komisi Agen</p>
              <p className="text-xs text-gray-500 mt-0.5">Kalkulasi Otomatis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Utama */}
      <section id="fitur" className="py-20 md:py-24 bg-emerald-50/20 border-b border-emerald-100/70">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-12">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-semibold">
              // Modul Operasional
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mt-1">
              Instrumen Inti Pengelolaan
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              Dirancang untuk merapikan alur kerja administrasi, mengurangi redundansi data, dan meminimalisir kesalahan manual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="p-6 rounded-xl border border-emerald-100 bg-white card-subtle group">
              <div className="w-9 h-9 rounded-lg border border-emerald-200 bg-emerald-50 flex items-center justify-center text-emerald-700 mb-4 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5 group-hover:text-emerald-800 transition-colors">
                Pendaftaran &amp; Dokumen
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Pencatatan identitas NIK, verifikasi paspor, buku nikah, dan checklist kelengkapan persyaratan jamaah secara digital.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-xl border border-emerald-100 bg-white card-subtle group">
              <div className="w-9 h-9 rounded-lg border border-emerald-200 bg-emerald-50 flex items-center justify-center text-emerald-700 mb-4 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5 group-hover:text-emerald-800 transition-colors">
                Manifes &amp; Rooming Hotel
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Penyusunan manifes tiket pesawat grup, penempatan kamar hotel Makkah &amp; Madinah, serta pemantauan serah-terima koper.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-xl border border-emerald-100 bg-white card-subtle group">
              <div className="w-9 h-9 rounded-lg border border-emerald-200 bg-emerald-50 flex items-center justify-center text-emerald-700 mb-4 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5 group-hover:text-emerald-800 transition-colors">
                Keuangan &amp; Komisi Agen
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Pencatatan cicilan, generate tagihan massal otomatis, rekapitulasi omset, serta transparansi pembagian fee referral agen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Paket Terbuka */}
      <section id="paket" className="py-20 md:py-24 border-b border-emerald-100/70 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-semibold">
                // Keberangkatan Terdekat
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mt-1">
                Paket Umroh &amp; Haji Terbuka
              </h2>
            </div>
            <Link
              href="/login"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors inline-flex items-center gap-1 group"
            >
              <span>Masuk untuk pendaftaran</span>
              <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </Link>
          </div>

          {activePackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activePackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-6 rounded-xl border border-emerald-100 bg-white flex flex-col justify-between card-subtle shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold">
                        {pkg.type}
                      </span>
                      <span className="font-mono text-[11px] text-gray-400">
                        Sisa {pkg.quota} seat
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug">
                      {pkg.name}
                    </h3>
                    <p className="text-xl font-bold text-emerald-700 mb-5">
                      {currency(pkg.price)}
                    </p>

                    <div className="divide-y divide-emerald-50 text-xs text-gray-600 border-t border-emerald-100/70 pt-2 mb-6">
                      <div className="flex justify-between py-2">
                        <span className="text-gray-400">Keberangkatan</span>
                        <span className="font-semibold text-gray-800">{formatDate(pkg.departureDate)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-400">Durasi</span>
                        <span className="font-semibold text-gray-800">{pkg.durationDays} Hari</span>
                      </div>
                      {pkg.airline && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-400">Maskapai</span>
                          <span className="font-semibold text-gray-800">{pkg.airline}</span>
                        </div>
                      )}
                      {pkg.hotelMakkah && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-400">Hotel Makkah</span>
                          <span className="font-semibold text-gray-800 truncate max-w-[140px]">{pkg.hotelMakkah}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link
                    href="/login"
                    className="w-full py-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 text-xs font-semibold text-center text-emerald-800 hover:bg-emerald-700 hover:text-white hover:border-emerald-700 transition-all btn-subtle shadow-2xs"
                  >
                    Booking via Portal
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-xl border border-emerald-100 text-center max-w-sm mx-auto bg-emerald-50/20">
              <p className="text-xs text-gray-500 font-mono">Belum ada paket aktif saat ini.</p>
            </div>
          )}
        </div>
      </section>

      {/* Alur Tahapan */}
      <section id="alur" className="py-20 md:py-24 bg-emerald-50/20 border-b border-emerald-100/70">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-12">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-semibold">
              // Prosedur
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mt-1">
              Alur Perjalanan Jamaah
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Pendaftaran", desc: "Registrasi paket via kantor cabang atau referral agen mitra." },
              { step: "02", title: "Verifikasi Berkas", desc: "Pengumpulan berkas paspor, KTP, dan pengurusan visa elektronik." },
              { step: "03", title: "Manasik Ibadah", desc: "Bimbingan simulasi ibadah dan absensi kehadiran jamaah." },
              { step: "04", title: "Keberangkatan", desc: "Penerimaan perlengkapan, boarding manifes, dan rooming hotel." },
            ].map((item, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-emerald-100 bg-white card-subtle shadow-2xs">
                <span className="text-xs font-mono font-bold text-emerald-700 block mb-2">
                  {item.step} / 04
                </span>
                <h4 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="font-semibold text-gray-800">{APP_NAME}</span>
            <span>&bull;</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#fitur" className="hover:text-emerald-700 transition-colors">Fitur</a>
            <a href="#paket" className="hover:text-emerald-700 transition-colors">Paket</a>
            <a href="#alur" className="hover:text-emerald-700 transition-colors">Alur</a>
            <Link href="/about" className="hover:text-emerald-700 transition-colors">Tentang</Link>
            <Link href="/login" className="hover:text-emerald-700 font-semibold transition-colors">Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
