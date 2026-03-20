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
import { useIsMobile } from "@/lib/useIsMobile";
import ChartTooltip from "./ChartTooltip";

const TARGET = projectionsData.metadata.target_2030_kt;

const OLS_COLOUR    = "#6b7280";
const ACTUAL_COLOUR = "#1e3a5f";

type TEntry = { dataKey: string; value: number };

function ProjectionTooltip({ active, payload, label }: { active?: boolean; payload?: readonly TEntry[]; label?: string | number }) {
  if (!active || !payload?.length) return null;
  const actual = payload.find((p) => p.dataKey === "actual" && p.value != null);
  const ols    = payload.find((p) => p.dataKey === "ols"    && p.value != null);
  if (!actual && !ols) return null;
  return (
    <ChartTooltip
      label={String(label)}
      items={[
        ...(actual ? [{ name: "Actual",    value: `${actual.value.toLocaleString()} kt`, color: ACTUAL_COLOUR, indicatorType: "line"   as const }] : []),
        ...(ols    ? [{ name: "OLS trend", value: `${ols.value.toLocaleString()} kt`,    color: OLS_COLOUR,    indicatorType: "dashed" as const }] : []),
      ]}
    />
  );
}

export default function ProjectionChart({ activeStep }: { activeStep?: number }) {
  const isMobile = useIsMobile();
  const showGap = activeStep === undefined || activeStep >= 7;

  return (
    <div className="w-full flex flex-col">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        Mt CO₂e · Source: NAEI
      </p>
      <ResponsiveContainer width="100%" height={isMobile ? 260 : 420}>
        <ComposedChart
          data={projectionsData.chart3_total}
          margin={{ top: 20, right: isMobile ? 15 : 60, left: isMobile ? 0 : 10, bottom: isMobile ? 0 : 20 }}
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
            width={isMobile ? 32 : 40}
          />
          <Tooltip content={ProjectionTooltip} />

          {/* 2030 target line */}
          <ReferenceLine
            y={TARGET}
            stroke="#16a34a"
            strokeWidth={1.5}
            strokeDasharray="6 3"
            label={isMobile ? undefined : {
              value: `2030 target: ${(TARGET / 1000).toFixed(1)}Mt`,
              position: "bottom",
              fontSize: 11,
              fill: "#16a34a",
            }}
          />

          {/* 2023 boundary — separates actuals from projection */}
          <ReferenceLine
            x={2023}
            stroke="#d1d5db"
            strokeDasharray="3 3"
            label={isMobile ? undefined : {
              value: "2023",
              position: "insideTopRight",
              fontSize: 10,
              fill: "#9ca3af",
            }}
          />

          {/* Gap fill — only shown at step 7+ */}
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
            stroke={ACTUAL_COLOUR}
            strokeWidth={2.5}
            dot={false}
            connectNulls
            name="actual"
          />

          {/* OLS trend — regression window (2018–2023) + projection to 2030 */}
          <Line
            type="monotone"
            dataKey="ols"
            stroke={OLS_COLOUR}
            strokeWidth={1.5}
            strokeDasharray="5 4"
            dot={false}
            connectNulls
            name="ols"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className={`flex flex-wrap gap-y-1 mt-4 justify-center ${isMobile ? "gap-x-3" : "gap-x-6"}`}>
        <div className="flex items-center gap-1.5">
          <div className="w-5 rounded" style={{ height: 3, backgroundColor: ACTUAL_COLOUR }} />
          <span className={`text-gray-800 dark:text-gray-100 ${isMobile ? "text-[10px]" : "text-xs"}`}>Actual</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-5"
            style={{
              height: 2,
              backgroundImage: `repeating-linear-gradient(to right, ${OLS_COLOUR} 0, ${OLS_COLOUR} 5px, transparent 5px, transparent 9px)`,
            }}
          />
          <span className={`text-gray-800 dark:text-gray-100 ${isMobile ? "text-[10px]" : "text-xs"}`}>
            {isMobile ? "OLS trend" : "Linear trend (OLS, 2018–2030)"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: "#fca5a5", opacity: 0.7 }} />
          <span className={`text-gray-800 dark:text-gray-100 ${isMobile ? "text-[10px]" : "text-xs"}`}>
            {isMobile ? "Gap" : "Gap to 2030 target"}
          </span>
        </div>
      </div>
    </div>
  );
}
