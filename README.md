# NI Climate Tool

A scrollytelling data tool that explains Northern Ireland's emissions gap and lets users model the interventions available to close it.

The tool covers:
- Historical emissions by sector (1990–2023), sourced from the NAEI Devolved GHG Inventory
- A comparison of agricultural emissions across UK nations
- Northern Ireland's trajectory against its legally binding 2030 target
- An interactive scenario modeller for agricultural interventions (Bovaer, slurry aeration, herd reduction, etc.)

A full methodology, including data sources, GWP basis, and intervention estimates, is available at `/methodology`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Key files

| Path | Purpose |
|---|---|
| `lib/steps.ts` | Scrollytelling copy and chart assignments |
| `lib/sliderTooltipContent.ts` | Tooltip text for each scenario modeller intervention |
| `components/ScenarioModeller.tsx` | Interactive modeller logic and UI |
| `components/Hero.tsx` | Hero stat cards |
| `public/data/ni_sectors.json` | Historical emissions data (NAEI 1990–2023) |
| `content/methodology.md` | Full methodology notes |

## Data

All historical figures use NAEI AR5 GWP100 values. The DAERA Draft Climate Action Plan uses AR4 values; where DAERA pathway data appears, it is rebased to the shared 2023 NAEI anchor to eliminate the GWP discrepancy. See `/methodology` for detail.

## Stack

Next.js 16, React 19, Recharts, Tailwind CSS, Scrollama.
