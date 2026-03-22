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
  ReferenceDot,
} from "recharts";
import { ZoomIn, ZoomOut, Share2 } from "lucide-react";
import projectionsData from "@/public/data/ni_projections.json";
import { SliderHelpTooltip } from "@/components/ui/SliderHelpTooltip";
import {
  NAEI_AGRI_2023,
  AGRI_TARGET_2030,
  AGRI_GAP,
  ENTERIC_KT,
  DAIRY_ENTERIC_KT,
  NON_DAIRY_ENTERIC_KT,
  SLURRY_METHANE_KT,
  SOIL_FERTILISER_KT,
  BOVAER_EFFICACY,
  PEATLAND_RATE,
  TOTAL_CATTLE,
  GENETICS_REDUCTION_KT,
  AD_POTENTIAL_KT,
  COMMITTED_BASELINE_KT,
  SCENARIO_SECTION_ID,
} from "@/lib/constants";
const ADJUSTED_GAP          = AGRI_GAP - COMMITTED_BASELINE_KT;
const GAP_CLOSING_HERD_PCT  = Math.ceil((ADJUSTED_GAP / ENTERIC_KT) * 100);

const MAX_ENTERIC_KT      = Math.round(
  0.9 * DAIRY_ENTERIC_KT * BOVAER_EFFICACY +
  0.9 * NON_DAIRY_ENTERIC_KT * BOVAER_EFFICACY +
  0.5 * ENTERIC_KT +
  GENETICS_REDUCTION_KT
);
const MAX_SLURRY_SOILS_KT = Math.round(0.8 * SLURRY_METHANE_KT * 0.40 + SOIL_FERTILISER_KT);
const MAX_LAND_USE_KT     = Math.round(10000 * PEATLAND_RATE / 1000);


const BASE_DATA = projectionsData.chart3_agriculture as Array<{
  year: number;
  actual: number | null;
  projected: number | null;
}>;

function RightEdgeReferenceLabel({
  viewBox,
  value,
  fill,
  dy = 0,
}: {
  viewBox?: { x?: number; y?: number };
  value: string;
  fill: string;
  dy?: number;
}) {
  if (typeof viewBox?.x !== "number" || typeof viewBox?.y !== "number") {
    return null;
  }

  return (
    <text
      x={viewBox.x + 10}
      y={viewBox.y + dy}
      fill={fill}
      fontSize={9}
      textAnchor="start"
      dominantBaseline="middle"
    >
      {value}
    </text>
  );
}

function pctOfGap(kt: number) {
  return Math.round((kt / AGRI_GAP) * 100);
}

function sliderBg(value: number, max: number) {
  const valuePct = (value / max) * 100;
  return `linear-gradient(to right, #c1440e 0%, #c1440e ${valuePct}%, #e8e0d8 ${valuePct}%, #e8e0d8 100%)`;
}

function sliderBgMuted(value: number, max: number) {
  const valuePct = (value / max) * 100;
  return `linear-gradient(to right, #8a7060 0%, #8a7060 ${valuePct}%, #e8e0d8 ${valuePct}%, #e8e0d8 100%)`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const year = Number(label);
  const key = year < 2024 ? "actual" : "scenario";
  const item = payload.find((p: any) => p.value != null && p.dataKey === key);
  if (!item) return null;
  return (
    <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-[10px]">
      <p className="text-gray-700">{year}: {Math.round(item.value).toLocaleString()} kt</p>
    </div>
  );
}

