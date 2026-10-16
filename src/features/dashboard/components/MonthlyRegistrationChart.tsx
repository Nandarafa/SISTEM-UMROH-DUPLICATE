"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface MonthlyRegistrationChartProps {
  labels: string[];
  data: number[];
}

export function MonthlyRegistrationChart({ labels, data }: MonthlyRegistrationChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Create teal gradient matching screenshot 2
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(13, 148, 136, 0.25)");
    gradient.addColorStop(1, "rgba(13, 148, 136, 0.01)");

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Pendaftaran",
            data,
            borderColor: "#0d9488",
            borderWidth: 2.5,
            pointBackgroundColor: "#0d9488",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 3.5,
            pointHoverRadius: 6,
            fill: true,
            backgroundColor: gradient,
            tension: 0.4, // smooth curved line matching screenshot
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "center",
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              usePointStyle: false,
              font: {
                size: 11,
              },
              color: "#6b7280",
            },
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
              color: "#f3f4f6",
            },
            ticks: {
              color: "#9ca3af",
              font: {
                size: 10,
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
