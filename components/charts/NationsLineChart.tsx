"use client";

import { useState } from "react";
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
  ReferenceDot,
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

const CHART_HEIGHT  = 540;
const MARGIN_TOP    = 10;
const MARGIN_BOTTOM = 0;

const AGRI_1990: Record<string, number> = {
  "Northern Ireland": 5198.7,
  "England":          34657.4,
  "Scotland":         8625.4,
  "Wales":            5919.5,
};

const agricultureIndexed = (
  nationsData.agriculture_by_year as Array<Record<string, number>>
).map((row) => {
  const ni = parseFloat(((row["Northern Ireland"] / AGRI_1990["Northern Ireland"]) * 100).toFixed(2));
  return {
    year:               row.year,
    "Northern Ireland": ni,
    "ni_area":          Math.max(ni, 100),
    "England":          parseFloat(((row["England"]  / AGRI_1990["England"])  * 100).toFixed(2)),
    "Scotland":         parseFloat(((row["Scotland"] / AGRI_1990["Scotland"]) * 100).toFixed(2)),
    "Wales":            parseFloat(((row["Wales"]    / AGRI_1990["Wales"])    * 100).toFixed(2)),
  };
});

const niAgriPeak = agricultureIndexed.reduce(
  (max, d) => d["Northern Ireland"] > max.value ? { year: d.year, value: d["Northern Ireland"] } : max,
  { year: 0, value: 0 }
);

const LABEL_MIN_GAP = 2.5;

function deconflictLabels(endpoint: Record<string, number>, nations: string[]): Record<string, number> {
  const sorted = [...nations]
    .map((n) => ({ nation: n, y: endpoint[n] ?? 0 }))
    .sort((a, b) => b.y - a.y);
  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i - 1].y - sorted[i].y;
    if (gap < LABEL_MIN_GAP) {
      const shift = (LABEL_MIN_GAP - gap) / 2;
      sorted[i - 1] = { ...sorted[i - 1], y: sorted[i - 1].y + shift };
      sorted[i]     = { ...sorted[i],     y: sorted[i].y     - shift };
    }
  }
  return Object.fromEntries(sorted.map(({ nation, y }) => [nation, y]));
}

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

function LineEndLabel({ viewBox, value, color, bold }: { viewBox?: { x?: number; y?: number }; value: string; color: string; bold?: boolean }) {
  if (typeof viewBox?.x !== "number" || typeof viewBox?.y !== "number") return null;
  return (
    <text
      x={viewBox.x + 8}
      y={viewBox.y + 4}
      fill={color}
      fontSize={bold ? 12 : 10}
      fontWeight={bold ? 700 : 500}
    >
      {value}
    </text>
  );
}

export default function NationsLineChart() {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<"total" | "agriculture">("agriculture");

  const isAgri         = tab === "agriculture";
  const chartData      = isAgri ? agricultureIndexed : nationsData.by_year_indexed;
  const yDomain        = isAgri ? AGRI_Y_DOMAIN : TOTAL_Y_DOMAIN;
  const endpoint       = chartData[chartData.length - 1] as Record<string, number>;
  const labelPositions = deconflictLabels(endpoint, Object.keys(NATION_COLOURS));

  return (
    <div className="w-full flex flex-col">
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
        <ComposedChart
          data={chartData}
          margin={{ top: MARGIN_TOP, right: isMobile ? 10 : 120, left: isMobile ? 0 : 20, bottom: MARGIN_BOTTOM }}
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
          />
          <ReferenceLine
            y={100}
            stroke="#9ca3af"
            strokeDasharray="4 4"
            label={isMobile ? undefined : { value: "1990 baseline", position: "insideRight", fontSize: 11, fill: "#9ca3af", dy: -8 }}
          />

          {isAgri && (
            <Area
              key="ni-area-fill"
              type="monotone"
              dataKey="ni_area"
              baseValue={100}
              fill="#c1440e"
              fillOpacity={0.07}
              stroke="none"
              legendType="none"
              tooltipType="none"
              isAnimationActive={false}
            />
          )}

          <Tooltip content={NationsTooltip} />

          {Object.entries(NATION_COLOURS).map(([nation, colour]) => (
            <Line
              key={nation}
              type="monotone"
              dataKey={nation}
              stroke={colour}
              strokeWidth={nation === "Northern Ireland" ? 3 : 1.5}
              dot={false}
              connectNulls
            />
          ))}

          {!isMobile && Object.entries(NATION_COLOURS).map(([nation, colour]) => (
            <ReferenceDot
              key={`label-${nation}`}
              x={2023}
              y={labelPositions[nation]}
              r={0}
              label={<LineEndLabel value={nation} color={colour} bold={nation === "Northern Ireland"} />}
            />
          ))}

          {isAgri && !isMobile && (
            <ReferenceDot
              x={niAgriPeak.year}
              y={niAgriPeak.value}
              r={4}
              fill="#c1440e"
              stroke="white"
              strokeWidth={1.5}
              label={{
                value: `${Math.round(niAgriPeak.value)} — peak`,
                position: "top",
                fontSize: 11,
                fill: "#c1440e",
                fontWeight: 600,
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 italic leading-relaxed text-center">
        Each nation starts at 100 in 1990. Above 100: emissions have risen. Below 100: emissions have fallen.
      </p>
    </div>
  );
}
