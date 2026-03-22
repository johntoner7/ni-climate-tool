"use client";

import ChartTooltip from "./ChartTooltip";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useIsMobile } from "@/lib/useIsMobile";

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
  const isMobile = useIsMobile();
  const dimmed = activeStep === 9 && !HIGHLIGHTED_AT_9.has(sector);

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
            tick={{ fontSize: isMobile ? 10 : 9, fill: isDark ? "#9ca3af" : "#6b7280" }}
            tickLine={false}
            ticks={isMobile ? [1990, 2023, 2030] : [1990, 2000, 2010, 2023, 2030]}
          />
          <YAxis hide />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const value = payload[0]?.value as number | undefined;
              return (
                <ChartTooltip
                  label={String(label)}
                  name={sector}
                  value={`${value?.toLocaleString() ?? "N/A"} kt`}
                  color={colour}
                  indicatorType="circle"
                />
              );
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
