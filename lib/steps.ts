export type Step = {
  id: number;
  chart: 1 | 2 | 3 | 4 | 5 | 6;
  eyebrow: string;
  copy: string;
};

export const STEPS: Step[] = [
  {
    id: 1,
    chart: 1,
    eyebrow: "THE HEADLINE",
    copy: "Northern Ireland has cut greenhouse gas emissions by 31.5% since 1990, from 26.6 million tonnes to 18.2 million tonnes of CO₂ equivalent.\n\nThat looks like meaningful progress, but not all sectors have reduced their emissions at the same rate.",
  },
  {
    id: 2,
    chart: 1,
    eyebrow: "WHERE THE REDUCTION CAME FROM",
    copy: "Almost all of it came from electricity. Northern Ireland invested heavily in onshore wind through its own renewables policy, and by 2023 nearly half of NI's electricity came from renewable sources.",
  },
  {
    id: 3,
    chart: 1,
    eyebrow: "THE EXCEPTION",
    copy: "Several sectors have reduced only modestly. Transport has fallen, but slowly. Buildings have barely moved.\n\nAgriculture is the only sector that has gone in the wrong direction entirely. Emissions have increased by 8% since 1990, reaching 5.6 million tonnes per year. Agriculture now accounts for 30.8% of everything Northern Ireland emits. The UK average is around 10%.",
  },
  {
    id: 4,
    chart: 5,
    eyebrow: "WHAT THAT MEANS IN PRACTICE",
    copy: "Almost all of those agricultural emissions come from livestock. Cattle produce methane through digestion, with each animal emitting roughly 70 to 120kg per year. Across NI's 1.67 million cattle, that accumulates fast.\n\nMethane is approximately 80 times more potent than CO₂ over 20 years. Nitrous oxide, from slurry and fertiliser, is 273 times more potent over 100 years. Every year of high emissions is warming the planet now.",
  },
  {
    id: 5,
    chart: 2,
    eyebrow: "NORTHERN IRELAND IS THE OUTLIER",
    copy: "Every other UK nation has reduced agricultural emissions since 1990. England down 16%. Scotland down 22%. Wales down 14%.\n\nNorthern Ireland is up 8%.\n\nThe other nations faced similar pressures and still reduced.",
  },
  {
    id: 6,
    chart: 3,
    eyebrow: "THE TARGET",
    copy: "The Climate Change Act (Northern Ireland) 2022 sets a legally binding target of a 48% reduction in total emissions by 2030.\n\nThat means cutting from 18.2 million tonnes to 13.8 million tonnes. To put that in scale: 4.4 million tonnes is almost three times the entire annual emissions of Belfast.",
  },
  {
    id: 7,
    chart: 3,
    eyebrow: "THE GAP",
    copy: "On current trends, Northern Ireland will miss that target by approximately 612,000 tonnes.\n\nThat gap is roughly equal to the total annual emissions of every home in Belfast.",
  },
  {
    id: 8,
    chart: 4,
    eyebrow: "THE PLAN THAT ISN'T",
    copy: "The Climate Change Committee advised that meeting the 2030 target requires significant reductions in cattle numbers — 22% fewer dairy cattle and 17% fewer beef cattle by 2030.\n\nThe draft Climate Action Plan takes a different approach. It proposes a 7% reduction in cattle numbers through productivity improvements, including faster slaughter ages and tighter calving intervals, while maintaining output. It does not explain how the remaining gap is closed.",
  },
  {
    id: 9,
    chart: 6,
    eyebrow: "WHAT WOULD IT TAKE",
    copy: "Several interventions could credibly reduce agricultural emissions before 2030. Bovaer requires near-universal uptake across dairy and beef herds. Slurry aeration requires capital grants that don't yet exist at scale. Protected urea requires changing entrenched fertiliser habits across thousands of farms. Peatland restoration requires taking land out of agricultural use. Genetics programmes take a generation of breeding to show results.\n\nThe modeller lets you test what different combinations of these interventions actually mean for the 2030 target. The committed policy baseline is already applied.",
  },
  {
    id: 10,
    chart: 6,
    eyebrow: "THE ARITHMETIC",
    copy: "The tools exist. At maximum deployment of every available measure simultaneously, the gap can be closed on paper — but only if near-universal adoption occurs across an industry that has increased its emissions over the last three decades.\n\nThe arithmetic points to herd reduction. No current policy says so.",
  },
];