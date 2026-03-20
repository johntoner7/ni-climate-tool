"use client";

import {
  ComposedChart,
  Line,
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

function linearRegression(points: Array<{ x: number; y: number }>) {
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return { m: 0, b: sumY / n };
  const m = (n * sumXY - sumX * sumY) / denom;
  const b = (sumY - m * sumX) / n;
  return { m, b };
}

export default function AgriculturePathwayChart() {
  const isMobile = useIsMobile();

  // DAERA and CCC Table 21 values (MtCO2e) for 2023-2027, convert to kt
  const daeraTableMt = [6.03, 5.97, 5.88, 5.67, 5.44];
  const cccTableMt = [5.98, 5.74, 5.60, 5.45, 5.29];
  const yearsTable = [2023, 2024, 2025, 2026, 2027];

  // DAERA/CCC use a different inventory basis (2022 base, AR4 GWP) so their 2023
  // starting point (~6.03 Mt) sits above the NAEI 2023 actual (5.615 Mt).
  // We rebase both series by the same offset to the NAEI 2023 actual, preserving
  // each pathway's rate of change while keeping the relative gap consistent.
  const NAEI_2023 = 5615.2;
  const sharedOffset = NAEI_2023 - Math.round(daeraTableMt[0] * 1000);

  const daeraPoints = yearsTable.map((y, i) => ({ x: y, y: Math.round(daeraTableMt[i] * 1000 + sharedOffset) }));
  const cccPoints   = yearsTable.map((y, i) => ({ x: y, y: Math.round(cccTableMt[i]   * 1000 + sharedOffset)   }));

  const daeraLR = linearRegression(daeraPoints);
  const cccLR   = linearRegression(cccPoints);

  // Source historical agriculture data from projectionsData
  // The JSON uses kt units
  const hist = (projectionsData as any).chart4_sectors?.Agriculture || [];

  const data: Array<any> = [];
  for (let y = 1990; y <= 2030; y++) {
    const histEntry = hist.find((d: any) => d.year === y);
    const actual = histEntry ? histEntry.actual ?? null : null;

    // DAERA / CCC values: use table for 2023-2027, extrapolate for 2028-2030
    let daeraVal: number | null = null;
    let cccVal: number | null = null;

    if (y >= 2023) {
      // use regression to extrapolate or table value
      const inTableIndex = yearsTable.indexOf(y);
      if (inTableIndex >= 0) {
        daeraVal = daeraPoints[inTableIndex].y;
        cccVal = cccPoints[inTableIndex].y;
      } else {
        daeraVal = Math.round(daeraLR.m * y + daeraLR.b);
        cccVal = Math.round(cccLR.m * y + cccLR.b);
      }
    }

    // create split series for solid (<=2027) and dashed (>=2027) lines
    const daera_solid = daeraVal != null && y <= 2027 ? daeraVal : null;
    const daera_dash = daeraVal != null && y >= 2027 ? daeraVal : null;
    const ccc_solid = cccVal != null && y <= 2027 ? cccVal : null;
    const ccc_dash = cccVal != null && y >= 2027 ? cccVal : null;

    const gap = (daeraVal != null && cccVal != null) ? Math.max(0, daeraVal - cccVal) : null;

    data.push({
      year: y,
      actual,
      daera: daeraVal,
      ccc: cccVal,
      daera_solid,
      daera_dash,
      ccc_solid,
      ccc_dash,
      gap,
    });
  }

  const SERIES = [
    { keys: ["actual"],                    label: "Actual (NAEI)",        color: "#334155" },
    { keys: ["daera_solid", "daera_dash"], label: "DAERA projection",     color: "#f97316" },
    { keys: ["ccc_solid",   "ccc_dash"],   label: "CCC pathway",          color: "#16a34a" },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const items = SERIES.flatMap(({ keys, label: name, color }) => {
      const hit = payload.find((p: any) => keys.includes(p.dataKey) && p.value != null);
      return hit ? [{ name, value: `${(hit.value / 1000).toFixed(2)} Mt`, color, indicatorType: "line" as const }] : [];
    });
    if (!items.length) return null;
    return <ChartTooltip label={String(label)} items={items} />;
  };

  return (
    <div className="w-full flex flex-col">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
        {isMobile ? "Mt CO₂e · NAEI / DAERA / CCC" : "Mt CO₂e · Sources: NAEI (historical), DAERA Draft CAP / CCC (Table 21, rebased to NAEI 2023)"}
      </p>
      <ResponsiveContainer width="100%" height={isMobile ? 240 : 520}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: isMobile ? 10 : 60, left: isMobile ? 0 : 20, bottom: 0 }}
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
            domain={[4000, 7000]}
            width={isMobile ? 30 : undefined}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Vertical ref line at 2027 */}
            <ReferenceLine
            x={2027}
            stroke="#9ca3af"
            strokeWidth={1}
            label={{ value: "End of first carbon budget period", position: "top", fontSize: isMobile ? 8 : 12, fill: "#6b7280"}}
            />

          {/* Historical actuals */}
          <Line type="monotone" dataKey="actual" stroke="#334155" strokeWidth={2.5} dot={false} connectNulls name="Actual" />

          {/* DAERA: solid then dashed */}
          <Line type="monotone" dataKey="daera_solid" stroke="#f97316" strokeWidth={2} dot={false} connectNulls name="DAERA (solid)" />
          <Line type="monotone" dataKey="daera_dash" stroke="#f97316" strokeWidth={2} strokeDasharray="6 4" dot={false} connectNulls name="DAERA (dashed)" />

          {/* CCC: solid then dashed */}
          <Line type="monotone" dataKey="ccc_solid" stroke="#16a34a" strokeWidth={2} dot={false} connectNulls name="CCC (solid)" />
          <Line type="monotone" dataKey="ccc_dash" stroke="#16a34a" strokeWidth={2} strokeDasharray="6 4" dot={false} connectNulls name="CCC (dashed)" />
        </ComposedChart>
      </ResponsiveContainer>

      <div className={`flex flex-wrap gap-y-1 mt-4 justify-center ${isMobile ? "gap-x-3" : "gap-x-6"}`}>
        <div className="flex items-center gap-1.5">
          <div className="w-5 rounded" style={{ height: 3, backgroundColor: "#334155" }} />
          <span className={`text-gray-600 dark:text-gray-300 ${isMobile ? "text-[10px]" : "text-xs"}`}>Historical actual</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 rounded" style={{ height: 3, backgroundColor: "#f97316" }} />
          <span className={`text-gray-600 dark:text-gray-300 ${isMobile ? "text-[10px]" : "text-xs"}`}>DAERA projection</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 rounded" style={{ height: 3, backgroundColor: "#16a34a" }} />
          <span className={`text-gray-600 dark:text-gray-300 ${isMobile ? "text-[10px]" : "text-xs"}`}>CCC pathway</span>
        </div>
      </div>

      {!isMobile && (
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Methodology: Table 21 provides DAERA and CCC values to 2027; 2028–2030 are linear extrapolations
          from the 2023–2027 trend. Both projection series are rebased by the same offset to the NAEI 2023
          actual (5.615 Mt), preserving each pathway's rate of change while keeping the gap between the
          trajectories consistent. DAERA's raw 2023 figure (6.03 Mt) reflects a different inventory basis
          (2022 data, AR4 GWP) than the NAEI series used here.
        </p>
      )}
    </div>
  );
}
