"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createMassBillingAction } from "@/features/payments/services/paymentActions";
import { PackageItem } from "@/features/packages/services/packageService";

interface Props {
  packages: PackageItem[];
}

export function MassBillingForm({ packages }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // default date is today formatted as YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createMassBillingAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/payments");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Paket */}
      <div>
        <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
          Paket <span className="text-red-500">*</span>
        </label>
        <select
          name="package_id"
          required
          className="w-full text-sm rounded-xl border border-gray-200 px-4 py-3 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
        >
          <option value="">&mdash; Pilih Paket &mdash;</option>
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name} ({pkg.code})
            </option>
          ))}
        </select>
        <p className="text-xs text-[#94a3b8] mt-1.5">
          Hanya pendaftaran aktif yang belum memiliki tagihan yang akan diproses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Uang Muka / DP */}
        <div>
          <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
            Uang Muka / DP (opsional)
          </label>
          <input
            type="number"
            name="dp_amount"
            className="w-full text-sm rounded-xl border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          />
          <p className="text-xs text-[#94a3b8] mt-1.5">
            Kosongkan jika tanpa DP.
          </p>
        </div>

        {/* Jumlah Cicilan */}
        <div>
          <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
            Jumlah Cicilan <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="installments_count"
            defaultValue={3}
            min={1}
            max={12}
            required
            className="w-full text-sm rounded-xl border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
      </div>

      {/* Jatuh Tempo Cicilan Pertama */}
      <div>
        <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
          Jatuh Tempo Cicilan Pertama
        </label>
        <input
          type="date"
          name="first_due_date"
          defaultValue={todayStr}
          className="w-full text-sm rounded-xl border border-gray-200 px-4 py-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#0f766e] text-white text-sm font-medium rounded-xl hover:bg-[#0d6d66] transition disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Buat Tagihan Massal"}
        </button>
        <Link
          href="/payments"
          className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
