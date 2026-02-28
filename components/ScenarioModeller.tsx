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

// ── Module-level constants ────────────────────────────────────────────────────

const AGRI_2023            = 5615;    // kt CO₂e — DAERA/NISRA GHG inventory 2023
const AGRI_TARGET_2030     = 4740;    // kt CO₂e — CCC Stretch Ambition (-21% from 2020 baseline)
const AGRI_BASELINE_2030   = 5615;    // kt CO₂e — flat projection (agriculture broadly flat 2020-2023)
const AGRI_GAP             = 875;     // kt CO₂e — AGRI_BASELINE_2030 - AGRI_TARGET_2030

const ENTERIC_KT           = 3200;    // kt CO₂e — total enteric fermentation 2023
const DAIRY_ENTERIC_KT     = 1760;    // kt CO₂e — dairy enteric portion
const NON_DAIRY_ENTERIC_KT = 1440;    // kt CO₂e — non-dairy (3200 - 1760)
const SLURRY_METHANE_KT    = 630;     // kt CO₂e — liquid slurry methane
const SOIL_FERTILISER_KT   = 80;      // kt CO₂e — ceiling for fertiliser switch savings
const BOVAER_EFFICACY      = 0.12;    // 12% — Teagasc pasture trials
const PEATLAND_RATE        = 5;       // t CO₂e/ha/yr — UK Peatland Code
const TOTAL_CATTLE         = 1673345; // DAERA census 2023

// Committed policy baseline — Draft NI CAP 2023-2027, p.158-165
// Livestock productivity improvements projected to remove ~116,000 cattle-equivalent
// by 2027 while maintaining output. Enteric reduction: 6.9% × 3,200 = ~221 kt
const COMMITTED_BASELINE_KT = 221;

// Adjusted gap after committed policies (654 kt)
const ADJUSTED_GAP = AGRI_GAP - COMMITTED_BASELINE_KT;

