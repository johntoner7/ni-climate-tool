"use client";

import { useState, useEffect } from "react";
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

// Improved color palette with distinct, differentiated hues
const SECTOR_COLOURS = {
  Agriculture: "#c1440e",  // Warm red
  Transport:   "#f4a259",  // Warm orange/yellow
  Buildings:   "#5b8bd6",  // Clear blue
  Industry:    "#7c3f9f",  // Purple
  Waste:       "#2d9f6c",  // Green
  Electricity: "#1a5f7a",  // Dark teal
};

const SECTORS = Object.keys(SECTOR_COLOURS) as Array<keyof typeof SECTOR_COLOURS>;

export default function SectorAreaChart({ activeStep }: { activeStep?: number }) {
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    return () => observer.disconnect();
  }, []);

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

  // Custom tooltip that shows the hovered sector
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      // Find the sector that matches our hovered state, or default to first
      const item = hoveredSector 
        ? payload.find((p: any) => p.name === hoveredSector) || payload[0]
        : payload[0];
      
      const sectorColor = SECTOR_COLOURS[item.name as keyof typeof SECTOR_COLOURS] || "#000";
      
      return (
        <ChartTooltip
          label={label}
          name={item.name}
          value={`${item.value?.toLocaleString() ?? 'N/A'} kt`}
          color={sectorColor}
          indicatorType="circle"
        />
      );
    }
    return null;
  };
  return (
    <div className="w-full">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        kt CO₂e · Source: NAEI
      </p>
      <ResponsiveContainer width="100%" height={420}>
          <AreaChart
            data={niSectorData}
            margin={{ top: 10, right: 110, left: 20, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke={isDark ? "#374151" : "#e5e7eb"} />
            <XAxis
              dataKey="year"
              tickLine={false}
              tick={{ fontSize: 12, fill: isDark ? "#9ca3af" : "#6b7280" }}
            />
            <YAxis
              tickLine={false}
              tick={{ fontSize: 12, fill: isDark ? "#9ca3af" : "#6b7280" }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}Mt`}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Direct labels on the right using ReferenceLine */}
            {SECTORS.map((sector) => (
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
    </div>
  );
}