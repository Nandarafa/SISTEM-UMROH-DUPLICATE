export function Loading({ label = "Memuat…" }: { label?: string }) {
  return <p className="py-12 text-center text-sm text-slate-500">{label}</p>;
}
