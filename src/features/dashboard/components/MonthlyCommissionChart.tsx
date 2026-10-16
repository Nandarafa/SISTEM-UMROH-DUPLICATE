"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface MonthlyCommissionChartProps {
  labels: string[];
  data: number[];
}

export function MonthlyCommissionChart({ labels, data }: MonthlyCommissionChartProps) {
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
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Komisi (Rp)",
            data,
            backgroundColor: "#0d9488",
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const val = Number(context.raw || 0);
                return " Rp " + new Intl.NumberFormat("id-ID").format(val);
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#9ca3af",
              font: {
                size: 10,
              },
            },
          },
          y: {
            grid: {
              color: "#f3f4f6",
            },
            ticks: {
              color: "#9ca3af",
              font: {
                size: 10,
              },
              callback: (value) => {
                const num = Number(value);
                if (num === 0) return "0";
                return (num / 1000000).toFixed(0) + ".000.000";
              },
            },
          },
        },
      },
    });

    return () => {
      chartInstance.current?.destroy();
    };
  }, [labels, data]);

  return (
    <div className="h-64 w-full">
      <canvas ref={canvasRef} />
    </div>
  );
}
