"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

interface BarChartProps {
  labels: string[];
  labelTitle: string;
  data: number[];
  chartTitle: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function BarChart({
  labels,
  labelTitle,
  data,
  chartTitle,
}: BarChartProps) {
  return (
    <Bar
      data={{
        labels: labels,
        datasets: [
          {
            label: labelTitle,
            data: data,
            backgroundColor: [
              "#4F46E5",
              "#10B981",
              "#0EA5E9",
              "#F59E0B",
              "#F43F5E",
              "#8B5CF6",
              "#64748B",
            ],
            borderRadius: 15,
            barPercentage: 0.5,
            categoryPercentage: 0.7,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
            text: chartTitle,
          },
        },
        scales: {
          y: {
            ticks: {
              precision: 0,
              stepSize: 1,
            },
          },
        },
      }}
    ></Bar>
  );
}
