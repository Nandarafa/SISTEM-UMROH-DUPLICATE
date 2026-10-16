"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { currency, formatDate } from "@/lib/utils";
import { recordPaymentAction } from "@/features/payments/services/paymentActions";

interface PaymentItem {
  id: string;
  code: string;
  typeLabel: string;
  typeColor: "blue" | "amber" | "green" | "gray";
  statusLabel: string;
  statusColor: "green" | "amber" | "red" | "gray";
  amount: number;
  paid_amount: number;
  outstanding: number;
  due_date: string;
}

interface Props {
  items: PaymentItem[];
  registrationId: string;
  isStaff: boolean;
  pilgrimName: string;
}

export function PaymentItemsList({ items, registrationId, isStaff, pilgrimName }: Props) {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const handleOpenModal = (payment: PaymentItem) => {
    setError(null);
    setSelectedPayment(payment);
  };

  const handleCloseModal = () => {
    setSelectedPayment(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPayment) return;

    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("payment_id", selectedPayment.id);

    const result = await recordPaymentAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      setSelectedPayment(null);
      setSuccessMsg(`Pembayaran untuk tagihan ${selectedPayment.code} berhasil diproses!`);
      setTimeout(() => setSuccessMsg(null), 5000);
      router.refresh();
    }
  };

  return (
    <div>
      {successMsg && (
        <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700 text-xs">
            &times;
          </button>
        </div>
      )}

      <div className="space-y-4">
        {items.map((payment) => (
          <div
            key={payment.id}
            className={`border rounded-xl p-4 transition-all ${
              payment.outstanding > 0 ? "border-gray-200 bg-white shadow-sm" : "border-emerald-100 bg-emerald-50/20"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 text-sm">{payment.code}</span>
                <Badge color={payment.typeColor}>{payment.typeLabel}</Badge>
                <Badge color={payment.statusColor}>{payment.statusLabel}</Badge>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  Jatuh tempo: <strong className="text-gray-600">{formatDate(payment.due_date)}</strong>
                </span>

                {payment.outstanding > 0 ? (
                  <button
                    onClick={() => handleOpenModal(payment)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d9488] text-white text-xs font-semibold hover:bg-teal-700 shadow-sm transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{isStaff ? "Catat Pembayaran" : "Bayar Sekarang"}</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Lunas
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1">
              <div>
                Tagihan: <span className="font-semibold text-gray-800">{currency(payment.amount)}</span>
              </div>
              <div>&bull;</div>
              <div>
                Terbayar: <span className="font-semibold text-emerald-600">{currency(payment.paid_amount)}</span>
              </div>
              <div>&bull;</div>
              <div>
                Sisa Tagihan:{" "}
                <span className={`font-semibold ${payment.outstanding > 0 ? "text-red-600 font-bold" : "text-gray-500"}`}>
                  {currency(payment.outstanding)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-800">
                  {isStaff ? "Catat Pembayaran Tagihan" : "Konfirmasi Pembayaran"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {selectedPayment.code} &bull; Jamaah: <strong className="text-gray-700">{pilgrimName}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1.5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Info Bank Rekening */}
              <div className="p-3.5 bg-teal-50/60 border border-teal-100 rounded-xl text-xs text-teal-900 space-y-1">
                <p className="font-semibold text-teal-800 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tujuan Pembayaran Resmi:
                </p>
                <div className="text-[11px] text-teal-800 pl-5 space-y-0.5">
                  <p>&bull; <strong>Bank Syariah Indonesia (BSI)</strong>: 712-3456-789 (a.n PT Perjalanan Umroh)</p>
                  <p>&bull; <strong>Bank Mandiri</strong>: 137-00-1234567-8 (a.n PT Perjalanan Umroh)</p>
                  <p>&bull; <strong>Bank BCA</strong>: 883-098-7654 (a.n PT Perjalanan Umroh)</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Jumlah Pembayaran (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  required
                  defaultValue={selectedPayment.outstanding}
                  max={selectedPayment.outstanding}
                  min={10000}
                  className="w-full text-sm rounded-lg border border-gray-300 px-3.5 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0d9488] focus:border-[#0d9488]"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Maksimal sisa tagihan: <strong>{currency(selectedPayment.outstanding)}</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Metode Pembayaran <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="method"
                    required
                    className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#0d9488] focus:border-[#0d9488]"
                  >
                    <option value="transfer">Transfer Bank (BSI / Mandiri / BCA)</option>
                    <option value="qris">QRIS Instant</option>
                    <option value="cash">Tunai / Teller Kantor</option>
                    <option value="edc">Mesin EDC Kartu Debit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tanggal Bayar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="paid_at"
                    defaultValue={todayStr}
                    required
                    className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0d9488] focus:border-[#0d9488]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Catatan / Bukti Transfer (opsional)
                </label>
                <input
                  type="text"
                  name="note"
                  placeholder="Misal: Sudah transfer via m-Banking BSI"
                  className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0d9488] focus:border-[#0d9488]"
                />
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={loading}
                  className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0d9488] rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {loading && (
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  <span>{loading ? "Memproses..." : "Konfirmasi Pembayaran"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
