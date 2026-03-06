"use client";

import { useState, useEffect } from "react";
import SectorAreaChart from "@/components/charts/SectorAreaChart";
import NationsLineChart from "@/components/charts/NationsLineChart";
import ProjectionChart from "@/components/charts/ProjectionChart";
import SectorGrid from "@/components/charts/SectorGrid";
import ScenarioModeller from "@/components/ScenarioModeller";
import GasCompositionChart from "@/components/charts/GasCompositionChart";
import { STEPS } from "@/lib/steps";
import { CHART_LABELS } from "@/lib/chartLabels";
import Hero from "@/components/Hero";
import StepsColumn from "@/components/StepsColumn";
import Footer from "@/components/Footer";

type ChartId = 1 | 2 | 3 | 4 | 5;


function renderChartForStep(chartId: ChartId, stepId: number) {
  switch (chartId) {
    case 1: return <SectorAreaChart activeStep={stepId} />;
    case 2: return <NationsLineChart />;
    case 3: return <ProjectionChart activeStep={stepId} />;
    case 4: return <SectorGrid activeStep={stepId} />;
    case 5: return <GasCompositionChart className="w-full h-full flex flex-col justify-center items-center overflow-y-auto" />;
  }
}



const TOTAL_STEPS = 10;

export default function Home() {
  const [activeChart, setActiveChart] = useState<ChartId>(1);
  const [activeStep, setActiveStep] = useState<number>(1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return; // desktop only

    let scroller: any;
    let cancelled = false;

    import("scrollama").then(({ default: scrollama }) => {
      if (cancelled) return;
      scroller = scrollama();
      scroller
        .setup({ step: ".step", offset: 0.5 })
        .onStepEnter(({ element }: { element: HTMLElement }) => {
          const step = parseInt(element.dataset.step ?? "1", 10);
          const chart = parseInt(element.dataset.chart ?? "1", 10) as ChartId;
          setActiveStep(step);
          setActiveChart(chart);
        });
    });

    const handleResize = () => scroller?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
      scroller?.destroy();
    };
  }, []);

  const renderChart = () => {
    switch (activeChart) {
      case 1:
        return <SectorAreaChart activeStep={activeStep} />;
      case 2:
        return <NationsLineChart />;
      case 3:
        return <ProjectionChart activeStep={activeStep} />;
      case 4:
        return <SectorGrid activeStep={activeStep} />;
      case 5:
        return <GasCompositionChart className="w-full h-full flex flex-col justify-center items-center overflow-y-auto" />;
    }
  };

  return (
    <div className="bg-white text-gray-900">
      <Hero />

      {/* Mobile: each step has its own inline chart */}
      <div className="lg:hidden">
        {STEPS.map((step) => (
          <div
            key={step.id}
            className="min-h-screen flex flex-col border-b border-gray-100"
          >
            <div className="shrink-0 px-5 pt-4 pb-2 flex justify-between items-center">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">
                {CHART_LABELS[step.chart]}
              </p>
              <span className="text-[10px] font-mono text-gray-300 tabular-nums">
                {String(step.id).padStart(2, "0")}&thinsp;/&thinsp;{TOTAL_STEPS}
              </span>
            </div>
            <div className="shrink-0 h-[45vh] px-2 overflow-hidden">
              {renderChartForStep(step.chart, step.id)}
            </div>
            <div className="flex-1 px-6 py-5">
              <p className="text-[10px] uppercase tracking-widest text-[#666666] mb-3">
                {step.eyebrow}
              </p>
              {step.copy.split("\n\n").map((para, i) => (
                <p key={i} className="text-[14px] leading-[1.8] text-gray-600 mb-3 last:mb-0">
                  {para}
                </p>
              ))}
              {step.id === TOTAL_STEPS && (
                <a
                  href="#scenario"
                  className="mt-5 inline-flex items-center gap-2 text-[12px] font-medium text-[#c1440e] border border-[#c1440e] rounded px-3 py-2 hover:bg-[#c1440e] hover:text-white transition-colors"
                >
                  Open scenario modeller ↓
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: sticky chart + scrolling text */}
      <div className="hidden lg:flex lg:flex-row">
        <StepsColumn totalSteps={TOTAL_STEPS} />
        <div className="w-[65%] sticky top-0 h-screen flex flex-col justify-center px-16 py-6 border-l border-gray-100 bg-white z-10 overflow-hidden">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 shrink-0">
            {CHART_LABELS[activeChart]}
          </p>
          <div
            key={activeStep}
            className="flex-1 min-h-0 flex items-center justify-center chart-fade-in"
          >
            <div className="w-full h-full">{renderChart()}</div>
          </div>
          <div className="shrink-0 flex items-center justify-between mt-4">
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
      <ScenarioModeller />
      <Footer />
    </div>
  );
}

