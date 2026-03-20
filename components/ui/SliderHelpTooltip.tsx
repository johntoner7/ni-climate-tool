"use client";

import { useState } from "react";
import {
  SLIDER_TOOLTIP_CONTENT,
  type SliderTooltipKey,
} from "@/lib/sliderTooltipContent";

export function SliderHelpTooltip({
  tooltipKey,
  className,
}: {
  tooltipKey: SliderTooltipKey;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const tooltipId = `slider-tooltip-${tooltipKey}`;

  return (
    <div
      className={`relative inline-flex items-center ${className ?? ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-label="Show intervention explanation"
        aria-expanded={open}
        aria-controls={tooltipId}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
      >
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="10" cy="10" r="7.5" />
          <line x1="10" y1="8" x2="10" y2="13" strokeLinecap="round" />
          <circle cx="10" cy="6" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      </button>
      {open && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-1 w-64 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-[11px] leading-relaxed text-gray-700 shadow"
        >
          {SLIDER_TOOLTIP_CONTENT[tooltipKey]}
        </div>
      )}
    </div>
  );
}
