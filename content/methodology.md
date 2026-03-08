# NI Climate Tool - Methodology

## 01 - Primary Data Source

All historical emissions figures are drawn from the National Atmospheric Emissions Inventory (NAEI) - Devolved Administration Greenhouse Gas Inventories, 1990–2023, published by the Department for Energy Security and Net Zero (DESNZ). Figures are expressed in kilotonnes of
 CO₂ equivalent (kt CO₂e) using AR5 100-year Global Warming Potential (GWP100) values throughout.

The NAEI is the legally defined measurement basis for Northern Ireland's carbon budget compliance under the Climate Change (Northern Ireland) Act 2022. It supersedes older DAERA/NISRA inventory publications for the purposes of this tool.

| Dataset | Coverage | Resolution | GWP basis |
|---|---|---|---|
| NAEI Devolved Admin Inventories | 1990–2023 | Annual, by sector | AR5 |
| DAERA/NISRA NI GHG Inventory | 1990–2022 | Annual, by sector | AR4 (legacy) |
| Draft NI Climate Action Plan 2023–27 | 2023–2027 projections | Annual, by sector | AR4 |
| CCC 'Path to Net Zero NI' (2023) | Pathway to 2050 | Annual, agriculture | AR5 |

---

## 02 - GWP Basis and the AR4/AR5 Discrepancy

A material discrepancy exists between the two principal sources used in this tool. DAERA's Draft Climate Action Plan 2023–2027 uses AR4 GWP100 values for methane (CH₄ = 25) and nitrous oxide (N₂O = 298). The NAEI uses AR5 GWP100 values (CH₄ = 28, N₂O = 265). Because agriculture's emissions profile is dominated by methane and nitrous oxide, this difference produces a meaningful offset between the two series.

This tool resolves the discrepancy as follows:

- **Historical actuals (all charts):** NAEI AR5 values are used throughout. DAERA AR4 projections are not plotted directly.
- **Agriculture Pathway Chart (Chart 6):** The DAERA and CCC pathway values sourced from Draft CAP Table 21 (2023–2027) are rebased to the NAEI 2023 actual (5,615 kt). Both series are expressed as proportional changes from this shared anchor point, preserving the relative divergence between the two pathways while eliminating the GWP-basis offset.
- **Scenario Modeller:** All arithmetic uses the NAEI 2023 actual as the baseline. Intervention efficacy estimates are applied as proportional reductions to NAEI-basis emission pools.

DAERA projections are not used as absolute figures anywhere in this tool. Where DAERA pathway data is displayed, it is always expressed relative to the shared 2023 NAEI anchor.

---

## 03 - Sector Classification

Northern Ireland's emissions are grouped into six sectors following the NAEI source classification, consolidated for presentational clarity:

| Sector | NAEI source categories included |
|---|---|
| Agriculture | Enteric fermentation, manure management, agricultural soils, field burning |
| Transport | Road transport, domestic aviation, railways, shipping |
| Buildings | Residential combustion, commercial/institutional combustion |
| Industry | Industrial processes, manufacturing combustion, F-gases |
| Waste | Landfill, wastewater, waste incineration |
| Electricity | Public electricity and heat production |

Land use, land-use change and forestry (LULUCF) is excluded from the six-sector totals shown in Charts 1–4, consistent with standard practice for sector-level analysis. LULUCF appears only within the Scenario Modeller's peatland restoration slider, which is attributed to LULUCF separately.

---

## 04 - Total Emissions Projection to 2030

No official Northern Ireland total-emissions projection to 2030 exists in the public domain. The Draft Climate Action Plan covers only the first carbon budget period (2023–2027) and does not extend to the 2030 annual target.

The 2030 projection used in Chart 3 is derived by ordinary least squares (OLS) linear regression on NAEI Grand Total annual figures for 2018–2023 (six data points), extrapolated to 2030. The 2018 start point was chosen to exclude structural breaks caused by the 2008 recession and subsequent recovery while capturing the recent trend.

