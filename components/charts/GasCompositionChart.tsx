"use client";

import { Cell, Pie, PieChart, Tooltip } from "recharts";
import ChartTooltip from "./ChartTooltip";
import { useIsMobile } from "@/lib/useIsMobile";

type CompositionDatum = {
  key: "enteric" | "soils" | "manure" | "combustion";
  label: string;
  value: number;
  share: number;
  color: string;
};

// 2023 NAEI agricultural emissions grouped into four source categories.
// Enteric fermentation rows: dairy cattle, non-dairy cattle, sheep, horses, swine, deer, goats.
// Agricultural soils rows: cultivation, indirect emissions, inorganic N, manure applied/deposited,
// mineralization, other organic, residues, sewage sludge, liming, urea.
// Manure management rows: dairy cattle, non-dairy cattle, sheep, swine, poultry, horses, goats,
// deer, indirect emissions.
// Agricultural combustion rows: mobile machinery fuel use, stationary fuel use.
// Source: NAEI Devolved Administration GHG Inventory 1990–2023, Northern Ireland
// (Northern_Ireland_By_SourceTable_1.csv). Values in kt CO₂e, AR5 GWPs.
// Grand total 5,615.16 kt; residual 0.21 kt "other agriculture" (field burning) omitted.
const DATA: CompositionDatum[] = [
  {
    key: "enteric",
    label: "Enteric fermentation",
    value: 3507.1,
    share: 62.5,
    color: "#b85a30",
  },
  {
    key: "soils",
    label: "Agricultural soils",
    value: 905.1,
    share: 16.1,
    color: "#6a8cad",
  },
  {
    key: "manure",
    label: "Manure management",
    value: 993.6,
    share: 17.7,
    color: "#8f6bb3",
  },
  {
    key: "combustion",
    label: "Agricultural combustion",
    value: 209.1,
    share: 3.7,
    color: "#c9ced6",
  },
];

function CenterLabel({ innerRadius, isMobile }: { innerRadius: number; isMobile: boolean }) {
  return (
    <>
      <circle
        cx="50%"
        cy="50%"
        r={innerRadius - 6}
        fill="rgba(255,255,255,0.96)"
        stroke="rgba(229,231,235,0.9)"
        strokeWidth={1}
      />
      <text
        x="50%"
        y="48%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#111827"
        style={{ fontSize: 13, fontWeight: 700 }}
      >
        2023 NAEI
      </text>
      <text
        x="50%"
        y="58%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#374151"
        style={{ fontSize: isMobile ? 8 : 10, fontWeight: 600 }}
      >
        Agricultural sources
      </text>
    </>
  );
}

export default function GasCompositionChart({
  className,
}: {
  className?: string;
}) {
  const isMobile = useIsMobile();
  const chartSize   = isMobile ? 220 : 300;
  const innerRadius = isMobile ? 52  : 70;
  const outerRadius = isMobile ? 86  : 112;

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload as CompositionDatum;

    return (
      <ChartTooltip
        name={item.label}
        value={`${item.value.toLocaleString("en-GB", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })} kt CO₂e (${item.share.toFixed(1)}%)`}
        color={item.color}
        indicatorType="circle"
      />
    );
  };

  return (
    <div className={className}>
      <div className="w-full max-w-[560px]">
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
          2023 NAEI · kt CO₂e by agricultural source
        </p>

        <div className="flex justify-center">
          <PieChart width={chartSize} height={chartSize}>
            <Pie
              data={DATA}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              stroke="none"
              isAnimationActive
              animationDuration={500}
              animationEasing="ease-out"
            >
              {DATA.map((entry) => (
                <Cell key={entry.key} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <CenterLabel innerRadius={innerRadius} isMobile={isMobile} />
          </PieChart>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {DATA.map((item) => (
            <div
              key={item.key}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-900/60"
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {item.value.toLocaleString("en-GB", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })} kt CO₂e · {item.share.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-2 text-center text-xs italic leading-relaxed text-gray-500 dark:text-gray-400">
          2023 NAEI agricultural emissions grouped into enteric fermentation, agricultural soils,
          manure management, and agricultural combustion.
        </p>
      </div>
    </div>
  );
}
