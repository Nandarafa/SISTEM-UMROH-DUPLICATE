"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommissionItem } from "@/features/commissions/services/commissionService";
import { updateCommissionStatusAction } from "@/features/commissions/services/commissionActions";
import { currency } from "@/lib/utils";

interface Props {
  items: CommissionItem[];
}

export function CommissionTable({ items }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleStatusChange = (id: string, newStatus: string) => {
    setActiveDropdown(null);
    startTransition(async () => {
      await updateCommissionStatusAction(id, newStatus);
      router.refresh();
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-gray-600">
        <thead className="bg-gray-50/75 text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4">AGEN</th>
            <th className="px-6 py-4">JAMAAH</th>
            <th className="px-6 py-4">PAKET</th>
            <th className="px-6 py-4">DASAR</th>
            <th className="px-6 py-4">RATE</th>
            <th className="px-6 py-4">KOMISI</th>
            <th className="px-6 py-4">STATUS</th>
            <th className="px-6 py-4 text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50/60 transition">
              <td className="px-6 py-4 font-medium text-gray-800">{item.agentName}</td>
              <td className="px-6 py-4 text-gray-700">{item.pilgrimName}</td>
              <td className="px-6 py-4 text-gray-700">{item.packageName}</td>
              <td className="px-6 py-4 text-gray-700">{currency(item.basePrice)}</td>
              <td className="px-6 py-4 text-gray-700">{item.ratePercent.toFixed(2)}%</td>
              <td className="px-6 py-4 font-medium text-gray-800">{currency(item.commissionAmount)}</td>
              <td className="px-6 py-4">
                {item.status === "approved" && (
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-600 inline-block">
                    Disetujui
                  </span>
                )}
                {item.status === "paid" && (
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-600 inline-block">
                    Dibayar
                  </span>
                )}
                {item.status === "pending" && (
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-600 inline-block">
                    Menunggu
                  </span>
                )}
                {item.status === "cancelled" && (
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-red-50 text-red-600 inline-block">
                    Dibatalkan
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleStatusChange(item.id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                  disabled={isPending}
                  className="text-xs font-normal text-gray-700 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-2xs"
                >
                  <option value="" disabled hidden>
                    Ubah status...
                  </option>
                  <option value="" disabled className="bg-blue-600 text-white font-medium">
                    Ubah status...
                  </option>
                  <option value="approved" className="text-gray-800 py-1">Setujui</option>
                  <option value="paid" className="text-gray-800 py-1">Tandai Dibayar</option>
                  <option value="cancelled" className="text-gray-800 py-1">Batalkan</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
