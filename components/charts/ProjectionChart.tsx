"use client";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import projectionsData from "@/public/data/ni_projections.json";
import ChartTooltip from "./ChartTooltip";
import { useIsMobile } from "@/lib/useIsMobile";

const TARGET = projectionsData.metadata.target_2030_kt;

export default function ProjectionChart({ activeStep }: { activeStep?: number }) {
  const isMobile = useIsMobile();
  const showGap = activeStep === undefined || activeStep >= 9;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const item = payload.find((p: any) => p.value != null);
    if (!item) return null;

    const name = item.dataKey === "actual" ? "Actual emissions" : "Projected (current trend)";
    return (
      <ChartTooltip
        label={label}
        name={name}
        value={`${item.value.toLocaleString()} kt`}
        color="#1e3a5f"
        indicatorType="line"
      />
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        kt CO₂e · Source: NAEI
      </p>
      <ResponsiveContainer width="100%" height={isMobile ? 260 : 420}>
        <ComposedChart
          data={projectionsData.chart3_total}
          margin={{ top: 20, right: isMobile ? 15 : 60, left: isMobile ? 0 : 20, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            type="number"
            domain={[1990, 2030]}
            tickCount={isMobile ? 5 : 9}
            tickLine={false}
            tick={{ fontSize: isMobile ? 10 : 12, fill: "#6b7280" }}
          />
          <YAxis
            tickLine={false}
            tick={{ fontSize: isMobile ? 10 : 12, fill: "#6b7280" }}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}Mt`}
            domain={[10000, 28000]}
            width={isMobile ? 28 : undefined}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* 2030 target line */}
          <ReferenceLine
            y={TARGET}
            stroke="#16a34a"
            strokeWidth={1.5}
            strokeDasharray="6 3"
            label={isMobile ? undefined : {
              value: `2030 target: ${(TARGET / 1000).toFixed(1)}Mt`,
              position: "right",
              fontSize: 11,
              fill: "#16a34a",
            }}
          />

          {/* Gap fill - only shown at step 7+ */}
          <Area
            type="monotone"
            dataKey="projected"
            baseValue={TARGET}
            fill={showGap ? "#fca5a5" : "transparent"}
            fillOpacity={showGap ? 0.4 : 0}
            stroke="none"
            legendType="none"
            tooltipType="none"
            connectNulls={false}
          />

          {/* Historical actuals */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#1e3a5f"
            strokeWidth={2.5}
            dot={false}
            connectNulls
            name="actual"
          />

          {/* Trend projection */}
          <Line
            type="monotone"
            dataKey="projected"
            stroke="#1e3a5f"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={false}
            connectNulls
            name="projected"
          />
        </ComposedChart>
      </ResponsiveContainer>
      {/* Legend outside the SVG */}
      <div className={`flex flex-wrap gap-y-1 mt-4 justify-center ${isMobile ? "gap-x-3" : "gap-x-6"}`}>
        <div className="flex items-center gap-1.5">
          <div className="w-5 rounded" style={{ height: 3, backgroundColor: "#1e3a5f" }} />
          <span className={`text-gray-600 dark:text-gray-300 ${isMobile ? "text-[10px]" : "text-xs"}`}>Actual</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-5"
            style={{
              height: 2,
              backgroundImage: "repeating-linear-gradient(to right, #1e3a5f 0, #1e3a5f 6px, transparent 6px, transparent 10px)",
            }}
          />
          <span className={`text-gray-600 dark:text-gray-300 ${isMobile ? "text-[10px]" : "text-xs"}`}>{isMobile ? "Projected" : "Projected (current trend)"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: "#fca5a5", opacity: 0.7 }} />
          <span className={`text-gray-600 dark:text-gray-300 ${isMobile ? "text-[10px]" : "text-xs"}`}>{isMobile ? "Gap" : "Gap to 2030 target"}</span>
        </div>
      </div>
    </div>
  );
}
