"use client";

import { useState, useEffect } from "react";
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

const TARGET = projectionsData.metadata.target_2030_kt;

export default function ProjectionChart({ activeStep }: { activeStep?: number }) {
  const showGap = activeStep === undefined || activeStep >= 8;
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

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
    <div className="w-full">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        kt CO₂e · Source: NAEI
      </p>
      <ResponsiveContainer width="100%" height={420}>
        <ComposedChart
          data={projectionsData.chart3_total}
          margin={{ top: 20, right: 60, left: 20, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke={isDark ? "#374151" : "#e5e7eb"} />
          <XAxis
            dataKey="year"
            type="number"
            domain={[1990, 2030]}
            tickCount={9}
            tickLine={false}
            tick={{ fontSize: 12, fill: isDark ? "#9ca3af" : "#6b7280" }}
          />
          <YAxis
            tickLine={false}
            tick={{ fontSize: 12, fill: isDark ? "#9ca3af" : "#6b7280" }}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}Mt`}
            domain={[10000, 28000]}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* 2030 target line */}
          <ReferenceLine
            y={TARGET}
            stroke="#16a34a"
            strokeWidth={1.5}
            strokeDasharray="6 3"
            label={{
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
      <div className="flex gap-6 mt-4 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-5 rounded" style={{ height: 3, backgroundColor: "#1e3a5f" }} />
          <span className="text-xs text-gray-600 dark:text-gray-300">Actual emissions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-5"
            style={{
              height: 2,
              backgroundImage: "repeating-linear-gradient(to right, #1e3a5f 0, #1e3a5f 6px, transparent 6px, transparent 10px)",
            }}
          />
          <span className="text-xs text-gray-600 dark:text-gray-300">Projected (current trend)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: "#fca5a5", opacity: 0.7 }} />
          <span className="text-xs text-gray-600 dark:text-gray-300">Gap to 2030 target</span>
        </div>
      </div>
    </div>
  );
}
