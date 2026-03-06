"use client";

export default function StatCard({
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
