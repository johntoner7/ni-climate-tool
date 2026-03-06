"use client";

import StatCard from "@/components/StatCard";

const HERO_STATS = [
  {
    label: "Agriculture Change Since 1990",
    value: "+8%",
    description: "The largest rise of any sector; transport also up ~5%",
    isHighlight: true,
  },
  {
    label: "Share of NI Emissions",
    value: "30.8%",
    description: "2.5× the UK average of 12% (Draft NI CAP, p.42)",
    isHighlight: true,
  },
  {
    label: "Cattle in Northern Ireland",
    value: "1.67m",
    description: "One animal for every 1.1 people (NI population: 1.91m, NISRA 2023)",
    isHighlight: false,
  },
  {
    label: "2030 Gap to Close",
    value: "612kt",
    description: "CO₂e - equivalent to 416,000 cars, permanently (DfT: 1.47t/car/yr)",
    isHighlight: false,
  },
];

export default function Hero() {
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
              NI cut emissions by 31.5% since 1990. Two sectors went the other way: agriculture and transport.
            </h1>
            <p className="text-lg text-[#444444] mt-5 max-w-[480px] leading-relaxed">
              The reduction came almost entirely from electricity. Agriculture
              went in the opposite direction over three decades.
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