The six input values are taken directly from the NAEI Devolved Administration Greenhouse Gas Inventories 1990–2023:

| Year | NAEI Grand Total (kt CO2e, AR5) |
|---|---|
| 2018 | 21,033.4 |
| 2019 | 20,577.0 |
| 2020 | 19,863.2 |
| 2021 | 20,565.5 |
| 2022 | 19,606.3 |
| 2023 | 18,212.2 |

OLS on these six values yields a slope of -466.2 kt per year and an intercept of 961,864.1 kt, giving a 2030 projection of **15,548 kt CO2e**. Against the legally binding 2030 target of 13,814 kt CO2e (a 48% reduction from the 1990 baseline of 26,565 kt), this yields a projected gap of **1,734 kt CO2e**.

The sensitivity of the 2030 projection to alternative regression windows is shown below. All windows produce a gap in the range 1,463 to 1,992 kt; Northern Ireland is materially off track under every variant.

| Regression window | n | 2030 projection (kt) | Gap (kt) |
|---|---|---|---|
| 2015–2023 | 9 | 15,806 | 1,992 |
| 2016–2023 | 8 | 15,462 | 1,648 |
| 2017–2023 | 7 | 15,590 | 1,776 |
| **2018–2023 (used)** | **6** | **15,548** | **1,734** |
| 2019–2023 | 5 | 15,277 | 1,463 |

Linear regression on six data points carries significant uncertainty. The projection should be read as an indicative central estimate, not a precise forecast. The 2030 gap could be larger or smaller depending on delivery of policies already in the Draft CAP, economic conditions, and future policy decisions. DAERA's own sensitivity analysis (Draft CAP, Section 5.4) estimates +/-6% uncertainty in the underlying inventory figures.

Individual sector projections shown in the Sector Grid (Chart 4) apply the same OLS method independently to each sector using 2018–2023 NAEI actuals. These sector-level regressions are used for illustrative purposes only and are not summed to produce the Chart 3 total.

---

## 05 - Agriculture Baseline: Two Coexisting Assumptions

The tool uses two different baseline assumptions for agriculture, applied in different contexts. This is intentional and documented here in full.

**Sector Grid (Chart 4): Linear regression.** The Sector Grid applies OLS regression on 2018–2023 NAEI agriculture actuals uniformly, consistent with the method applied to all other sectors. The agriculture series shows a positive slope over this window (+6.1 kt/year), projecting to approximately 5,751 kt by 2030. This reflects a modest upward trend in the 2018–2023 period driven partly by a spike in 2021 (5,861 kt) before returning to 5,615 kt in 2023.

**Scenario Modeller: Flat hold at 5,615 kt.** The Scenario Modeller holds agricultural emissions constant at the 2023 NAEI actual of 5,615 kt through to 2030. This is a deliberate modelling choice. Agriculture ended 2023 at approximately the same level it was at in 2020 (5,684 kt), having risen sharply in 2021 and fallen back. Extrapolating the 2018–2023 regression line - which is pulled upward by the 2021 spike - would project a 2030 baseline of 5,751 kt, overstating the likely trend. The flat hold treats the 2023 actual as the most defensible neutral starting point, avoiding the risk of baking a single anomalous year into a seven-year projection.

It is important to note that this makes the flat-hold a more cautious assumption in one direction only: it produces a smaller agriculture gap (1,125 kt) than OLS regression would (approximately 1,261 kt; 5,751 kt projected baseline minus 4,490 kt target). The flat hold does not overstate the intervention required - if anything, it understates it relative to what the recent trend line implies. Both assumptions are presented transparently within their respective contexts.

The 2021 spike in agriculture emissions (5,861 kt, the highest recorded value in the series) is not explained by any single documented policy event. It likely reflects a combination of herd size fluctuations and fertiliser application patterns in the post-pandemic period. It does not alter the fundamental picture - agriculture ended 2023 higher than it started in 1990 - but it does affect regression-based projections materially.

