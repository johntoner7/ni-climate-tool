"use client";

import { useState, useEffect } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type DataPoint = {
  year: number;
  actual: number | null;
  projected: number | null;
};

type Props = {
  sector: string;
  data: DataPoint[];
  target: number;
  colour: string;
  change1990: string;
  activeStep?: number;
};

const HIGHLIGHTED_AT_9 = new Set(["Agriculture", "Transport"]);

export default function SectorMiniChart({
  sector,
  data,
  target,
  colour,
  change1990,
  activeStep,
}: Props) {
  const [isDark, setIsDark] = useState(false);
  const dimmed = activeStep === 9 && !HIGHLIGHTED_AT_9.has(sector);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`bg-white dark:bg-gray-800 border rounded p-4 transition-opacity duration-300 ${dimmed ? "border-gray-100 dark:border-gray-800 opacity-30" : "border-gray-200 dark:border-gray-700 opacity-100"}`}>
      <div className="flex justify-between items-baseline mb-2">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {sector}
        </h3>
        <span
          className={`text-xs font-mono ${
            change1990.startsWith("+")
              ? "text-red-600 dark:text-red-400"
              : "text-green-700 dark:text-green-500"
          }`}
        >
          {change1990} since 1990
        </span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="year"
            tick={{ fontSize: 9, fill: isDark ? "#9ca3af" : "#6b7280" }}
            tickLine={false}
            ticks={[1990, 2000, 2010, 2023, 2030]}
          />
          <YAxis hide />
          <Tooltip
            formatter={(value: number | undefined) => [
              `${value?.toLocaleString() ?? 'N/A'} kt`,
            ]}
            contentStyle={{
              fontSize: 11,
              backgroundColor: isDark ? "rgba(31, 41, 55, 0.95)" : "rgba(255, 255, 255, 0.95)",
              color: isDark ? "#f3f4f6" : "#111827",
              border: isDark ? "1px solid #4b5563" : "1px solid #e5e7eb",
              borderRadius: "4px",
            }}
          />
          <ReferenceLine
            y={target}
            stroke="#16a34a"
            strokeDasharray="4 2"
            strokeWidth={1}
          />
          {sector === "Industry" && activeStep === 9 && (
            <ReferenceLine
              x={2002}
              stroke="#9ca3af"
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{
                value: "Richardson's 2002",
                position: "insideTopRight",
                fontSize: 8,
                fill: "#6b7280",
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="actual"
            stroke={colour}
            strokeWidth={1.5}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="projected"
            stroke={colour}
            strokeWidth={1.5}
            strokeDasharray="4 3"
            dot={false}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
