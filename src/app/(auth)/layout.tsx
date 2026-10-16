import React from "react";
import Link from "next/link";
import { APP_NAME, APP_SUBTITLE } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* ================= Panel branding (desktop) ================= */}
      <aside className="hidden lg:flex auth-hero relative flex-col justify-between p-12 text-white overflow-hidden">
        <div className="auth-pattern absolute inset-0 opacity-70 pointer-events-none"></div>

        {/* siluet kubah & menara */}
        <svg
          className="absolute bottom-0 left-0 w-full opacity-[.13] pointer-events-none"
          viewBox="0 0 600 200"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M60 200v-90a12 12 0 0124 0v90zM66 96c0-12 6-18 6-26s-6-10-6-18c0 8-6 10-6 18s6 14 6 26z" />
          <path d="M540 200v-90a12 12 0 0124 0v90zM546 96c0-12 6-18 6-26s-6-10-6-18c0 8-6 10-6 18s6 14 6 26z" />
          <path d="M120 200v-70h360v70zM300 40c50 26 80 56 80 90H220c0-34 30-64 80-90zM300 10c8 10 8 20 0 30-8-10-8-20 0-30z" />
          <path d="M160 130c0-26 18-42 40-42s40 16 40 42zM360 130c0-26 18-42 40-42s40 16 40 42z" />
        </svg>

        <div className="relative">
          <Link href="/login" className="inline-flex items-center gap-3">
            <span className="h-12 w-12 grid place-items-center rounded-xl bg-white/15 ring-1 ring-white/30 text-lg font-extrabold backdrop-blur">
              UM
            </span>
            <span className="leading-tight">
              <span className="block font-bold text-lg">{APP_NAME}</span>
              <span className="block text-xs text-white/70">{APP_SUBTITLE}</span>
            </span>
          </Link>
        </div>

        <div className="relative max-w-lg">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/25 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300"></span>
            Sistem Terintegrasi Multi-Cabang
          </p>
          <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight">
            Kelola perjalanan ibadah<br />dengan lebih tenang.
          </h2>
          <p className="mt-4 text-white/75 leading-relaxed">
            Pendaftaran jamaah, dokumen, pembayaran, manasik, manifest keberangkatan,
            hingga komisi agen — semuanya rapi dalam satu platform.
          </p>

          <ul className="mt-8 space-y-3.5 text-sm">
            {[
              "Data jamaah & dokumen terpusat dan aman",
              "Pembayaran, cicilan, dan kuitansi otomatis",
              "Manasik, manifest, serta komisi agen real-time",
            ].map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/20 ring-1 ring-white/30">
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="text-white/85">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/55">
          &copy; {new Date().getFullYear()} {APP_NAME}. Seluruh hak cipta dilindungi.
        </p>
      </aside>

      {/* ================= Kolom form ================= */}
      <main className="flex min-h-screen flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 bg-white">
        <div className="mx-auto w-full max-w-[26rem]">
          {/* Logo untuk mobile */}
          <div className="lg:hidden mb-8 flex flex-col items-center text-center">
            <span className="h-14 w-14 grid place-items-center rounded-2xl bg-brand text-white text-xl font-extrabold shadow-lg">
              UM
            </span>
            <p className="mt-3 font-bold text-slate-800">{APP_NAME}</p>
            <p className="text-xs text-slate-400">{APP_SUBTITLE}</p>
          </div>

          <header className="mb-7">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Selamat datang kembali
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Masuk menggunakan akun Anda untuk melanjutkan.
            </p>
          </header>

          {children}

          <p className="mt-10 text-center text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-medium text-brand">Sistem Manajemen Umroh</span>
          </p>
        </div>
      </main>
    </div>
  );
}
