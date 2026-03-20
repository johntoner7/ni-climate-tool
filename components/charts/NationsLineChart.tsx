"use client";

import { useState } from "react";
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
import { useIsMobile } from "@/lib/useIsMobile";
import ChartTooltip from "./ChartTooltip";

const NATION_COLOURS: Record<string, string> = {
  "Northern Ireland": "#c1440e",
  "England":          "#6e9ec5",
  "Scotland":         "#4a7c9e",
  "Wales":            "#8fbc8f",
};

const TOTAL_Y_DOMAIN: [number, number] = [40, 110];
const AGRI_Y_DOMAIN:  [number, number] = [75, 120];

const CHART_HEIGHT   = 540;
const MARGIN_TOP     = 10;
const MARGIN_BOTTOM  = 0;


// ── Pre-compute agriculture indexed (1990 = 100) ─────────────────────────────

const AGRI_1990: Record<string, number> = {
  "Northern Ireland": 5198.7,
  "England":          34657.4,
  "Scotland":         8625.4,
  "Wales":            5919.5,
};

const agricultureIndexed = (
  nationsData.agriculture_by_year as Array<Record<string, number>>
).map((row) => ({
  year:               row.year,
  "Northern Ireland": parseFloat(((row["Northern Ireland"] / AGRI_1990["Northern Ireland"]) * 100).toFixed(2)),
  "England":          parseFloat(((row["England"]          / AGRI_1990["England"])          * 100).toFixed(2)),
  "Scotland":         parseFloat(((row["Scotland"]         / AGRI_1990["Scotland"])         * 100).toFixed(2)),
  "Wales":            parseFloat(((row["Wales"]            / AGRI_1990["Wales"])            * 100).toFixed(2)),
}));

type NEntry = { value: number; name: string; color: string };

function NationsTooltip({ active, payload, label }: { active?: boolean; payload?: readonly NEntry[]; label?: string | number }) {
  if (!active || !payload?.length) return null;
  const items = [...payload]
    .filter((p) => p.value != null)
    .sort((a, b) => b.value - a.value)
    .map((p) => ({ name: p.name, value: p.value.toFixed(1), color: p.color, indicatorType: "circle" as const }));
  if (!items.length) return null;
  return <ChartTooltip label={String(label)} items={items} />;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function NationsLineChart() {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<"total" | "agriculture">("agriculture");

  const isAgri   = tab === "agriculture";
  const chartData = isAgri ? agricultureIndexed : nationsData.by_year_indexed;
  const yDomain   = isAgri ? AGRI_Y_DOMAIN : TOTAL_Y_DOMAIN;

  return (
    <div className="w-full flex flex-col">

      {/* Tab row */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Index (1990=100) · Source: NAEI
        </p>
        <div className="flex gap-1 text-[11px]">
          <button
            onClick={() => setTab("total")}
            className={`px-2.5 py-1 rounded transition-colors ${
              tab === "total"
                ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            All emissions
          </button>
          <button
            onClick={() => setTab("agriculture")}
            className={`px-2.5 py-1 rounded transition-colors ${
              tab === "agriculture"
                ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            Agriculture only
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={isMobile ? 260 : CHART_HEIGHT}>
        <LineChart
          data={chartData}
          margin={{ top: MARGIN_TOP, right: isMobile ? 10 : 30, left: isMobile ? 0 : 20, bottom: MARGIN_BOTTOM }}
        >
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            tickLine={false}
            tick={{ fontSize: isMobile ? 10 : 12, fill: "#6b7280" }}
            ticks={isMobile ? [1990, 2000, 2010, 2023] : [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2023]}
            padding={{ left: 8, right: 8 }}
          />
          <YAxis
            tickLine={false}
            tick={{ fontSize: isMobile ? 10 : 12, fill: "#6b7280" }}
            tickFormatter={(v) => `${v}`}
            domain={yDomain}
            width={isMobile ? 28 : undefined}
            label={isMobile ? undefined : {
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
          <Tooltip content={NationsTooltip} />
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

      {/* Legend */}
      <div className={`flex flex-wrap gap-y-1 mt-4 justify-center ${isMobile ? "gap-x-3" : "gap-x-6"}`}>
        {Object.entries(NATION_COLOURS).map(([nation, colour]) => (
          <div key={nation} className="flex items-center gap-1.5">
            <div
              className="w-5 rounded"
              style={{
                backgroundColor: colour,
                height: nation === "Northern Ireland" ? 3 : 2,
              }}
            />
            <span className={`text-gray-600 dark:text-gray-300 ${isMobile ? "text-[10px]" : "text-xs"}`}>{nation}</span>
          </div>
        ))}
      </div>

      {/* Caption */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 italic leading-relaxed text-center">
        Each nation starts at 100 in 1990. Above 100: emissions have risen. Below 100: emissions have fallen.
      </p>

    </div>
  );
}
