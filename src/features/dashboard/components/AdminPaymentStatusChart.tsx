"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface AdminPaymentStatusChartProps {
  sukses: number;
  sebagian: number;
  belumBayar: number;
}

export function AdminPaymentStatusChart({
  sukses,
  sebagian,
  belumBayar,
}: AdminPaymentStatusChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Sukses", "Sebagian", "Belum Bayar"],
        datasets: [
          {
            data: [sukses, sebagian, belumBayar],
            backgroundColor: ["#16a34a", "#f59e0b", "#dc2626"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            position: "top",
            labels: {
              boxWidth: 8,
              boxHeight: 8,
              font: { size: 10 },
              color: "#6b7280",
            },
          },
        },
      },
    });

    return () => {
      chartInstance.current?.destroy();
    };
  }, [sukses, sebagian, belumBayar]);

  return (
    <div className="h-64 w-full flex items-center justify-center">
      <canvas ref={canvasRef} />
    </div>
  );
}
