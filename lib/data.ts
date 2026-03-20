import niData from "@/public/data/ni_sectors.json";

export type SectorYear = {
  year: number;
  Agriculture: number;
  Buildings: number;
  Transport: number;
  Electricity: number;
  Industry: number;
  Waste: number;
  total: number;
};

export const niSectorData: SectorYear[] = niData.by_year;