---

## 06 - Agriculture Pathway Chart (Chart 6): DAERA vs CCC

Chart 6 compares two agriculture emission pathways to 2030. The DAERA pathway is derived from Draft Northern Ireland Climate Action Plan 2023–2027, Table 21 (agriculture sector projections, 2023–2027), with the 2028–2030 segment extrapolated by OLS on the 2023–2027 table values. The CCC pathway is derived from the Climate Change Committee, 'The path to a Net Zero Northern Ireland' (2023), Stretch Ambition scenario, with the 2028–2030 segment extrapolated by OLS on available CCC annual values.

Both series are rebased to the NAEI 2023 actual (5,615 kt) to correct for the AR4/AR5 GWP mismatch (see Section 02). Solid lines indicate values sourced directly from published tables (2023–2027); dashed lines indicate extrapolated values (2028–2030). A vertical reference line marks 2027, the end of the first carbon budget period.

---

## 07 - Scenario Modeller: Intervention Assumptions

The Scenario Modeller calculates the combined emissions reduction from up to eight simultaneous interventions applied to the agriculture baseline of 5,615 kt CO₂e. A committed policy baseline of 242 kt is pre-applied, representing five structural efficiency measures already included in the Draft CAP 2023–2027 and not subject to user control: the Beef Carbon Reduction Scheme (age at slaughter), the Suckler Cow Scheme (calving intervals), dairy age at first calving, dairy calving interval, and increased proportion of beef cattle finished as young bulls. This figure is the sum of their projected 2027 annual reductions as reported in the Draft CAP quantification report (Annex A, Table 3.7.6) and is treated as a point estimate. The Draft CAP's own sensitivity analysis (Section 5.4) identifies delivery risk across its policies and proposals; the 242 kt should therefore be understood as a central estimate rather than a guaranteed reduction. If these productivity improvements underdeliver, the effective user-adjustable gap would be larger than 633  kt.

**Feed additives - dairy and non-dairy cattle (Bovaer)**

The tool uses a 12% enteric methane reduction per animal, applied separately to dairy and non-dairy cattle enteric emission pools (~1,760 kt and ~1,440 kt respectively). DAERA's Draft CAP quantification assumes 20% (Annex A, Table 3.7.4), but that figure does not differentiate by housing system and likely reflects housed/TMR trial conditions. NI cattle spend a significant portion of the year at pasture, where supplement delivery is constrained to twice-daily parlour dosing rather than continuous feed mixing. Muñoz-Tamayo et al. (2024) recorded approximately 5% daily methane reduction under twice-daily grazing delivery — substantially below TMR efficacy. The 12% used here sits between that pastoral lower bound and the housed-system evidence, reflecting NI's partially-housed system. It is conservative relative to DAERA's assumption; scenarios using this tool therefore understate reductions relative to the Draft CAP's own modelling. Maximum adoption is capped at 90% to reflect practical limits of herd-level delivery in pastoral systems.

**Slurry aeration**
*Source: AFBI (Agri-Food and Biosciences Institute) and Teagasc field trials.*

Aeration of liquid slurry stores is modelled as a 40% reduction in methane emissions per treated unit, consistent with the figure cited in the Draft CAP quantification report (Annex A), which draws on AFBI and Teagasc field trials. Applied to the liquid slurry methane pool (~630 kt). The Draft CAP notes that aeration may increase ammonia emissions from slurry stores by approximately 20% depending on system design. This tool models only the methane reduction and does not account for that trade-off. The Draft CAP itself models a modest near-term deployment (a 50% increase on a current base of 1–2% of slurry aerated); the slider here extends to 80% adoption to allow users to explore the upper bound of what widespread deployment could achieve, well beyond current policy ambition.

