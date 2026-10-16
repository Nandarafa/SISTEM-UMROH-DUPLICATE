"use client";

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

interface AttendanceChartProps {
  hadir: number;
  tidakHadir: number;
  izin: number;
}

export function AttendanceChart({ hadir, tidakHadir, izin }: AttendanceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS<"doughnut"> | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    chartInstanceRef.current = new ChartJS(ctx, {
      type: "doughnut",
      data: {
        labels: ["Hadir", "Tidak Hadir", "Izin"],
        datasets: [
          {
            data: [hadir, tidakHadir, izin],
            backgroundColor: ["#16a34a", "#dc2626", "#f59e0b"],
            borderWidth: 2,
            borderColor: "#ffffff",
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // Full 360° doughnut, mulai dari atas (atas = -90°), animasi scale dari tengah
        circumference: 360,
        rotation: -90,
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1200,
          easing: "easeOutQuart",
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              boxWidth: 12,
              font: {
                size: 11,
                family: "Figtree, sans-serif",
              },
              color: "#475569",
            },
          },
          tooltip: {
            backgroundColor: "#0f172a",
            titleFont: { size: 12 },
            bodyFont: { size: 12 },
            padding: 8,
            cornerRadius: 6,
          },
        },
        cutout: "60%",
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [hadir, tidakHadir, izin]);

  return (
    <div className="relative w-full h-56 flex items-center justify-center">
      <canvas ref={canvasRef} />
    </div>
  );
}
