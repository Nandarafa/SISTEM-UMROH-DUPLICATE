import { LoginForm } from "@/features/auth/components/LoginForm";
import { Suspense } from "react";

export const metadata = {
  title: "Login | Sistem Umroh & Haji",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-4 text-sm text-slate-500">Memuat formulir login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