**Protected urea fertiliser**
A switch from calcium ammonium nitrate (CAN) to protected urea fertiliser is modelled as delivering up to 59 kt CO₂e reduction per year at full adoption, derived by scaling the Draft CAP's quantified saving of 44 kt at 75% adoption (Annex A, Table 3.7.6) linearly to 100%. This intervention addresses nitrous oxide emissions from agricultural soils. The ceiling reflects NI-specific nitrogen application volumes and the current CAN/urea split in NI fertiliser use.

**Peatland restoration**

Modelled at 11 t CO₂e avoided per hectare per year, based on the UK Centre for Ecology and Hydrology's NI-specific analysis for the Draft CAP, which projects 111.8 kt of annual savings from 9,866 ha restored by 2027 (Annex A, Table 3.8.6). This figure represents avoided emissions from degraded peat, not active carbon sequestration. The 10,000 ha slider ceiling reflects the CCC's recommended target for peatland "on the road to recovery" by 2027, not the total restorable area. NI has an estimated 170,000 ha of degraded peatland in total. The Draft CAP itself flags substantial delivery risk: NI was restoring less than 100 ha/year in 2023–2024 and would need to reach approximately 2,750 ha/year by 2025 to meet this target. This intervention is attributed to the LULUCF sector and does not affect the agriculture emission pool directly.

**Cattle herd reduction**
Applied as a linear function of total cattle enteric fermentation emissions (3,157 kt CO₂e in 2023, approximated as ~3,200 kt; NAEI 2023). A 1% herd reduction yields approximately 32 kt of avoided emissions. This is a conservative treatment: it does not credit associated reductions in manure management emissions, which add a further ~766 kt CO₂e attributable to dairy and non-dairy cattle. The true per-head saving including manure is approximately 24% higher than the slider reflects. A reference marker is displayed at the ~21% threshold, the level at which this single intervention alone closes the adjusted agriculture gap on the enteric-only basis used here.

**Ruminant genetics (toggle)**
Modelled as a 17 kt reduction, derived from 0.15% annual methane reduction per animal through selective breeding over 7 years to 2030, at 50% national herd uptake, applied to the cattle enteric pool (~3,200 kt).

**Anaerobic digestion (toggle)**
Modelled as a 21 kt reduction, derived from diverting an additional 6% of total managed slurry to AD systems at 55% methane capture efficiency, applied to the liquid slurry methane pool (~630 kt). The Draft CAP models a similar scenario using a 50% uptake factor rather than a capture efficiency rate, yielding a slightly lower figure (approximately 19 kt); the tool's 21 kt should be treated as a marginal upper-bound estimate relative to the official quantification. Note: slurry aeration and anaerobic digestion both act on the same slurry methane pool. The model applies AD to the residual pool after slurry aeration is deducted. At maximum combined adoption, the combined figure should be treated as an upper-bound estimate.

---

## 08 - Agriculture Gap Calculation

- Baseline (2023 actual, flat-held to 2030): 5,615 kt
- CCC Stretch Ambition target (2030): 4,490 kt
- Gap: 1,125 kt

The target of 4,490 kt is derived by applying the CCC's Stretch Ambition reduction of 21% to the NAEI 2023 AR5 figure for NI agriculture in 2020 (5,684 kt): 5,684 × 0.79 = 4,490 kt. This is an advisory recommendation rather than a statutory sectoral limit. Northern Ireland's only legal obligation is an economy-wide 48% reduction from the 1990 baseline by 2030; the CCC Stretch Ambition target for agriculture is the Committee's recommendation for what the sector needs to contribute to make that economy-wide figure achievable, but DAERA is not legally required to meet it as a standalone sectoral figure.

The committed policy baseline of 242 kt is sourced from the Draft CAP's quantification of livestock productivity improvements projected across the first carbon budget period, reducing the user-adjustable gap to 883 kt. As noted in Section 07, this is a central estimate subject to delivery risk.

