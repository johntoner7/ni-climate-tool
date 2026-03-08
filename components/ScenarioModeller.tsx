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
} from "recharts";
import projectionsData from "@/public/data/ni_projections.json";

// ── Module-level constants ────────────────────────────────────────────────────

const AGRI_2023            = 5615;    // kt CO₂e — DAERA/NISRA GHG inventory 2023
const AGRI_TARGET_2030     = 4490;    // kt CO₂e — CCC Stretch Ambition (-21% from 2020 baseline)
const AGRI_BASELINE_2030   = 5615;    // kt CO₂e — flat projection (agriculture broadly flat 2020-2023)
const AGRI_GAP             = 1125;     // kt CO₂e — AGRI_BASELINE_2030 - AGRI_TARGET_2030

const ENTERIC_KT           = 3200;    // kt CO₂e — total enteric fermentation 2023
const DAIRY_ENTERIC_KT     = 1760;    // kt CO₂e — dairy enteric portion (methodology §07)
const NON_DAIRY_ENTERIC_KT = 1440;    // kt CO₂e — non-dairy (3200 - 1760)
const SLURRY_METHANE_KT    = 630;     // kt CO₂e — liquid slurry methane
const SOIL_FERTILISER_KT   = 59;      // kt CO₂e — ceiling for fertiliser switch savings (44 kt at 75% → scaled to 100%)
const BOVAER_EFFICACY      = 0.12;    // 12% — Teagasc pasture trials
const PEATLAND_RATE        = 11;      // t CO₂e/ha/yr — UK CEH NI-specific analysis (methodology §07)
const TOTAL_CATTLE         = 1673345; // DAERA census 2023

// Committed policy baseline — Draft NI CAP 2023-2027, livestock productivity improvements (methodology §07)
const COMMITTED_BASELINE_KT = 242;

// Adjusted gap after committed policies (1125 - 242 = 883 kt)
const ADJUSTED_GAP = AGRI_GAP - COMMITTED_BASELINE_KT;

// Herd reduction % that closes the adjusted gap alone (883/3200 ≈ 28%)
const GAP_CLOSING_HERD_PCT = Math.ceil((ADJUSTED_GAP / ENTERIC_KT) * 100);

// ── Chart base data ───────────────────────────────────────────────────────────

const BASE_DATA = projectionsData.chart3_agriculture as Array<{
  year: number;
  actual: number | null;
  projected: number | null;
}>;

// ── Component ─────────────────────────────────────────────────────────────────

