export type SliderTooltipKey =
  | "bovaerDairy"
  | "bovaerNonDairy"
  | "slurryAeration"
  | "protectedUrea"
  | "peatland"
  | "herdReduction"
  | "ruminantGenetics"
  | "anaerobicDigestion";

export const SLIDER_TOOLTIP_CONTENT: Record<SliderTooltipKey, string> = {
  bovaerDairy:
    "Bovaer (3-NOP) inhibits the enzyme responsible for methane production in the rumen. This tool applies an estimated 12% reduction in enteric methane per dairy animal at the specified adoption rate, based on pasture-system trial results (Muñoz-Tamayo et al., 2024). Efficacy in housed systems is higher; the 12% figure reflects the lower consistency of supplement delivery in grazing herds. DAERA's Draft CAP assumes 20%, citing housed-system data. Applied to the dairy enteric pool of 1,760 kt CO₂e.",
  bovaerNonDairy:
    "Same mechanism and estimated efficacy as dairy (12% per animal, Muñoz-Tamayo et al., 2024), applied to the non-dairy cattle enteric pool of 1,440 kt CO₂e. Non-dairy cattle in NI are almost entirely pasture-based, making the pasture-system estimate appropriate.",
  slurryAeration:
    "Aerating slurry stores reduces anaerobic decomposition, cutting methane emissions by approximately 40% per treated unit. Based on AFBI and Teagasc field trials, consistent with the rate used in DAERA's Draft CAP. Applied to the liquid slurry methane pool of 630 kt CO₂e. Where anaerobic digestion is also enabled, a residual pool approach prevents double-counting between the two measures.",
  protectedUrea:
    "Replacing standard urea with urease-inhibitor-coated ('protected') urea reduces nitrous oxide emissions from fertiliser application. The ceiling of 59 kt CO₂e is derived by scaling the Draft CAP's stated saving of 44 kt at 75% adoption linearly to 100%. Source: Draft NI CAP 2023–27, p.158.",
  peatland:
    "Degraded peatlands emit CO₂. Rewetting restores their carbon sink function. This tool applies 11 t CO₂e avoided per hectare per year, from UK Centre for Ecology and Hydrology NI-specific analysis used in the Draft CAP. Emissions avoided sit within the land use sector, not agriculture directly. Slider range: 0–10,000 hectares.",
  herdReduction:
    "A reduction in cattle numbers proportionally reduces enteric fermentation emissions. Applied linearly to the cattle enteric fermentation pool (~3,200 kt CO₂e): a 1% reduction avoids approximately 32 kt CO₂e. The marker on the slider shows the reduction required to close the adjusted gap by this measure alone, without any other intervention.",
  ruminantGenetics:
    "Selective breeding can reduce the methane intensity of individual animals over successive generations. The 17 kt estimate is based on a 0.15%/year improvement in emissions intensity sustained over seven years, applied to 50% of the herd. Source: CCC Stretch Ambition modelling for Northern Ireland.",
  anaerobicDigestion:
    "Anaerobic digestion (AD) captures methane from slurry that would otherwise be released to atmosphere. The 21 kt nominal figure assumes 6% of managed slurry enters AD at 55% methane capture efficiency. Where slurry aeration is also enabled, the actual saving is lower: a residual pool approach is applied so the two measures do not draw from the same emissions twice.",
};
