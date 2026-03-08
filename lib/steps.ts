export type Step = {
  id: number;
  chart: 1 | 2 | 3 | 4 | 5 | 6;
  eyebrow: string;
  copy: string;
  cta?: string;
};

import { UK_AGRI_SHARE_AVERAGE } from "./constants";

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
    copy: "Almost all of the reduction came from electricity. The conversion of Ballylumford and Coolkeeragh power stations from oil to gas, the growth of onshore wind under the Northern Ireland Renewables Obligation, and the end of coal-fired generation at Kilroot in 2023 together drove a 60% reduction in the electricity sector since 1990.\n\nThe electricity transition has been important. But it was not something Stormont could easily repeat in other sectors."

  },
  {
    id: 3,
    chart: 1,
    eyebrow: "THE EXCEPTION",
    copy: `Several sectors have reduced only modestly. Buildings has barely changed. Two sectors have gone in the wrong direction entirely.\n\nTransport emissions have increased by around 5% since 1990. Agriculture has increased by 8%, reaching 5.6 million tonnes per year. Agriculture now accounts for 30.8% of everything Northern Ireland emits. The UK average is ${UK_AGRI_SHARE_AVERAGE}%.`,
  },
  {
    id: 4,
    chart: 5,
    eyebrow: "WHERE AGRICULTURE'S EMISSIONS COME FROM",
    copy: "The chart shows what drives NI's agricultural emissions. More than half \ncomes from a single source: enteric fermentation, the methane produced in \nthe digestive systems of cattle and sheep.",
  },
  {
    id: 5,
    chart: 2,
    eyebrow: "NORTHERN IRELAND IS THE OUTLIER",
    copy: "Every other UK nation has reduced agricultural emissions since 1990. England has reduced by 18%, Scotland by 13%, and Wales by 13%.\n\nNorthern Ireland is up 8%.\n\nThe other nations faced similar pressures and still reduced.",
  },
  {
    id: 6,
    chart: 1,
    eyebrow: "THE STRUCTURAL CAUSE",
    copy: "In April 2015, the EU abolished milk quotas that had capped dairy production across Europe for three decades. Northern Ireland's dairy sector expanded in the years that followed, and agricultural emissions rose with it.",
  },
  {
    id: 7,
    chart: 3,
    eyebrow: "THE TARGET",
    copy: "The Climate Change Act (Northern Ireland) 2022 sets a legally binding target of a 48% reduction in total emissions by 2030.\n\nThat means cutting from 18.2 million tonnes to 13.8 million tonnes, a reduction of 4.4 million tonnes of CO₂ equivalent. To put that in context, it is roughly equal to Northern Ireland's entire annual output from transport.",
  },
  {
    id: 8,
    chart: 3,
    eyebrow: "THE GAP",
    copy: "On current trends, Northern Ireland will miss that target by approximately 1.73 million tonnes.\n\n No current policy sets out a credible plan to close the gap.",
  },
  {
    id: 9,
    chart: 6,
    eyebrow: "THE PLAN THAT ISN'T",
    copy: "The Climate Change Committee advised that meeting the 2030 target requires a 22% reduction in dairy cattle numbers and 17% in beef cattle, compared to 2020 levels.\n\nThe draft Climate Action Plan takes a different approach. It proposes a 7% reduction in cattle numbers through productivity improvements, including faster slaughter ages and tighter calving intervals, while maintaining output. It does not explain how the remaining gap is closed.",
  },
  {
    id: 10,
    chart: 5,
    eyebrow: "WHAT COULD CHANGE THIS",
    copy: "The emissions gap is 1.73 million tonnes. The interventions exist: feed \nadditives, slurry aeration, protected urea, peatland restoration, genetics \nprogrammes, herd reduction. Some are already in the draft plan at modest scale.\n\nThe scenario modeller below lets you test each intervention individually or \ncombine them. How much of the gap can technology close without touching herd \nsize? What does closing it entirely require?",
    cta: "#scenario",
  },
];