**Why this tool uses the Stretch Ambition target, not the Balanced Pathway.** The CCC published two scenarios for Northern Ireland: a Balanced Pathway and a more ambitious Stretch Ambition. This tool benchmarks against Stretch Ambition for three analytically grounded reasons. First, the CCC's own modelling shows that even Stretch Ambition leaves a residual shortfall against net zero by 2050; the Balanced Pathway falls further short. Second, Northern Ireland's agriculture sector accounts for 30.8% of total emissions - more than two and a half times the UK average of approximately 12% (NAEI, 2023, AR5 basis) - meaning any scenario that does not push agriculture hard simply transfers the deficit to sectors where NI has fewer policy levers available. Third, the Balanced Pathway's more modest agriculture reductions were predicated on offsetting action elsewhere in the economy, including land-use sinks and industrial decarbonisation, that NI's structural position makes harder to replicate at scale. Taken together, these factors make Stretch Ambition the more appropriate analytical benchmark for assessing whether NI's agriculture trajectory is compatible with its 2030 statutory target - not the most demanding benchmark available, but the minimum one consistent with the CCC's own assessment of what is required.

The CCC Balanced Pathway implies a smaller agriculture reduction than the Stretch Ambition's 21%, which would produce a correspondingly smaller gap figure. The exact Balanced Pathway kt figure is not independently verified here; users who wish to apply a less demanding benchmark should note that closing a smaller agriculture gap under the Balanced Pathway would require correspondingly larger reductions from other sectors that are already on declining trajectories.

---

## 09 - UK Nations Comparison (Chart 2)

Chart 2 displays agricultural emissions for England, Scotland, Wales, and Northern Ireland indexed to 1990 = 100, using NAEI devolved administration data on an AR5 GWP basis. The 1990 baseline values for each nation are taken directly from the NAEI inventory source CSVs and used as the denominator for all subsequent years. No boundary adjustments have been applied; the NAEI series is treated as consistent throughout the 1990–2023 period. The comparison shows NI's +8.0% increase against declines of −18.2% (England), −13.0% (Scotland), and −12.9% (Wales) over the 1990–2023 period. These figures have been verified directly against the NAEI source CSVs.

---

## 10 - Hero Section: Key Statistics

| Statistic | Value | Source / derivation |
|---|---|---|
| Agriculture change since 1990 | +8% | NAEI 2023 vs NAEI 1990, NI agriculture sector (AR5): 5,615 kt vs 5,199 kt |
| Share of NI total emissions | 30.8% | NAEI 2023: 5,615 kt ÷ 18,226 kt total |
| UK average agriculture share | ~12% | NAEI UK Devolved Administration Inventories, 2023 (AR5): 46,614 kt agriculture ÷ 384,973 kt total |
| Cattle in NI | 1.67 million | DAERA Agricultural Census 2023 |
| 2030 gap (total emissions) | 1,734 kt | OLS projection 15,548 kt minus legal target 13,814 kt |
| Car equivalent | 1,180,000 cars | 1,734,000 t CO₂e ÷ 1.47 t CO₂e/car/yr |
\
**Note on car equivalent:** The 1.47 t CO₂e/car/year figure is derived from DfT Vehicle Licensing Statistics, Table VEH0156 (average reported CO₂ emissions for cars registered for the first time, Great Britain and United Kingdom), combined with DfT annual average mileage estimates from traffic statistics table TRA0101. Calculation: 129.4 g/km × 11,427 km (7,100 miles) = approximately 1,478 kg CO₂/car/year, rounded to 1.47 t. VEH0156 reports the average for newly registered cars; the whole licensed fleet, which includes older higher-emitting vehicles, would produce a modestly higher per-car figure. The car-equivalent is therefore a slight underestimate, making it a conservative comparator. It is used for illustrative purposes only and should not be treated as a precise scientific conversion.

---

