"use client";

import { useState, useEffect } from "react";
import SectorAreaChart from "@/components/charts/SectorAreaChart";
import NationsLineChart from "@/components/charts/NationsLineChart";
import ProjectionChart from "@/components/charts/ProjectionChart";
import SectorGrid from "@/components/charts/SectorGrid";
import ScenarioModeller from "@/components/ScenarioModeller";
import GasCompositionChart from "@/components/charts/GasCompositionChart";
import { STEPS } from "@/lib/steps";

type ChartId = 1 | 2 | 3 | 4 | 5;

const CHART_LABELS: Record<ChartId, string> = {
  1: "NI Emissions by Sector, 1990–2023",
  2: "UK Nations Comparison (1990 = 100)",
  3: "NI Emissions: Actuals & Projection to 2030",
  4: "Sector-level Projections to 2030",
  5: "Agricultural Greenhouse Gas Composition",
};

const HERO_STATS = [
  {
    label: "Agriculture Change Since 1990",
    value: "+8%",
    description: "Every other major sector has fallen",
    isHighlight: true,
  },
  {
    label: "Share of NI Emissions",
    value: "30.8%",
    description: "Three times the UK average of ~10%",
    isHighlight: true,
  },
  {
    label: "Cattle in Northern Ireland",
    value: "1.67m",
    description: "One animal for every 1.1 people",
    isHighlight: false,
  },
  {
    label: "2030 Gap to Close",
    value: "612kt",
    description: "CO₂e — equivalent to 270,000 cars, permanently",
    isHighlight: false,
  },
];

const TOTAL_STEPS = 11;

export default function Home() {
  const [activeChart, setActiveChart] = useState<ChartId>(1);
  const [activeStep, setActiveStep] = useState<number>(1);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const scrollamaModule = require("scrollama");
    const scrollama = scrollamaModule.default ?? scrollamaModule;
    const scroller = scrollama();

    scroller
      .setup({ step: ".step", offset: 0.5 })
      .onStepEnter(({ element }: { element: HTMLElement }) => {
        const step = parseInt(element.dataset.step ?? "1", 10);
        const chart = parseInt(element.dataset.chart ?? "1", 10) as ChartId;
        setActiveStep(step);
        setActiveChart(chart);
      });

    const handleResize = () => scroller.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      scroller.destroy();
    };
  }, []);

  const renderChart = () => {
    switch (activeChart) {
      case 1:
        return <SectorAreaChart activeStep={activeStep} />;
      case 2:
        return <NationsLineChart />;
      case 3:
        return activeStep >= 10 ? (
          <ScenarioModeller />
        ) : (
          <ProjectionChart activeStep={activeStep} />
        );
      case 4:
        return <SectorGrid activeStep={activeStep} />;
      case 5:
        return <GasCompositionChart className="w-full h-full overflow-y-auto" />;
    }
  };

  return (
    <div className="bg-white text-gray-900">
      <Hero />

      <div className="flex flex-col lg:flex-row">
        <StepsColumn />

        <div className="order-1 lg:order-2 w-full lg:w-[65%] sticky top-0 h-[50vh] lg:h-screen flex flex-col px-5 lg:px-16 py-4 lg:py-6 lg:border-l border-gray-100 bg-white overflow-hidden z-10">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 lg:mb-4 shrink-0">
            {CHART_LABELS[activeChart]}
          </p>

          <div
            key={`${activeChart}-${activeStep >= 10 ? "scenario" : "base"}`}
            className="flex-1 min-h-0 flex items-center justify-center chart-fade-in"
          >
            <div className="w-full h-full">{renderChart()}</div>
          </div>

          <div className="hidden lg:flex shrink-0 items-center justify-between mt-3 lg:mt-4">
            <span className="text-[10px] font-mono text-gray-300 tabular-nums">
              {String(activeStep).padStart(2, "0")}&thinsp;/&thinsp;{TOTAL_STEPS}
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                    i + 1 === activeStep ? "bg-gray-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <header className="min-h-screen flex items-center bg-[#FFF9F5] border-b border-[#e8e0d8] px-8 lg:px-16 py-12 lg:py-20 hero-fade-in">
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row lg:gap-0 gap-10">
        {/* Left Column */}
        <div className="lg:w-[55%] lg:pr-16 flex flex-col justify-between gap-8 lg:gap-0">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#666666] mb-4">
              Northern Ireland Climate Analysis
            </p>
            <h1 className="text-[28px] lg:text-[42px] font-bold leading-tight text-[#1a1a1a] max-w-[520px]">
              NI cut emissions by 31.5% since 1990. Agriculture went the other
              way.
            </h1>
            <p className="text-lg text-[#444444] mt-5 max-w-[480px] leading-relaxed">
              Almost all of that reduction came from electricity — a UK-wide
              shift that happened to Northern Ireland. The sector Stormont
              controls most directly has increased emissions by 8% over the same
              period.
            </p>
            <p className="text-base text-[#666666] mt-4 max-w-[480px] leading-relaxed">
              1.67 million cattle. A dairy herd that expanded after milk quotas
              were abolished in 2015. A 2030 target that mathematics says cannot
              be met without structural change to agriculture.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-[#666666]">
              Data: DAERA / NISRA NI Greenhouse Gas Inventory 1990–2023
            </p>
            <p className="text-sm text-[#999999]">Scroll to explore ↓</p>
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="lg:w-[45%] lg:pl-8 lg:border-l border-[#e8e0d8] flex flex-col divide-y divide-[#e8e0d8]">
          {HERO_STATS.map((stat, idx) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              description={stat.description}
              isHighlight={stat.isHighlight}
              isFirst={idx === 0}
              isLast={idx === HERO_STATS.length - 1}
            />
          ))}
        </div>
      </div>
    </header>
  );
}