export default function ScenarioModeller() {
  const [bovaerPct,   setBovaerPct]   = useState(0);
  const [nonDairyPct, setNonDairyPct] = useState(0);
  const [slurryPct,   setSlurryPct]   = useState(0);
  const [fertPct,     setFertPct]     = useState(0);
  const [peatlandHa,  setPeatlandHa]  = useState(0);
  const [herdPct,     setHerdPct]     = useState(0);
  const [geneticsOn,  setGeneticsOn]  = useState(false);
  const [adOn,        setAdOn]        = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [zoomed,      setZoomed]      = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
    const setNum = (key: string, setter: (v: number) => void, min: number, max: number) => {
      const raw = Number(p.get(key));
      if (p.has(key) && !isNaN(raw)) setter(clamp(raw, min, max));
    };
    setNum("bovaer",   setBovaerPct,   0, 90);
    setNum("nondairy", setNonDairyPct, 0, 90);
    setNum("slurry",   setSlurryPct,   0, 80);
    setNum("fert",     setFertPct,     0, 100);
    setNum("peat",     setPeatlandHa,  0, 10000);
    setNum("herd",     setHerdPct,     0, 50);
    if (p.has("genetics")) setGeneticsOn(p.get("genetics") === "1");
    if (p.has("ad"))       setAdOn(p.get("ad") === "1");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const p = new URLSearchParams();
      if (bovaerPct)   p.set("bovaer",   String(bovaerPct));
      if (nonDairyPct) p.set("nondairy", String(nonDairyPct));
      if (slurryPct)   p.set("slurry",   String(slurryPct));
      if (fertPct)     p.set("fert",     String(fertPct));
      if (peatlandHa)  p.set("peat",     String(peatlandHa));
      if (herdPct)     p.set("herd",     String(herdPct));
      if (geneticsOn)  p.set("genetics", "1");
      if (adOn)        p.set("ad",       "1");
      const qs = p.toString();
      const newUrl = qs
        ? `?${qs}${window.location.hash}`
        : window.location.pathname + window.location.hash;
      window.history.replaceState(null, "", newUrl);
    }, 150);
    return () => clearTimeout(timer);
  }, [bovaerPct, nonDairyPct, slurryPct, fertPct, peatlandHa, herdPct, geneticsOn, adOn]);

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

  // Raw reductions (before clamping to physical source pools)
  const bovaerRaw         = (bovaerPct   / 100) * DAIRY_ENTERIC_KT     * BOVAER_EFFICACY;
  const nonDairyRaw       = (nonDairyPct / 100) * NON_DAIRY_ENTERIC_KT * BOVAER_EFFICACY;
  const slurryRaw         = (slurryPct   / 100) * SLURRY_METHANE_KT    * 0.40;
  const fertRaw           = (fertPct     / 100) * SOIL_FERTILISER_KT;
  const peatlandRaw       = (peatlandHa  * PEATLAND_RATE) / 1000;
  const herdRaw           = (herdPct     / 100) * ENTERIC_KT;

  const bovaerReduction   = Math.min(bovaerRaw, DAIRY_ENTERIC_KT);
  const nonDairyReduction = Math.min(nonDairyRaw, NON_DAIRY_ENTERIC_KT);
  const slurryReduction   = Math.min(slurryRaw, SLURRY_METHANE_KT);
  const fertReduction     = Math.min(fertRaw, SOIL_FERTILISER_KT);
  const peatlandReduction = peatlandRaw;
  const herdReduction     = Math.min(herdRaw, ENTERIC_KT);

  const geneticsReduction = geneticsOn ? GENETICS_REDUCTION_KT : 0;

  // AD draws from the same slurry pool as aeration — apply to residual pool (methodology §07)
  const slurryResidualPool = Math.max(0, SLURRY_METHANE_KT - slurryReduction);
  const effectiveAd = adOn ? Math.round(0.06 * 0.55 * slurryResidualPool) : 0;

  const adOverstatement = adOn && slurryPct > 0 ? Math.max(0, AD_POTENTIAL_KT - effectiveAd) : 0;

  const userReduction  = bovaerReduction + nonDairyReduction + slurryReduction
                       + fertReduction + peatlandReduction + herdReduction
                       + geneticsReduction + effectiveAd;

  const totalReduction   = COMMITTED_BASELINE_KT + userReduction;
  const remainingGap     = Math.max(0, AGRI_GAP - totalReduction);
  const gapClosedPct     = Math.min(100, Math.round((totalReduction / AGRI_GAP) * 100));
  const newProjected2030 = Math.round(NAEI_AGRI_2023 - totalReduction);
  const targetMet        = newProjected2030 <= AGRI_TARGET_2030;
  const animalsRemoved   = Math.round((herdPct / 100) * TOTAL_CATTLE);
  const scenarioColour   = targetMet ? "#16a34a" : "#c1440e";

  const statusMessage =
    gapClosedPct >= 100
      ? `Gap closed. Herd reduction is doing the work that technology cannot. This scenario removes ${animalsRemoved.toLocaleString()} cattle. No current NI policy proposes that.`
      : gapClosedPct >= 88 && herdPct === 0
      ? `At maximum deployment of every available technology, 88% of the gap closes. The remaining ~136 kt cannot be reached without reducing herd size. No current NI policy commits to that.`
      : gapClosedPct >= 40 && herdPct === 0
      ? `Significant progress. At these adoption rates, closing the gap entirely requires either pushing every measure to its ceiling or some reduction in herd size.`
      : gapClosedPct >= 40
      ? `Significant progress, but a gap remains. Closing it requires either near-maximum deployment of every remaining measure or further herd reduction.`
      : `Current interventions fall well short. Even the full government programme leaves a substantial gap without structural change to the herd.`;

  const committedProjected2030 = NAEI_AGRI_2023 - COMMITTED_BASELINE_KT;

  const xDomain: [number, number]  = zoomed ? [2016, 2030] : [1990, 2030];
  const xTickCount                 = zoomed ? 8 : 5;
  const zoomVisibleValues = [AGRI_TARGET_2030, newProjected2030, committedProjected2030, NAEI_AGRI_2023];
  const yMin = zoomed ? Math.floor((Math.min(...zoomVisibleValues) - 200) / 500) * 500 : 4000;
  const yMax = zoomed ? Math.ceil((Math.max(...zoomVisibleValues) + 200) / 500) * 500 : 6500;
  const yDomain: [number, number]  = [yMin, yMax];

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
        baseline:  NAEI_AGRI_2023,
        committed: NAEI_AGRI_2023,
        scenario:  NAEI_AGRI_2023,
      };
    } else {
      const t = (point.year - 2023) / 7;
      return {
        year:      point.year,
        actual:    null as number | null,
        baseline:  NAEI_AGRI_2023,
        committed: Math.round(NAEI_AGRI_2023 + t * (committedProjected2030 - NAEI_AGRI_2023)),
        scenario:  Math.round(NAEI_AGRI_2023 + t * (newProjected2030 - NAEI_AGRI_2023)),
      };
    }
  });

  return (
    <section id={SCENARIO_SECTION_ID} className="bg-[#FFF9F5] border-t border-[#e8e0d8] px-6 lg:px-8 xl:px-10 py-14 lg:py-20">
      <div className="mx-auto w-full max-w-[1500px]">

        <div className="mb-10 lg:mb-14 w-full">
          <p className="text-xs uppercase tracking-widest text-[#666666] mb-4">
            What would it take
          </p>
          <p className="text-[20px] lg:text-[28px] font-bold text-[#1a1a1a] leading-tight mb-5">
            Adjust the interventions. Watch the trajectory change.
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

        <div className="w-full py-6 mb-2">
          <div className="grid grid-cols-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Current Projection</p>
              <p className="text-3xl font-bold tabular-nums text-gray-900">{newProjected2030.toLocaleString()} kt</p>
            </div>
            <div className="border-l border-[#e8e0d8] pl-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Target</p>
              <p className="text-3xl font-bold tabular-nums text-gray-900">{AGRI_TARGET_2030.toLocaleString()} kt</p>
            </div>
            <div className="border-l border-[#e8e0d8] pl-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Gap</p>
              <p className={`text-3xl font-bold tabular-nums ${targetMet ? "text-green-600" : "text-[#c1440e]"}`}>{remainingGap.toLocaleString()} kt</p>
            </div>
          </div>
        </div>

        <p className="w-full text-[11px] text-gray-400 mb-4">Includes 242 kt already committed under Draft CAP 2023–27 livestock productivity improvements. The remaining gap is 883 kt.</p>

        <div className="w-full rounded-lg bg-white/70 border border-[#e8e0d8] px-4 py-3 mb-4">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span className="uppercase tracking-widest">Gap closed</span>
            <span>{gapClosedPct}% of {AGRI_GAP.toLocaleString()} kt</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
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

        <div className="w-full">
          <div className="relative w-full">
            <div className="flex justify-end mb-2">
              <div className="relative group">
                <button
                  onClick={() => setZoomed(v => !v)}
                  className={`transition-colors ${zoomed ? "text-sky-500 hover:text-sky-700" : "text-sky-400 hover:text-sky-600"}`}
                >
                  {zoomed ? <ZoomOut size={22} /> : <ZoomIn size={22} />}
                </button>
                <span className="pointer-events-none absolute right-0 bottom-full mb-1.5 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                  {zoomed ? "Show full history" : "Zoom to 2016–2030"}
                </span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={460}>
              <ComposedChart
                data={zoomed ? chartData.filter(d => d.year >= 2016) : chartData}
                margin={{ top: 5, right: 92, left: 4, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="year"
                  type="number"
                  domain={xDomain}
                  tickCount={xTickCount}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#4b5563" }}
                />
                <YAxis
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#4b5563" }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(1)}Mt`}
                  domain={yDomain}
                  width={44}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={AGRI_TARGET_2030}
                  stroke="#15803d"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  label={{ value: "CCC target", position: "right", fontSize: 10, fill: "#15803d" }}
                />
                <ReferenceLine
                  y={NAEI_AGRI_2023}
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
                  fillOpacity={0.5}
                  stroke="none"
                  legendType="none"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#1e3a5f"
                  strokeWidth={2}
                  isAnimationActive={false}
                  dot={false}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="committed"
                  stroke="#9ca3af"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  isAnimationActive={false}
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
                  isAnimationActive={true}
                  animationDuration={400}
                  dot={false}
                  connectNulls
                />
                <ReferenceDot
                  x={2030}
                  y={committedProjected2030}
                  r={0}
                  label={<RightEdgeReferenceLabel value="Draft CAP" fill="#9ca3af" dy={10} />}
                />
                <ReferenceDot
                  x={2030}
                  y={newProjected2030}
                  r={0}
                  label={<RightEdgeReferenceLabel value="Your scenario" fill={scenarioColour} dy={-10} />}
                />
                <ReferenceDot
                  x={2005}
                  y={chartData.find((d) => d.year === 2005)?.actual ?? NAEI_AGRI_2023}
                  r={0}
                  label={{ value: "Historical", position: "top", fontSize: 9, fill: "#1e3a5f" }}
                />

                {!targetMet && (
                  <ReferenceDot
                    x={2028.85}
                    y={(newProjected2030 + AGRI_TARGET_2030) / 2}
                    r={0}
                    label={{
                      value: `Gap: ${remainingGap.toLocaleString()} kt`,
                      position: "left",
                      fontSize: 10,
                      fill: "#c1440e",
                    }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>

            {zoomed && (
              <p className="text-[10px] text-gray-300 mt-1 text-right">
                Showing 2016–2030. Toggle above to restore full history.
              </p>
            )}

          </div>

          <p className="text-xs text-gray-600 leading-snug mt-3">
            {statusMessage}
          </p>

          <div className="flex items-center justify-between pt-6 mt-2">
            <div className="flex gap-2">
              <button
                onClick={() => applyPreset("techOnly")}
                className="rounded border border-gray-200 px-2 py-1 md:px-3 md:py-1.5 text-left transition-colors hover:bg-gray-50"
              >
                <span className="text-[10px] md:text-[11px] font-medium text-gray-700">Tech only</span>
                <span className="hidden md:inline ml-1.5 text-[10px] text-gray-400">No herd reduction</span>
              </button>
              <button
                onClick={() => applyPreset("mixed")}
                className="rounded border border-[#c1440e]/40 bg-[#c1440e]/5 px-2 py-1 md:px-3 md:py-1.5 text-left transition-colors hover:bg-[#c1440e]/10"
              >
                <span className="text-[10px] md:text-[11px] font-medium text-gray-700">Mixed</span>
                <span className="hidden md:inline ml-1.5 text-[10px] text-gray-400">Closes the gap</span>
              </button>
              <button
                onClick={() => applyPreset("reset")}
                className="rounded border border-gray-200 px-2 py-1 md:px-3 md:py-1.5 text-left transition-colors hover:bg-gray-50"
              >
                <span className="text-[10px] md:text-[11px] font-medium text-gray-700">Reset</span>
              </button>
            </div>
            <div className="relative group">
              <button
                onClick={() => {
                  const url = window.location.href;
                  if (navigator.share) {
                    navigator.share({ title: "Climate Gap NI", url }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(url)
                      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); })
                      .catch(() => {});
                  }
                }}
                className={`transition-colors ${copied ? "text-green-500" : "text-[#c1440e]/50 hover:text-[#c1440e]"}`}
              >
                <Share2 size={20} />
              </button>
              <span className="pointer-events-none absolute right-0 top-full mt-1.5 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                {copied ? "Copied!" : "Share"}
              </span>
            </div>
          </div>

          <div className="pt-8 mt-2 border-t border-[#e8e0d8] flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-0">

            <div className="w-full pr-0 md:pr-6 lg:pr-8">
              <div className="flex justify-between items-baseline mb-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Enteric emissions</p>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 text-right">up to {MAX_ENTERIC_KT.toLocaleString()} kt</span>
              </div>
              <div className="flex flex-col gap-5">

                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm lg:text-xs text-gray-500">
                          Feed additives — dairy (Bovaer)
                        </span>
                        <SliderHelpTooltip tooltipKey="bovaerDairy" />
                      </div>
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
                      title="Proportion of dairy cattle receiving Bovaer feed additive, reducing enteric methane by 12% per animal"
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
                    {bovaerReduction > 0 && (
                      <p className="text-sm lg:text-[11px] text-gray-400 mt-1 transition-all">
                        Saves <span className="text-[11px] font-medium text-gray-700">{Math.round(bovaerReduction)} kt</span>{" "}
                        <span className="text-green-600">({pctOfGap(bovaerReduction)}% of gap)</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm lg:text-xs text-gray-500">
                          Feed additives — non-dairy cattle
                        </span>
                        <SliderHelpTooltip tooltipKey="bovaerNonDairy" />
                      </div>
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
                      title="Proportion of beef and other cattle receiving Bovaer, reducing enteric methane by 12% per animal"
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
                    {nonDairyReduction > 0 && (
                      <p className="text-sm lg:text-[11px] text-gray-400 mt-1 transition-all">
                        Saves <span className="text-[11px] font-medium text-gray-700">{Math.round(nonDairyReduction)} kt</span>{" "}
                        <span className="text-green-600">({pctOfGap(nonDairyReduction)}% of gap)</span>
                      </p>
                    )}
                  </div>

                  <div className="border-t border-[#e8e0d8] pt-4 mt-3">
                    <div className="flex justify-between items-baseline mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm lg:text-xs text-gray-500">Cattle herd reduction</span>
                        <SliderHelpTooltip tooltipKey="herdReduction" />
                      </div>
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
                          background: sliderBgMuted(herdPct, 50),
                          borderRadius: "9999px", outline: "none",
                        }}
                        title="Percentage reduction in total cattle numbers, linearly reducing enteric fermentation emissions"
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
                    {herdReduction > 0 && (
                      <p className="text-sm lg:text-[11px] text-gray-400 mt-1 transition-all">
                        Saves <span className="text-[11px] font-medium text-gray-700">{Math.round(herdReduction)} kt</span>{" "}
                        <span className="text-green-600">({pctOfGap(herdReduction)}% of gap)</span>
                      </p>
                    )}
                    {herdPct >= GAP_CLOSING_HERD_PCT && (
                      <p className="text-sm lg:text-[11px] text-[#c1440e] mt-1 font-medium">
                        {herdPct}% = {animalsRemoved.toLocaleString()} fewer cattle
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setGeneticsOn((v) => !v)}
                        className={`flex-1 rounded-lg border px-3 py-2 text-left transition-colors ${
                          geneticsOn
                            ? "border-[#c1440e] bg-white text-gray-700"
                            : "border-gray-200 bg-white text-gray-400"
                        }`}
                      >
                        <span className="text-[11px] font-medium leading-tight block">
                          {geneticsOn && <span className="mr-1">✓</span>}Ruminant genetics
                        </span>
                        <span className="text-[10px] tabular-nums">
                          {geneticsOn ? `+${GENETICS_REDUCTION_KT} kt` : `${GENETICS_REDUCTION_KT} kt potential`}
                        </span>
                      </button>
                      <SliderHelpTooltip tooltipKey="ruminantGenetics" />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAdOn((v) => !v)}
                        className={`flex-1 rounded-lg border px-3 py-2 text-left transition-colors ${
                          adOn
                            ? "border-[#c1440e] bg-white text-gray-700"
                            : "border-gray-200 bg-white text-gray-400"
                        }`}
                      >
                        <span className="text-[11px] font-medium leading-tight block">
                          {adOn && <span className="mr-1">✓</span>}Anaerobic digestion
                        </span>
                        <span className="text-[10px] tabular-nums">
                          {adOn ? `+${effectiveAd} kt` : `${AD_POTENTIAL_KT} kt potential`}
                        </span>
                      </button>
                      <SliderHelpTooltip tooltipKey="anaerobicDigestion" />
                    </div>
                    {adOverstatement > 0 && (
                      <p className="text-[10px] text-amber-600">
                        Note: AD and slurry aeration draw from the same pool. At current adoption, combined reduction may overstate by ~{adOverstatement} kt.
                      </p>
                    )}
                  </div>

                </div>
              </div>

            <div className="w-full px-0 md:px-6 lg:px-8 lg:border-l border-[#e8e0d8]">
                <div className="flex justify-between items-baseline mb-4">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400">Slurry & soils</p>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 text-right">up to {MAX_SLURRY_SOILS_KT.toLocaleString()} kt</span>
                </div>
                <div className="flex flex-col gap-5">

                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm lg:text-xs text-gray-500">
                          Slurry aeration
                        </span>
                        <SliderHelpTooltip tooltipKey="slurryAeration" />
                      </div>
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
                      title="Proportion of liquid slurry storage units fitted with aeration, reducing methane emissions by 40% per unit"
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
                    {slurryReduction > 0 && (
                      <p className="text-sm lg:text-[11px] text-gray-400 mt-1 transition-all">
                        Saves <span className="text-[11px] font-medium text-gray-700">{Math.round(slurryReduction)} kt</span>{" "}
                        <span className="text-green-600">({pctOfGap(slurryReduction)}% of gap)</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm lg:text-xs text-gray-500">
                          Switch to protected urea fertiliser
                        </span>
                        <SliderHelpTooltip tooltipKey="protectedUrea" />
                      </div>
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
                      title="Proportion of synthetic fertiliser use switched to protected urea, reducing nitrous oxide emissions"
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
                    {fertReduction > 0 && (
                      <p className="text-sm lg:text-[11px] text-gray-400 mt-1 transition-all">
                        Saves <span className="text-[11px] font-medium text-gray-700">{Math.round(fertReduction)} kt</span>{" "}
                        <span className="text-green-600">({pctOfGap(fertReduction)}% of gap)</span>
                      </p>
                    )}
                  </div>

                </div>

            </div>

            <div className="w-full px-0 md:px-6 lg:px-8 lg:border-l border-[#e8e0d8]">
                <div className="flex justify-between items-baseline mb-4">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400">Land use</p>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 text-right">up to {MAX_LAND_USE_KT.toLocaleString()} kt</span>
                </div>
                <div className="flex flex-col gap-5">

                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm lg:text-xs text-gray-500">Peatland restoration</span>
                        <SliderHelpTooltip tooltipKey="peatland" />
                      </div>
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
                      title="Hectares of degraded peatland restored, avoiding 11 tonnes CO₂e per hectare per year"
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
                    {peatlandReduction > 0 && (
                      <p className="text-sm lg:text-[11px] text-gray-400 mt-1 transition-all">
                        Saves <span className="text-[11px] font-medium text-gray-700">{Math.round(peatlandReduction)} kt</span>{" "}
                        <span className="text-green-600">({pctOfGap(peatlandReduction)}% of gap)</span>
                      </p>
                    )}
                  </div>

                </div>

            </div>

          </div>
        </div>

        <div className="mt-14 pt-10 border-t border-[#e8e0d8]">
          <p className="text-[11px] uppercase tracking-widest text-[#666666] mb-4">
            The Arithmetic
          </p>
          <p className="text-[15px] leading-[1.9] text-gray-600 mb-3">
            Even at maximum adoption across every available productivity improvement measure, the gap to the 2030 CCC Stretch Ambition Target is not closed. Some reduction in cattle numbers is required regardless.
          </p>
          <p className="text-[15px] leading-[1.9] text-gray-600 mb-3">
            Technology-only scenarios depend on near-universal adoption across thousands of farms by 2030. Bovaer works by adding a supplement to cattle feed concentrate, but because this must be given twice daily, achieving 90% uptake across NI's farms is a significant logistical challenge. Slurry aeration requires capital grants that do not yet exist at scale. Protected urea requires changing fertiliser habits across the entire industry.
          </p>
          <p className="text-[15px] leading-[1.9] text-gray-600">
            Since 1990, Northern Ireland&apos;s total emissions fell by nearly a third, but agriculture&apos;s share has grown. The modeller above shows what closing the gap requires. On current trends, agriculture will not fall fast enough to meet the 2030 target. With it accounting for 30.8% of all emissions, the legally binding target cannot be met unless the rate of reduction accelerates significantly. The draft Climate Action Plan does not say how it will.
          </p>
        </div>
      </div>
    </section>
  );
}
