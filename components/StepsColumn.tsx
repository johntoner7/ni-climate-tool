"use client";

import { STEPS } from "@/lib/steps";

export default function StepsColumn({ totalSteps }: { totalSteps?: number }) {
  const TOTAL_STEPS = totalSteps ?? STEPS.length;

  return (
    <div className="w-full lg:w-[35%]">
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
            {step.copy.split("\n\n").map((paragraph, i) => (
              <p
                key={`${step.id}-p${i}`}
                className="text-[15px] leading-[1.9] text-gray-600 mb-3 last:mb-0"
              >
                {paragraph}
              </p>
            ))}
            {step.cta && (
              <a
                href={step.cta}
                className="mt-5 inline-flex items-center gap-2 text-[12px] font-medium text-[#c1440e] border border-[#c1440e] rounded px-3 py-2 hover:bg-[#c1440e] hover:text-white transition-colors"
              >
                Open the scenario modeller ↓
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
