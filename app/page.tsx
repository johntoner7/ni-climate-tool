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

  return (
    <div className="bg-white text-gray-900">

      {/* ── Hero ── */}
      <header className="min-h-screen flex items-center bg-[#FFF9F5] border-b border-[#e8e0d8] px-8 lg:px-16 py-12 lg:py-20 hero-fade-in">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row lg:gap-0 gap-10">

          {/* Left column */}
          <div className="lg:w-[55%] lg:pr-16 flex flex-col justify-between gap-8 lg:gap-0">
            <div>
              <p className="text-xs tracking-widest uppercase text-[#666666] mb-4">
                Northern Ireland Climate Analysis
              </p>
              <h1 className="text-[28px] lg:text-[42px] font-bold leading-tight text-[#1a1a1a] max-w-[520px]">
                NI cut emissions by 31.5% since 1990.
                Agriculture went the other way.
              </h1>
              <p className="text-lg text-[#444444] mt-5 max-w-[480px] leading-relaxed">
                Almost all of that reduction came from electricity — a UK-wide shift
                that happened to Northern Ireland. The sector Stormont controls most
                directly has increased emissions by 8% over the same period.
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
              <p className="text-sm text-[#999999]">
                Scroll to explore ↓
              </p>
            </div>
          </div>

          {/* Right column — stat cards */}
          <div className="lg:w-[45%] lg:pl-8 lg:border-l border-[#e8e0d8] flex flex-col divide-y divide-[#e8e0d8]">
            <div className="pb-6 lg:pt-0">
              <p className="text-[11px] uppercase tracking-widest text-[#666666] mb-1">
                Agriculture Change Since 1990
              </p>
              <p className="text-[36px] font-bold text-[#c1440e] leading-none my-1">+8%</p>
              <p className="text-sm text-[#666666]">
                Every other major sector has fallen
              </p>
            </div>
            <div className="py-6">
              <p className="text-[11px] uppercase tracking-widest text-[#666666] mb-1">
                Share of NI Emissions
              </p>
              <p className="text-[36px] font-bold text-[#c1440e] leading-none my-1">30.8%</p>
              <p className="text-sm text-[#666666]">
                Three times the UK average of ~10%
              </p>
            </div>
            <div className="py-6">
              <p className="text-[11px] uppercase tracking-widest text-[#666666] mb-1">
                Cattle in Northern Ireland
              </p>
              <p className="text-[36px] font-bold text-[#1a1a1a] leading-none my-1">1.67m</p>
              <p className="text-sm text-[#666666]">
                One animal for every 1.1 people
              </p>
            </div>
            <div className="pt-6">
              <p className="text-[11px] uppercase tracking-widest text-[#666666] mb-1">
                2030 Gap to Close
              </p>
              <p className="text-[36px] font-bold text-[#1a1a1a] leading-none my-1">612kt</p>
              <p className="text-sm text-[#666666]">
                CO₂e — equivalent to 270,000 cars, permanently
              </p>
            </div>
          </div>

        </div>
      </header>
      {/* ── Scrollytelling ── */}
      {/*
        Mobile  (< lg): flex-col — chart panel stacks first (order-1),
                         steps scroll below (order-2).
        Desktop (≥ lg): flex-row — steps on left (order-1), chart on right (order-2).
      */}
      <div className="flex flex-col lg:flex-row">

        {/* Steps — below chart on mobile, left column on desktop */}
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
                  {String(step.id).padStart(2, "0")}&thinsp;/&thinsp;11
                </span>
                <p className="text-[11px] uppercase tracking-widest text-[#666666] mb-3">
                  {step.eyebrow}
                </p>
                {step.copy.split("\n\n").map((para, i) => (
                  <p key={i} className="text-[15px] leading-[1.9] text-gray-600 mb-3 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Chart panel — sticky at top on mobile, sticky right column on desktop */}
        <div className="order-1 lg:order-2 w-full lg:w-[65%] sticky top-0 h-[50vh] lg:h-screen flex flex-col px-5 lg:px-8 py-4 lg:py-6 lg:border-l border-gray-100 bg-white overflow-hidden z-10">

          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 lg:mb-4 shrink-0">
            {CHART_LABELS[activeChart]}
          </p>

          {/* key={activeChart} remounts on chart change, triggering the CSS fade-in */}
          <div key={`${activeChart}-${activeStep >= 10 ? "scenario" : "base"}`} className="flex-1 min-h-0 flex items-center chart-fade-in">
            <div className="w-full h-full">
              {activeChart === 1 && <SectorAreaChart activeStep={activeStep} />}
              {activeChart === 2 && <NationsLineChart />}
              {activeChart === 3 && (
                activeStep >= 10
                  ? <ScenarioModeller />
                  : <ProjectionChart activeStep={activeStep} />
              )}
              {activeChart === 4 && <SectorGrid activeStep={activeStep} />}
              {activeChart === 5 && <GasCompositionChart className="w-full h-full overflow-y-auto" />}
            </div>
          </div>

          {/* Progress dots — desktop only */}
          <div className="hidden lg:flex shrink-0 items-center justify-between mt-3 lg:mt-4">
            <span className="text-[10px] font-mono text-gray-300 tabular-nums">
              {String(activeStep).padStart(2, "0")}&thinsp;/&thinsp;11
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: 11 }, (_, i) => (
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

      {/* ── Footer ── */}
      <footer className="max-w-2xl mx-auto px-8 py-14 mt-8 border-t border-gray-100">
        <p className="text-[11px] text-gray-400 leading-relaxed max-w-[60ch]">
          <span className="text-gray-500 font-medium">Data:</span> National
          Atmospheric Emissions Inventory (NAEI), GWP AR5. All figures in kt
          CO₂e. Projections use linear regression on 2018–2023 actuals per
          sector. 2030 target: 48% reduction from 1990 baseline (NI Climate
          Change Act 2022). DAERA projections not used due to GWP mismatch (AR4
          vs AR5).
        </p>
        <p className="text-[11px] text-gray-400 leading-relaxed max-w-[60ch] mt-3">
          <a href="https://rivers.climategapni.com" className="hover:text-gray-600 underline">
            Rivers Map — explore Northern Ireland&apos;s river network and flow data
          </a>
        </p>
      </footer>

    </div>
  );
}
