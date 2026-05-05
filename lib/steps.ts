export type Step = {
  id: number;
  chart: 1 | 2 | 3 | 4 | 5;
  eyebrow: string;
  copy: string; // paragraphs separated by \n\n
};

export const STEPS: Step[] = [
  {
    id: 1,
    chart: 1,
    eyebrow: "THE HEADLINE",
    copy: "Northern Ireland has cut greenhouse gas emissions by 31.5% since the 1990 baseline — from 26.6 million tonnes to 18.2 million tonnes of CO₂ equivalent.\n\nThat sounds like meaningful progress. Look at what's actually driving it.",
  },
  {
    id: 2,
    chart: 1,
    eyebrow: "WHERE THE REDUCTION CAME FROM",
    copy: "Most of the long-term fall came from electricity generation, which has cut emissions dramatically as renewables replaced coal and oil-fired power stations across the UK grid. By the end of 2023, nearly half of NI's electricity was generated from renewable sources — primarily wind.\n\nNorthern Ireland's power system is tightly integrated with the wider UK energy market, so much of this shift reflects broader UK-wide energy transition dynamics alongside local policy. Strip out electricity, and NI's emissions record looks very different.",
  },
  {
    id: 3,
    chart: 1,
    eyebrow: "THE EXCEPTION",
    copy: "Agriculture is the sector Stormont controls most directly, through subsidies, planning policy, and land use decisions. It is the only major sector that has gone in the wrong direction.\n\nSince 1990, agricultural emissions have increased by 8%, reaching 5,615,000 tonnes per year. Agriculture now accounts for 30.8% of everything Northern Ireland emits. The UK average is around 10%. NI's share is three times that.\n\nAlmost all of those emissions are methane and nitrous oxide, gases produced directly by livestock.",
  },
  {
    id: 4,
    chart: 5,
    eyebrow: "WHAT CATTLE ACTUALLY EMIT",
    copy: "The mechanism matters. When cattle digest grass and silage, microbes in their stomachs produce methane, a process called enteric fermentation. Each cow belches approximately 70–120kg of methane per year. Across NI's 1.67 million cattle, this adds up to thousands of tonnes daily.\n\nMethane is roughly 80 times more potent than CO₂ over a 20-year period, according to the IPCC's Sixth Assessment Report. It breaks down faster than CO₂, within about a decade, which means reducing it produces near-immediate climate benefits. But it also means every year of continued high emissions is warming the planet significantly right now.\n\nThe second major source is nitrous oxide from slurry, manure spread on fields, and synthetic fertilisers, a gas approximately 273 times more potent than CO₂ over 100 years.",
  },
  {
    id: 5,
    chart: 2,
    eyebrow: "COMPARED TO EVERYWHERE ELSE",
    copy: "Every other UK nation has reduced agricultural emissions since 1990. England is down 16%. Scotland down 22%. Wales down 14%.\n\nNorthern Ireland: up 8%.\n\nThis comparison refers to agricultural emissions specifically. The pattern is not uniform across the UK; Northern Ireland has diverged from the direction of travel elsewhere for over three decades.",
  },
  {
    id: 6,
    chart: 1,
    eyebrow: "WHY: THE DAIRY EXPANSION",
    copy: "EU milk quotas, introduced in 1984 to prevent overproduction, were abolished in April 2015. In Northern Ireland, as in the Republic of Ireland, this triggered rapid expansion of the dairy herd. Dairy cow numbers increased to 319,346 by 2023 (a post-quota high) while total cattle reached 1.67 million.\n\nThe expansion was not an accident. It was encouraged by subsidy structures and government agricultural policy that rewarded production volume over environmental performance. More cows producing more milk means more methane, year after year.\n\nThis is why NI's agricultural emissions have moved in the opposite direction from every other UK region: the sector that should have been decarbonising was actively expanding instead.",
  },
  {
    id: 7,
    chart: 3,
    eyebrow: "THE TARGET",
    copy: "The Climate Change Act (Northern Ireland) 2022 sets a legally binding target: a 48% reduction in emissions by 2030, advised by the independent UK Climate Change Committee.\n\nThat means cutting from 18.2 million tonnes to 13.8 million tonnes, a reduction of 4.4 million tonnes in seven years.\n\nTo put that in context: achieving that reduction in full would be equivalent to permanently removing every car in Northern Ireland from the road, more than twice over.",
  },
  {
    id: 8,
    chart: 3,
    eyebrow: "THE GAP",
    copy: "On a continuation of long-run trends, Northern Ireland is projected to miss that target by around 612,000 tonnes. This projection is a simple linear extrapolation of historical emissions and does not assume additional future policy change.\n\n612kt is roughly equivalent to taking 270,000 cars off the road permanently, or the total annual emissions of a mid-sized Northern Ireland city.\n\nIt took 33 years to cut 8.4 million tonnes, much of it from electricity generation. NI now needs to cut 4.4 million in seven years, and agriculture, the largest and most structurally challenging sector, is still rising.",
  },
  {
    id: 9,
    chart: 4,
    eyebrow: "THE SECTORS STORMONT CONTROLS",
    copy: "The Climate Change Committee's March 2023 advice to Stormont indicates that significant reductions in livestock numbers are likely to be required for Northern Ireland to reach net zero. The Committee has also noted there is no purely technical reason why net zero is not achievable; the remaining barriers are largely political and structural.\n\nNorthern Ireland's draft Climate Action Plan 2023–2027 does not currently set out a policy pathway that would deliver a substantial reduction in herd size.\n\nThis leaves a material gap between long-term targets and currently specified policy.",
  },
  {
    id: 10,
    chart: 3,
    eyebrow: "WHAT WOULD IT TAKE",
    copy: "Three interventions have the strongest evidence base for reducing NI's agricultural emissions at scale. Each is technically feasible. None is currently government policy.\n\nAdjust the sliders to see what the arithmetic actually requires, and what remains impossible without structural change to the herd.",
  },
  {
    id: 11,
    chart: 3,
    eyebrow: "THE QUESTION NOBODY IS ASKING",
    copy: "Deploying Bovaer across NI's entire dairy herd, at the reduced efficacy of around 12% observed in grass-based systems, closes less than a third of the gap. Restoring every viable hectare of degraded peatland adds another 8%. Together, at maximum deployment: about 39%.\n\nThe remaining gap cannot be fully closed by currently available feed additives, soil restoration, or efficiency improvements alone at scale.\n\nUnder central modelling assumptions (including typical enteric methane per animal), closing the gap entirely would be equivalent to reducing the cattle herd by roughly 317,000 animals. This is presented as a mathematical illustration of the scale of change implied by the 2030 target, not a policy prescription.\n\nWhat changes by 2030 that hasn't changed in 33 years?",
  },
];