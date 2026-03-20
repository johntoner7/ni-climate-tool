"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { niSectorData } from "@/lib/data";
import ChartTooltip from "./ChartTooltip";
import { useIsMobile } from "@/lib/useIsMobile";
import { SECTOR_COLOURS } from "@/lib/constants";

const SECTORS = Object.keys(SECTOR_COLOURS) as Array<keyof typeof SECTOR_COLOURS>;

type SEntry = { name: string; value: number };

function SectorTooltip({ active, payload, label, hoveredSector }: {
  active?: boolean;
  payload?: readonly SEntry[];
  label?: string | number;
  hoveredSector: string | null;
}) {
  if (!active || !payload?.length) return null;
  const item = hoveredSector
    ? payload.find((p) => p.name === hoveredSector) ?? payload[0]
    : payload[0];
  const color = SECTOR_COLOURS[item.name as keyof typeof SECTOR_COLOURS] ?? "#000";
  return (
    <ChartTooltip
      label={String(label)}
      name={item.name}
      value={`${item.value?.toLocaleString() ?? "N/A"} kt`}
      color={color}
      indicatorType="circle"
    />
  );
}

export default function SectorAreaChart({ activeStep }: { activeStep?: number }) {
  const isMobile = useIsMobile();
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);

  const highlightedSector: string | null =
    activeStep === 2 ? "Electricity" :
    activeStep === 3 || activeStep === 6 ? "Agriculture" :
    null;

  // Calculate Y positions for labels (midpoint of each sector band at the last data point)
  const labelYPositions: Record<string, number> = {};
  if (niSectorData.length > 0) {
    const lastDataPoint = niSectorData[niSectorData.length - 1];
    let cumulative = 0;
    SECTORS.forEach((sector) => {
      const value = lastDataPoint[sector] || 0;
      labelYPositions[sector] = cumulative + value / 2;
      cumulative += value;
    });
  }

  return (
    <div className="w-full flex flex-col">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        kt CO₂e · Source: NAEI
      </p>
      <ResponsiveContainer width="100%" height={isMobile ? 260 : 540}>
          <AreaChart
            data={niSectorData}
            margin={{ top: 10, right: isMobile ? 20 : 110, left: isMobile ? 0 : 20, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="year"
              type="number"
              domain={[1990, 2023]}
              tickLine={false}
              tick={{ fontSize: isMobile ? 10 : 12, fill: "#6b7280" }}
              ticks={isMobile ? [1990, 2000, 2010, 2023] : [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2023]}
            />
            <YAxis
              tickLine={false}
              tick={{ fontSize: isMobile ? 10 : 12, fill: "#6b7280" }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}Mt`}
              width={isMobile ? 28 : undefined}
            />
            <Tooltip content={(props) => <SectorTooltip {...props} hoveredSector={hoveredSector} />} />
            {/* Direct labels on the right — desktop only */}
            {!isMobile && SECTORS.map((sector) => (
              <ReferenceLine
                key={`label-${sector}`}
                y={labelYPositions[sector]}
                stroke="none"
                label={{
                  value: sector === "Electricity" && activeStep === 2
                    ? "Electricity −60%"
                    : sector,
                  position: "right",
                  fill: highlightedSector === null || sector === highlightedSector
                    ? SECTOR_COLOURS[sector]
                    : "#d1d5db",
                  fontSize: 12,
                  fontWeight: 600,
                  offset: 8,
                }}
                ifOverflow="extendDomain"
              />
            ))}
            {SECTORS.map((sector) => (
              <Area
                key={sector}
                type="monotone"
                dataKey={sector}
                stackId="1"
                stroke={SECTOR_COLOURS[sector]}
                fill={SECTOR_COLOURS[sector]}
                fillOpacity={
                  highlightedSector === null
                    ? 0.85
                    : sector === highlightedSector
                    ? 0.9
                    : 0.12
                }
                strokeWidth={0}
                onMouseEnter={() => setHoveredSector(sector)}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      {/* Compact legend — mobile only */}
      {isMobile && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 px-1">
          {SECTORS.map((sector) => (
            <div key={sector} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: SECTOR_COLOURS[sector] }} />
              <span className="text-[10px] text-gray-500">{sector}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}