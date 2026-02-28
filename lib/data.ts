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

// Scenario modeller configuration constants (agricultural emissions)
export const scenarioConfig = {
  // Agricultural emissions baseline constants
  AGRI_TARGET_2030: 4740,    // kt CO₂e — CCC Stretch Ambition (-21% from 2020 baseline of 6,000 kt)
  AGRI_BASELINE_2030: 5615,  // kt CO₂e — flat projection (agriculture broadly flat 2020-2023)
  AGRI_GAP: 875,             // kt CO₂e — gap between baseline and target

  // Scenario parameters (unchanged)
  DAIRY_ENTERIC_KT: 1760,    // ~55% of enteric fermentation
  NON_DAIRY_ENTERIC_KT: 1440, // 3200 - 1760
  BOVAER_EFFICACY: 0.12,     // 12% reduction (Teagasc pasture trials)
  PEATLAND_RATE: 5,          // t CO₂e / ha / yr avoided
  ENTERIC_KT: 3200,          // total enteric fermentation 2023
  TOTAL_CATTLE: 1673345,     // DAERA census June 2023
} as const;