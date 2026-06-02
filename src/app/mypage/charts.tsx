"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  DoughnutController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./mypageStyle.css";
import { Tooltip as ReactTootip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { FaRegCheckCircle } from "react-icons/fa";
import { BsFire } from "react-icons/bs";
import { RiTeamLine } from "react-icons/ri";
import { MdOutlineQuestionMark } from "react-icons/md";
import { FiUserCheck } from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  DoughnutController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const iconComponent = {
  checkCircle: FaRegCheckCircle,
  fire: BsFire,
  team: RiTeamLine,
};

export function Card({
  title,
  info,
  iconComponentName,
}: {
  title: string;
  info: number;
  iconComponentName: keyof typeof iconComponent;
}) {
  const iconCSS = {
    checkCircle: "text-green-500 bg-green-200 rounded-lg",
    fire: "text-red-500 bg-red-200 rounded-lg",
    team: "text-blue-500 bg-blue-200 rounded-lg",
  };

  const IconComponent = iconComponent[iconComponentName];
  const IconCSS =
    "inline-block mr-2 w-8 h-8 p-1.5 " + iconCSS[iconComponentName];
  return (
    <div className="w-auto border-2 border-gray-100 rounded-lg bg-white text-black px-2 hover:shadow-lg transition-shadow">
      <div className="ml-4 mt-4">
        <IconComponent className={IconCSS} />
        <span className="text-sm md:text-base">{title}</span>
      </div>
      <div className="text-lg md:text-2xl px-4 md:px-5 py-2 md:py-3">
        {info}
      </div>
    </div>
  );
}

interface BarChartProps {
  labels: string[];
  labelTitle: string;
  data: number[];
  chartTitle: string;
}

export function BarChart({
  labels,
  labelTitle,
  data,
  chartTitle,
}: BarChartProps) {
  return (
    <div className="w-[100%] h-[100%] p-8">
      <Bar
        data={{
          labels: labels,
          datasets: [
            {
              label: labelTitle,
              data: data,
              backgroundColor: ["rgba(59, 130, 246, 0.8)"],
              hoverBackgroundColor: "rgb(9, 83, 201)",
              borderRadius: 20,
              barPercentage: 0.6,
              categoryPercentage: 0.6,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
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
              beginAtZero: true,
              grace: "20%",
              ticks: {
                precision: 0,
              },
            },
          },
        }}
      ></Bar>
    </div>
  );
}

interface DoughnutChartProps {
  labels: string[];
  label: string;
  data: number[];
}

export function DoughnutChart({ labels, label, data }: DoughnutChartProps) {
  // console.log(labels);
  // console.log(data);
  return (
    <div className="w-[100%] h-[100%] px-5 py-8">
      <Doughnut
        data={{
          labels: labels,
          datasets: [
            {
              label: label,
              data: data,
              backgroundColor: ["#EF4444", "#f59e0b", "#3b82f6"],
              borderWidth: 0,
              borderRadius: 4,
              spacing: 5,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: "75%",
          plugins: {
            legend: {
              position: "bottom" as const,
            },
            tooltip: {
              enabled: true,
            },
          },
        }}
      ></Doughnut>
    </div>
  );
}

interface LineChartProps {
  labels: string[];
  label: string;
  data: number[];
}

export function LineChart({ labels, label, data }: LineChartProps) {
  return (
    <>
      <div className="relative w-[100%] h-[400px]">
        <Line
          data={{
            labels: labels,
            datasets: [
              {
                label: label,
                data: data,
                borderColor: "rgb(16, 185, 129)",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                tension: 0.2,
                fill: true,
                borderWidth: 3,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: "#4B5563",
                  font: { family: "Pretendard, sans-serif", size: 12 },
                },
              },
            },
            elements: {
              point: {
                radius: 0,
                hoverRadius: 10,
                hitRadius: 10,
              },
            },
            scales: {
              x: {
                grid: { display: false, color: "#E5E7EB" },
                ticks: { color: "#9CA3AF", font: { size: 11 } },
              },
              y: {
                beginAtZero: true,
                grace: "20%",
                ticks: {
                  precision: 0,
                  color: "#9CA3AF",
                  font: { size: 11 },
                },
                grid: { color: "#E5E7EB" },
                border: { dash: [5, 5] },
              },
            },
          }}
        ></Line>
      </div>
    </>
  );
}

interface activityDatum {
  date: string | Date | number;
  count: number;
}

interface activityDataProps {
  year: number;
  activityData: activityDatum[];
}

export function Calendar({ year, activityData }: activityDataProps) {
  const startDate = new Date(year - 1 + "-12-31");
  const endDate = new Date(year + "-12-31");

  return (
    <div className="w-full">
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={activityData || []}
        classForValue={(datum) => {
          if (!datum) return "color-empty";
          return `color-scale-${Math.min(datum.count, 4)}`;
        }}
        tooltipDataAttrs={(value) => {
          if (
            value &&
            (value.date != undefined || value.date != null) &&
            value.count != 0
          ) {
            return {
              "data-tooltip-id": "tooltip_active",
              "data-tooltip-content": `${new Date(
                value?.date,
              ).toLocaleDateString("sv-SE", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })} : ${value.count} 문제 해결`,
            } as any;
          } else
            return {
              "data-tooltip-id": "tooltip_nonActive",
              "data-tooltip-content": "잔디를 심지 않았어요.",
            } as any;
        }}
        gutterSize={2}
        weekdayLabels={["월", "화", "수", "목", "금", "토", "일"]}
        showWeekdayLabels={true}
        showMonthLabels={true}
      />
      <ReactTootip
        id="tooltip_active"
        variant="success"
        place="left"
        float={true}
      ></ReactTootip>
      <ReactTootip
        id="tooltip_nonActive"
        variant="warning"
        place="left"
        float={true}
      ></ReactTootip>
    </div>
  );
}

interface ProgressBarProps {
  progress: number;
}

function ProgressBar({ progress }: ProgressBarProps) {
  const safeProgress = Math.min(progress, 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-semibold text-blue-600">
          {safeProgress}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
}

interface AttendceRateCardProps {
  progress: number;
}

export function AttendceRateCard({ progress }: AttendceRateCardProps) {
  return (
    <div className="w-auto border-2 border-gray-100 rounded-lg bg-white text-black px-2 hover:shadow-lg transition-shadow">
      <div className="ml-4 mt-4">
        <FiUserCheck className="inline-block mr-2 w-8 h-8 p-1.5 text-orange-500 bg-yellow-100 rounded-lg"></FiUserCheck>
        <span className="text-sm md:text-base">출석률</span>
      </div>
      <div className="text-lg md:text-2xl px-4 md:px-5 py-2 md:py-3">
        <ProgressBar progress={progress}></ProgressBar>
      </div>
    </div>
  );
}