// Herd reduction % that closes the adjusted gap alone (21%)
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
  // UI state
  const [isDark,      setIsDark]      = useState(false);

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

  // ── Derived calculations ──────────────────────────────────────────────────

  const bovaerReduction   = (bovaerPct   / 100) * DAIRY_ENTERIC_KT     * BOVAER_EFFICACY;
  const nonDairyReduction = (nonDairyPct / 100) * NON_DAIRY_ENTERIC_KT * 0.12;
  const slurryReduction   = (slurryPct   / 100) * SLURRY_METHANE_KT    * 0.40;
  const fertReduction     = (fertPct     / 100) * SOIL_FERTILISER_KT;
  const peatlandReduction = (peatlandHa  * PEATLAND_RATE) / 1000;
  const herdReduction     = (herdPct     / 100) * ENTERIC_KT;

  const geneticsReduction = geneticsOn ? 34 : 0;
  const adReduction       = adOn       ? 21 : 0;

  const userReduction  = bovaerReduction + nonDairyReduction + slurryReduction
                       + fertReduction + peatlandReduction + herdReduction
                       + geneticsReduction + adReduction;

  const totalReduction   = COMMITTED_BASELINE_KT + userReduction;
  const remainingGap     = Math.max(0, AGRI_GAP - totalReduction);
  const gapClosedPct     = Math.min(100, Math.round((totalReduction / AGRI_GAP) * 100));
  const newProjected2030 = Math.round(AGRI_BASELINE_2030 - totalReduction);
  const targetMet        = newProjected2030 <= AGRI_TARGET_2030;
  const animalsRemoved   = Math.round((herdPct / 100) * TOTAL_CATTLE);
  const scenarioColour   = targetMet ? "#16a34a" : "#c1440e";

  const statusMessage =
    gapClosedPct >= 100
      ? `Gap closed. Requires ${animalsRemoved.toLocaleString()} fewer cattle. No current policy says so.`
      : gapClosedPct >= 40
      ? `Significant progress, but a gap remains. Herd reduction is the only lever that closes it.`
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
      <div className="bg-white dark:bg-gray-800 p-2.5 border border-gray-200 dark:border-gray-600 rounded shadow text-xs">
        <p className="font-semibold text-gray-700 dark:text-gray-200 mb-0.5">{label}</p>
        <p className="text-gray-600 dark:text-gray-300">
          {item.dataKey === "actual" ? "Actual" : "Scenario"}:{" "}
          <span className="font-medium">{Math.round(item.value).toLocaleString()} kt</span>
        </p>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full">

      {/* Section header */}
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">
          What would it take
        </p>
        <p className="text-base lg:text-sm font-semibold text-gray-800 dark:text-gray-100 leading-snug">
          Adjust the interventions. Watch the gap.
        </p>
        <p className="text-sm lg:text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          Agriculture is the only sector that has gone in the wrong direction entirely — up 8% since 1990.
        </p>
      </div>

      {/* Two-column body */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-0">

        {/* ── Left: controls ─────────────────────────────────────── */}
        <div className="w-full lg:w-[45%] lg:pr-5 lg:border-r border-gray-100 dark:border-gray-800 flex flex-col gap-5">

          {/* ── Group 1: Committed policy baseline ─────────────────── */}
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900 border-l-2 border-gray-300 dark:border-gray-600 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
              Committed policy baseline (already applied)
            </p>
            <p className="text-sm lg:text-xs text-gray-600 dark:text-gray-300 font-medium">
              Livestock productivity improvements (Draft CAP 2023–27): −221 kt
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              Reduces gap from 875 kt to 654 kt before any additional action
            </p>
          </div>

          {/* ── Group 2: Additional interventions ──────────────────── */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">
              Additional interventions
            </p>
            <div className="flex flex-col gap-5">

              {/* Slider: Feed additives — dairy (Bovaer) */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm lg:text-xs text-gray-500 dark:text-gray-400">
                    Feed additives — dairy (Bovaer)
                  </span>
                  <span className="text-2xl lg:text-xs font-mono font-bold lg:font-medium text-gray-700 dark:text-gray-200 tabular-nums">
                    {bovaerPct}%
                  </span>
                </div>
                <input
                  type="range" min="0" max="90" step="5"
                  value={bovaerPct}
                  onChange={(e) => setBovaerPct(Number(e.target.value))}
                  className="w-full h-3 lg:h-auto cursor-pointer"
                  style={{
                    WebkitAppearance: 'none', appearance: 'none',
                    background: sliderBg(bovaerPct, 90),
                    borderRadius: '9999px', outline: 'none',
                  }}
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
                <p className="text-sm lg:text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                  Saves <span className="font-medium text-gray-600 dark:text-gray-300">{Math.round(bovaerReduction)} kt</span>
                  {bovaerReduction > 0 && (
                    <span className="text-green-600 dark:text-green-500"> ({pctOfGap(bovaerReduction)}% of gap)</span>
                  )}
                </p>
              </div>

              {/* Slider: Feed additives — non-dairy */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm lg:text-xs text-gray-500 dark:text-gray-400">
                    Feed additives — non-dairy cattle
                  </span>
                  <span className="text-2xl lg:text-xs font-mono font-bold lg:font-medium text-gray-700 dark:text-gray-200 tabular-nums">
                    {nonDairyPct}%
                  </span>
                </div>
                <input
                  type="range" min="0" max="90" step="5"
                  value={nonDairyPct}
                  onChange={(e) => setNonDairyPct(Number(e.target.value))}
                  className="w-full h-3 lg:h-auto cursor-pointer"
                  style={{
                    WebkitAppearance: 'none', appearance: 'none',
                    background: sliderBg(nonDairyPct, 90),
                    borderRadius: '9999px', outline: 'none',
                  }}
                  aria-label="Non-dairy feed additive adoption percentage"
                />
                <div className="flex justify-between text-[10px] text-gray-300 dark:text-gray-600 mt-0.5">
                  <span>0%</span>
                  <span>90%</span>
                </div>
                {nonDairyPct === 90 && (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                    CAP Central Scenario assumes 35% uptake
                  </p>
                )}
                <p className="text-sm lg:text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                  Saves <span className="font-medium text-gray-600 dark:text-gray-300">{Math.round(nonDairyReduction)} kt</span>
                  {nonDairyReduction > 0 && (
                    <span className="text-green-600 dark:text-green-500"> ({pctOfGap(nonDairyReduction)}% of gap)</span>
                  )}
                </p>
              </div>

              {/* Slider: Slurry aeration */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm lg:text-xs text-gray-500 dark:text-gray-400">
                    Slurry aeration
                  </span>
                  <span className="text-2xl lg:text-xs font-mono font-bold lg:font-medium text-gray-700 dark:text-gray-200 tabular-nums">
                    {slurryPct}%
                  </span>
                </div>
                <input
                  type="range" min="0" max="80" step="5"
                  value={slurryPct}
                  onChange={(e) => setSlurryPct(Number(e.target.value))}
                  className="w-full h-3 lg:h-auto cursor-pointer"
                  style={{
                    WebkitAppearance: 'none', appearance: 'none',
                    background: sliderBg(slurryPct, 80),
                    borderRadius: '9999px', outline: 'none',
                  }}
                  aria-label="Slurry aeration adoption percentage"
                />
                <div className="flex justify-between text-[10px] text-gray-300 dark:text-gray-600 mt-0.5">
                  <span>0%</span>
                  <span>80%</span>
                </div>
                {slurryPct >= 50 && (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                    Capital-intensive; 50% by 2027 is CAP target
                  </p>
                )}
                <p className="text-sm lg:text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                  Saves <span className="font-medium text-gray-600 dark:text-gray-300">{Math.round(slurryReduction)} kt</span>
                  {slurryReduction > 0 && (
                    <span className="text-green-600 dark:text-green-500"> ({pctOfGap(slurryReduction)}% of gap)</span>
                  )}
                </p>
              </div>

              {/* Slider: Fertiliser switch — protected urea */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm lg:text-xs text-gray-500 dark:text-gray-400">
                    Switch to protected urea fertiliser
                  </span>
                  <span className="text-2xl lg:text-xs font-mono font-bold lg:font-medium text-gray-700 dark:text-gray-200 tabular-nums">
                    {fertPct}%
                  </span>
                </div>
                <input
                  type="range" min="0" max="100" step="5"
                  value={fertPct}
                  onChange={(e) => setFertPct(Number(e.target.value))}
                  className="w-full h-3 lg:h-auto cursor-pointer"
                  style={{
                    WebkitAppearance: 'none', appearance: 'none',
                    background: sliderBg(fertPct, 100),
                    borderRadius: '9999px', outline: 'none',
                  }}
                  aria-label="Protected urea fertiliser adoption percentage"
                />
                <div className="flex justify-between text-[10px] text-gray-300 dark:text-gray-600 mt-0.5">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                {fertPct >= 75 && (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                    CAP target by 2027
                  </p>
                )}
                <p className="text-sm lg:text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                  Saves <span className="font-medium text-gray-600 dark:text-gray-300">{Math.round(fertReduction)} kt</span>
                  {fertReduction > 0 && (
                    <span className="text-green-600 dark:text-green-500"> ({pctOfGap(fertReduction)}% of gap)</span>
                  )}
                </p>
              </div>

              {/* Slider: Peatland restoration */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm lg:text-xs text-gray-500 dark:text-gray-400">Peatland restoration</span>
                  <span className="text-2xl lg:text-xs font-mono font-bold lg:font-medium text-gray-700 dark:text-gray-200 tabular-nums">
                    {peatlandHa.toLocaleString()} ha
                  </span>
                </div>
                <input
                  type="range" min="0" max="10000" step="500"
                  value={peatlandHa}
                  onChange={(e) => setPeatlandHa(Number(e.target.value))}
                  className="w-full h-3 lg:h-auto cursor-pointer"
                  style={{
                    WebkitAppearance: 'none', appearance: 'none',
                    background: sliderBg(peatlandHa, 10000),
                    borderRadius: '9999px', outline: 'none',
                  }}
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
                <p className="text-sm lg:text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                  Saves <span className="font-medium text-gray-600 dark:text-gray-300">{Math.round(peatlandReduction)} kt</span>
                  {peatlandReduction > 0 && (
                    <span className="text-green-600 dark:text-green-500"> ({pctOfGap(peatlandReduction)}% of gap)</span>
                  )}
                </p>
              </div>

              {/* Slider: Cattle herd reduction */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm lg:text-xs text-gray-500 dark:text-gray-400">Cattle herd reduction</span>
                  <span className="text-2xl lg:text-xs font-mono font-bold lg:font-medium text-gray-700 dark:text-gray-200 tabular-nums">
                    {herdPct}%
                  </span>
                </div>
                {/* Track wrapper with gap-closing tick mark */}
                <div className="relative">
                  <input
                    type="range" min="0" max="50" step="1"
                    value={herdPct}
                    onChange={(e) => setHerdPct(Number(e.target.value))}
                    className="w-full h-3 lg:h-auto cursor-pointer"
                    style={{
                      WebkitAppearance: 'none', appearance: 'none',
                      background: sliderBg(herdPct, 50),
                      borderRadius: '9999px', outline: 'none',
                    }}
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
                <p className="text-sm lg:text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                  Saves <span className="font-medium text-gray-600 dark:text-gray-300">{Math.round(herdReduction)} kt</span>
                  {herdReduction > 0 && (
                    <span className="text-green-600 dark:text-green-500"> ({pctOfGap(herdReduction)}% of gap)</span>
                  )}
                </p>
                {herdPct >= 21 && (
                  <p className="text-sm lg:text-[11px] text-[#c1440e] dark:text-red-400 mt-1 font-medium">
                    {herdPct}% = {animalsRemoved.toLocaleString()} fewer cattle
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* ── Group 3: Minor interventions (toggles) ─────────────── */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
              Minor interventions
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setGeneticsOn((v) => !v)}
                className={`flex-1 rounded-lg border px-3 py-2 text-left transition-colors ${
                  geneticsOn
                    ? "border-[#c1440e] text-gray-700 dark:text-gray-200"
                    : "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500"
                }`}
              >
                <span className="text-[11px] font-medium block leading-tight">
                  {geneticsOn && <span className="mr-1">✓</span>}Ruminant genetics
                </span>
                <span className="text-[10px] tabular-nums">
                  {geneticsOn ? "+34 kt" : "34 kt potential"}
                </span>
              </button>
              <button
                onClick={() => setAdOn((v) => !v)}
                className={`flex-1 rounded-lg border px-3 py-2 text-left transition-colors ${
                  adOn
                    ? "border-[#c1440e] text-gray-700 dark:text-gray-200"
                    : "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500"
                }`}
              >
                <span className="text-[11px] font-medium block leading-tight">
                  {adOn && <span className="mr-1">✓</span>}Anaerobic digestion
                </span>
                <span className="text-[10px] tabular-nums">
                  {adOn ? "+21 kt" : "21 kt potential"}
                </span>
              </button>
            </div>
          </div>

          {/* ── Methodology toggle ──────────────────────────────────── */}
          <details className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary className="px-3 py-2 cursor-pointer select-none text-sm lg:text-[11px] text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 font-medium">
              Methodology
            </summary>
            <div className="px-3 pb-3 pt-2 text-sm lg:text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed space-y-2 border-t border-gray-100 dark:border-gray-800">
              <p>
                <strong className="text-gray-600 dark:text-gray-300">Committed baseline:</strong>{" "}
                Livestock productivity improvements per Draft NI Climate Action Plan 2023–2027
                (DAERA). Projected to remove equivalent of ~116,000 cattle by 2027 while
                maintaining output, reducing enteric emissions by ~221 kt.
                Source: Draft CAP p.158–165 and Table 20.
              </p>
              <p>
                <strong className="text-gray-600 dark:text-gray-300">Bovaer (dairy):</strong>{" "}
                12% enteric reduction via twice-daily concentrate delivery (Teagasc pasture
                trials). Applied to dairy herd only (~1,760 kt). More conservative than CAP
                Central Scenario assumption of 20%.
              </p>
              <p>
                <strong className="text-gray-600 dark:text-gray-300">Feed additives — non-dairy:</strong>{" "}
                12% enteric reduction applied (pasture-system efficacy, consistent with Teagasc
                trials). CAP Central Scenario uses 20% based on concentrate-feeding trials; this
                is not considered applicable to NI's predominantly grass-fed beef cattle.
                Applied to non-dairy enteric (~1,440 kt). Dairy Demonstrator Project launched
                Nov 2023.
              </p>
              <p>
                <strong className="text-gray-600 dark:text-gray-300">Slurry aeration:</strong>{" "}
                40% methane reduction per aerated slurry unit (AFBI/Teagasc/University of
                Galway trials). Applied to liquid slurry methane (~630 kt). Note: aeration may
                increase ammonia emissions ~20% — trade-off not reflected here.
                Source: Draft CAP p.161.
              </p>
              <p>
                <strong className="text-gray-600 dark:text-gray-300">Fertiliser switch:</strong>{" "}
                Switch from calcium ammonium nitrate (CAN) to urease-inhibitor treated urea.
                Ceiling ~80 kt CO₂e (conservative; full quantification in CAP Annex A). CAP
                targets 18% → 75% uptake by 2027. Source: Draft CAP p.158 and Table 20.
              </p>
              <p>
                <strong className="text-gray-600 dark:text-gray-300">Peatland:</strong>{" "}
                5 t CO₂e/ha/yr avoided (UK Peatland Code). LULUCF sector — requires land
                taken out of production.
              </p>
              <p>
                <strong className="text-gray-600 dark:text-gray-300">Herd:</strong>{" "}
                Linear relationship with enteric fermentation (~3,200 kt). NI cattle census
                2023: 1,673,345 (DAERA). After committed policy baseline, closing the remaining
                gap requires ~21% herd reduction (~351,000 cattle). CCC Stretch Ambition assumes
                12% (~200,000 cattle), closing ~44% of the adjusted gap.
              </p>
              <p>
                <strong className="text-gray-600 dark:text-gray-300">Ruminant genetics:</strong>{" "}
                0.15% methane reduction/yr × 7 years × 50% uptake ≈ 34 kt by 2030. Bovine
                Genetics Project commenced 2024 (£55.6m capital, £66m industry).
                Source: Draft CAP p.160; Teagasc/Wageningen breeding research.
              </p>
              <p>
                <strong className="text-gray-600 dark:text-gray-300">Anaerobic digestion:</strong>{" "}
                Additional 6% of managed slurry processed through AD × ~55% methane capture ×
                630 kt slurry methane ≈ 21 kt. Energy substitution benefit counted in energy
                sector, not here. Source: Draft CAP p.162 and Table 20.
              </p>
              <p>
                <strong className="text-gray-600 dark:text-gray-300">CCC agriculture target:</strong>{" "}
                Climate Change Committee, 'Path to Net Zero Northern Ireland' (2023). −21% from
                2020 baseline (6,000 kt) = 4,740 kt by 2030.
              </p>
              <p>
                <strong className="text-gray-600 dark:text-gray-300">Sources:</strong>{" "}
                DAERA census 2023 · Draft NI CAP 2023–2027 · Teagasc/DSM trials ·
                NISRA GHG inventory 1990–2023 · CCC NI Net Zero 2023.
              </p>
            </div>
          </details>

        </div>

        {/* ── Right: output panel ─────────────────────────────────── */}
        <div className="w-full lg:w-[55%] lg:pl-5 flex flex-col gap-4">

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
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${targetMet ? "bg-green-500" : "bg-[#c1440e]"}`}
                style={{ width: `${gapClosedPct}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              Committed: {COMMITTED_BASELINE_KT} kt · User: {Math.round(userReduction)} kt · Remaining: {Math.round(remainingGap)} kt
            </p>
          </div>

          {/* Status */}
          <p className="text-sm lg:text-xs text-gray-600 dark:text-gray-400 leading-snug">
            {statusMessage}
          </p>

          {/* Amber caution — gap closed without herd reduction */}
          {gapClosedPct >= 100 && herdPct === 0 && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-3 py-2">
              <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-snug">
                ⚠ Gap closed without herd reduction — requires every other intervention at near-maximum. No current NI policy achieves this combination.
              </p>
            </div>
          )}

          {/* Chart */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
              Agricultural emissions trajectory
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart
                data={chartData}
                margin={{ top: 5, right: 60, left: 0, bottom: 0 }}
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
                tickFormatter={(v) => `${(v / 1000).toFixed(1)}Mt`}
                domain={[3000, 7000]}
                width={32}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Target reference line */}
              <ReferenceLine
                y={AGRI_TARGET_2030}
                stroke="#16a34a"
                strokeWidth={1}
                strokeDasharray="6 3"
                label={{ value: "CCC target", position: "right", fontSize: 9, fill: "#16a34a" }}
              />
              {/* 2023 actual reference line */}
              <ReferenceLine
                y={AGRI_2023}
                stroke={isDark ? "#374151" : "#d1d5db"}
                strokeWidth={1}
                strokeDasharray="2 2"
                label={{ value: "2023 actual", position: "right", fontSize: 9, fill: isDark ? "#6b7280" : "#9ca3af" }}
              />
              {/* Gap fill area */}
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
              {/* Historical actuals */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#1e3a5f"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
              {/* No-action baseline (flat) */}
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
              {/* Committed policy trajectory */}
              <Line
                type="monotone"
                dataKey="committed"
                stroke={isDark ? "#6b7280" : "#9ca3af"}
                strokeWidth={1.5}
                strokeDasharray="4 2"
                dot={false}
                connectNulls
                legendType="none"
              />
              {/* User scenario trajectory */}
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
    </div>
  );
}
