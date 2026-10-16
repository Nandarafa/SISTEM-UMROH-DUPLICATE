export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  return (
    <p className="mt-4 text-xs text-slate-500">
      Halaman {page} dari {Math.max(totalPages, 1)}
    </p>
  );
}
