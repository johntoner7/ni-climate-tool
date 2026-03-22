export const UK_AGRI_SHARE_AVERAGE = 12; // percent

// NI agriculture 2023 NAEI actual (kt CO₂e, AR5). Used as the flat-hold 2030 baseline
// in the scenario modeller and as the rebasing anchor in AgriculturePathwayChart.
export const NAEI_AGRI_2023 = 5615;

export const SCENARIO_SECTION_ID = "scenario";

// CCC Stretch Ambition 2030 target for NI agriculture (kt CO₂e, AR5)
export const AGRI_TARGET_2030 = 4490;
// Gap: NAEI_AGRI_2023 − AGRI_TARGET_2030
export const AGRI_GAP         = 1125;

// Emission pools — NAEI 2023, AR5 (kt CO₂e)
export const DAIRY_ENTERIC_KT     = 1098;  // dairy cattle enteric
export const NON_DAIRY_ENTERIC_KT = 2059;  // non-dairy cattle enteric
export const ENTERIC_KT           = 3157;  // total cattle enteric (dairy + non-dairy)
export const SLURRY_METHANE_KT    = 630;   // liquid slurry methane
export const SOIL_FERTILISER_KT   = 59;    // protected urea ceiling (44 kt at 75% → scaled to 100%)

// Intervention parameters
export const BOVAER_EFFICACY      = 0.12;  // 12% enteric methane reduction — Muñoz-Tamayo et al. (2024) pasture trials
export const PEATLAND_RATE        = 11;    // t CO₂e/ha/yr — UK CEH NI-specific analysis (methodology §07)
export const GENETICS_REDUCTION_KT = 17;  // ruminant genetics programme (methodology §07)
export const AD_POTENTIAL_KT       = 21;  // anaerobic digestion nominal (before slurry pool constraint)

// Committed policy baseline — Draft NI CAP 2023-2027 livestock productivity improvements (methodology §07)
export const COMMITTED_BASELINE_KT = 242;

// Population
export const TOTAL_CATTLE = 1673345; // DAERA Agricultural Census 2023

export const SECTOR_COLOURS = {
  Agriculture: "#c1440e",
  Transport:   "#f4a259",
  Buildings:   "#5b8bd6",
  Industry:    "#7c3f9f",
  Waste:       "#2d9f6c",
  Electricity: "#1a5f7a",
} as const;
