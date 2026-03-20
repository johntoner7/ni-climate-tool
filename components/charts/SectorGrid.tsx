import SectorMiniChart from "./SectorMiniChart";
import projectionsData from "@/public/data/ni_projections.json";
import { SECTOR_COLOURS } from "@/lib/constants";

const SECTOR_CONFIG: Record<string, { colour: string; target: number }> = {
  Agriculture: { colour: SECTOR_COLOURS.Agriculture, target: 2700 },
  Transport:   { colour: SECTOR_COLOURS.Transport,   target: 1900 },
  Buildings:   { colour: SECTOR_COLOURS.Buildings,   target: 1300 },
  Electricity: { colour: SECTOR_COLOURS.Electricity, target: 700  },
  Industry:    { colour: SECTOR_COLOURS.Industry,    target: 550  },
  Waste:       { colour: SECTOR_COLOURS.Waste,       target: 380  },
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
