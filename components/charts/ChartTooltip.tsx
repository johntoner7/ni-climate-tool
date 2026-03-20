export interface TooltipItem {
  name: string;
  value: string | number;
  color: string;
  indicatorType?: "circle" | "line" | "dashed";
}

interface ChartTooltipProps {
  label?: string;
  // Multi-item form
  items?: TooltipItem[];
  // Single-item form (legacy)
  name?: string;
  value?: string | number;
  color?: string;
  indicatorType?: "circle" | "line" | "dashed";
}

function Indicator({ color, type = "circle" }: { color: string; type?: "circle" | "line" | "dashed" }) {
  if (type === "circle") {
    return <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />;
  }
  if (type === "dashed") {
    return (
      <div
        className="w-5 flex-shrink-0"
        style={{
          height: 1,
          backgroundImage: `repeating-linear-gradient(to right, ${color} 0, ${color} 4px, transparent 4px, transparent 7px)`,
        }}
      />
    );
  }
  return <div className="w-5 h-0.5 rounded flex-shrink-0" style={{ backgroundColor: color }} />;
}

export default function ChartTooltip({
  label,
  items,
  name,
  value,
  color,
  indicatorType = "circle",
}: ChartTooltipProps) {
  const resolved: TooltipItem[] =
    items ?? (name != null ? [{ name, value: value ?? "", color: color ?? "#000", indicatorType }] : []);

  if (!resolved.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded shadow-lg min-w-[160px]">
      {label && (
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
          {label}
        </p>
      )}
      <div className="flex flex-col gap-1.5">
        {resolved.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <Indicator color={item.color} type={item.indicatorType} />
            <p className="text-sm text-gray-900 dark:text-gray-100">
              <span className="font-semibold">{item.name}:</span>{" "}
              <span className="font-medium">{item.value}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
