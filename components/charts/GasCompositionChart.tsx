"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  Tooltip,
} from "recharts";
import ChartTooltip from "./ChartTooltip";

type View = "gwp100" | "gwp20";

// ── GWP-weighted shares as reported by NAEI (View 1, GWP100 AR5) ──
const V1 = { ch4: 72, n2o: 23, co2: 6 };
const V1_SUM = V1.ch4 + V1.n2o + V1.co2; // 101 — normalise below

// Back-calculate raw gas masses from GWP100, then re-weight by GWP20.
// CH₄ GWP100 = 28 (AR5, no climate-carbon feedback)
// N₂O GWP100 ≈ GWP20 ≈ 273 (stable across timescales, per spec)
const rawMass = {
  ch4: V1.ch4 / 28,
  n2o: V1.n2o / 273,
  co2: V1.co2 / 1,
};
const gwp20w = {
  ch4: rawMass.ch4 * 80.8,
  n2o: rawMass.n2o * 273,
  co2: rawMass.co2 * 1,
};
const V2_SUM = gwp20w.ch4 + gwp20w.n2o + gwp20w.co2;

// ── Derived percentage shares ──────────────────────────────────────
const SHARES: Record<View, { ch4: number; n2o: number; co2: number }> = {
  gwp100: {
    ch4: (V1.ch4 / V1_SUM) * 100, // ≈ 71%
    n2o: (V1.n2o / V1_SUM) * 100, // ≈ 23%
    co2: (V1.co2 / V1_SUM) * 100, // ≈ 6%
  },
  gwp20: {
    ch4: (gwp20w.ch4 / V2_SUM) * 100, // ≈ 88%
    n2o: (gwp20w.n2o / V2_SUM) * 100, // ≈ 10%
    co2: (gwp20w.co2 / V2_SUM) * 100, // ≈ 3%
  },
};

// ── Styling ────────────────────────────────────────────────────────
// Muted data-journalism palette — avoids bright primaries
const COLOURS = {
  ch4: "#b85a30", // muted burnt sienna
  n2o: "#6a8cad", // muted steel blue
  co2: "#c4ccd4", // light warm grey
} as const;

// Labels text colour — co2 segment is light so needs dark text
const LABEL_TEXT = {
  ch4: "white",
  n2o: "white",
  co2: "#6b7280",
} as const;

const DISPLAY_LABELS = {
  ch4: "Methane (CH₄)",
  n2o: "Nitrous oxide (N₂O)",
  co2: "Carbon dioxide (CO₂)",
} as const;

const CAPTIONS: Record<View, string> = {
  gwp100: "By mass, methane dominates NI agricultural emissions",
  gwp20: "Weighted by near-term warming impact, methane's share becomes overwhelming",
};

// ── Inline segment label renderer ─────────────────────────────────
function makeLabel(textColour: string) {
  return function SegmentLabel({ x, y, width, height, value }: any) {
    if (!width || width < 44) return null;
    return (
      <text
        x={(x as number) + (width as number) / 2}
        y={(y as number) + (height as number) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColour}
        fontSize={12}
        fontWeight={700}
        style={{ pointerEvents: "none" }}
      >
        {Math.round(value as number)}%
      </text>
    );
  };
}

const SEGMENT_LABELS = {
  ch4: makeLabel(LABEL_TEXT.ch4),
  n2o: makeLabel(LABEL_TEXT.n2o),
  co2: makeLabel(LABEL_TEXT.co2),
} as const;

// ── Component ──────────────────────────────────────────────────────
export default function GasCompositionChart({
  className,
}: {
  className?: string;
}) {
  const [view, setView] = useState<View>("gwp100");
  const s = SHARES[view];

  const chartData = [
    {
      name: "",
      [DISPLAY_LABELS.ch4]: +s.ch4.toFixed(2),
      [DISPLAY_LABELS.n2o]: +s.n2o.toFixed(2),
      [DISPLAY_LABELS.co2]: +s.co2.toFixed(2),
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    const gasKey = Object.keys(DISPLAY_LABELS).find(
      (k) => DISPLAY_LABELS[k as keyof typeof DISPLAY_LABELS] === item.name
    ) as keyof typeof COLOURS | undefined;
    
    return (
      <ChartTooltip
        name={item.name}
        value={`${Math.round(item.value)}%`}
        color={gasKey ? COLOURS[gasKey] : "#000"}
        indicatorType="circle"
      />
    );
  };

  return (
    <div className={className}>

      {/* ── Toggle ──────────────────────────────────────────────── */}
      <div className="flex w-fit gap-0.5 rounded-full border border-gray-200 dark:border-gray-700 p-0.5 mb-5">
        {(["gwp100", "gwp20"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              view === v
                ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {v === "gwp100" ? "Actual emissions" : "20-year climate impact"}
          </button>
        ))}
      </div>

      {/* ── Stacked bar ─────────────────────────────────────────── */}
      {/* key={view} remounts the chart on toggle, firing the grow animation */}
      <ResponsiveContainer key={view} width="100%" height={52}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          barCategoryGap={0}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" hide width={0} />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          {(["ch4", "n2o", "co2"] as const).map((k) => (
            <Bar
              key={k}
              dataKey={DISPLAY_LABELS[k]}
              stackId="a"
              fill={COLOURS[k]}
              isAnimationActive
              animationDuration={450}
              animationEasing="ease-out"
            >
              <LabelList
                dataKey={DISPLAY_LABELS[k]}
                content={SEGMENT_LABELS[k]}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* ── Legend ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
        {(["ch4", "n2o", "co2"] as const).map((k) => (
          <div key={k} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: COLOURS[k] }}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {DISPLAY_LABELS[k]}
            </span>
          </div>
        ))}
      </div>

      {/* ── Caption ─────────────────────────────────────────────── */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 italic leading-relaxed">
        {CAPTIONS[view]}
      </p>

    </div>
  );
}
