"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import nationsData from "@/public/data/nations_comparison.json";
import ChartTooltip from "./ChartTooltip";

const NATION_COLOURS: Record<string, string> = {
  "Northern Ireland": "#c1440e",
  "England":          "#6e9ec5",
  "Scotland":         "#4a7c9e",
  "Wales":            "#8fbc8f",
};

const Y_DOMAIN: [number, number] = [40, 110];
const CHART_HEIGHT = 420;
const MARGIN_TOP = 10;
const MARGIN_BOTTOM = 0;

// Converts a data value to its SVG pixel Y - exact because the legend is outside the SVG
function toPixelY(value: number) {
  const plotHeight = CHART_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;
  return MARGIN_TOP + ((Y_DOMAIN[1] - value) / (Y_DOMAIN[1] - Y_DOMAIN[0])) * plotHeight;
}

export default function NationsLineChart() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const CustomTooltip = ({ active, payload, label, coordinate }: any) => {
    if (!active || !payload?.length || coordinate?.y == null) return null;

    const THRESHOLD = 20;
    let closest = null;
    let closestDist = Infinity;
    for (const p of payload) {
      if (p.value == null) continue;
      const dist = Math.abs(toPixelY(p.value) - coordinate.y);
      if (dist < closestDist) { closestDist = dist; closest = p; }
    }

    if (!closest || closestDist > THRESHOLD) return null;

    return (
      <ChartTooltip
        label={label}
        name={closest.name}
        value={closest.value.toFixed(1)}
        color={closest.color}
        indicatorType="circle"
      />
    );
  };

  return (
    <div className="w-full">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        Index (1990=100) · Source: NAEI
      </p>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <LineChart
          data={nationsData.by_year_indexed}
          margin={{ top: MARGIN_TOP, right: 20, left: 20, bottom: MARGIN_BOTTOM }}
        >
          <CartesianGrid vertical={false} stroke={isDark ? "#374151" : "#e5e7eb"} />
          <XAxis
            dataKey="year"
            tickLine={false}
            tick={{ fontSize: 12, fill: isDark ? "#9ca3af" : "#6b7280" }}
          />
          <YAxis
            tickLine={false}
            tick={{ fontSize: 12, fill: isDark ? "#9ca3af" : "#6b7280" }}
            tickFormatter={(v) => `${v}`}
            domain={Y_DOMAIN}
            label={{
              value: "Index (1990=100)",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 11, fill: "#9ca3af" },
            }}
          />
          <ReferenceLine
            y={100}
            stroke="#9ca3af"
            strokeDasharray="4 4"
            label={{ value: "1990 baseline", position: "right", fontSize: 11, fill: "#9ca3af" }}
          />
          <Tooltip content={<CustomTooltip />} />
          {Object.entries(NATION_COLOURS).map(([nation, colour]) => (
            <Line
              key={nation}
              type="monotone"
              dataKey={nation}
              stroke={colour}
              strokeWidth={nation === "Northern Ireland" ? 2.5 : 1.5}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {/* Legend rendered outside the SVG so it doesn't affect the plot area height */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 justify-center">
        {Object.entries(NATION_COLOURS).map(([nation, colour]) => (
          <div key={nation} className="flex items-center gap-1.5">
            <div
              className="h-0.5 w-5 rounded"
              style={{
                backgroundColor: colour,
                height: nation === "Northern Ireland" ? 3 : 2,
              }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-300">{nation}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
