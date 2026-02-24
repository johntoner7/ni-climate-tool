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

const BASE_DATA = projectionsData.chart3_total as Array<{
  year: number;
  actual: number | null;
  projected: number | null;
}>;

// Fixed baseline constants
const TARGET        = 13814;   // kt — 2030 legal target
const ANCHOR_2023   = 18212;   // kt — actual 2023 total
const BASELINE_2030 = 14426;   // kt — current-trend projected 2030 total
const GAP           = 612;     // kt — BASELINE_2030 − TARGET

// Scenario parameters
const DAIRY_ENTERIC_KT = 1760;    // ~55% of enteric fermentation
const BOVAER_EFFICACY  = 0.12;    // 12% reduction (Teagasc pasture trials)
const PEATLAND_RATE    = 5;       // t CO₂e / ha / yr avoided
const ENTERIC_KT       = 3200;    // total enteric fermentation 2023
const TOTAL_CATTLE     = 1673345; // NI cattle census June 2023

// The herd-reduction % at which the gap is exactly closed
const GAP_CLOSING_HERD_PCT = Math.ceil((GAP / ENTERIC_KT) * 100); // = 20

export default function ScenarioModeller() {
  const [bovaerPct,  setBovaerPct]  = useState(0);
  const [peatlandHa, setPeatlandHa] = useState(0);
  const [herdPct,    setHerdPct]    = useState(0);
  const [showMethod, setShowMethod] = useState(false);
  const [isDark,     setIsDark]     = useState(false);

  useEffect(() => {
    const checkDark = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ── Derived calculations ──────────────────────────────────────────
  const bovaerReduction   = (bovaerPct  / 100) * DAIRY_ENTERIC_KT * BOVAER_EFFICACY;
  const peatlandReduction = (peatlandHa * PEATLAND_RATE) / 1000;
  const herdReduction     = (herdPct    / 100) * ENTERIC_KT;
  const totalReduction    = bovaerReduction + peatlandReduction + herdReduction;

  const remainingGap     = Math.max(0, GAP - totalReduction);
  const gapClosedPct     = Math.min(100, Math.round((totalReduction / GAP) * 100));
  const newProjected2030 = Math.round(BASELINE_2030 - totalReduction);
  const targetMet        = newProjected2030 <= TARGET;
  const animalsRemoved   = Math.round((herdPct / 100) * TOTAL_CATTLE);
  const scenarioColour   = targetMet ? "#16a34a" : "#c1440e";

  const statusMessage =
    gapClosedPct >= 100
      ? `Gap closed. This requires ${animalsRemoved.toLocaleString()} fewer cattle — a reduction with no current policy support in Northern Ireland.`
      : gapClosedPct >= 40
      ? `Significant progress — but a gap remains without addressing herd size.`
      : `Current interventions fall well short. The gap requires more than technology alone.`;

  // ── Chart data ────────────────────────────────────────────────────
  const chartData = BASE_DATA.map((point) => {
    if (point.year < 2023) {
      return {
        year: point.year,
        actual: point.actual,
        baseline: null as number | null,
        scenario: null as number | null,
      };
    } else if (point.year === 2023) {
      return {
        year: point.year,
        actual: point.actual,
        baseline: ANCHOR_2023,
        scenario: ANCHOR_2023,
      };
    } else {
      const t = (point.year - 2023) / 7;
      return {
        year: point.year,
        actual: null as number | null,
        baseline: point.projected,
        scenario: Math.round(ANCHOR_2023 + t * (newProjected2030 - ANCHOR_2023)),
      };
    }
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const item = payload.find(
      (p: any) =>
        p.value != null &&
        (p.dataKey === "actual" || p.dataKey === "scenario") &&
        p.type !== "area"
    );
    if (!item) return null;
    return (
      <div className="bg-white dark:bg-gray-800 p-2.5 border border-gray-200 dark:border-gray-600 rounded shadow text-xs">
        <p className="font-semibold text-gray-700 dark:text-gray-200 mb-0.5">{label}</p>
        <p className="text-gray-600 dark:text-gray-300">
          {item.dataKey === "actual" ? "Actual" : "Scenario"}:{" "}
          <span className="font-medium">{Math.round(item.value).toLocaleString()} kt</span>
        </p>
      </div>
    );
  };

  const pctOfGap = (kt: number) => Math.round((kt / GAP) * 100);

  return (
    <div className="w-full h-full overflow-y-auto">

      {/* Section header */}
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">
          What would it take?
        </p>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-snug">
          Adjust the interventions. Watch the gap.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          No current NI policy commits to any of these at meaningful scale.
        </p>
      </div>

      {/* Two-column body */}
      <div className="flex gap-0">

        {/* ── Left: sliders ──────────────────────────────────────── */}
        <div className="w-[45%] pr-5 border-r border-gray-100 dark:border-gray-800 flex flex-col gap-5">

          {/* Slider 1: Bovaer */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Feed additive (Bovaer)</span>
              <span className="text-xs font-mono font-medium text-gray-700 dark:text-gray-200 tabular-nums">
                {bovaerPct}%
              </span>
            </div>
            <input
              type="range" min="0" max="90" step="5"
              value={bovaerPct}
              onChange={(e) => setBovaerPct(Number(e.target.value))}
              className="w-full accent-[#c1440e] cursor-pointer"
              aria-label="Bovaer adoption percentage"
            />
            <div className="flex justify-between text-[10px] text-gray-300 dark:text-gray-600 mt-0.5">
              <span>0%</span>
              <span>90%</span>
            </div>
            {bovaerPct === 90 && (
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                Maximum realistic deployment by 2030
              </p>
            )}
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              Saves{" "}
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {Math.round(bovaerReduction)} kt
              </span>
              {bovaerReduction > 0 && (
                <span className="text-green-600 dark:text-green-500">
                  {" "}({pctOfGap(bovaerReduction)}% of gap)
                </span>
              )}
            </p>
          </div>

          {/* Slider 2: Peatland */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Peatland restoration</span>
              <span className="text-xs font-mono font-medium text-gray-700 dark:text-gray-200 tabular-nums">
                {peatlandHa.toLocaleString()} ha
              </span>
            </div>
            <input
              type="range" min="0" max="10000" step="500"
              value={peatlandHa}
              onChange={(e) => setPeatlandHa(Number(e.target.value))}
              className="w-full accent-[#c1440e] cursor-pointer"
              aria-label="Peatland restoration hectares"
            />
            <div className="flex justify-between text-[10px] text-gray-300 dark:text-gray-600 mt-0.5">
              <span>0</span>
              <span>10,000 ha</span>
            </div>
            {peatlandHa === 10000 && (
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                Ambitious under NI Peatland Strategy
              </p>
            )}
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              Saves{" "}
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {Math.round(peatlandReduction)} kt
              </span>
              {peatlandReduction > 0 && (
                <span className="text-green-600 dark:text-green-500">
                  {" "}({pctOfGap(peatlandReduction)}% of gap)
                </span>
              )}
            </p>
          </div>

          {/* Slider 3: Herd reduction */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Cattle herd reduction</span>
              <span className="text-xs font-mono font-medium text-gray-700 dark:text-gray-200 tabular-nums">
                {herdPct}%
              </span>
            </div>
            {/* Track wrapper with gap-closing tick mark */}
            <div className="relative">
              <input
                type="range" min="0" max="50" step="1"
                value={herdPct}
                onChange={(e) => setHerdPct(Number(e.target.value))}
                className="w-full accent-[#c1440e] cursor-pointer"
                aria-label="Cattle herd reduction percentage"
              />
              <div
                className="absolute top-0 pointer-events-none flex flex-col items-center"
                style={{ left: `${(GAP_CLOSING_HERD_PCT / 50) * 100}%` }}
              >
                <div className="w-px h-2.5 mt-2 bg-gray-300 dark:bg-gray-600" />
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-300 dark:text-gray-600 mt-0.5 relative">
              <span>0%</span>
              <span
                className="absolute text-gray-400 dark:text-gray-500"
                style={{
                  left: `${(GAP_CLOSING_HERD_PCT / 50) * 100}%`,
                  transform: "translateX(-50%)",
                }}
              >
                closes gap
              </span>
              <span>50%</span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              Saves{" "}
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {Math.round(herdReduction)} kt
              </span>
              {herdReduction > 0 && (
                <span className="text-green-600 dark:text-green-500">
                  {" "}({pctOfGap(herdReduction)}% of gap)
                </span>
              )}
            </p>
            {herdPct >= 19 && (
              <p className="text-[11px] text-[#c1440e] dark:text-red-400 mt-1 font-medium">
                {herdPct}% = {animalsRemoved.toLocaleString()} fewer cattle
              </p>
            )}
          </div>

          {/* Methodology toggle */}
          <div>
            <button
              onClick={() => setShowMethod(!showMethod)}
              className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:underline underline-offset-2"
            >
              methodology {showMethod ? "−" : "+"}
            </button>
            {showMethod && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed space-y-2">
                <p>
                  <strong className="text-gray-600 dark:text-gray-300">Bovaer:</strong>{" "}
                  12% enteric reduction via twice-daily concentrate delivery (Teagasc pasture
                  trials). Applied to dairy enteric only (~1,760 kt).
                </p>
                <p>
                  <strong className="text-gray-600 dark:text-gray-300">Peatland:</strong>{" "}
                  5 t CO₂e/ha/yr avoided (UK Peatland Code). LULUCF sector — requires land
                  taken out of production.
                </p>
                <p>
                  <strong className="text-gray-600 dark:text-gray-300">Herd:</strong>{" "}
                  Linear relationship with enteric fermentation (~3,200 kt). NI cattle census
                  2023: 1,673,345 (DAERA/NISRA).
                </p>
                <p>
                  <strong className="text-gray-600 dark:text-gray-300">Sources:</strong>{" "}
                  DAERA census 2023 · Teagasc/DSM trials · NISRA GHG inventory 1990–2023 ·
                  CCC NI Net Zero 2023.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* ── Right: output panel ────────────────────────────────── */}
        <div className="w-[55%] pl-5 flex flex-col gap-4">

          {/* Projected 2030 total */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
              Projected 2030 total
            </p>
            <p
              className="text-[32px] font-bold tabular-nums leading-none"
              style={{ color: targetMet ? "#16a34a" : "#c1440e" }}
            >
              {newProjected2030.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">kt CO₂e</p>
          </div>

          {/* Gap progress bar */}
          <div>
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-[10px] uppercase tracking-widest text-gray-400">Gap closed</span>
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ color: gapClosedPct >= 100 ? "#16a34a" : "#c1440e" }}
              >
                {gapClosedPct}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${gapClosedPct}%`,
                  backgroundColor: gapClosedPct >= 100 ? "#16a34a" : "#c1440e",
                }}
              />
            </div>
            {remainingGap > 0 && (
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                {Math.round(remainingGap).toLocaleString()} kt still to close
              </p>
            )}
          </div>

          {/* Status message */}
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {statusMessage}
          </p>

          {/* Mini chart */}
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart
              data={chartData}
              margin={{ top: 5, right: 55, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke={isDark ? "#374151" : "#e5e7eb"} />
              <XAxis
                dataKey="year"
                type="number"
                domain={[1990, 2030]}
                tickCount={5}
                tickLine={false}
                tick={{ fontSize: 10, fill: isDark ? "#9ca3af" : "#6b7280" }}
              />
              <YAxis
                tickLine={false}
                tick={{ fontSize: 10, fill: isDark ? "#9ca3af" : "#6b7280" }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}Mt`}
                domain={[10000, 28000]}
                width={28}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={TARGET}
                stroke="#16a34a"
                strokeWidth={1}
                strokeDasharray="6 3"
                label={{ value: "2030 target", position: "right", fontSize: 9, fill: "#16a34a" }}
              />
              <Area
                type="monotone"
                dataKey="scenario"
                baseValue={TARGET}
                fill={targetMet ? "#bbf7d0" : "#fca5a5"}
                fillOpacity={0.35}
                stroke="none"
                legendType="none"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#1e3a5f"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="baseline"
                stroke={isDark ? "#4b5563" : "#d1d5db"}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                dot={false}
                connectNulls
                legendType="none"
              />
              <Line
                type="monotone"
                dataKey="scenario"
                stroke={scenarioColour}
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>

        </div>
      </div>
    </div>
  );
}