export default function ScenarioModeller() {
  // Slider states
  const [bovaerPct,   setBovaerPct]   = useState(0);
  const [nonDairyPct, setNonDairyPct] = useState(0);
  const [slurryPct,   setSlurryPct]   = useState(0);
  const [fertPct,     setFertPct]     = useState(0);
  const [peatlandHa,  setPeatlandHa]  = useState(0);
  const [herdPct,     setHerdPct]     = useState(0);
  // Toggle states
  const [geneticsOn,  setGeneticsOn]  = useState(false);
  const [adOn,        setAdOn]        = useState(false);

  const applyPreset = (preset: "techOnly" | "mixed" | "reset") => {
    if (preset === "techOnly") {
      setBovaerPct(90); setNonDairyPct(90); setSlurryPct(80);
      setFertPct(100); setPeatlandHa(10000); setHerdPct(0);
      setGeneticsOn(true); setAdOn(true);
    } else if (preset === "mixed") {
      setBovaerPct(60); setNonDairyPct(50); setSlurryPct(50);
      setFertPct(75); setPeatlandHa(5000); setHerdPct(20);
      setGeneticsOn(true); setAdOn(false);
    } else {
      setBovaerPct(0); setNonDairyPct(0); setSlurryPct(0);
      setFertPct(0); setPeatlandHa(0); setHerdPct(0);
      setGeneticsOn(false); setAdOn(false);
    }
  };

  // ── Derived calculations ──────────────────────────────────────────────────

  // Raw reductions (before clamping to physical source pools)
  const bovaerRaw         = (bovaerPct   / 100) * DAIRY_ENTERIC_KT     * BOVAER_EFFICACY;
  const nonDairyRaw       = (nonDairyPct / 100) * NON_DAIRY_ENTERIC_KT * BOVAER_EFFICACY;
  const slurryRaw         = (slurryPct   / 100) * SLURRY_METHANE_KT    * 0.40;
  const fertRaw           = (fertPct     / 100) * SOIL_FERTILISER_KT;
  const peatlandRaw       = (peatlandHa  * PEATLAND_RATE) / 1000;
  const herdRaw           = (herdPct     / 100) * ENTERIC_KT;

  // Clamp reductions so they cannot exceed the physical emission pools
  const bovaerReduction   = Math.min(bovaerRaw, DAIRY_ENTERIC_KT);
  const nonDairyReduction = Math.min(nonDairyRaw, NON_DAIRY_ENTERIC_KT);
  const slurryReduction   = Math.min(slurryRaw, SLURRY_METHANE_KT);
  const fertReduction     = Math.min(fertRaw, SOIL_FERTILISER_KT);
  const peatlandReduction = peatlandRaw;
  const herdReduction     = Math.min(herdRaw, ENTERIC_KT);

  const geneticsReduction = geneticsOn ? 17 : 0;
  const adReduction       = adOn       ? 21 : 0;

  // AD draws from the same slurry pool as aeration — apply to residual pool (methodology §07)
  const slurryResidualPool = Math.max(0, SLURRY_METHANE_KT - slurryReduction);
  const effectiveAd = adOn ? Math.round(0.06 * 0.55 * slurryResidualPool) : 0;

  // Amount by which AD's nominal 21 kt overstates its real contribution (due to slurry aeration reducing the pool)
  const adOverstatement = adOn && slurryPct > 0 ? Math.max(0, adReduction - effectiveAd) : 0;

  const userReduction  = bovaerReduction + nonDairyReduction + slurryReduction
                       + fertReduction + peatlandReduction + herdReduction
                       + geneticsReduction + effectiveAd;

  const totalReduction   = COMMITTED_BASELINE_KT + userReduction;
  const remainingGap     = Math.max(0, AGRI_GAP - totalReduction);
  const gapClosedPct     = Math.min(100, Math.round((totalReduction / AGRI_GAP) * 100));
  const newProjected2030 = Math.round(AGRI_BASELINE_2030 - totalReduction);
  const targetMet        = newProjected2030 <= AGRI_TARGET_2030;
  const animalsRemoved   = Math.round((herdPct / 100) * TOTAL_CATTLE);
  const scenarioColour   = targetMet ? "#16a34a" : "#c1440e";

  const statusMessage =
    gapClosedPct >= 100
      ? `Gap closed. That requires ${animalsRemoved.toLocaleString()} fewer cattle. No current NI policy commits to that.`
      : gapClosedPct >= 40
      ? `Significant progress, but a gap remains. Closing it requires either near-maximum deployment of every remaining measure or herd reduction.`
      : `Current interventions fall well short. Even the full government programme leaves a substantial gap without structural change to the herd.`;

  // ── Chart data ────────────────────────────────────────────────────────────

  const committedProjected2030 = AGRI_BASELINE_2030 - COMMITTED_BASELINE_KT; // = 5394

  const chartData = BASE_DATA.map((point) => {
    if (point.year < 2023) {
      return {
        year:      point.year,
        actual:    point.actual,
        baseline:  null as number | null,
        committed: null as number | null,
        scenario:  null as number | null,
      };
    } else if (point.year === 2023) {
      return {
        year:      point.year,
        actual:    point.actual,
        baseline:  AGRI_2023,
        committed: AGRI_2023,
        scenario:  AGRI_2023,
      };
    } else {
      const t = (point.year - 2023) / 7;
      return {
        year:      point.year,
        actual:    null as number | null,
        baseline:  AGRI_BASELINE_2030,
        committed: Math.round(AGRI_2023 + t * (committedProjected2030 - AGRI_2023)),
        scenario:  Math.round(AGRI_2023 + t * (newProjected2030 - AGRI_2023)),
      };
    }
  });

  // ── Helpers ───────────────────────────────────────────────────────────────

  const pctOfGap = (kt: number) => Math.round((kt / AGRI_GAP) * 100);

  const sliderBg = (value: number, max: number) =>
    `linear-gradient(to right, #c1440e 0%, #c1440e ${(value / max) * 100}%, #e5e7eb ${(value / max) * 100}%, #e5e7eb 100%)`;

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
      <div className="bg-white p-2.5 border border-gray-200 rounded shadow text-xs">
        <p className="font-semibold text-gray-700 mb-0.5">{label}</p>
        <p className="text-gray-600">
          {item.dataKey === "actual" ? "Actual" : "Scenario"}:{" "}
          <span className="font-medium">{Math.round(item.value).toLocaleString()} kt</span>
        </p>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section id="scenario" className="bg-[#FFF9F5] border-t border-[#e8e0d8] px-8 lg:px-16 py-14 lg:py-20">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div className="mb-10 lg:mb-14 max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-[#666666] mb-4">
            What would it take
          </p>
          <p className="text-[20px] lg:text-[28px] font-bold text-[#1a1a1a] leading-tight mb-5">
            Adjust the interventions. Watch the gap.
          </p>
          <p className="text-[15px] leading-[1.9] text-gray-600">
            Several interventions could credibly reduce agricultural emissions
            before 2030. Bovaer requires near-universal uptake across dairy and
            beef herds. Slurry aeration requires capital grants that do not yet
            exist at scale. Protected urea requires changing entrenched
            fertiliser habits across thousands of farms. Peatland restoration
            requires taking land out of agricultural use. Genetics programmes
            take a generation of breeding to show results.
          </p>
        </div>

        {/* Two-column interactive area
            DOM order: output panel first (top on mobile), controls second.
            Desktop reverses via lg:order-1 / lg:order-2. */}
        <div className="flex flex-col lg:flex-row lg:gap-0 gap-8">

          {/* ── Output panel — top on mobile, right on desktop ──────── */}
          <div className="w-full lg:w-[55%] lg:pl-10 lg:order-2 flex flex-col gap-4">

            {/* Projected 2030 */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                Projected 2030 (kt CO₂e)
              </p>
              <p className={`text-4xl lg:text-3xl font-bold tabular-nums leading-none ${targetMet ? "text-green-600" : "text-[#c1440e]"}`}>
                {newProjected2030.toLocaleString()}
              </p>
              <p className="text-sm lg:text-xs text-gray-400 mt-0.5">
                Target: {AGRI_TARGET_2030.toLocaleString()} kt
              </p>
            </div>

            {/* Gap progress bar */}
            <div>
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Gap closed</span>
                <span>{gapClosedPct}% of {AGRI_GAP} kt</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${targetMet ? "bg-green-500" : "bg-[#c1440e]"}`}
                  style={{ width: `${gapClosedPct}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Committed: {COMMITTED_BASELINE_KT} kt · User: {Math.round(userReduction)} kt ·{" "}
                {totalReduction > AGRI_GAP
                  ? <span className="text-green-600">Surplus: {Math.round(totalReduction - AGRI_GAP)} kt</span>
                  : <>Remaining: {Math.round(remainingGap)} kt</>
                }
              </p>
            </div>

            {/* Status */}
            <p className="text-sm lg:text-xs text-gray-600 leading-snug">
              {statusMessage}
            </p>

            {/* Chart */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                Agricultural emissions trajectory
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart
                  data={chartData}
                  margin={{ top: 5, right: 60, left: 0, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="year"
                    type="number"
                    domain={[1990, 2030]}
                    tickCount={5}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#6b7280" }}
                  />
                  <YAxis
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#6b7280" }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(1)}Mt`}
                    domain={[3000, 7000]}
                    width={32}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    y={AGRI_TARGET_2030}
                    stroke="#16a34a"
                    strokeWidth={1}
                    strokeDasharray="6 3"
                    label={{ value: "CCC target", position: "right", fontSize: 9, fill: "#16a34a" }}
                  />
                  <ReferenceLine
                    y={AGRI_2023}
                    stroke="#d1d5db"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    label={{ value: "2023 actual", position: "right", fontSize: 9, fill: "#9ca3af" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="scenario"
                    baseValue={AGRI_TARGET_2030}
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
                    stroke="#d1d5db"
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    dot={false}
                    connectNulls
                    legendType="none"
                  />
                  <Line
                    type="monotone"
                    dataKey="committed"
                    stroke="#9ca3af"
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
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

          {/* ── Controls — bottom on mobile, left on desktop ─────────── */}
          <div className="w-full lg:w-[45%] lg:pr-10 lg:border-r border-[#e8e0d8] lg:order-1 flex flex-col gap-5">

            {/* Committed policy baseline */}
            <div className="rounded-lg bg-white border-l-2 border-gray-300 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                Committed policy baseline (already applied)
              </p>
              <p className="text-sm lg:text-xs text-gray-600 font-medium">
                Livestock productivity improvements (Draft CAP 2023–27): −242 kt
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Reduces gap from 1,125 kt to 883 kt before any additional action
              </p>
            </div>

            {/* Quick scenarios — mobile only */}
            <div className="lg:hidden rounded-lg bg-white border border-gray-200 p-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                Quick scenarios
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => applyPreset("techOnly")}
                  className="flex-1 rounded border border-gray-200 px-2 py-2 text-left transition-colors active:bg-gray-50"
                >
                  <p className="text-[11px] font-medium text-gray-700">Tech only</p>
                  <p className="text-[10px] text-gray-400">No herd reduction</p>
                </button>
                <button
                  onClick={() => applyPreset("mixed")}
                  className="flex-1 rounded border border-[#c1440e]/40 bg-[#c1440e]/5 px-2 py-2 text-left transition-colors active:bg-[#c1440e]/10"
                >
                  <p className="text-[11px] font-medium text-gray-700">Mixed</p>
                  <p className="text-[10px] text-gray-400">Closes the gap</p>
                </button>
                <button
                  onClick={() => applyPreset("reset")}
                  className="flex-1 rounded border border-gray-200 px-2 py-2 text-left transition-colors active:bg-gray-50"
                >
                  <p className="text-[11px] font-medium text-gray-700">Reset</p>
                  <p className="text-[10px] text-gray-400">Clear all</p>
                </button>
              </div>
            </div>

            {/* Additional interventions */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">
                Additional interventions
              </p>
              <div className="flex flex-col gap-5">

                {/* Feed additives — dairy (Bovaer) */}
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm lg:text-xs text-gray-500">
                      Feed additives — dairy (Bovaer)
                    </span>
                    <span className="text-2xl lg:text-xs font-mono font-bold lg:font-medium text-gray-700 tabular-nums">
                      {bovaerPct}%
                    </span>
                  </div>
                  <input
                    type="range" min="0" max="90" step="5"
                    value={bovaerPct}
                    onChange={(e) => setBovaerPct(Number(e.target.value))}
                    className="w-full h-3 lg:h-auto cursor-pointer"
                    style={{
                      WebkitAppearance: "none", appearance: "none",
                      background: sliderBg(bovaerPct, 90),
                      borderRadius: "9999px", outline: "none",
                    }}
                    aria-label="Bovaer adoption percentage"
                  />
                  <div className="flex justify-between text-[10px] text-gray-300 mt-0.5">
                    <span>0%</span>
                    <span>90%</span>
                  </div>
                  {bovaerPct === 90 && (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Maximum realistic deployment by 2030
                    </p>
                  )}
                  <p className="text-sm lg:text-[11px] text-gray-400 mt-1">
                    Saves <span className="font-medium text-gray-600">{Math.round(bovaerReduction)} kt</span>
                    {bovaerReduction > 0 && (
                      <span className="text-green-600"> ({pctOfGap(bovaerReduction)}% of gap)</span>
                    )}
                  </p>
                </div>

                {/* Feed additives — non-dairy cattle */}
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm lg:text-xs text-gray-500">
                      Feed additives — non-dairy cattle
                    </span>
                    <span className="text-2xl lg:text-xs font-mono font-bold lg:font-medium text-gray-700 tabular-nums">
                      {nonDairyPct}%
                    </span>
                  </div>
                  <input
                    type="range" min="0" max="90" step="5"
                    value={nonDairyPct}
                    onChange={(e) => setNonDairyPct(Number(e.target.value))}
                    className="w-full h-3 lg:h-auto cursor-pointer"
                    style={{
                      WebkitAppearance: "none", appearance: "none",
                      background: sliderBg(nonDairyPct, 90),
                      borderRadius: "9999px", outline: "none",
                    }}
                    aria-label="Non-dairy feed additive adoption percentage"
                  />
                  <div className="flex justify-between text-[10px] text-gray-300 mt-0.5">
                    <span>0%</span>
                    <span>90%</span>
                  </div>
                  {nonDairyPct === 90 && (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      CAP Central Scenario assumes 35% uptake
                    </p>
                  )}
                  <p className="text-sm lg:text-[11px] text-gray-400 mt-1">
                    Saves <span className="font-medium text-gray-600">{Math.round(nonDairyReduction)} kt</span>
                    {nonDairyReduction > 0 && (
                      <span className="text-green-600"> ({pctOfGap(nonDairyReduction)}% of gap)</span>
                    )}
                  </p>
                </div>

                {/* Slurry aeration */}
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm lg:text-xs text-gray-500">
                      Slurry aeration
                    </span>
                    <span className="text-2xl lg:text-xs font-mono font-bold lg:font-medium text-gray-700 tabular-nums">
                      {slurryPct}%
                    </span>
                  </div>
                  <input
                    type="range" min="0" max="80" step="5"
                    value={slurryPct}
                    onChange={(e) => setSlurryPct(Number(e.target.value))}
                    className="w-full h-3 lg:h-auto cursor-pointer"
                    style={{
                      WebkitAppearance: "none", appearance: "none",
                      background: sliderBg(slurryPct, 80),
                      borderRadius: "9999px", outline: "none",
                    }}
                    aria-label="Slurry aeration adoption percentage"
                  />
                  <div className="flex justify-between text-[10px] text-gray-300 mt-0.5">
                    <span>0%</span>
                    <span>80%</span>
                  </div>
                  {slurryPct >= 50 && (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Capital-intensive; 50% by 2027 is CAP target
                    </p>
                  )}
                  <p className="text-sm lg:text-[11px] text-gray-400 mt-1">
                    Saves <span className="font-medium text-gray-600">{Math.round(slurryReduction)} kt</span>
                    {slurryReduction > 0 && (
                      <span className="text-green-600"> ({pctOfGap(slurryReduction)}% of gap)</span>
                    )}
                  </p>
                </div>

                {/* Fertiliser switch — protected urea */}
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm lg:text-xs text-gray-500">
                      Switch to protected urea fertiliser
                    </span>
                    <span className="text-2xl lg:text-xs font-mono font-bold lg:font-medium text-gray-700 tabular-nums">
                      {fertPct}%
                    </span>
                  </div>
                  <input
                    type="range" min="0" max="100" step="5"
                    value={fertPct}
                    onChange={(e) => setFertPct(Number(e.target.value))}
                    className="w-full h-3 lg:h-auto cursor-pointer"
                    style={{
                      WebkitAppearance: "none", appearance: "none",
                      background: sliderBg(fertPct, 100),
                      borderRadius: "9999px", outline: "none",
                    }}
                    aria-label="Protected urea fertiliser adoption percentage"
                  />
                  <div className="flex justify-between text-[10px] text-gray-300 mt-0.5">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                  {fertPct >= 75 && (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      CAP target by 2027
                    </p>
                  )}
                  <p className="text-sm lg:text-[11px] text-gray-400 mt-1">
                    Saves <span className="font-medium text-gray-600">{Math.round(fertReduction)} kt</span>
                    {fertReduction > 0 && (
                      <span className="text-green-600"> ({pctOfGap(fertReduction)}% of gap)</span>
                    )}
                  </p>
                </div>

                {/* Peatland restoration */}
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm lg:text-xs text-gray-500">Peatland restoration</span>
                    <span className="text-2xl lg:text-xs font-mono font-bold lg:font-medium text-gray-700 tabular-nums">
                      {peatlandHa.toLocaleString()} ha
                    </span>
                  </div>
                  <input
                    type="range" min="0" max="10000" step="500"
                    value={peatlandHa}
                    onChange={(e) => setPeatlandHa(Number(e.target.value))}
                    className="w-full h-3 lg:h-auto cursor-pointer"
                    style={{
                      WebkitAppearance: "none", appearance: "none",
                      background: sliderBg(peatlandHa, 10000),
                      borderRadius: "9999px", outline: "none",
                    }}
                    aria-label="Peatland restoration hectares"
                  />
                  <div className="flex justify-between text-[10px] text-gray-300 mt-0.5">
                    <span>0</span>
                    <span>10,000 ha</span>
                  </div>
                  {peatlandHa === 10000 && (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Ambitious under NI Peatland Strategy
                    </p>
                  )}
                  <p className="text-sm lg:text-[11px] text-gray-400 mt-1">
                    Saves <span className="font-medium text-gray-600">{Math.round(peatlandReduction)} kt</span>
                    {peatlandReduction > 0 && (
                      <span className="text-green-600"> ({pctOfGap(peatlandReduction)}% of gap)</span>
                    )}
                  </p>
                </div>

                {/* Cattle herd reduction */}
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm lg:text-xs text-gray-500">Cattle herd reduction</span>
                    <span className="text-2xl lg:text-xs font-mono font-bold lg:font-medium text-gray-700 tabular-nums">
                      {herdPct}%
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range" min="0" max="50" step="1"
                      value={herdPct}
                      onChange={(e) => setHerdPct(Number(e.target.value))}
                      className="w-full h-3 lg:h-auto cursor-pointer"
                      style={{
                        WebkitAppearance: "none", appearance: "none",
                        background: sliderBg(herdPct, 50),
                        borderRadius: "9999px", outline: "none",
                      }}
                      aria-label="Cattle herd reduction percentage"
                    />
                    <div
                      className="absolute top-0 pointer-events-none flex flex-col items-center"
                      style={{ left: `${(GAP_CLOSING_HERD_PCT / 50) * 100}%` }}
                    >
                      <div className="w-px h-2.5 mt-2 bg-gray-300" />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-300 mt-0.5 relative">
                    <span>0%</span>
                    <span
                      className="absolute text-gray-400"
                      style={{
                        left: `${(GAP_CLOSING_HERD_PCT / 50) * 100}%`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      closes gap
                    </span>
                    <span>50%</span>
                  </div>
                  <p className="text-sm lg:text-[11px] text-gray-400 mt-1">
                    Saves <span className="font-medium text-gray-600">{Math.round(herdReduction)} kt</span>
                    {herdReduction > 0 && (
                      <span className="text-green-600"> ({pctOfGap(herdReduction)}% of gap)</span>
                    )}
                  </p>
                  {herdPct >= GAP_CLOSING_HERD_PCT && (
                    <p className="text-sm lg:text-[11px] text-[#c1440e] mt-1 font-medium">
                      {herdPct}% = {animalsRemoved.toLocaleString()} fewer cattle
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* Minor interventions (toggles) */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                Minor interventions
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setGeneticsOn((v) => !v)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-left transition-colors ${
                    geneticsOn
                      ? "border-[#c1440e] bg-white text-gray-700"
                      : "border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  <span className="text-[11px] font-medium block leading-tight">
                    {geneticsOn && <span className="mr-1">✓</span>}Ruminant genetics
                  </span>
                  <span className="text-[10px] tabular-nums">
                    {geneticsOn ? "+17 kt" : "17 kt potential"}
                  </span>
                </button>
                <button
                  onClick={() => setAdOn((v) => !v)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-left transition-colors ${
                    adOn
                      ? "border-[#c1440e] bg-white text-gray-700"
                      : "border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  <span className="text-[11px] font-medium block leading-tight">
                    {adOn && <span className="mr-1">✓</span>}Anaerobic digestion
                  </span>
                  <span className="text-[10px] tabular-nums">
                    {adOn ? `+${effectiveAd} kt` : "21 kt potential"}
                  </span>
                </button>
              </div>
              {adOverstatement > 0 && (
                <p className="text-[10px] text-amber-600 mt-2">
                  Note: AD and slurry aeration draw from the same pool. At current adoption, combined reduction may overstate by ~{adOverstatement} kt.
                </p>
              )}
            </div>

            {/* Methodology */}
            <details className="border border-gray-200 rounded-lg bg-white">
              <summary className="px-3 py-2 cursor-pointer select-none text-sm lg:text-[11px] text-gray-600 hover:text-gray-800 font-medium">
                Methodology
              </summary>
              <div className="px-3 pb-3 pt-2 text-sm lg:text-[11px] text-gray-500 leading-relaxed space-y-4 border-t border-gray-100">
                <div>
                  <p className="font-semibold text-gray-600 mb-1">Data source</p>
                  <p>All emissions figures come from the National Atmospheric Emissions Inventory (NAEI), published annually by the UK government. The NAEI is the legally-defined measurement basis for Northern Ireland&apos;s carbon budgets under the Climate Change (Northern Ireland) Act 2022. Historical figures cover 1990–2023.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1">Projections</p>
                  <p>No official projection of Northern Ireland&apos;s total emissions to 2030 exists — the draft Climate Action Plan covers only to 2027. To estimate the 2030 gap, this tool applies a linear trend to NAEI figures from 2018–2023. This is an indicative central estimate, not a forecast. The actual gap could be larger or smaller depending on policy delivery and economic conditions.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1">The agriculture gap</p>
                  <p>The scenario modeller focuses specifically on agricultural emissions, which is where the gap between Northern Ireland&apos;s current trajectory and its 2030 target is most acute.</p>
                  <p className="mt-2">The modeller measures progress against the Climate Change Committee&apos;s recommended pathway for Northern Ireland&apos;s agriculture sector, which implies a target of around 4,490 kt CO₂e by 2030. This is an advisory recommendation from the UK&apos;s independent climate advisers — it is not a statutory sectoral limit. It represents what the CCC calculates is needed from agriculture for Northern Ireland to meet its legally binding overall 2030 target.</p>
                  <p className="mt-2">The gap between Northern Ireland&apos;s current agricultural emissions (5,615 kt in 2023) and this recommended level is 1,125,000 tonnes. This is different from the total emissions gap of 1.73 million tonnes shown in the narrative, because the modeller isolates agriculture specifically, and uses a flat baseline rather than a projected one. Both figures are explained in the full methodology.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1">Measuring methane</p>
                  <p>Agricultural emissions are dominated by methane and nitrous oxide. This tool uses AR5 Global Warming Potential values throughout — the current international standard. DAERA&apos;s draft Climate Action Plan uses an older standard (AR4), which produces slightly different absolute figures. Where DAERA projections appear in the charts, they have been adjusted to the same measurement basis as the NAEI data.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1">Intervention estimates</p>
                  <p>The scenario modeller draws on published trial data and official sources for each intervention:</p>
                  <ul className="mt-2 space-y-1.5 list-disc pl-4">
                    <li><strong className="text-gray-600">Feed additives (Bovaer):</strong> 12% reduction in enteric methane per animal at the specified adoption rate. This reflects pasture-system trial results, which are lower than reductions reported in housed systems, because consistent supplement delivery is harder to achieve in grazing herds.</li>
                    <li><strong className="text-gray-600">Slurry aeration:</strong> 40% methane reduction per treated unit, consistent with AFBI/Teagasc field trial data and the figure used in DAERA&apos;s own draft Climate Action Plan.</li>
                    <li><strong className="text-gray-600">Protected urea:</strong> Up to 59 kt CO₂e reduction at full adoption, derived by scaling the Draft CAP&apos;s 44 kt saving at 75% adoption linearly to 100%.</li>
                    <li><strong className="text-gray-600">Peatland restoration:</strong> 11 tonnes CO₂e avoided per hectare per year, from UK Centre for Ecology and Hydrology NI-specific analysis for the Draft CAP. This affects land use emissions, not agriculture directly.</li>
                    <li><strong className="text-gray-600">Herd reduction:</strong> Applied linearly to enteric fermentation emissions. A 1% reduction in cattle numbers avoids approximately 32 kt CO₂e per year.</li>
                    <li><strong className="text-gray-600">Ruminant genetics and anaerobic digestion</strong> are modelled as fixed toggles based on CCC pathway estimates and draft CAP projections respectively.</li>
                  </ul>
                  <p className="mt-2">All intervention estimates carry uncertainty. The modeller is designed to illustrate the scale and combination of changes required, not to produce precise forecasts.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1">Committed baseline</p>
                  <p>The modeller pre-applies 242 kt of reductions already committed in the draft Climate Action Plan — primarily livestock productivity improvements. The gap you are adjusting with the sliders is the remaining 883 kt not yet accounted for by current policy.</p>
                </div>
                <p>
                  For detailed sourcing, assumptions, and technical notes on each figure, see the{" "}
                  <a href="/methodology" className="underline hover:text-gray-700">full methodology</a>.
                </p>
              </div>
            </details>

          </div>

        </div>

        {/* Concluding text — THE ARITHMETIC */}
        <div className="mt-14 pt-10 border-t border-[#e8e0d8] max-w-2xl">
          <p className="text-[11px] uppercase tracking-widest text-[#666666] mb-4">
            The Arithmetic
          </p>
          <p className="text-[15px] leading-[1.9] text-gray-600 mb-3">
            Technology-only deployment, even at maximum adoption across every available measure, falls short of closing the gap. Some reduction in cattle numbers is required regardless. The modeller above shows the scale of what that means.
          </p>
          <p className="text-[15px] leading-[1.9] text-gray-600 mb-3">
            Technology-only scenarios depend on near-universal adoption across thousands of farms by 2030. Bovaer requires twice-daily concentrate delivery at 90% uptake. Slurry aeration requires capital grants that do not yet exist at scale. Protected urea requires changing fertiliser habits across an entire industry. The question is not whether the arithmetic works. It is whether the conditions for that arithmetic exist.
          </p>
          <p className="text-[15px] leading-[1.9] text-gray-600">
            Since 1990, Northern Ireland's emissions fell by nearly a third, but agriculture's share grew. The legal target for 2030 cannot be met unless that changes. The draft Climate Action Plan does not say how it will.
          </p>
        </div>
      </div>
    </section>
  );
}
