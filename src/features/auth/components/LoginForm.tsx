"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/features/auth/services/authActions";
import { DEMO_ACCOUNTS } from "@/lib/constants";

export function LoginForm() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("superadmin@example.com");
  const [selectedPassword, setSelectedPassword] = useState("password");
  const error = params.get("error");

  const fillAccount = (email: string) => {
    const acc = DEMO_ACCOUNTS.find((a) => a.email === email);
    if (acc) {
      setSelectedEmail(acc.email);
      setSelectedPassword(acc.password);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-8-4a1 1 0 011 1v4a1 1 0 11-2 0V7a1 1 0 011-1zm0 8.5a1.1 1.1 0 100-2.2 1.1 1.1 0 000 2.2z"
              clipRule="evenodd"
            />
          </svg>
          <span>Email atau password salah. Silakan coba lagi.</span>
        </div>
      )}

      <form
        action={loginAction}
        className="space-y-4"
        onSubmit={() => setLoading(true)}
      >
        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </span>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              required
              autoFocus
              autoComplete="username"
              placeholder="nama@travel.com"
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              className="auth-input"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <span className="text-xs font-medium text-brand hover:underline cursor-pointer">
              Lupa password?
            </span>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 12.75v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={selectedPassword}
              onChange={(e) => setSelectedPassword(e.target.value)}
              className="auth-input pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition hover:text-slate-600"
            >
              {showPassword ? (
                <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" />
                </svg>
              ) : (
                <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <label htmlFor="remember_me" className="flex cursor-pointer select-none items-center gap-2.5 pt-1">
          <input
            id="remember_me"
            name="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-0"
          />
          <span className="text-sm text-slate-600">Ingat saya di perangkat ini</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`auth-btn !mt-6 ${loading ? "cursor-wait opacity-80" : ""}`}
        >
          {loading && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4z"></path>
            </svg>
          )}
          <span>{loading ? "Memproses…" : "Masuk"}</span>
        </button>
      </form>

      {/* Akun demo selector shortcut */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
        <p className="font-semibold text-slate-700 mb-2">⚡ Klik untuk pilih Akun Demo (password: password):</p>
        <div className="grid grid-cols-1 gap-1.5">
          {DEMO_ACCOUNTS.map((a) => (
            <button
              type="button"
              key={a.email}
              onClick={() => fillAccount(a.email)}
              className={`text-left px-2.5 py-1.5 rounded-lg border transition flex items-center justify-between ${
                selectedEmail === a.email
                  ? "bg-teal-50 border-teal-300 text-teal-900 font-medium"
                  : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <span>{a.name} <span className="text-slate-400">({a.email})</span></span>
              <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">
                {a.role}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
        <span className="font-semibold text-slate-600">Belum punya akun?</span>{" "}
        Akun jamaah, agen, dan muthawif dibuat oleh staf kantor.
        Silakan hubungi admin cabang Anda untuk mendapatkan akses.
      </div>
    </div>
  );
}
