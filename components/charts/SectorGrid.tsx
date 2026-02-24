import SectorMiniChart from "./SectorMiniChart";
import projectionsData from "@/public/data/ni_projections.json";

// Sector target allocations and colors matching the main area chart
// Updated with improved distinct colors
const SECTOR_CONFIG: Record<string, { colour: string; target: number }> = {
  Agriculture: { colour: "#c1440e", target: 2700 }, // Warm red
  Transport: { colour: "#f4a259", target: 1900 },   // Warm orange/yellow
  Buildings: { colour: "#5b8bd6", target: 1300 },   // Clear blue
  Electricity: { colour: "#1a5f7a", target: 700 },  // Dark teal
  Industry: { colour: "#7c3f9f", target: 550 },     // Purple
  Waste: { colour: "#2d9f6c", target: 380 },        // Green
};

export default function SectorGrid({ activeStep }: { activeStep?: number }) {
  const changes = projectionsData.sector_changes_since_1990 as Record<
    string,
    string
  >;
  const sectorData = projectionsData.chart4_sectors as Record<string, any[]>;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(SECTOR_CONFIG).map(([sector, config]) => (
        <SectorMiniChart
          key={sector}
          sector={sector}
          data={sectorData[sector]}
          target={config.target}
          colour={config.colour}
          change1990={changes[sector]}
          activeStep={activeStep}
        />
      ))}
    </div>
  );
}
