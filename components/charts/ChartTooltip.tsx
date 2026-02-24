interface ChartTooltipProps {
  label?: string;
  name: string;
  value: string | number;
  color: string;
  indicatorType?: "circle" | "line";
}

export default function ChartTooltip({
  label,
  name,
  value,
  color,
  indicatorType = "circle",
}: ChartTooltipProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
      {label && (
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
          {label}
        </p>
      )}
      <div className="flex items-center gap-2">
        {indicatorType === "circle" ? (
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
        ) : (
          <div
            className="w-5 h-0.5 rounded"
            style={{ backgroundColor: color }}
          />
        )}
        <p className="text-sm text-gray-900 dark:text-gray-100">
          <span className="font-semibold">{name}:</span>{" "}
          <span className="font-medium">{value}</span>
        </p>
      </div>
    </div>
  );
}