function StatCard({
  label,
  value,
  description,
  isHighlight,
  isFirst,
  isLast,
}: {
  label: string;
  value: string;
  description: string;
  isHighlight: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className={`${isFirst ? "pb-6 lg:pt-0" : isLast ? "pt-6" : "py-6"}`}>
      <p className="text-[11px] uppercase tracking-widest text-[#666666] mb-1">
        {label}
      </p>
      <p
        className={`text-[36px] font-bold leading-none my-1 ${
          isHighlight ? "text-[#c1440e]" : "text-[#1a1a1a]"
        }`}
      >
        {value}
      </p>
      <p className="text-sm text-[#666666]">{description}</p>
    </div>
  );
}

function StepsColumn() {
  return (
    <div className="order-2 lg:order-1 w-full lg:w-[35%]">
      {STEPS.map((step) => (
        <div
          key={step.id}
          className="step min-h-[75vh] lg:min-h-screen flex items-center px-8 lg:px-12"
          data-step={step.id}
          data-chart={step.chart}
        >
          <div className="max-w-[480px]">
            <span className="text-[10px] font-mono text-gray-300 tabular-nums tracking-widest mb-4 block">
              {String(step.id).padStart(2, "0")}&thinsp;/&thinsp;{TOTAL_STEPS}
            </span>
            <p className="text-[11px] uppercase tracking-widest text-[#666666] mb-3">
              {step.eyebrow}
            </p>
            {step.copy.split("\n\n").map((para, i) => (
              <p
                key={i}
                className="text-[15px] leading-[1.9] text-gray-600 mb-3 last:mb-0"
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="max-w-2xl mx-auto px-8 py-14 mt-8 border-t border-gray-100">
      <p className="text-[11px] text-gray-400 leading-relaxed max-w-[60ch]">
        <span className="text-gray-500 font-medium">Data:</span> National
        Atmospheric Emissions Inventory (NAEI), GWP AR5. All figures in kt CO₂e.
        Projections use linear regression on 2018–2023 actuals per sector. 2030
        target: 48% reduction from 1990 baseline (NI Climate Change Act 2022).
        DAERA projections not used due to GWP mismatch (AR4 vs AR5).
      </p>
    </footer>
  );
}
