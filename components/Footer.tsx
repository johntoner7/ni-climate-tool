"use client";

export default function Footer() {
  return (
    <footer className="max-w-2xl mx-auto px-8 py-14 mt-8 border-t border-gray-100">
      <p className="text-[11px] text-gray-400 leading-relaxed max-w-[60ch]">
        <span className="text-gray-500 font-medium">Data:</span> National
        Atmospheric Emissions Inventory (NAEI), GWP AR5. All figures in kt CO₂e.
        Projections use linear regression on 2018–2023 actuals per sector. 2030
        target: 48% reduction from 1990 baseline (NI Climate Change Act 2022).
        DAERA projections not used due to GWP mismatch (AR4 vs AR5).
      </p>
      <p className="text-[11px] text-gray-400 leading-relaxed max-w-[60ch] mt-3">
        <a
          href="https://www.flaticon.com/free-icons/cow"
          title="cow icons"
          className="hover:text-gray-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cow icons created by Kach - Flaticon
        </a>
      </p>
    </footer>
  );
}