## 11 - Known Limitations and Caveats

**Projection uncertainty.** The 2030 total emissions projection is based on OLS regression over six years. Short regression windows amplify sensitivity to individual data points. The ±6% inventory uncertainty cited in the Draft CAP applies to underlying actuals, compounding projection uncertainty further.

**Double-counting risk.** Slurry aeration and anaerobic digestion both act on the liquid slurry methane pool. The model applies AD to the residual pool after slurry aeration is deducted. At high combined adoption, the combined reduction figure should nonetheless be treated as an upper-bound estimate rather than a precise projection.

**Herd reduction arithmetic.** The model applies herd reduction linearly to enteric fermentation only. In practice, reducing herd size also reduces manure management emissions, meaning the model understates the total per-head saving.

**Agriculture baseline discrepancy.** The Scenario Modeller uses a flat-hold baseline (5,615 kt) while Chart 4 uses a regression baseline that projects to approximately 5,751 kt by 2030. The implied agriculture gap differs by around 136 kt between sections. The flat-hold produces the smaller gap figure. Both assumptions are documented and the discrepancy is a consequence of choosing the most defensible assumption for each context rather than forcing consistency at the cost of accuracy.

**Bovaer pasture efficacy.** The 12% enteric methane reduction assumes consistent pasture-system supplement delivery. Efficacy may vary with housing patterns. The model uses a single fixed rate.

**Committed baseline delivery risk.** The 221 kt committed policy baseline is treated as a fixed reduction in the modeller. In practice, the Draft CAP's own sensitivity analysis identifies delivery risk across its quantified policies. If livestock productivity improvements underdeliver, the effective user-adjustable gap would be larger than 904 kt.

**CCC target is advisory.** The 1,125 kt agriculture gap is calculated against the CCC Stretch Ambition target, which is a recommendation rather than a legal requirement. The rationale for using Stretch Ambition rather than the CCC Balanced Pathway is set out in Section 08. Framing the gap against this target is analytically appropriate but readers should be aware that no statutory sectoral agriculture target exists for Northern Ireland.

**Data vintage.** This tool uses 2023 NAEI data. DAERA's Draft CAP references 2022 figures on an AR4 basis, creating numerical discrepancies resolved by rebasing as described in Section 02.

---

## 12 - References

1. DESNZ / NAEI (2024). *Devolved Administration Greenhouse Gas Inventories 1990–2023.* National Atmospheric Emissions Inventory.
2. DAERA / NISRA (2024). *Northern Ireland Greenhouse Gas Inventory 1990–2022.* Department of Agriculture, Environment and Rural Affairs.
3. DAERA (2024). *Draft Northern Ireland Climate Action Plan 2023–2027.* [Table 21; Section 5.4; p. 42; p. 158]
4. Climate Change Committee (2023). *The path to a Net Zero Northern Ireland.* CCC Advice Report.
5. DAERA (2023). *Agricultural Census 2023.* Northern Ireland cattle population statistics.
6. UK Peatland Code (v2.0). Carbon accounting methodology for peatland restoration projects. IUCN UK Peatland Programme.
7. Muñoz-Tamayo, R. et al. (2024). 'The effect of twice daily 3-nitroxypropanol supplementation on enteric methane emissions in grazing dairy cows.' Journal of Dairy Science, 107(11).
8. DAERA (2024). Draft Northern Ireland Climate Action Plan 2023–2027, p. 158. Department of Agriculture, Environment and Rural Affairs.
9. Department for Transport (2024). *Vehicle Licensing Statistics, Table VEH0156: Provisional average reported CO₂ emissions for cars registered for the first time, Great Britain and United Kingdom.* GOV.UK. Available at: https://www.gov.uk/government/statistical-data-sets/all-vehicles-veh01
10. Department for Transport (2024). *Road Traffic Statistics, Table TRA0101: Annual average mileage by vehicle type.* GOV.UK.