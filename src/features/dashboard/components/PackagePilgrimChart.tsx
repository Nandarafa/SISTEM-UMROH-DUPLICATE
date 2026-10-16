"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface PackagePilgrimChartProps {
  labels: string[];
  data: number[];
}

export function PackagePilgrimChart({ labels, data }: PackagePilgrimChartProps) {
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
            label: "Jamaah",
            data,
            backgroundColor: "#0d9488",
            borderRadius: 4,
            barThickness: 56,
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
            backgroundColor: "#1f2937",
            padding: 8,
            titleFont: { size: 12 },
            bodyFont: { size: 12 },
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
                size: 9,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "#f3f4f6",
            },
            ticks: {
              color: "#9ca3af",
              font: {
                size: 10,
              },
              precision: 0,
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
