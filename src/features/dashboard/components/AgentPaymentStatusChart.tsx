"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface AgentPaymentStatusChartProps {
  labels: string[];
  data: number[];
}

export function AgentPaymentStatusChart({ labels, data }: AgentPaymentStatusChartProps) {
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
        labels,
        datasets: [
          {
            data,
            backgroundColor: ["#16a34a", "#f59e0b", "#dc2626"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%",
        plugins: {
          legend: {
            position: "top",
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              usePointStyle: false,
              font: {
                size: 11,
              },
              color: "#4b5563",
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
    <div className="h-64 w-full flex items-center justify-center">
      <canvas ref={canvasRef} />
    </div>
  );
}
